import React from 'react';
import SearchFilters from './SearchFilters';
import JobCard from './JobCard';
import { Job } from '@/types';
import { useLLM } from '@/context/LLMContext';
import { LLM_MODELS } from '@/lib/constants';

const JobSearch: React.FC = () => {
  const { settings } = useLLM();
  
  const [jobs, setJobs] = React.useState<Job[]>([
    { 
      id: 1, 
      title: 'Senior Frontend Developer', 
      company: 'Acme Technology', 
      location: 'San Francisco, CA (Remote)', 
      salary: '$130,000 - $160,000',
      match: 92,
      description: 'Acme Technology is seeking a Senior Frontend Developer to join our growing team...',
      status: 'applied',
      applied_date: '2023-05-10',
      favorite: true
    },
    { 
      id: 2, 
      title: 'Product Designer', 
      company: 'InnovateTech', 
      location: 'New York, NY (Hybrid)', 
      salary: '$95,000 - $120,000',
      match: 87,
      description: 'InnovateTech is looking for a creative Product Designer with experience in...',
      status: 'interview',
      applied_date: '2023-05-08',
      favorite: false
    },
    { 
      id: 3, 
      title: 'Data Engineer', 
      company: 'DataFlow', 
      location: 'Austin, TX (Remote)', 
      salary: '$125,000 - $150,000',
      match: 84,
      description: 'DataFlow is expanding our engineering team and looking for experienced Data Engineers...',
      status: 'saved',
      applied_date: undefined,
      favorite: true
    },
    { 
      id: 4, 
      title: 'Digital Marketing Specialist', 
      company: 'GrowthX', 
      location: 'Chicago, IL (On-site)', 
      salary: '$70,000 - $85,000',
      match: 78,
      description: 'GrowthX is searching for a talented Digital Marketing Specialist to drive our online presence...',
      status: 'saved',
      applied_date: undefined,
      favorite: false
    },
    { 
      id: 5, 
      title: 'Full Stack Developer', 
      company: 'WebSphere Solutions', 
      location: 'Seattle, WA (Remote)', 
      salary: '$110,000 - $140,000',
      match: 90,
      description: 'WebSphere Solutions is hiring a Full Stack Developer to help build our next generation platform...',
      status: 'applied',
      applied_date: '2023-05-12',
      favorite: true
    }
  ]);
  
  const handleToggleFavorite = (jobId: number) => {
    setJobs(jobs.map(job => 
      job.id === jobId ? { ...job, favorite: !job.favorite } : job
    ));
  };
  
  const modelInfo = LLM_MODELS[settings.provider].find(m => m.id === settings.model);
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Job Search</h1>
        <p className="text-gray-600 dark:text-gray-300">Find and apply to jobs matching your skills</p>
      </div>
      
      {/* Search Filters */}
      <SearchFilters />
      
      {/* AI Jobs Recommendation */}
      <div className="p-5 mb-6 bg-white rounded-lg shadow-sm dark:bg-neutral-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">AI-Matched Job Recommendations</h2>
          <span className="flex items-center px-2 py-1 text-xs font-medium rounded-full bg-blue-50 text-primary dark:bg-blue-900/30">
            <i className="mr-1 bx bx-chip"></i>
            <span>{`${settings.provider.charAt(0).toUpperCase() + settings.provider.slice(1)} • ${modelInfo?.name || settings.model}`}</span>
          </span>
        </div>
        
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">Based on your resume and preferences, here are jobs with the highest match scores.</p>
        
        {/* Job Cards */}
        <div className="space-y-4">
          {jobs.map(job => (
            <JobCard 
              key={job.id} 
              job={job} 
              onToggleFavorite={handleToggleFavorite} 
            />
          ))}
        </div>
        
        <div className="flex justify-center mt-6">
          <button className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-blue-600">
            Load More Jobs
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobSearch;
