import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import * as openaiAPI from "./api/openai";
import * as anthropicAPI from "./api/anthropic";
import * as ollamaAPI from "./api/ollama";
import * as geminiAPI from "./api/gemini";

export async function registerRoutes(app: Express): Promise<Server> {
  // LLM providers API routes
  
  // OpenAI endpoints
  app.post('/api/llm/openai/chat', openaiAPI.chatCompletion);
  app.post('/api/llm/openai/analyze-resume', openaiAPI.analyzeResume);
  app.post('/api/llm/openai/match-resume', openaiAPI.matchResumeToJob);
  app.post('/api/llm/openai/generate-cover-letter', openaiAPI.generateCoverLetter);
  app.post('/api/llm/openai/generate-interview-questions', openaiAPI.generateInterviewQuestions);
  app.post('/api/llm/openai/generate-interview-answer', openaiAPI.generateInterviewAnswer);
  
  // Anthropic endpoints
  app.post('/api/llm/anthropic/chat', anthropicAPI.chatCompletion);
  app.post('/api/llm/anthropic/analyze-resume', anthropicAPI.analyzeResume);
  app.post('/api/llm/anthropic/match-resume', anthropicAPI.matchResumeToJob);
  app.post('/api/llm/anthropic/generate-cover-letter', anthropicAPI.generateCoverLetter);
  app.post('/api/llm/anthropic/generate-interview-questions', anthropicAPI.generateInterviewQuestions);
  app.post('/api/llm/anthropic/generate-interview-answer', anthropicAPI.generateInterviewAnswer);
  
  // Ollama endpoints
  app.post('/api/llm/ollama/test', ollamaAPI.testOllamaConnection);
  app.post('/api/llm/ollama/chat', ollamaAPI.chatCompletion);
  app.post('/api/llm/ollama/analyze-resume', ollamaAPI.analyzeResume);
  app.post('/api/llm/ollama/match-resume', ollamaAPI.matchResumeToJob);
  app.post('/api/llm/ollama/generate-cover-letter', ollamaAPI.generateCoverLetter);
  app.post('/api/llm/ollama/generate-interview-questions', ollamaAPI.generateInterviewQuestions);
  app.post('/api/llm/ollama/generate-interview-answer', ollamaAPI.generateInterviewAnswer);
  
  // Google Gemini endpoints
  app.post('/api/llm/gemini/chat', geminiAPI.chatCompletion);
  app.post('/api/llm/gemini/analyze-resume', geminiAPI.analyzeResume);
  app.post('/api/llm/gemini/match-resume', geminiAPI.matchResumeToJob);
  app.post('/api/llm/gemini/generate-cover-letter', geminiAPI.generateCoverLetter);
  app.post('/api/llm/gemini/generate-interview-questions', geminiAPI.generateInterviewQuestions);
  app.post('/api/llm/gemini/generate-interview-answer', geminiAPI.generateInterviewAnswer);
  
  // Universal route that will select the appropriate LLM based on the provider in the request
  app.post('/api/chat', async (req, res) => {
    const { provider = 'openai' } = req.body;
    
    switch(provider) {
      case 'openai':
        return openaiAPI.chatCompletion(req, res);
      case 'anthropic':
        return anthropicAPI.chatCompletion(req, res);
      case 'ollama':
        return ollamaAPI.chatCompletion(req, res);
      case 'gemini':
        return geminiAPI.chatCompletion(req, res);
      default:
        return res.status(400).json({ error: 'Invalid LLM provider' });
    }
  });
  
  // Universal resume analysis route
  app.post('/api/resume/analyze', async (req, res) => {
    const { provider = 'openai' } = req.body;
    
    switch(provider) {
      case 'openai':
        return openaiAPI.analyzeResume(req, res);
      case 'anthropic':
        return anthropicAPI.analyzeResume(req, res);
      case 'ollama':
        return ollamaAPI.analyzeResume(req, res);
      case 'gemini':
        return geminiAPI.analyzeResume(req, res);
      default:
        return res.status(400).json({ error: 'Invalid LLM provider' });
    }
  });
  
  // Universal job matching route
  app.post('/api/resume/match', async (req, res) => {
    const { provider = 'openai' } = req.body;
    
    switch(provider) {
      case 'openai':
        return openaiAPI.matchResumeToJob(req, res);
      case 'anthropic':
        return anthropicAPI.matchResumeToJob(req, res);
      case 'ollama':
        return ollamaAPI.matchResumeToJob(req, res);
      case 'gemini':
        return geminiAPI.matchResumeToJob(req, res);
      default:
        return res.status(400).json({ error: 'Invalid LLM provider' });
    }
  });
  
  // Universal cover letter generation route
  app.post('/api/cover-letter/generate', async (req, res) => {
    const { provider = 'openai' } = req.body;
    
    switch(provider) {
      case 'openai':
        return openaiAPI.generateCoverLetter(req, res);
      case 'anthropic':
        return anthropicAPI.generateCoverLetter(req, res);
      case 'ollama':
        return ollamaAPI.generateCoverLetter(req, res);
      case 'gemini':
        return geminiAPI.generateCoverLetter(req, res);
      default:
        return res.status(400).json({ error: 'Invalid LLM provider' });
    }
  });
  
  // Universal interview questions generation route
  app.post('/api/interview/questions', async (req, res) => {
    const { provider = 'openai' } = req.body;
    
    switch(provider) {
      case 'openai':
        return openaiAPI.generateInterviewQuestions(req, res);
      case 'anthropic':
        return anthropicAPI.generateInterviewQuestions(req, res);
      case 'ollama':
        return ollamaAPI.generateInterviewQuestions(req, res);
      case 'gemini':
        return geminiAPI.generateInterviewQuestions(req, res);
      default:
        return res.status(400).json({ error: 'Invalid LLM provider' });
    }
  });
  
  // Universal interview answer generation route
  app.post('/api/interview/answer', async (req, res) => {
    const { provider = 'openai' } = req.body;
    
    switch(provider) {
      case 'openai':
        return openaiAPI.generateInterviewAnswer(req, res);
      case 'anthropic':
        return anthropicAPI.generateInterviewAnswer(req, res);
      case 'ollama':
        return ollamaAPI.generateInterviewAnswer(req, res);
      case 'gemini':
        return geminiAPI.generateInterviewAnswer(req, res);
      default:
        return res.status(400).json({ error: 'Invalid LLM provider' });
    }
  });
  
  // Job listing and application management routes
  app.get('/api/jobs', async (req, res) => {
    try {
      // In a real app, this would fetch from a database
      res.json([
        { 
          id: 1, 
          title: 'Senior Frontend Developer', 
          company: 'Acme Technology', 
          location: 'San Francisco, CA (Remote)', 
          salary: '$130,000 - $160,000',
          match: 92,
          description: 'Acme Technology is seeking a Senior Frontend Developer to join our growing team...',
          status: 'applied',
          applied_date: '2023-05-10',
          favorite: true
        },
        { 
          id: 2, 
          title: 'Product Designer', 
          company: 'InnovateTech', 
          location: 'New York, NY (Hybrid)', 
          salary: '$95,000 - $120,000',
          match: 87,
          description: 'InnovateTech is looking for a creative Product Designer with experience in...',
          status: 'interview',
          applied_date: '2023-05-08',
          favorite: false
        },
        { 
          id: 3, 
          title: 'Data Engineer', 
          company: 'DataFlow', 
          location: 'Austin, TX (Remote)', 
          salary: '$125,000 - $150,000',
          match: 84,
          description: 'DataFlow is expanding our engineering team and looking for experienced Data Engineers...',
          status: 'saved',
          applied_date: null,
          favorite: true
        }
      ]);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Resume management routes
  app.get('/api/resumes', async (req, res) => {
    try {
      // In a real app, this would fetch from a database
      res.json([
        {
          id: 1,
          title: "My Professional Resume",
          createdAt: "2023-05-01T12:30:00Z",
          updatedAt: "2023-05-10T15:45:00Z"
        }
      ]);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Cover letter management routes
  app.get('/api/cover-letters', async (req, res) => {
    try {
      // In a real app, this would fetch from a database
      res.json([
        {
          id: 1,
          title: "Acme Technology Application",
          jobId: 1,
          createdAt: "2023-05-10T10:15:00Z",
          updatedAt: "2023-05-10T10:15:00Z"
        },
        {
          id: 2,
          title: "InnovateTech Cover Letter",
          jobId: 2,
          createdAt: "2023-05-08T14:20:00Z",
          updatedAt: "2023-05-08T14:20:00Z"
        }
      ]);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Interview prep management routes
  app.get('/api/interview-preps', async (req, res) => {
    try {
      // In a real app, this would fetch from a database
      res.json([
        {
          id: 1,
          jobId: 2,
          questions: [
            {
              id: "q1",
              question: "Can you walk me through your experience with React and how you've used it in previous projects?",
              answer: "In my current role at TechSolutions, I've been working extensively with React for the past 3 years..."
            },
            {
              id: "q2",
              question: "How do you approach optimizing the performance of a React application?",
              answer: "I follow a systematic approach to performance optimization..."
            }
          ],
          createdAt: "2023-05-12T09:30:00Z",
          updatedAt: "2023-05-12T09:30:00Z"
        }
      ]);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
