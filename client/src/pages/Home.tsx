import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useLLM } from '@/context/LLMContext';
import APIKeyModal from '@/components/modals/APIKeyModal';
import OllamaSettingsModal from '@/components/modals/OllamaSettingsModal';

const Home: React.FC = () => {
  const { showAPISettings, showLLMSettings } = useLLM();
  
  return (
    <>
      <AppLayout />
      {showAPISettings && <APIKeyModal />}
      {showLLMSettings && <OllamaSettingsModal />}
    </>
  );
};

export default Home;
