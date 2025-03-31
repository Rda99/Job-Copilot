import React, { useState } from 'react';
import { ResumeAnalysis } from '@/types';
import { useLLM } from '@/context/LLMContext';
import { LLM_MODELS } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';

const AIAnalysis: React.FC = () => {
  const { settings } = useLLM();
  const { toast } = useToast();
  
  const [analysis, setAnalysis] = useState<ResumeAnalysis>({
    score: 85,
    strengths: [
      'Strong technical skills section with in-demand technologies',
      'Quantifiable achievements in work experience',
      'Clear professional summary highlighting expertise'
    ],
    improvements: [
      'Work experience could use more specific technical details',
      'Consider adding certifications or additional education',
      'Add keywords from job descriptions you\'re targeting'
    ],
    suggestions: 'Senior Front-end Developer with 7+ years of experience crafting responsive and high-performance web applications using React and TypeScript. Demonstrated expertise in leading teams to deliver user-centric solutions that drive business growth. Passionate about clean code architecture and mentoring junior developers.'
  });
  
  const generateMoreSuggestions = () => {
    toast({
      title: "Generating suggestions",
      description: "AI is analyzing your resume...",
    });
    
    // In a real app, this would call the API
    setTimeout(() => {
      toast({
        title: "Analysis complete",
        description: "New suggestions are available",
      });
    }, 1500);
  };
  
  const analyzeForJobFit = () => {
    toast({
      title: "Job Fit Analysis",
      description: "Please upload job descriptions to analyze",
    });
  };
  
  const modelInfo = LLM_MODELS[settings.provider].find(m => m.id === settings.model);
  
  return (
    <div className="flex flex-col bg-white rounded-lg shadow-sm dark:bg-neutral-800">
      <div className="p-5 border-b border-gray-200 dark:border-neutral-700">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">AI Resume Analysis</h2>
          <span className="flex items-center px-2 py-1 text-xs font-medium rounded-full bg-blue-50 text-primary dark:bg-blue-900/30">
            <i className="mr-1 bx bx-chip"></i>
            <span>{`${settings.provider.charAt(0).toUpperCase() + settings.provider.slice(1)} • ${modelInfo?.name || settings.model}`}</span>
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">Get feedback and optimization suggestions for your resume</p>
      </div>
      
      <div className="flex-1 p-5 overflow-y-auto">
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <div className="flex items-center justify-center w-8 h-8 mr-2 rounded-full bg-blue-50 dark:bg-blue-900/30">
              <i className="text-primary bx bx-line-chart"></i>
            </div>
            <h3 className="text-base font-medium text-gray-900 dark:text-white">Resume Score: {analysis.score}/100</h3>
          </div>
          
          <div className="h-2 bg-gray-200 rounded-full dark:bg-neutral-700">
            <div 
              className="h-2 rounded-full bg-primary"
              style={{ width: `${analysis.score}%` }}
            ></div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="p-3 border border-l-4 rounded-r-md border-l-green-500 border-gray-200 bg-green-50 dark:bg-green-900/20 dark:border-gray-700">
            <h4 className="font-medium text-green-700 dark:text-green-400">Strengths</h4>
            <ul className="pl-5 mt-1 text-sm list-disc text-green-700 dark:text-green-400">
              {analysis.strengths.map((strength, index) => (
                <li key={index}>{strength}</li>
              ))}
            </ul>
          </div>
          
          <div className="p-3 border border-l-4 rounded-r-md border-l-yellow-500 border-gray-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-gray-700">
            <h4 className="font-medium text-yellow-700 dark:text-yellow-400">Improvement Areas</h4>
            <ul className="pl-5 mt-1 text-sm list-disc text-yellow-700 dark:text-yellow-400">
              {analysis.improvements.map((improvement, index) => (
                <li key={index}>{improvement}</li>
              ))}
            </ul>
          </div>
          
          <div className="p-3 border border-gray-200 rounded-md dark:border-neutral-700">
            <h4 className="mb-2 font-medium text-gray-900 dark:text-white">AI Suggestions</h4>
            
            <div className="p-3 mb-3 text-sm bg-blue-50 rounded-md dark:bg-blue-900/20">
              <p className="mb-1 text-blue-700 dark:text-blue-300">Try enhancing your professional summary with:</p>
              <p className="italic text-blue-700 dark:text-blue-300">
                {analysis.suggestions}
              </p>
            </div>
            
            <button 
              onClick={generateMoreSuggestions}
              className="flex items-center justify-center w-full px-3 py-2 text-sm font-medium text-white rounded-md bg-primary hover:bg-blue-600"
            >
              <i className="mr-2 bx bx-wand-2"></i>
              Generate More Suggestions
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-200 dark:border-neutral-700">
        <button 
          onClick={analyzeForJobFit}
          className="flex items-center justify-center w-full px-4 py-2 mb-2 text-sm font-medium text-white rounded-md bg-primary hover:bg-blue-600"
        >
          <i className="mr-2 bx bx-analyse"></i>
          Analyze for Job Fit
        </button>
        <p className="text-xs text-center text-gray-500 dark:text-gray-400">Upload job descriptions to get tailored resume optimization tips</p>
      </div>
    </div>
  );
};

export default AIAnalysis;
