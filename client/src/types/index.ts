export type LLMProvider = 'openai' | 'anthropic' | 'gemini' | 'ollama';

export interface LLMModel {
  id: string;
  name: string;
  isDefault: boolean;
}

export interface LLMProviderInfo {
  id: LLMProvider;
  name: string;
  icon: string;
  hasApiKey: boolean;
}

export interface LLMSettings {
  provider: LLMProvider;
  model: string;
  apiKey?: string;
  ollamaEndpoint?: string;
}

export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  salary?: string;
  match?: number;
  description?: string;
  status: 'saved' | 'applied' | 'interview' | 'offer' | 'rejected';
  applied_date?: string;
  favorite: boolean;
}

export interface ApplicationsData {
  total: number;
  applied: number;
  interviews: number;
  offers: number;
}

export interface ActivityItem {
  id: number;
  type: 'applied' | 'resume' | 'interview' | 'cover_letter';
  title: string;
  subtitle: string;
  timestamp: string;
}

export interface Message {
  role: 'ai' | 'user';
  content: string;
}

export interface ChatMessage {
  role: 'assistant' | 'user';
  content: string;
}

export interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  avatar?: string;
  plan: string;
}

export interface ResumeData {
  id?: number;
  title: string;
  contactInfo: {
    fullName: string;
    jobTitle: string;
    email: string;
    phone: string;
  };
  summary: string;
  experience: ExperienceItem[];
  skills: string[];
  education?: EducationItem[];
}

export interface ExperienceItem {
  id: string;
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
}

export interface ResumeAnalysis {
  score: number;
  strengths: string[];
  improvements: string[];
  suggestions: string;
}

export interface CoverLetterData {
  id?: number;
  jobId?: number;
  title: string;
  content: string;
}

export interface InterviewQuestionAnswer {
  id: string;
  question: string;
  answer?: string;
}

export interface InterviewPrepData {
  id?: number;
  jobId?: number;
  questions: InterviewQuestionAnswer[];
  notes?: string;
}
