import React from 'react';
import ResumeEditor from './ResumeEditor';
import AIAnalysis from './AIAnalysis';

const ResumeBuilder: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Resume Builder</h1>
        <p className="text-gray-600 dark:text-gray-300">Create and optimize your resume with AI assistance</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ResumeEditor className="lg:col-span-2" />
        <AIAnalysis />
      </div>
    </div>
  );
};

export default ResumeBuilder;
