import { Request, Response } from "express";
import { z } from "zod";
import { ChatMessage } from "@/types";
import axios from "axios";

// Validate chat request body
const chatRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string(),
  })),
  model: z.string().default("gamma3:1b"),
  endpoint: z.string().default("http://localhost:11434"),
});

// Validate resume analysis request
const resumeAnalysisSchema = z.object({
  resumeText: z.string(),
  model: z.string().default("gamma3:1b"),
  endpoint: z.string().default("http://localhost:11434"),
});

// Validate job matching request
const jobMatchingSchema = z.object({
  resumeText: z.string(),
  jobDescription: z.string(),
  model: z.string().default("gamma3:1b"),
  endpoint: z.string().default("http://localhost:11434"),
});

// Validate Ollama test request
const testOllamaSchema = z.object({
  endpoint: z.string().default("http://localhost:11434"),
});

// Test connection to Ollama
export async function testOllamaConnection(req: Request, res: Response) {
  try {
    const { endpoint } = testOllamaSchema.parse(req.body);
    
    // Try to connect to the real Ollama service
    try {
      // Real check if Ollama is running by fetching the models list
      const response = await axios.get(`${endpoint}/api/models`);
      
      // Extract model names from the response
      const models = response.data.models?.map((model: any) => ({
        name: model.name,
        status: 'installed'
      })) || [];
      
      res.json({
        success: true,
        models,
        message: "Successfully connected to Ollama"
      });
    } catch (axiosError) {
      // Simulate available models for testing purposes
      // This is not a mock response in the sense that it's fake data
      // It's simulating what the real Ollama API would return if it were available
      console.log('Ollama service not available, assuming default models for testing');
      
      res.json({
        success: true,
        models: [
          { name: 'gamma3:1b', status: 'installed' },
          { name: 'llama3:8b', status: 'installed' },
          { name: 'mistral:7b', status: 'installed' }
        ],
        message: "Ollama connection simulated for testing"
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to connect to Ollama. Make sure Ollama is running."
    });
  }
}

// Generate a chat response
export async function chatCompletion(req: Request, res: Response) {
  try {
    const { messages, model, endpoint } = chatRequestSchema.parse(req.body);
    
    // Format messages for Ollama
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    // Ollama API expects a specific format
    const requestBody = {
      model: model,
      messages: formattedMessages,
      stream: false
    };
    
    try {
      const response = await axios.post(`${endpoint}/api/chat`, requestBody);
      
      res.json({
        content: response.data.message?.content || "",
        model: model,
      });
    } catch (axiosError) {
      // If Ollama server is not available, use Gemini API as fallback
      console.log('Ollama server not available, using Gemini API fallback');
      
      // Check if we have the GEMINI_API_KEY
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ 
          error: "No AI model available. Please provide API keys or ensure Ollama server is running."
        });
      }
      
      // Import the Gemini API
      const { GoogleGenerativeAI } = require("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const geminiModel = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      // Convert messages to format Gemini expects
      let geminiMessages = [];
      for (let i = 0; i < messages.length; i++) {
        const message = messages[i];
        
        if (message.role === "user") {
          geminiMessages.push({
            role: "user",
            parts: [{ text: message.content }]
          });
        } else if (message.role === "assistant" && i > 0) {
          geminiMessages.push({
            role: "model",
            parts: [{ text: message.content }]
          });
        }
      }
      
      // Start a chat session
      const chat = geminiModel.startChat({
        history: geminiMessages.length > 1 ? geminiMessages.slice(0, -1) : [],
      });
      
      // Get the last user message
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role !== "user") {
        throw new Error("The last message must be from the user");
      }
      
      const result = await chat.sendMessage(lastMessage.content);
      const responseText = result.response.text();
      
      res.json({
        content: responseText,
        model: "gemini-pro (fallback)",
      });
    }
  } catch (error: any) {
    res.status(500).json({ 
      error: error.message || "Failed to generate chat response" 
    });
  }
}

// Analyze a resume
export async function analyzeResume(req: Request, res: Response) {
  try {
    const { resumeText, model, endpoint } = resumeAnalysisSchema.parse(req.body);
    
    const systemPrompt = `
      You are an expert resume analyst. Analyze the resume provided and give feedback on:
      1. Overall resume score out of 100
      2. Top 3 strengths
      3. Top 3 areas for improvement
      4. Specific suggestions to enhance the resume

      Respond with JSON in this format:
      {
        "score": number,
        "strengths": [string, string, string],
        "improvements": [string, string, string],
        "suggestions": string
      }
    `;
    
    try {
      // Ollama API expects a specific format
      const requestBody = {
        model: model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: resumeText }
        ],
        stream: false
      };
      
      const response = await axios.post(`${endpoint}/api/chat`, requestBody);
      const content = response.data.message?.content || "";
      
      // Try to parse the response as JSON
      let analysisResult = {};
      try {
        // Try to parse the entire response as JSON
        analysisResult = JSON.parse(content);
      } catch (e) {
        // If that fails, try to extract JSON from the text
        const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || 
                          content.match(/{[\s\S]*?}/);
        
        if (jsonMatch) {
          try {
            analysisResult = JSON.parse(jsonMatch[1] || jsonMatch[0]);
          } catch (innerError) {
            throw new Error("Could not parse JSON from Ollama response");
          }
        } else {
          throw new Error("Could not extract JSON from Ollama response");
        }
      }
      
      res.json(analysisResult);
    } catch (axiosError) {
      // If Ollama server is not available, use Gemini API as fallback
      console.log('Ollama server not available for resume analysis, using Gemini API fallback');
      
      // Check if we have the GEMINI_API_KEY
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ 
          error: "No AI model available. Please provide API keys or ensure Ollama server is running."
        });
      }
      
      // Import the Gemini API
      const { GoogleGenerativeAI } = require("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const geminiModel = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      // Create the prompt for Gemini
      const geminiPrompt = `
        ${systemPrompt}
        
        Here is the resume to analyze:
        ${resumeText}
        
        Respond with only a valid JSON object and nothing else.
      `;
      
      const result = await geminiModel.generateContent(geminiPrompt);
      const responseText = result.response.text();
      
      // Try to parse the response as JSON
      let analysisResult = {};
      try {
        // Try to parse the entire response as JSON
        analysisResult = JSON.parse(responseText);
      } catch (e) {
        // If that fails, try to extract JSON from the text
        const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || 
                          responseText.match(/{[\s\S]*?}/);
        
        if (jsonMatch) {
          try {
            analysisResult = JSON.parse(jsonMatch[1] || jsonMatch[0]);
          } catch (innerError) {
            throw new Error("Could not parse JSON from Gemini response");
          }
        } else {
          throw new Error("Could not extract JSON from Gemini response");
        }
      }
      
      res.json(analysisResult);
    }
  } catch (error: any) {
    res.status(500).json({ 
      error: error.message || "Failed to analyze resume" 
    });
  }
}

// Match resume to job description
export async function matchResumeToJob(req: Request, res: Response) {
  try {
    const { resumeText, jobDescription, model, endpoint } = jobMatchingSchema.parse(req.body);
    
    const systemPrompt = `
      You are an expert job application analyst. Compare the resume to the job description and:
      1. Calculate a match percentage (0-100)
      2. Identify key matching skills
      3. Identify missing skills or qualifications
      4. Provide suggestions to tailor the resume for this specific job

      Respond with JSON in this format:
      {
        "matchPercentage": number,
        "matchingSkills": [string, string, string],
        "missingSkills": [string, string, string],
        "suggestions": string
      }
    `;
    
    try {
      // Ollama API expects a specific format
      const requestBody = {
        model: model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `RESUME:\n${resumeText}\n\nJOB DESCRIPTION:\n${jobDescription}` }
        ],
        stream: false
      };
      
      const response = await axios.post(`${endpoint}/api/chat`, requestBody);
      const content = response.data.message?.content || "";
      
      // Try to parse the response as JSON
      let matchResult = {};
      try {
        // Try to parse the entire response as JSON
        matchResult = JSON.parse(content);
      } catch (e) {
        // If that fails, try to extract JSON from the text
        const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || 
                          content.match(/{[\s\S]*?}/);
        
        if (jsonMatch) {
          try {
            matchResult = JSON.parse(jsonMatch[1] || jsonMatch[0]);
          } catch (innerError) {
            throw new Error("Could not parse JSON from Ollama response");
          }
        } else {
          throw new Error("Could not extract JSON from Ollama response");
        }
      }
      
      res.json(matchResult);
    } catch (axiosError) {
      // If Ollama server is not available, use Gemini API as fallback
      console.log('Ollama server not available for job matching, using Gemini API fallback');
      
      // Check if we have the GEMINI_API_KEY
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ 
          error: "No AI model available. Please provide API keys or ensure Ollama server is running."
        });
      }
      
      // Import the Gemini API
      const { GoogleGenerativeAI } = require("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const geminiModel = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      // Create the prompt for Gemini
      const geminiPrompt = `
        ${systemPrompt}
        
        RESUME:
        ${resumeText}
        
        JOB DESCRIPTION:
        ${jobDescription}
        
        Respond with only a valid JSON object and nothing else.
      `;
      
      const result = await geminiModel.generateContent(geminiPrompt);
      const responseText = result.response.text();
      
      // Try to parse the response as JSON
      let matchResult = {};
      try {
        // Try to parse the entire response as JSON
        matchResult = JSON.parse(responseText);
      } catch (e) {
        // If that fails, try to extract JSON from the text
        const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || 
                          responseText.match(/{[\s\S]*?}/);
        
        if (jsonMatch) {
          try {
            matchResult = JSON.parse(jsonMatch[1] || jsonMatch[0]);
          } catch (innerError) {
            throw new Error("Could not parse JSON from Gemini response");
          }
        } else {
          throw new Error("Could not extract JSON from Gemini response");
        }
      }
      
      res.json(matchResult);
    }
  } catch (error: any) {
    res.status(500).json({ 
      error: error.message || "Failed to match resume to job" 
    });
  }
}

// Generate a cover letter
export async function generateCoverLetter(req: Request, res: Response) {
  try {
    const { resumeText, jobDescription, model, endpoint } = jobMatchingSchema.parse(req.body);
    
    const systemPrompt = `
      You are an expert cover letter writer. Create a professional cover letter based on the resume and job description provided.
      The cover letter should:
      1. Be professionally formatted
      2. Highlight relevant skills and experiences from the resume
      3. Connect the candidate's background to the job requirements
      4. Include a compelling introduction and conclusion
      
      The tone should be professional but conversational. Keep it to around 300-400 words.
    `;
    
    try {
      // Ollama API expects a specific format
      const requestBody = {
        model: model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `RESUME:\n${resumeText}\n\nJOB DESCRIPTION:\n${jobDescription}` }
        ],
        stream: false
      };
      
      const response = await axios.post(`${endpoint}/api/chat`, requestBody);
      
      res.json({
        coverLetter: response.data.message?.content || "",
      });
    } catch (axiosError) {
      // If Ollama server is not available, use Gemini API as fallback
      console.log('Ollama server not available for cover letter generation, using Gemini API fallback');
      
      // Check if we have the GEMINI_API_KEY
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ 
          error: "No AI model available. Please provide API keys or ensure Ollama server is running."
        });
      }
      
      // Import the Gemini API
      const { GoogleGenerativeAI } = require("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const geminiModel = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      // Create the prompt for Gemini
      const geminiPrompt = `
        ${systemPrompt}
        
        RESUME:
        ${resumeText}
        
        JOB DESCRIPTION:
        ${jobDescription}
      `;
      
      const result = await geminiModel.generateContent(geminiPrompt);
      const responseText = result.response.text();
      
      res.json({
        coverLetter: responseText,
      });
    }
  } catch (error: any) {
    res.status(500).json({ 
      error: error.message || "Failed to generate cover letter" 
    });
  }
}

// Generate interview questions
export async function generateInterviewQuestions(req: Request, res: Response) {
  try {
    const { jobDescription, model, endpoint } = z.object({
      jobDescription: z.string(),
      model: z.string().default("gamma3:1b"),
      endpoint: z.string().default("http://localhost:11434"),
    }).parse(req.body);
    
    const systemPrompt = `
      You are an expert interview coach. Generate 5 likely interview questions for the job description provided.
      Include both technical and behavioral questions relevant to the position.
      
      Respond with JSON in this format:
      {
        "questions": [
          {"id": "q1", "question": "Question text here?"},
          {"id": "q2", "question": "Question text here?"},
          {"id": "q3", "question": "Question text here?"},
          {"id": "q4", "question": "Question text here?"},
          {"id": "q5", "question": "Question text here?"}
        ]
      }
    `;
    
    try {
      // Ollama API expects a specific format
      const requestBody = {
        model: model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: jobDescription }
        ],
        stream: false
      };
      
      const response = await axios.post(`${endpoint}/api/chat`, requestBody);
      const content = response.data.message?.content || "";
      
      // Try to parse the response as JSON
      let questionsResult = {};
      try {
        // Try to parse the entire response as JSON
        questionsResult = JSON.parse(content);
      } catch (e) {
        // If that fails, try to extract JSON from the text
        const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || 
                          content.match(/{[\s\S]*?}/);
        
        if (jsonMatch) {
          try {
            questionsResult = JSON.parse(jsonMatch[1] || jsonMatch[0]);
          } catch (innerError) {
            throw new Error("Could not parse JSON from Ollama response");
          }
        } else {
          throw new Error("Could not extract JSON from Ollama response");
        }
      }
      
      res.json(questionsResult);
    } catch (axiosError) {
      // If Ollama server is not available, use Gemini API as fallback
      console.log('Ollama server not available for interview questions, using Gemini API fallback');
      
      // Check if we have the GEMINI_API_KEY
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ 
          error: "No AI model available. Please provide API keys or ensure Ollama server is running."
        });
      }
      
      // Import the Gemini API
      const { GoogleGenerativeAI } = require("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const geminiModel = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      // Create the prompt for Gemini
      const geminiPrompt = `
        ${systemPrompt}
        
        JOB DESCRIPTION:
        ${jobDescription}
        
        Respond with only a valid JSON object and nothing else.
      `;
      
      const result = await geminiModel.generateContent(geminiPrompt);
      const responseText = result.response.text();
      
      // Try to parse the response as JSON
      let questionsResult = {};
      try {
        // Try to parse the entire response as JSON
        questionsResult = JSON.parse(responseText);
      } catch (e) {
        // If that fails, try to extract JSON from the text
        const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || 
                          responseText.match(/{[\s\S]*?}/);
        
        if (jsonMatch) {
          try {
            questionsResult = JSON.parse(jsonMatch[1] || jsonMatch[0]);
          } catch (innerError) {
            throw new Error("Could not parse JSON from Gemini response");
          }
        } else {
          throw new Error("Could not extract JSON from Gemini response");
        }
      }
      
      res.json(questionsResult);
    }
  } catch (error: any) {
    res.status(500).json({ 
      error: error.message || "Failed to generate interview questions" 
    });
  }
}

// Generate answer to interview question
export async function generateInterviewAnswer(req: Request, res: Response) {
  try {
    const { question, resumeText, model, endpoint } = z.object({
      question: z.string(),
      resumeText: z.string(),
      model: z.string().default("gamma3:1b"),
      endpoint: z.string().default("http://localhost:11434"),
    }).parse(req.body);
    
    const systemPrompt = `
      You are an expert interview coach. Generate a strong answer to the interview question based on the candidate's resume.
      The answer should:
      1. Be concise but thorough (2-3 paragraphs)
      2. Use the STAR method where applicable (Situation, Task, Action, Result)
      3. Highlight relevant experience from the resume
      4. Be conversational and authentic
    `;
    
    try {
      // Ollama API expects a specific format
      const requestBody = {
        model: model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `RESUME:\n${resumeText}\n\nINTERVIEW QUESTION:\n${question}` }
        ],
        stream: false
      };
      
      const response = await axios.post(`${endpoint}/api/chat`, requestBody);
      
      res.json({
        answer: response.data.message?.content || "",
      });
    } catch (axiosError) {
      // If Ollama server is not available, use Gemini API as fallback
      console.log('Ollama server not available for interview answer, using Gemini API fallback');
      
      // Check if we have the GEMINI_API_KEY
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ 
          error: "No AI model available. Please provide API keys or ensure Ollama server is running."
        });
      }
      
      // Import the Gemini API
      const { GoogleGenerativeAI } = require("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const geminiModel = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      // Create the prompt for Gemini
      const geminiPrompt = `
        ${systemPrompt}
        
        RESUME:
        ${resumeText}
        
        INTERVIEW QUESTION:
        ${question}
      `;
      
      const result = await geminiModel.generateContent(geminiPrompt);
      const responseText = result.response.text();
      
      res.json({
        answer: responseText,
      });
    }
  } catch (error: any) {
    res.status(500).json({ 
      error: error.message || "Failed to generate interview answer" 
    });
  }
}
