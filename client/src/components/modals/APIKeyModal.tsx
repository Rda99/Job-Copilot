import React, { useState } from 'react';
import { useLLM } from '@/context/LLMContext';
import { LLM_PROVIDERS } from '@/lib/constants';

const APIKeyModal: React.FC = () => {
  const { settings, setApiKey, setShowAPISettings } = useLLM();
  const [apiKeyInput, setApiKeyInput] = useState(settings.apiKey || '');
  const [showApiKey, setShowApiKey] = useState(false);
  
  const provider = LLM_PROVIDERS.find(p => p.id === settings.provider);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApiKey(apiKeyInput);
  };
  
  const handleCancel = () => {
    setShowAPISettings(false);
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div 
        className="relative w-full max-w-md p-6 mx-4 bg-white rounded-lg shadow-xl dark:bg-neutral-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Configure API Key</h3>
          <button 
            onClick={handleCancel}
            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-neutral-700"
          >
            <i className="text-xl text-gray-500 bx bx-x"></i>
          </button>
        </div>
        
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Enter your {provider?.name} API key below. Your key is stored locally and never sent to our servers.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">API Key</label>
            <div className="relative">
              <input 
                type={showApiKey ? "text" : "password"} 
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder={`Enter your ${provider?.name} API key`}
                className="block w-full px-3 py-2 pr-10 bg-white border border-gray-200 rounded-md dark:bg-neutral-700 dark:border-neutral-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
              <button 
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
              >
                <i className={`bx ${showApiKey ? 'bx-hide' : 'bx-show'}`}></i>
              </button>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button 
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md dark:text-white dark:bg-neutral-700 dark:border-neutral-600 hover:bg-gray-50 dark:hover:bg-neutral-600"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white rounded-md bg-primary hover:bg-blue-600"
            >
              Save API Key
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default APIKeyModal;
