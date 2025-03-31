import React, { useState } from 'react';
import { Message } from '@/types';
import { useLLM } from '@/context/LLMContext';
import { LLM_MODELS } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';

interface AIAssistantProps {
  className?: string;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ className = '' }) => {
  const { settings } = useLLM();
  const { toast } = useToast();
  
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'ai', 
      content: "Hi Alex! I'm your AI job search assistant. How can I help you today?" 
    },
    { 
      role: 'user', 
      content: "I need help finding remote software engineering jobs that match my skills." 
    },
    { 
      role: 'ai', 
      content: "I'll help you find remote software engineering positions. Based on your resume, I'll focus on roles that need React, Node.js, and cloud services experience. Would you like me to:\n\n1. Search for jobs now\n2. Optimize your resume first\n3. Prepare custom job search alerts" 
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  
  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: newMessage }]);
    
    // Clear input
    setNewMessage('');
    
    try {
      // Simulate API call
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: newMessage }],
          provider: settings.provider,
          model: settings.model
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }
      
      // Since we don't have a real backend response yet, simulate a response
      setTimeout(() => {
        setMessages(prev => [
          ...prev, 
          { 
            role: 'ai', 
            content: "I'll help you with that! Based on your skills, I've found several remote software engineering positions that might be a good fit. Would you like me to show you the top matches or help tailor your resume for these opportunities first?" 
          }
        ]);
      }, 1000);
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to get a response from the AI assistant. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };
  
  const modelInfo = LLM_MODELS[settings.provider].find(m => m.id === settings.model);
  
  return (
    <div className={`p-6 bg-white rounded-lg shadow-sm dark:bg-neutral-800 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">AI Job Search Assistant</h2>
        <span className="flex items-center px-2 py-1 text-xs font-medium rounded-full bg-blue-50 text-primary dark:bg-blue-900/30">
          <i className="mr-1 bx bx-chip"></i>
          <span>{`${settings.provider.charAt(0).toUpperCase() + settings.provider.slice(1)} • ${modelInfo?.name || settings.model}`}</span>
        </span>
      </div>
      
      <div className="p-4 mb-4 overflow-y-auto bg-gray-50 rounded-lg dark:bg-neutral-700/50 h-72 scrollbar-hide">
        <div className="flex flex-col space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : ''}`}>
              {message.role === 'ai' && (
                <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 mr-2 rounded-full bg-primary">
                  <i className="text-white bx bx-bot"></i>
                </div>
              )}
              <div className={`px-4 py-2 rounded-lg ${
                message.role === 'user' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 dark:bg-neutral-700 text-gray-800 dark:text-gray-200'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="relative">
        <input 
          type="text" 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="block w-full px-4 py-3 pr-12 leading-tight text-gray-900 bg-gray-100 border border-gray-200 rounded-lg appearance-none dark:bg-neutral-700 dark:border-neutral-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" 
          placeholder="Type a message..."
        />
        <button 
          onClick={sendMessage}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-xl text-primary"
        >
          <i className="bx bx-send"></i>
        </button>
      </div>
    </div>
  );
};

export default AIAssistant;
