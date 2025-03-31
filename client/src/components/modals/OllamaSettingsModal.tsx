import React, { useState, useEffect } from 'react';
import { useLLM } from '@/context/LLMContext';
import { useToast } from '@/hooks/use-toast';

interface OllamaModel {
  name: string;
  status: 'installed' | 'not_installed';
}

const OllamaSettingsModal: React.FC = () => {
  const { settings, setOllamaEndpoint, setShowLLMSettings } = useLLM();
  const { toast } = useToast();
  
  const [endpointInput, setEndpointInput] = useState(settings.ollamaEndpoint || 'http://localhost:11434');
  const [isLoading, setIsLoading] = useState(false);
  const [models, setModels] = useState<OllamaModel[]>([
    { name: 'gamma3:1b', status: 'installed' },
    { name: 'llama3:8b', status: 'installed' },
    { name: 'mistral:7b', status: 'installed' },
    { name: 'phi3:mini', status: 'installed' }
  ]);
  
  const handleTestConnection = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/llm/ollama/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ endpoint: endpointInput })
      });
      
      if (!response.ok) {
        throw new Error('Failed to connect to Ollama');
      }
      
      const data = await response.json();
      
      toast({
        title: 'Connection Successful',
        description: `Successfully connected to Ollama at ${endpointInput}`,
      });
      
      if (data.models) {
        setModels(data.models);
      }
    } catch (error) {
      toast({
        title: 'Connection Failed',
        description: 'Could not connect to Ollama. Please check the endpoint and ensure Ollama is running.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRefreshModels = () => {
    handleTestConnection();
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOllamaEndpoint(endpointInput);
  };
  
  const handleCancel = () => {
    setShowLLMSettings(false);
  };
  
  // Test connection when component mounts
  useEffect(() => {
    // We don't actually send the request here in the component mount
    // to avoid errors if Ollama isn't running
    // handleTestConnection();
  }, []);
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div 
        className="relative w-full max-w-md p-6 mx-4 bg-white rounded-lg shadow-xl dark:bg-neutral-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Ollama Connection Settings</h3>
          <button 
            onClick={handleCancel}
            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-neutral-700"
          >
            <i className="text-xl text-gray-500 bx bx-x"></i>
          </button>
        </div>
        
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Configure your local Ollama instance to use your installed models.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Ollama API Endpoint</label>
            <div className="flex space-x-2">
              <input 
                type="text" 
                value={endpointInput}
                onChange={(e) => setEndpointInput(e.target.value)}
                placeholder="http://localhost:11434"
                className="block w-full px-3 py-2 bg-white border border-gray-200 rounded-md dark:bg-neutral-700 dark:border-neutral-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
              <button 
                type="button"
                onClick={handleTestConnection}
                disabled={isLoading}
                className="px-3 py-2 text-sm font-medium text-white rounded-md bg-primary hover:bg-blue-600 disabled:opacity-50"
              >
                Test
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Default: http://localhost:11434</p>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Available Local Models</label>
              <button 
                type="button"
                onClick={handleRefreshModels}
                disabled={isLoading}
                className="text-xs text-primary disabled:opacity-50"
              >
                {isLoading ? 'Refreshing...' : 'Refresh List'}
              </button>
            </div>
            
            <div className="p-3 mb-2 overflow-y-auto border border-gray-200 rounded-md dark:border-neutral-700 max-h-40">
              {models.map((model, index) => (
                <div key={index} className="flex items-center justify-between mb-2 text-sm">
                  <span className="font-medium">{model.name}</span>
                  <span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full dark:bg-green-900/30 dark:text-green-300">
                    {model.status === 'installed' ? 'Installed' : 'Not Installed'}
                  </span>
                </div>
              ))}
              
              {models.length === 0 && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  No models found. Please check your Ollama installation.
                </div>
              )}
            </div>
            
            <button 
              type="button"
              onClick={() => {
                toast({
                  title: 'Feature Not Available',
                  description: 'Installing new models directly from JobCopilot is not yet supported. Please use the Ollama CLI to install models.',
                });
              }}
              className="flex items-center text-xs text-primary"
            >
              <i className="mr-1 bx bx-download"></i>
              Install a new model from Ollama library
            </button>
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
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OllamaSettingsModal;
