import React from 'react';
import { useLLM } from '@/context/LLMContext';
import { useUser } from '@/context/UserContext';
import { LLM_PROVIDERS, LLM_MODELS } from '@/lib/constants';

type TabType = 'dashboard' | 'job-search' | 'resume-builder' | 'cover-letter' | 'interview-prep' | 'applications';

interface SidebarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  sidebarOpen, 
  toggleSidebar, 
  activeTab, 
  setActiveTab 
}) => {
  const { settings, setProvider, setModel, setShowAPISettings, setShowLLMSettings } = useLLM();
  const { user } = useUser();
  
  return (
    <aside 
      className={`fixed inset-y-0 left-0 z-10 w-64 transition-transform duration-300 ease-in-out bg-white border-r border-gray-200 dark:bg-neutral-800 dark:border-neutral-700 md:translate-x-0 md:relative ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-neutral-700">
        <a href="#" className="flex items-center space-x-2">
          <span className="flex items-center justify-center w-8 h-8 bg-primary rounded-md">
            <i className="text-white bx bx-briefcase-alt-2"></i>
          </span>
          <span className="text-lg font-semibold">JobCopilot</span>
        </a>
        <button 
          onClick={toggleSidebar} 
          className="p-1 rounded-md md:hidden hover:bg-gray-100 dark:hover:bg-neutral-700"
        >
          <i className="text-xl bx bx-x"></i>
        </button>
      </div>
      
      {/* Sidebar Content */}
      <div className="p-4 overflow-y-auto h-[calc(100vh-4rem)]">
        {/* Main Navigation */}
        <nav className="space-y-1">
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); setActiveTab('dashboard'); }} 
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md group ${
              activeTab === 'dashboard' 
                ? 'bg-blue-50 text-primary dark:bg-blue-900/30 dark:text-blue-200' 
                : 'hover:bg-gray-50 dark:hover:bg-neutral-700'
            }`}
          >
            <i className="w-5 h-5 mr-3 text-xl bx bxs-dashboard"></i>
            Dashboard
          </a>
          
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); setActiveTab('job-search'); }} 
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md group ${
              activeTab === 'job-search' 
                ? 'bg-blue-50 text-primary dark:bg-blue-900/30 dark:text-blue-200' 
                : 'hover:bg-gray-50 dark:hover:bg-neutral-700'
            }`}
          >
            <i className="w-5 h-5 mr-3 text-xl bx bx-search-alt"></i>
            Job Search
          </a>
          
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); setActiveTab('resume-builder'); }} 
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md group ${
              activeTab === 'resume-builder' 
                ? 'bg-blue-50 text-primary dark:bg-blue-900/30 dark:text-blue-200' 
                : 'hover:bg-gray-50 dark:hover:bg-neutral-700'
            }`}
          >
            <i className="w-5 h-5 mr-3 text-xl bx bx-file"></i>
            Resume Builder
          </a>
          
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); setActiveTab('cover-letter'); }} 
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md group ${
              activeTab === 'cover-letter' 
                ? 'bg-blue-50 text-primary dark:bg-blue-900/30 dark:text-blue-200' 
                : 'hover:bg-gray-50 dark:hover:bg-neutral-700'
            }`}
          >
            <i className="w-5 h-5 mr-3 text-xl bx bx-envelope"></i>
            Cover Letters
          </a>
          
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); setActiveTab('interview-prep'); }} 
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md group ${
              activeTab === 'interview-prep' 
                ? 'bg-blue-50 text-primary dark:bg-blue-900/30 dark:text-blue-200' 
                : 'hover:bg-gray-50 dark:hover:bg-neutral-700'
            }`}
          >
            <i className="w-5 h-5 mr-3 text-xl bx bx-chat"></i>
            Interview Prep
          </a>
          
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); setActiveTab('applications'); }} 
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md group ${
              activeTab === 'applications' 
                ? 'bg-blue-50 text-primary dark:bg-blue-900/30 dark:text-blue-200' 
                : 'hover:bg-gray-50 dark:hover:bg-neutral-700'
            }`}
          >
            <i className="w-5 h-5 mr-3 text-xl bx bx-list-check"></i>
            Applications
          </a>
        </nav>
        
        {/* LLM Settings */}
        <div className="pt-5 mt-6 border-t border-gray-200 dark:border-neutral-700">
          <h3 className="px-3 mb-3 text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">
            AI Settings
          </h3>
          
          <div className="p-3 mb-3 bg-gray-50 rounded-lg dark:bg-neutral-700/50">
            <div className="mb-2 font-medium">LLM Provider</div>
            <div className="flex flex-wrap gap-2 mb-3">
              {LLM_PROVIDERS.map(provider => (
                <button 
                  key={provider.id}
                  onClick={() => setProvider(provider.id)}
                  className={`flex items-center gap-1 px-2 py-1 text-sm font-medium border border-gray-200 rounded-md dark:border-neutral-600 ${
                    settings.provider === provider.id 
                      ? 'bg-primary text-white' 
                      : 'bg-white dark:bg-neutral-700 hover:bg-gray-100 dark:hover:bg-neutral-600'
                  }`}
                >
                  <i className={`bx ${provider.icon} text-base`}></i>
                  <span>{provider.name}</span>
                </button>
              ))}
            </div>
            
            <div className="mb-2 font-medium">Model</div>
            <select 
              value={settings.model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-md dark:bg-neutral-700 dark:border-neutral-600"
            >
              {LLM_MODELS[settings.provider].map(model => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
            
            {LLM_PROVIDERS.find(p => p.id === settings.provider)?.hasApiKey && (
              <div className="mt-3">
                <button 
                  onClick={() => setShowAPISettings(true)}
                  className="flex items-center w-full gap-1 px-3 py-1 text-sm text-gray-600 bg-white border border-gray-200 rounded-md dark:text-gray-300 dark:bg-neutral-700 dark:border-neutral-600 hover:bg-gray-50 dark:hover:bg-neutral-600"
                >
                  <i className="bx bx-key"></i>
                  <span>Configure API Key</span>
                </button>
              </div>
            )}
            
            {settings.provider === 'ollama' && (
              <div className="mt-3">
                <button 
                  onClick={() => setShowLLMSettings(true)}
                  className="flex items-center w-full gap-1 px-3 py-1 text-sm text-gray-600 bg-white border border-gray-200 rounded-md dark:text-gray-300 dark:bg-neutral-700 dark:border-neutral-600 hover:bg-gray-50 dark:hover:bg-neutral-600"
                >
                  <i className="bx bx-server"></i>
                  <span>Local Ollama Settings</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Account section */}
        <div className="pt-4 mt-4 border-t border-gray-200 dark:border-neutral-700">
          <div className="flex items-center px-2 py-2 text-sm rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-700">
            <img 
              className="flex-shrink-0 w-8 h-8 rounded-full" 
              src={user.avatar || "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=320&h=320&fit=crop&crop=faces&auto=format&q=80"} 
              alt="User profile"
            />
            <div className="flex-1 min-w-0 ml-3">
              <div className="text-sm font-medium text-gray-900 truncate dark:text-gray-100">
                {user.fullName}
              </div>
              <div className="text-xs text-gray-500 truncate dark:text-gray-400">
                {user.plan}
              </div>
            </div>
            <div className="text-base">
              <i className="bx bx-cog"></i>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
