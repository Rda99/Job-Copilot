import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { LLMProvider as LLMProviderType, LLMSettings } from '@/types';
import { LLM_MODELS } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';

interface LLMContextType {
  settings: LLMSettings;
  setProvider: (provider: LLMProviderType) => void;
  setModel: (model: string) => void;
  setApiKey: (key: string) => void;
  setOllamaEndpoint: (endpoint: string) => void;
  showAPISettings: boolean;
  setShowAPISettings: (show: boolean) => void;
  showLLMSettings: boolean;
  setShowLLMSettings: (show: boolean) => void;
}

const DEFAULT_SETTINGS: LLMSettings = {
  provider: 'openai',
  model: 'gpt-4o',
  apiKey: '',
  ollamaEndpoint: 'http://localhost:11434'
};

const LLMContext = createContext<LLMContextType | undefined>(undefined);

export function LLMProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<LLMSettings>(() => {
    // Try to load settings from localStorage
    const savedSettings = localStorage.getItem('llm_settings');
    return savedSettings ? JSON.parse(savedSettings) : DEFAULT_SETTINGS;
  });
  
  const [showAPISettings, setShowAPISettings] = useState(false);
  const [showLLMSettings, setShowLLMSettings] = useState(false);
  const { toast } = useToast();

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('llm_settings', JSON.stringify(settings));
  }, [settings]);

  const setProvider = (provider: LLMProviderType) => {
    // Find the default model for the selected provider
    const defaultModel = LLM_MODELS[provider].find(m => m.isDefault)?.id || LLM_MODELS[provider][0].id;
    
    setSettings(prev => ({
      ...prev,
      provider,
      model: defaultModel
    }));
    
    toast({
      title: "LLM Provider Changed",
      description: `Now using ${provider.charAt(0).toUpperCase() + provider.slice(1)} with ${defaultModel}`,
    });
  };

  const setModel = (model: string) => {
    setSettings(prev => ({
      ...prev,
      model
    }));
    
    toast({
      title: "Model Changed",
      description: `Now using ${model}`,
    });
  };

  const setApiKey = (apiKey: string) => {
    setSettings(prev => ({
      ...prev,
      apiKey
    }));
    
    setShowAPISettings(false);
    
    toast({
      title: "API Key Saved",
      description: "Your API key has been saved for future use",
    });
  };

  const setOllamaEndpoint = (ollamaEndpoint: string) => {
    setSettings(prev => ({
      ...prev,
      ollamaEndpoint
    }));
    
    setShowLLMSettings(false);
    
    toast({
      title: "Ollama Settings Saved",
      description: "Your Ollama endpoint has been configured",
    });
  };

  return (
    <LLMContext.Provider value={{
      settings,
      setProvider,
      setModel,
      setApiKey,
      setOllamaEndpoint,
      showAPISettings,
      setShowAPISettings,
      showLLMSettings,
      setShowLLMSettings
    }}>
      {children}
    </LLMContext.Provider>
  );
}

export function useLLM() {
  const context = useContext(LLMContext);
  if (context === undefined) {
    throw new Error('useLLM must be used within a LLMProvider');
  }
  return context;
}
