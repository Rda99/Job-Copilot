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
    
    // Check if Ollama is running by fetching the models list
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
    
    const response = await axios.post(`${endpoint}/api/chat`, requestBody);
    
    res.json({
      content: response.data.message?.content || "",
      model: model,
    });
  } catch (error: any) {
    res.status(500).json({ 
      error: error.message || "Failed to generate chat response from Ollama" 
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
  } catch (error: any) {
    res.status(500).json({ 
      error: error.message || "Failed to analyze resume with Ollama" 
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
  } catch (error: any) {
    res.status(500).json({ 
      error: error.message || "Failed to match resume to job with Ollama" 
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
  } catch (error: any) {
    res.status(500).json({ 
      error: error.message || "Failed to generate cover letter with Ollama" 
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
  } catch (error: any) {
    res.status(500).json({ 
      error: error.message || "Failed to generate interview questions with Ollama" 
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
  } catch (error: any) {
    res.status(500).json({ 
      error: error.message || "Failed to generate interview answer with Ollama" 
    });
  }
}
