import React, { useState } from 'react';
import { ResumeData, ExperienceItem } from '@/types';
import { nanoid } from 'nanoid';
import { useToast } from '@/hooks/use-toast';

interface ResumeEditorProps {
  className?: string;
}

const ResumeEditor: React.FC<ResumeEditorProps> = ({ className = '' }) => {
  const { toast } = useToast();
  
  const [resumeData, setResumeData] = useState<ResumeData>({
    title: 'My Professional Resume',
    contactInfo: {
      fullName: 'Alex Morgan',
      jobTitle: 'Senior Front-end Developer',
      email: 'alex.morgan@example.com',
      phone: '(555) 123-4567'
    },
    summary: 'Senior Front-end Developer with 7+ years of experience building responsive and performant web applications. Specialized in React, TypeScript, and modern JavaScript frameworks. Strong focus on user experience, accessibility, and code quality. Demonstrated ability to lead teams and mentor junior developers.',
    experience: [
      {
        id: nanoid(),
        jobTitle: 'Senior Front-end Developer',
        company: 'TechSolutions Inc.',
        startDate: '2020-03',
        endDate: '2023-04',
        bullets: [
          'Led the frontend team in redesigning the company\'s flagship product, resulting in a 35% increase in user engagement',
          'Architected and implemented a component library used across multiple products, reducing development time by 40%'
        ]
      }
    ],
    skills: ['React', 'TypeScript', 'JavaScript', 'HTML/CSS', 'Redux', 'Node.js', 'AWS']
  });
  
  // Helper functions to update resume data
  const updateContactInfo = (field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [field]: value
      }
    }));
  };
  
  const updateSummary = (value: string) => {
    setResumeData(prev => ({
      ...prev,
      summary: value
    }));
  };
  
  const updateExperience = (id: string, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };
  
  const updateBullet = (experienceId: string, index: number, value: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => {
        if (exp.id === experienceId) {
          const newBullets = [...exp.bullets];
          newBullets[index] = value;
          return { ...exp, bullets: newBullets };
        }
        return exp;
      })
    }));
  };
  
  const addBullet = (experienceId: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => {
        if (exp.id === experienceId) {
          return { ...exp, bullets: [...exp.bullets, ''] };
        }
        return exp;
      })
    }));
  };
  
  const removeBullet = (experienceId: string, index: number) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => {
        if (exp.id === experienceId) {
          const newBullets = [...exp.bullets];
          newBullets.splice(index, 1);
          return { ...exp, bullets: newBullets };
        }
        return exp;
      })
    }));
  };
  
  const addExperience = () => {
    const newExperience: ExperienceItem = {
      id: nanoid(),
      jobTitle: '',
      company: '',
      startDate: '',
      endDate: '',
      bullets: ['']
    };
    
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, newExperience]
    }));
  };
  
  const [newSkill, setNewSkill] = useState('');
  
  const addSkill = () => {
    if (!newSkill.trim()) return;
    
    setResumeData(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill.trim()]
    }));
    
    setNewSkill('');
  };
  
  const removeSkill = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };
  
  const optimizeWithAI = () => {
    toast({
      title: "AI Optimization",
      description: "Resume optimization in progress...",
    });
    
    // In a real app, this would call the AI API
    setTimeout(() => {
      const improvedSummary = "Senior Front-end Developer with 7+ years of experience crafting responsive and high-performance web applications using React and TypeScript. Demonstrated expertise in leading teams to deliver user-centric solutions that drive business growth. Passionate about clean code architecture and mentoring junior developers.";
      
      updateSummary(improvedSummary);
      
      toast({
        title: "AI Optimization Complete",
        description: "Your resume summary has been improved.",
      });
    }, 1500);
  };
  
  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: "Your resume is being prepared for download.",
    });
  };
  
  const handleUpload = () => {
    toast({
      title: "Upload Resume",
      description: "Please select a file to upload.",
    });
  };
  
  return (
    <div className={`bg-white rounded-lg shadow-sm dark:bg-neutral-800 ${className}`}>
      <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-neutral-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Resume Editor</h2>
        <div className="flex space-x-2">
          <button 
            onClick={handleUpload}
            className="flex items-center px-3 py-1 text-sm font-medium text-white rounded-md bg-primary hover:bg-blue-600"
          >
            <i className="mr-1 bx bx-cloud-upload"></i>
            Upload Resume
          </button>
          <button 
            onClick={handleDownload}
            className="flex items-center px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md dark:text-white dark:bg-neutral-700 dark:border-neutral-600 hover:bg-gray-50 dark:hover:bg-neutral-600"
          >
            <i className="mr-1 bx bx-download"></i>
            Download
          </button>
        </div>
      </div>
      
      <div className="p-5">
        {/* Contact Information */}
        <div className="mb-6">
          <h3 className="mb-3 text-base font-medium text-gray-900 dark:text-white">Contact Information</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
              <input 
                type="text" 
                value={resumeData.contactInfo.fullName} 
                onChange={(e) => updateContactInfo('fullName', e.target.value)}
                className="block w-full px-3 py-2 bg-white border border-gray-200 rounded-md dark:bg-neutral-700 dark:border-neutral-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Job Title</label>
              <input 
                type="text" 
                value={resumeData.contactInfo.jobTitle} 
                onChange={(e) => updateContactInfo('jobTitle', e.target.value)}
                className="block w-full px-3 py-2 bg-white border border-gray-200 rounded-md dark:bg-neutral-700 dark:border-neutral-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <input 
                type="email" 
                value={resumeData.contactInfo.email} 
                onChange={(e) => updateContactInfo('email', e.target.value)}
                className="block w-full px-3 py-2 bg-white border border-gray-200 rounded-md dark:bg-neutral-700 dark:border-neutral-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
              <input 
                type="tel" 
                value={resumeData.contactInfo.phone} 
                onChange={(e) => updateContactInfo('phone', e.target.value)}
                className="block w-full px-3 py-2 bg-white border border-gray-200 rounded-md dark:bg-neutral-700 dark:border-neutral-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
        </div>
        
        {/* Professional Summary */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-medium text-gray-900 dark:text-white">Professional Summary</h3>
            <button 
              onClick={optimizeWithAI}
              className="flex items-center text-xs text-primary"
            >
              <i className="mr-1 bx bx-wand-2"></i>
              Optimize with AI
            </button>
          </div>
          <textarea 
            rows={4} 
            value={resumeData.summary}
            onChange={(e) => updateSummary(e.target.value)}
            className="block w-full px-3 py-2 bg-white border border-gray-200 rounded-md dark:bg-neutral-700 dark:border-neutral-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
        </div>
        
        {/* Work Experience */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-medium text-gray-900 dark:text-white">Work Experience</h3>
            <button 
              onClick={addExperience}
              className="flex items-center text-xs text-green-500"
            >
              <i className="mr-1 bx bx-plus-circle"></i>
              Add Experience
            </button>
          </div>
          
          {resumeData.experience.map((exp) => (
            <div key={exp.id} className="p-4 mb-4 border border-gray-200 rounded-lg dark:border-neutral-700">
              <div className="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Job Title</label>
                  <input 
                    type="text" 
                    value={exp.jobTitle} 
                    onChange={(e) => updateExperience(exp.id, 'jobTitle', e.target.value)}
                    className="block w-full px-3 py-2 bg-white border border-gray-200 rounded-md dark:bg-neutral-700 dark:border-neutral-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Company</label>
                  <input 
                    type="text" 
                    value={exp.company} 
                    onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                    className="block w-full px-3 py-2 bg-white border border-gray-200 rounded-md dark:bg-neutral-700 dark:border-neutral-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
                  <input 
                    type="month" 
                    value={exp.startDate} 
                    onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                    className="block w-full px-3 py-2 bg-white border border-gray-200 rounded-md dark:bg-neutral-700 dark:border-neutral-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">End Date</label>
                  <input 
                    type="month" 
                    value={exp.endDate} 
                    onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                    className="block w-full px-3 py-2 bg-white border border-gray-200 rounded-md dark:bg-neutral-700 dark:border-neutral-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Responsibilities & Achievements</label>
                {exp.bullets.map((bullet, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <input 
                      type="text" 
                      value={bullet} 
                      onChange={(e) => updateBullet(exp.id, index, e.target.value)}
                      className="block w-full px-3 py-2 bg-white border border-gray-200 rounded-md dark:bg-neutral-700 dark:border-neutral-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    />
                    <button 
                      onClick={() => removeBullet(exp.id, index)}
                      className="flex-shrink-0 p-1 text-red-500 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <i className="bx bx-trash"></i>
                    </button>
                  </div>
                ))}
                <button 
                  onClick={() => addBullet(exp.id)}
                  className="flex items-center mt-2 text-xs text-green-500"
                >
                  <i className="mr-1 bx bx-plus-circle"></i>
                  Add Bullet Point
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Skills */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-medium text-gray-900 dark:text-white">Skills</h3>
            <button className="flex items-center text-xs text-primary">
              <i className="mr-1 bx bx-wand-2"></i>
              Analyze Resume for Skills
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-2">
            {resumeData.skills.map((skill, index) => (
              <div key={index} className="flex items-center px-3 py-1 bg-gray-100 rounded-full dark:bg-neutral-700">
                <span className="text-sm">{skill}</span>
                <button 
                  onClick={() => removeSkill(index)}
                  className="ml-2 text-gray-500 hover:text-red-500"
                >
                  <i className="text-xs bx bx-x"></i>
                </button>
              </div>
            ))}
          </div>
          
          <div className="flex">
            <input 
              type="text" 
              placeholder="Add a skill..." 
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addSkill()}
              className="block w-full px-3 py-2 bg-white border border-gray-200 rounded-l-md dark:bg-neutral-700 dark:border-neutral-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
            <button 
              onClick={addSkill}
              className="px-3 py-2 text-white bg-green-500 border border-green-500 rounded-r-md hover:bg-green-600"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeEditor;
