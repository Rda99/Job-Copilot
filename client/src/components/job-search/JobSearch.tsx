import React, { useState, useEffect } from 'react';
import SearchFilters, { SearchFilters as ISearchFilters } from './SearchFilters';
import JobCard from './JobCard';
import { Job } from '@/types';
import { useLLM } from '@/context/LLMContext';
import { LLM_MODELS } from '@/lib/constants';

// Sample job data
const ALL_JOBS: Job[] = [
  { 
    id: 1, 
    title: 'Senior Frontend Developer', 
    company: 'Acme Technology', 
    location: 'San Francisco, CA (Remote)', 
    salary: '$130,000 - $160,000',
    match: 92,
    description: 'Acme Technology is seeking a Senior Frontend Developer to join our growing team. You will be responsible for building user interfaces for web applications using React, TypeScript, and modern frontend tools. The ideal candidate has 5+ years of experience with frontend development and strong JavaScript skills.',
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
    description: 'InnovateTech is looking for a creative Product Designer with experience in UX/UI design, wireframing, and prototyping. You will work closely with product managers and engineers to design intuitive user experiences for web and mobile applications. Requires 3+ years of experience and proficiency in Figma or similar tools.',
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
    description: 'DataFlow is expanding our engineering team and looking for experienced Data Engineers to build and maintain our data pipeline infrastructure. The ideal candidate has experience with Python, SQL, and big data technologies like Spark, Kafka, and cloud platforms (AWS/GCP). Join us to solve challenging data problems at scale.',
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
    description: 'GrowthX is searching for a talented Digital Marketing Specialist to drive our online presence and customer acquisition strategies. You will manage SEO/SEM campaigns, social media marketing, email campaigns, and content strategy. Looking for candidates with 2+ years of experience and a data-driven approach to marketing.',
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
    description: 'WebSphere Solutions is hiring a Full Stack Developer to help build our next generation platform. You will work on both frontend and backend components using React, Node.js, and PostgreSQL. The ideal candidate is comfortable across the entire stack and has experience with cloud infrastructure, API design, and modern JavaScript frameworks.',
    status: 'applied',
    applied_date: '2023-05-12',
    favorite: true
  },
  { 
    id: 6, 
    title: 'DevOps Engineer', 
    company: 'CloudNative Inc', 
    location: 'Remote', 
    salary: '$120,000 - $160,000',
    match: 88,
    description: 'CloudNative Inc is seeking a DevOps Engineer to join our infrastructure team. You will be responsible for building and maintaining CI/CD pipelines, Kubernetes clusters, and cloud infrastructure on AWS. The ideal candidate has experience with Docker, Kubernetes, Terraform, and at least one major cloud provider.',
    status: 'saved',
    applied_date: undefined,
    favorite: false
  },
  { 
    id: 7, 
    title: 'Product Manager', 
    company: 'TechStartup', 
    location: 'Boston, MA (Hybrid)', 
    salary: '$110,000 - $140,000',
    match: 82,
    description: 'TechStartup is looking for a Product Manager to lead product development for our SaaS platform. You will work with stakeholders to define requirements, create roadmaps, and prioritize features. The ideal candidate has 3+ years of product management experience in a B2B SaaS environment and strong analytical skills.',
    status: 'saved',
    applied_date: undefined,
    favorite: false
  },
  { 
    id: 8, 
    title: 'Machine Learning Engineer', 
    company: 'AI Innovations', 
    location: 'San Francisco, CA (On-site)', 
    salary: '$140,000 - $180,000',
    match: 95,
    description: 'AI Innovations is seeking a Machine Learning Engineer to join our research team. You will design and implement ML models to solve complex problems, work with large datasets, and deploy models to production. Requires experience with Python, TensorFlow/PyTorch, and a strong background in mathematics and statistics.',
    status: 'saved',
    applied_date: undefined,
    favorite: true
  }
];

const JobSearch: React.FC = () => {
  const { settings } = useLLM();
  
  const [jobs, setJobs] = useState<Job[]>(ALL_JOBS.slice(0, 5));
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(jobs);
  const [isLoading, setIsLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  
  const handleToggleFavorite = (jobId: number) => {
    const updatedJobs = filteredJobs.map(job => 
      job.id === jobId ? { ...job, favorite: !job.favorite } : job
    );
    setFilteredJobs(updatedJobs);
    
    // Also update the main jobs array to keep favorites state in sync
    setJobs(jobs.map(job => 
      job.id === jobId ? { ...job, favorite: !job.favorite } : job
    ));
  };
  
  const handleSearch = (filters: ISearchFilters) => {
    setIsLoading(true);
    setSearchPerformed(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      let results = [...ALL_JOBS];
      
      // Filter by job title
      if (filters.jobTitle) {
        results = results.filter(job => 
          job.title.toLowerCase().includes(filters.jobTitle.toLowerCase())
        );
      }
      
      // Filter by location
      if (filters.location) {
        results = results.filter(job => 
          job.location.toLowerCase().includes(filters.location.toLowerCase())
        );
      }
      
      // Filter by job type (this would use a real field in a real implementation)
      if (filters.jobType) {
        // For demo purposes, we'll just filter randomly to simulate results
        if (filters.jobType === 'full_time') {
          results = results.filter(job => job.id % 2 === 0);
        } else if (filters.jobType === 'part_time') {
          results = results.filter(job => job.id % 2 === 1);
        }
      }
      
      // Filter remote jobs
      if (filters.isRemote) {
        results = results.filter(job => 
          job.location.toLowerCase().includes('remote')
        );
      }
      
      // Filter by salary (in a real implementation, this would use actual salary ranges)
      if (filters.hasSalary) {
        results = results.filter(job => job.salary !== undefined);
      }
      
      setFilteredJobs(results);
      setIsLoading(false);
    }, 1000);
  };
  
  const loadMoreJobs = () => {
    setIsLoading(true);
    
    // Simulate loading more jobs
    setTimeout(() => {
      // If we haven't displayed all jobs yet, add more
      if (jobs.length < ALL_JOBS.length) {
        const newJobs = [...jobs, ...ALL_JOBS.slice(jobs.length, jobs.length + 3)];
        setJobs(newJobs);
        
        // If search was performed, also filter the new jobs
        if (searchPerformed) {
          handleSearch({
            jobTitle: '',
            location: '',
            experienceLevel: '',
            jobType: '',
            isRemote: false,
            isRecent: false,
            hasSalary: false
          });
        } else {
          setFilteredJobs(newJobs);
        }
      }
      
      setIsLoading(false);
    }, 1000);
  };
  
  // Safely get the model info with fallbacks to prevent errors
  const getModelInfo = () => {
    try {
      // Ensure provider exists and is a valid key in LLM_MODELS
      if (!settings || !settings.provider || !LLM_MODELS[settings.provider]) {
        return { provider: 'AI', model: 'Model' };
      }
      
      const providerName = settings.provider.charAt(0).toUpperCase() + settings.provider.slice(1);
      const models = LLM_MODELS[settings.provider] || [];
      const modelInfo = models.find(m => m.id === settings.model);
      const modelName = modelInfo?.name || settings.model || 'Model';
      
      return { provider: providerName, model: modelName };
    } catch (error) {
      console.error('Error getting model info:', error);
      return { provider: 'AI', model: 'Model' };
    }
  };
  
  // Reset filtered jobs when main jobs change
  useEffect(() => {
    if (!searchPerformed) {
      setFilteredJobs(jobs);
    }
  }, [jobs, searchPerformed]);
  
  const { provider, model } = getModelInfo();
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Job Search</h1>
        <p className="text-gray-600 dark:text-gray-300">Find and apply to jobs matching your skills</p>
      </div>
      
      {/* Search Filters */}
      <SearchFilters onSearch={handleSearch} />
      
      {/* AI Jobs Recommendation */}
      <div className="p-5 mb-6 bg-white rounded-lg shadow-sm dark:bg-neutral-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {searchPerformed ? 'Search Results' : 'AI-Matched Job Recommendations'}
          </h2>
          <span className="flex items-center px-2 py-1 text-xs font-medium rounded-full bg-blue-50 text-primary dark:bg-blue-900/30">
            <i className="mr-1 bx bx-chip"></i>
            <span>{`${provider} • ${model}`}</span>
          </span>
        </div>
        
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          {searchPerformed 
            ? `Found ${filteredJobs.length} jobs matching your search criteria.` 
            : 'Based on your resume and preferences, here are jobs with the highest match scores.'}
        </p>
        
        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center py-10">
            <div className="w-6 h-6 border-2 border-t-2 border-gray-200 border-t-primary rounded-full animate-spin"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-400">Finding the best matches...</span>
          </div>
        )}
        
        {/* No results */}
        {!isLoading && filteredJobs.length === 0 && (
          <div className="py-10 text-center">
            <i className="text-5xl bx bx-search-alt text-gray-300 dark:text-gray-600"></i>
            <p className="mt-2 text-gray-600 dark:text-gray-400">No jobs found matching your criteria. Try adjusting your filters.</p>
          </div>
        )}
        
        {/* Job Cards */}
        {!isLoading && filteredJobs.length > 0 && (
          <div className="space-y-4">
            {filteredJobs.map(job => (
              <JobCard 
                key={job.id} 
                job={job} 
                onToggleFavorite={handleToggleFavorite} 
              />
            ))}
          </div>
        )}
        
        {/* Load More button - only show if there are more jobs to load */}
        {!isLoading && filteredJobs.length > 0 && jobs.length < ALL_JOBS.length && (
          <div className="flex justify-center mt-6">
            <button 
              onClick={loadMoreJobs} 
              className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-blue-600"
            >
              Load More Jobs
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobSearch;
