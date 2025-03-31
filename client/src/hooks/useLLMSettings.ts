import { useState, useEffect } from 'react';
import { LLMSettings, LLMProvider } from '@/types';
import { LLM_MODELS } from '@/lib/constants';

// Default settings to use when localStorage is empty
const DEFAULT_SETTINGS: LLMSettings = {
  provider: 'openai',
  model: 'gpt-4o', // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
  apiKey: '',
  ollamaEndpoint: 'http://localhost:11434'
};

export const useLLMSettings = () => {
  const [settings, setSettings] = useState<LLMSettings>(() => {
    // Try to load settings from localStorage
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem('llm_settings');
      return savedSettings ? JSON.parse(savedSettings) : DEFAULT_SETTINGS;
    }
    return DEFAULT_SETTINGS;
  });
  
  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('llm_settings', JSON.stringify(settings));
    }
  }, [settings]);
  
  const setProvider = (provider: LLMProvider) => {
    // Find the default model for the selected provider
    const defaultModel = LLM_MODELS[provider].find(m => m.isDefault)?.id || LLM_MODELS[provider][0].id;
    
    setSettings(prev => ({
      ...prev,
      provider,
      model: defaultModel
    }));
    
    return {
      provider,
      model: defaultModel
    };
  };
  
  const setModel = (model: string) => {
    setSettings(prev => ({
      ...prev,
      model
    }));
    
    return model;
  };
  
  const setApiKey = (apiKey: string) => {
    setSettings(prev => ({
      ...prev,
      apiKey
    }));
    
    return apiKey;
  };
  
  const setOllamaEndpoint = (ollamaEndpoint: string) => {
    setSettings(prev => ({
      ...prev,
      ollamaEndpoint
    }));
    
    return ollamaEndpoint;
  };
  
  return {
    settings,
    setProvider,
    setModel,
    setApiKey,
    setOllamaEndpoint
  };
};
