import { GoogleGenerativeAI } from "@google/generative-ai";
import { Request, Response } from "express";
import { z } from "zod";
import { ChatMessage } from "@/types";

// Validate the API key
const apiKeySchema = z.string().min(1, "API key is required");

// Validate chat request body
const chatRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string(),
  })),
  apiKey: z.string().optional(),
  model: z.string().default("gemini-pro"),
});

// Validate resume analysis request
const resumeAnalysisSchema = z.object({
  resumeText: z.string(),
  apiKey: z.string().optional(),
  model: z.string().default("gemini-pro"),
});

// Validate job matching request
const jobMatchingSchema = z.object({
  resumeText: z.string(),
  jobDescription: z.string(),
  apiKey: z.string().optional(),
  model: z.string().default("gemini-pro"),
});

// Create a Google Generative AI instance with the user's API key or the environment variable
function createGeminiClient(apiKey?: string) {
  const key = apiKey || process.env.GEMINI_API_KEY || "";
  
  try {
    apiKeySchema.parse(key);
    return new GoogleGenerativeAI(key);
  } catch (error) {
    throw new Error("Invalid Google Gemini API key");
  }
}

// Generate a chat response
export async function chatCompletion(req: Request, res: Response) {
  try {
    const { messages, apiKey, model } = chatRequestSchema.parse(req.body);
    
    const genAI = createGeminiClient(apiKey);
    const geminiModel = genAI.getGenerativeModel({ model });

    // Convert the chat history to Gemini's format
    // Gemini needs the first role to be 'user', so we might need to adjust
    let formattedHistory: any[] = [];
    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      
      if (message.role === "user") {
        // For user messages, add to formatted history
        formattedHistory.push({
          role: "user",
          parts: [{ text: message.content }]
        });
      } else if (message.role === "assistant" && i > 0) {
        // For assistant messages, add to formatted history if not first
        formattedHistory.push({
          role: "model",
          parts: [{ text: message.content }]
        });
      }
    }

    // Start a chat session
    const chat = geminiModel.startChat({
      history: formattedHistory.length > 1 ? formattedHistory.slice(0, -1) : [],
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
      model: model,
    });
  } catch (error: any) {
    res.status(500).json({ 
      error: error.message || "Failed to generate chat response" 
    });
  }
}

// Analyze a resume
export async function analyzeResume(req: Request, res: Response) {
  try {
    const { resumeText, apiKey, model } = resumeAnalysisSchema.parse(req.body);
    
    const genAI = createGeminiClient(apiKey);
    const geminiModel = genAI.getGenerativeModel({ model });
    
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
    
    const prompt = `${systemPrompt}\n\nRESUME:\n${resumeText}`;
    
    const result = await geminiModel.generateContent(prompt);
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
  } catch (error: any) {
    res.status(500).json({ 
      error: error.message || "Failed to analyze resume" 
    });
  }
}

// Match resume to job description
export async function matchResumeToJob(req: Request, res: Response) {
  try {
    const { resumeText, jobDescription, apiKey, model } = jobMatchingSchema.parse(req.body);
    
    const genAI = createGeminiClient(apiKey);
    const geminiModel = genAI.getGenerativeModel({ model });
    
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
    
    const prompt = `${systemPrompt}\n\nRESUME:\n${resumeText}\n\nJOB DESCRIPTION:\n${jobDescription}`;
    
    const result = await geminiModel.generateContent(prompt);
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
  } catch (error: any) {
    res.status(500).json({ 
      error: error.message || "Failed to match resume to job" 
    });
  }
}

// Generate a cover letter
export async function generateCoverLetter(req: Request, res: Response) {
  try {
    const { resumeText, jobDescription, apiKey, model } = jobMatchingSchema.parse(req.body);
    
    const genAI = createGeminiClient(apiKey);
    const geminiModel = genAI.getGenerativeModel({ model });
    
    const systemPrompt = `
      You are an expert cover letter writer. Create a professional cover letter based on the resume and job description provided.
      The cover letter should:
      1. Be professionally formatted
      2. Highlight relevant skills and experiences from the resume
      3. Connect the candidate's background to the job requirements
      4. Include a compelling introduction and conclusion
      
      The tone should be professional but conversational. Keep it to around 300-400 words.
    `;
    
    const prompt = `${systemPrompt}\n\nRESUME:\n${resumeText}\n\nJOB DESCRIPTION:\n${jobDescription}`;
    
    const result = await geminiModel.generateContent(prompt);
    const responseText = result.response.text();
    
    res.json({
      coverLetter: responseText,
    });
  } catch (error: any) {
    res.status(500).json({ 
      error: error.message || "Failed to generate cover letter" 
    });
  }
}

// Generate interview questions
export async function generateInterviewQuestions(req: Request, res: Response) {
  try {
    const { jobDescription, apiKey, model } = z.object({
      jobDescription: z.string(),
      apiKey: z.string().optional(),
      model: z.string().default("gemini-pro"),
    }).parse(req.body);
    
    const genAI = createGeminiClient(apiKey);
    const geminiModel = genAI.getGenerativeModel({ model });
    
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
    
    const prompt = `${systemPrompt}\n\nJOB DESCRIPTION:\n${jobDescription}`;
    
    const result = await geminiModel.generateContent(prompt);
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
  } catch (error: any) {
    res.status(500).json({ 
      error: error.message || "Failed to generate interview questions" 
    });
  }
}

// Generate answer to interview question
export async function generateInterviewAnswer(req: Request, res: Response) {
  try {
    const { question, resumeText, apiKey, model } = z.object({
      question: z.string(),
      resumeText: z.string(),
      apiKey: z.string().optional(),
      model: z.string().default("gemini-pro"),
    }).parse(req.body);
    
    const genAI = createGeminiClient(apiKey);
    const geminiModel = genAI.getGenerativeModel({ model });
    
    const systemPrompt = `
      You are an expert interview coach. Generate a strong answer to the interview question based on the candidate's resume.
      The answer should:
      1. Be concise but thorough (2-3 paragraphs)
      2. Use the STAR method where applicable (Situation, Task, Action, Result)
      3. Highlight relevant experience from the resume
      4. Be conversational and authentic
    `;
    
    const prompt = `${systemPrompt}\n\nRESUME:\n${resumeText}\n\nINTERVIEW QUESTION:\n${question}`;
    
    const result = await geminiModel.generateContent(prompt);
    const responseText = result.response.text();
    
    res.json({
      answer: responseText,
    });
  } catch (error: any) {
    res.status(500).json({ 
      error: error.message || "Failed to generate interview answer" 
    });
  }
}