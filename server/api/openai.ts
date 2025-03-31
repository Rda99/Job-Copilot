import OpenAI from "openai";
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
  model: z.string().default("gpt-4o"),
});

// Validate resume analysis request
const resumeAnalysisSchema = z.object({
  resumeText: z.string(),
  apiKey: z.string().optional(),
  model: z.string().default("gpt-4o"),
});

// Validate job matching request
const jobMatchingSchema = z.object({
  resumeText: z.string(),
  jobDescription: z.string(),
  apiKey: z.string().optional(),
  model: z.string().default("gpt-4o"),
});

// Create an OpenAI instance with the user's API key or the environment variable
function createOpenAIClient(apiKey?: string) {
  const key = apiKey || process.env.OPENAI_API_KEY || "";
  
  try {
    apiKeySchema.parse(key);
    return new OpenAI({ apiKey: key });
  } catch (error) {
    throw new Error("Invalid OpenAI API key");
  }
}

// Generate a chat response
export async function chatCompletion(req: Request, res: Response) {
  try {
    const { messages, apiKey, model } = chatRequestSchema.parse(req.body);
    
    const openai = createOpenAIClient(apiKey);
    
    const completion = await openai.chat.completions.create({
      model: model, // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
    });
    
    res.json({
      content: completion.choices[0].message.content,
      model: completion.model,
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
    
    const openai = createOpenAIClient(apiKey);
    
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
    
    const completion = await openai.chat.completions.create({
      model: model, // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: resumeText }
      ],
      response_format: { type: "json_object" }
    });
    
    const analysisResult = JSON.parse(completion.choices[0].message.content || "{}");
    
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
    
    const openai = createOpenAIClient(apiKey);
    
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
    
    const completion = await openai.chat.completions.create({
      model: model, // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `RESUME:\n${resumeText}\n\nJOB DESCRIPTION:\n${jobDescription}` }
      ],
      response_format: { type: "json_object" }
    });
    
    const matchResult = JSON.parse(completion.choices[0].message.content || "{}");
    
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
    
    const openai = createOpenAIClient(apiKey);
    
    const systemPrompt = `
      You are an expert cover letter writer. Create a professional cover letter based on the resume and job description provided.
      The cover letter should:
      1. Be professionally formatted
      2. Highlight relevant skills and experiences from the resume
      3. Connect the candidate's background to the job requirements
      4. Include a compelling introduction and conclusion
      
      The tone should be professional but conversational. Keep it to around 300-400 words.
    `;
    
    const completion = await openai.chat.completions.create({
      model: model, // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `RESUME:\n${resumeText}\n\nJOB DESCRIPTION:\n${jobDescription}` }
      ]
    });
    
    res.json({
      coverLetter: completion.choices[0].message.content,
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
      model: z.string().default("gpt-4o"),
    }).parse(req.body);
    
    const openai = createOpenAIClient(apiKey);
    
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
    
    const completion = await openai.chat.completions.create({
      model: model, // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: jobDescription }
      ],
      response_format: { type: "json_object" }
    });
    
    const questionsResult = JSON.parse(completion.choices[0].message.content || "{}");
    
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
      model: z.string().default("gpt-4o"),
    }).parse(req.body);
    
    const openai = createOpenAIClient(apiKey);
    
    const systemPrompt = `
      You are an expert interview coach. Generate a strong answer to the interview question based on the candidate's resume.
      The answer should:
      1. Be concise but thorough (2-3 paragraphs)
      2. Use the STAR method where applicable (Situation, Task, Action, Result)
      3. Highlight relevant experience from the resume
      4. Be conversational and authentic
    `;
    
    const completion = await openai.chat.completions.create({
      model: model, // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `RESUME:\n${resumeText}\n\nINTERVIEW QUESTION:\n${question}` }
      ]
    });
    
    res.json({
      answer: completion.choices[0].message.content,
    });
  } catch (error: any) {
    res.status(500).json({ 
      error: error.message || "Failed to generate interview answer" 
    });
  }
}
