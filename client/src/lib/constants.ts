import { LLMModel, LLMProviderInfo, UserProfile } from "@/types";

export const LLM_PROVIDERS: LLMProviderInfo[] = [
  { id: 'openai', name: 'OpenAI', icon: 'bx-aperture', hasApiKey: true },
  { id: 'anthropic', name: 'Anthropic', icon: 'bx-shape-square', hasApiKey: true },
  { id: 'gemini', name: 'Google Gemini', icon: 'bx-shape-circle', hasApiKey: true },
  { id: 'ollama', name: 'Ollama (Local)', icon: 'bx-server', hasApiKey: false }
];

export const LLM_MODELS: Record<string, LLMModel[]> = {
  openai: [
    { id: 'gpt-4o', name: 'GPT-4o', isDefault: true }, // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', isDefault: false },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', isDefault: false }
  ],
  anthropic: [
    { id: 'claude-3-7-sonnet-20250219', name: 'Claude 3.7 Sonnet', isDefault: true }, // the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025. Do not change this unless explicitly requested by the user.
    { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', isDefault: false },
    { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet', isDefault: false },
    { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', isDefault: false }
  ],
  gemini: [
    { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', isDefault: true },
    { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', isDefault: false },
    { id: 'gemini-pro', name: 'Gemini Pro (Legacy)', isDefault: false }
  ],
  ollama: [
    { id: 'gamma3:1b', name: 'Gamma3:1b', isDefault: true },
    { id: 'llama3:8b', name: 'Llama3:8b', isDefault: false },
    { id: 'mistral:7b', name: 'Mistral:7b', isDefault: false },
    { id: 'phi3:mini', name: 'Phi3:mini', isDefault: false }
  ]
};

export const STATUS_CLASSES = {
  'applied': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'interview': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'offer': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  'rejected': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  'saved': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
};

export const STATUS_ICONS = {
  'applied': 'bx-send',
  'interview': 'bx-calendar',
  'offer': 'bx-badge-check',
  'rejected': 'bx-x-circle',
  'saved': 'bx-bookmark'
};

export const ACTIVITY_ICONS = {
  'applied': { icon: 'bx-send', bgClass: 'bg-green-50 dark:bg-green-900/30', textClass: 'text-green-500' },
  'resume': { icon: 'bx-file', bgClass: 'bg-blue-50 dark:bg-blue-900/30', textClass: 'text-primary' },
  'interview': { icon: 'bx-calendar', bgClass: 'bg-purple-50 dark:bg-purple-900/30', textClass: 'text-purple-500' },
  'cover_letter': { icon: 'bx-envelope', bgClass: 'bg-indigo-50 dark:bg-indigo-900/30', textClass: 'text-indigo-500' }
};

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 1,
  fullName: 'Alex Morgan',
  email: 'alex.morgan@example.com',
  avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=320&h=320&fit=crop&crop=faces&auto=format&q=80',
  plan: 'Professional Plan'
};

export const STATS_CARDS = [
  { title: 'Total Applications', icon: 'bx-file', iconBg: 'bg-blue-50 dark:bg-blue-900/30', iconColor: 'text-primary', key: 'total' },
  { title: 'Applied', icon: 'bx-send', iconBg: 'bg-green-50 dark:bg-green-900/30', iconColor: 'text-green-500', key: 'applied' },
  { title: 'Interviews', icon: 'bx-calendar', iconBg: 'bg-purple-50 dark:bg-purple-900/30', iconColor: 'text-purple-500', key: 'interviews' },
  { title: 'Offers', icon: 'bx-trophy', iconBg: 'bg-yellow-50 dark:bg-yellow-900/30', iconColor: 'text-yellow-500', key: 'offers' }
];
