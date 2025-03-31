import React from 'react';

const SearchFilters: React.FC = () => {
  return (
    <div className="p-5 mb-6 bg-white rounded-lg shadow-sm dark:bg-neutral-800">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Job Title</label>
          <input 
            type="text" 
            placeholder="e.g. Software Engineer" 
            className="block w-full px-3 py-2 bg-white border border-gray-200 rounded-md dark:bg-neutral-700 dark:border-neutral-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
        </div>
        
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
          <input 
            type="text" 
            placeholder="e.g. San Francisco, Remote" 
            className="block w-full px-3 py-2 bg-white border border-gray-200 rounded-md dark:bg-neutral-700 dark:border-neutral-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
        </div>
        
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Experience Level</label>
          <select className="block w-full px-3 py-2 bg-white border border-gray-200 rounded-md dark:bg-neutral-700 dark:border-neutral-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary">
            <option value="">Any Experience</option>
            <option value="entry">Entry Level</option>
            <option value="mid">Mid Level</option>
            <option value="senior">Senior Level</option>
            <option value="executive">Executive</option>
          </select>
        </div>
        
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Job Type</label>
          <select className="block w-full px-3 py-2 bg-white border border-gray-200 rounded-md dark:bg-neutral-700 dark:border-neutral-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary">
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
          <button className="px-3 py-1 text-sm bg-gray-100 border border-gray-200 rounded-md dark:bg-neutral-700 dark:border-neutral-600 dark:text-white hover:bg-gray-200 dark:hover:bg-neutral-600">
            Remote Jobs
          </button>
          <button className="px-3 py-1 text-sm bg-gray-100 border border-gray-200 rounded-md dark:bg-neutral-700 dark:border-neutral-600 dark:text-white hover:bg-gray-200 dark:hover:bg-neutral-600">
            Posted Last 24h
          </button>
          <button className="px-3 py-1 text-sm bg-gray-100 border border-gray-200 rounded-md dark:bg-neutral-700 dark:border-neutral-600 dark:text-white hover:bg-gray-200 dark:hover:bg-neutral-600">
            Salary Range
          </button>
          <button className="px-3 py-1 text-sm text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary">
            More Filters
          </button>
        </div>
        
        <button className="flex items-center px-4 py-2 text-sm font-medium text-white rounded-md bg-primary hover:bg-blue-600">
          <i className="mr-2 bx bx-search"></i>
          Search Jobs
        </button>
      </div>
    </div>
  );
};

export default SearchFilters;
