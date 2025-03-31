import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Dashboard from '@/components/dashboard/Dashboard';
import JobSearch from '@/components/job-search/JobSearch';
import ResumeBuilder from '@/components/resume-builder/ResumeBuilder';
import CoverLetter from '@/components/cover-letter/CoverLetter';
import InterviewPrep from '@/components/interview-prep/InterviewPrep';
import Applications from '@/components/applications/Applications';

type TabType = 'dashboard' | 'job-search' | 'resume-builder' | 'cover-letter' | 'interview-prep' | 'applications';

const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        
        {/* Main content area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-neutral-900">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'job-search' && <JobSearch />}
          {activeTab === 'resume-builder' && <ResumeBuilder />}
          {activeTab === 'cover-letter' && <CoverLetter />}
          {activeTab === 'interview-prep' && <InterviewPrep />}
          {activeTab === 'applications' && <Applications />}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
