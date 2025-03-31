import React, { useState } from 'react';

interface SearchFiltersProps {
  onSearch?: (filters: SearchFilters) => void;
}

export interface SearchFilters {
  jobTitle: string;
  location: string;
  experienceLevel: string;
  jobType: string;
  isRemote: boolean;
  isRecent: boolean;
  hasSalary: boolean;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ onSearch }) => {
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [jobType, setJobType] = useState('');
  const [isRemote, setIsRemote] = useState(false);
  const [isRecent, setIsRecent] = useState(false);
  const [hasSalary, setHasSalary] = useState(false);
  
  const handleSearch = () => {
    const filters = {
      jobTitle,
      location,
      experienceLevel,
      jobType,
      isRemote,
      isRecent,
      hasSalary
    };
    
    if (onSearch) {
      onSearch(filters);
    } else {
      // If no onSearch prop is provided, show an alert with the filters for demo purposes
      console.log('Search filters:', filters);
      alert(`Search with the following filters:\nJob Title: ${jobTitle || 'Any'}\nLocation: ${location || 'Any'}\nExperience: ${experienceLevel || 'Any'}\nJob Type: ${jobType || 'Any'}`);
    }
  };
  
  return (
    <div className="p-5 mb-6 bg-white rounded-lg shadow-sm dark:bg-neutral-800">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Job Title</label>
          <input 
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g. Software Engineer" 
            className="block w-full px-3 py-2 bg-white border border-gray-200 rounded-md dark:bg-neutral-700 dark:border-neutral-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
        </div>
        
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
          <input 
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. San Francisco, Remote" 
            className="block w-full px-3 py-2 bg-white border border-gray-200 rounded-md dark:bg-neutral-700 dark:border-neutral-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
        </div>
        
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Experience Level</label>
          <select 
            value={experienceLevel}
            onChange={(e) => setExperienceLevel(e.target.value)}
            className="block w-full px-3 py-2 bg-white border border-gray-200 rounded-md dark:bg-neutral-700 dark:border-neutral-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          >
            <option value="">Any Experience</option>
            <option value="entry">Entry Level</option>
            <option value="mid">Mid Level</option>
            <option value="senior">Senior Level</option>
            <option value="executive">Executive</option>
          </select>
        </div>
        
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Job Type</label>
          <select 
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            className="block w-full px-3 py-2 bg-white border border-gray-200 rounded-md dark:bg-neutral-700 dark:border-neutral-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          >
            <option value="">All Types</option>
            <option value="full_time">Full-time</option>
            <option value="part_time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center justify-between mt-4 gap-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by:</span>
          <button 
            className={`px-3 py-1 text-sm rounded-md ${isRemote ? 'bg-primary text-white' : 'bg-gray-100 border border-gray-200 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white hover:bg-gray-200 dark:hover:bg-neutral-600'}`}
            onClick={() => setIsRemote(!isRemote)}
          >
            Remote Jobs
          </button>
          <button 
            className={`px-3 py-1 text-sm rounded-md ${isRecent ? 'bg-primary text-white' : 'bg-gray-100 border border-gray-200 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white hover:bg-gray-200 dark:hover:bg-neutral-600'}`}
            onClick={() => setIsRecent(!isRecent)}
          >
            Posted Last 24h
          </button>
          <button 
            className={`px-3 py-1 text-sm rounded-md ${hasSalary ? 'bg-primary text-white' : 'bg-gray-100 border border-gray-200 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white hover:bg-gray-200 dark:hover:bg-neutral-600'}`}
            onClick={() => setHasSalary(!hasSalary)}
          >
            Salary Range
          </button>
          <button className="px-3 py-1 text-sm text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary">
            More Filters
          </button>
        </div>
        
        <button 
          onClick={handleSearch}
          className="flex items-center px-4 py-2 text-sm font-medium text-white rounded-md bg-primary hover:bg-blue-600"
        >
          <i className="mr-2 bx bx-search"></i>
          Search Jobs
        </button>
      </div>
    </div>
  );
};

export default SearchFilters;
