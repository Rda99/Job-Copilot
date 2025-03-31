import React, { useState } from 'react';
import { useLLM } from '@/context/LLMContext';
import { LLM_MODELS } from '@/lib/constants';
import { CoverLetterData } from '@/types';
import { useToast } from '@/hooks/use-toast';

const CoverLetter: React.FC = () => {
  const { settings } = useLLM();
  const { toast } = useToast();
  
  const [selectedJob, setSelectedJob] = useState<string>('Acme Technology - Senior Frontend Developer');
  const [coverLetterContent, setCoverLetterContent] = useState<string>(
    `Dear Hiring Manager,

I am writing to express my interest in the Senior Frontend Developer position at Acme Technology, which I found on your website. As a passionate and experienced frontend developer with over 7 years of professional experience in building responsive web applications using React and TypeScript, I believe I would be a valuable addition to your team.

In my current role at TechSolutions Inc., I led the frontend team in redesigning the company's flagship product, resulting in a 35% increase in user engagement. I also architected and implemented a component library used across multiple products, reducing development time by 40%.

I am particularly impressed by Acme Technology's commitment to innovation and user-centric design. Your recent product launches demonstrate a focus on seamless user experiences, which aligns perfectly with my own professional values.

Some of my key qualifications include:
• Extensive experience with React, TypeScript, and modern JavaScript frameworks
• Strong focus on performance optimization and accessibility
• Experience in leading teams and mentoring junior developers
• Excellent problem-solving skills and attention to detail

I am excited about the opportunity to contribute to Acme Technology's continued success and growth. I would welcome the chance to discuss how my skills and experience align with your needs.

Thank you for considering my application.

Sincerely,
Alex Morgan`
  );
  
  const jobs = [
    'Acme Technology - Senior Frontend Developer',
    'InnovateTech - Product Designer',
    'DataFlow - Data Engineer',
    'WebSphere Solutions - Full Stack Developer'
  ];
  
  const [coverLetters, setCoverLetters] = useState<CoverLetterData[]>([
    {
      id: 1,
      title: 'Acme Technology Application',
      content: coverLetterContent
    },
    {
      id: 2,
      title: 'InnovateTech Cover Letter',
      content: 'Cover letter content for InnovateTech...'
    }
  ]);
  
  const [activeLetterIndex, setActiveLetterIndex] = useState(0);
  
  const generateNewLetter = () => {
    toast({
      title: "Generating Cover Letter",
      description: "AI is creating a customized cover letter...",
    });
    
    // In a real app, this would call the API
    setTimeout(() => {
      const newLetter = {
        id: coverLetters.length + 1,
        title: `${selectedJob.split(' - ')[0]} Application`,
        content: `Dear Hiring Manager,\n\nI'm excited to apply for the ${selectedJob.split(' - ')[1]} position...`
      };
      
      setCoverLetters([...coverLetters, newLetter]);
      setActiveLetterIndex(coverLetters.length);
      
      toast({
        title: "Cover Letter Generated",
        description: "Your new cover letter is ready!",
      });
    }, 1500);
  };
  
  const saveLetter = () => {
    toast({
      title: "Cover Letter Saved",
      description: "Your changes have been saved successfully.",
    });
  };
  
  const modelInfo = LLM_MODELS[settings.provider].find(m => m.id === settings.model);
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Cover Letters</h1>
        <p className="text-gray-600 dark:text-gray-300">Create customized cover letters for your job applications</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Sidebar with letter list */}
        <div className="bg-white rounded-lg shadow-sm dark:bg-neutral-800">
          <div className="p-4 border-b border-gray-200 dark:border-neutral-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your Cover Letters</h2>
          </div>
          
          <div className="p-4">
            <div className="space-y-2">
              {coverLetters.map((letter, index) => (
                <button
                  key={letter.id}
                  onClick={() => setActiveLetterIndex(index)}
                  className={`w-full px-3 py-2 text-left text-sm rounded-md ${
                    index === activeLetterIndex
                      ? 'bg-blue-50 text-primary dark:bg-blue-900/30 dark:text-blue-200'
                      : 'hover:bg-gray-50 dark:hover:bg-neutral-700'
                  }`}
                >
                  <div className="font-medium truncate">{letter.title}</div>
                </button>
              ))}
            </div>
            
            <div className="mt-4">
              <button
                onClick={generateNewLetter}
                className="flex items-center justify-center w-full px-3 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-blue-600"
              >
                <i className="mr-2 bx bx-plus"></i>
                Create New Letter
              </button>
            </div>
          </div>
        </div>
        
        {/* Cover letter editor */}
        <div className="bg-white rounded-lg shadow-sm dark:bg-neutral-800 lg:col-span-3">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-neutral-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {activeLetterIndex < coverLetters.length ? 
                coverLetters[activeLetterIndex].title : 'New Cover Letter'}
            </h2>
            <span className="flex items-center px-2 py-1 text-xs font-medium rounded-full bg-blue-50 text-primary dark:bg-blue-900/30">
              <i className="mr-1 bx bx-chip"></i>
              <span>{`${settings.provider.charAt(0).toUpperCase() + settings.provider.slice(1)} • ${modelInfo?.name || settings.model}`}</span>
            </span>
          </div>
          
          <div className="p-4">
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Job Position</label>
              <select 
                value={selectedJob}
                onChange={(e) => setSelectedJob(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md dark:bg-neutral-700 dark:border-neutral-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              >
                {jobs.map((job) => (
                  <option key={job} value={job}>{job}</option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Cover Letter Content</label>
                <div className="flex space-x-2">
                  <button 
                    onClick={generateNewLetter}
                    className="flex items-center text-xs text-primary"
                  >
                    <i className="mr-1 bx bx-wand-2"></i>
                    Generate with AI
                  </button>
                </div>
              </div>
              <textarea
                rows={20}
                value={activeLetterIndex < coverLetters.length ? coverLetters[activeLetterIndex].content : ''}
                onChange={(e) => {
                  if (activeLetterIndex < coverLetters.length) {
                    const updated = [...coverLetters];
                    updated[activeLetterIndex].content = e.target.value;
                    setCoverLetters(updated);
                  }
                }}
                className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-md dark:bg-neutral-700 dark:border-neutral-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-mono"
              ></textarea>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md dark:text-white dark:bg-neutral-700 dark:border-neutral-600 hover:bg-gray-50 dark:hover:bg-neutral-600">
                Download as PDF
              </button>
              <button
                onClick={saveLetter}
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-blue-600"
              >
                Save Cover Letter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverLetter;
