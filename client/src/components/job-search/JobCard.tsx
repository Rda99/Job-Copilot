import React from 'react';
import { Job } from '@/types';
import { STATUS_CLASSES, STATUS_ICONS } from '@/lib/constants';

interface JobCardProps {
  job: Job;
  onToggleFavorite: (jobId: number) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onToggleFavorite }) => {
  return (
    <div className="p-4 transition-colors border border-gray-200 rounded-lg hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-700/50">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{job.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{`${job.company} • ${job.location}`}</p>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center px-2 py-1 mb-2 text-sm font-medium text-white rounded-md bg-primary">
            <i className="mr-1 bx bx-check-shield"></i>
            <span>{`${job.match}% Match`}</span>
          </div>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{job.salary}</span>
        </div>
      </div>
      
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{job.description}</p>
      
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_CLASSES[job.status]}`}>
            <i className={`bx ${STATUS_ICONS[job.status]} mr-1`}></i>
            <span>{job.status.charAt(0).toUpperCase() + job.status.slice(1)}</span>
          </span>
          {job.applied_date && (
            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">{`Applied: ${job.applied_date}`}</span>
          )}
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => onToggleFavorite(job.id)}
            className="p-1 text-gray-400 rounded hover:bg-gray-100 dark:hover:bg-neutral-700 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <i className={`text-xl bx ${job.favorite ? 'bxs-heart text-red-500' : 'bx-heart'}`}></i>
          </button>
          
          <button className="p-1 text-gray-400 rounded hover:bg-gray-100 dark:hover:bg-neutral-700 hover:text-gray-500 dark:hover:text-gray-300">
            <i className="text-xl bx bx-share-alt"></i>
          </button>
          
          <button className="flex items-center px-3 py-1 text-sm font-medium text-white rounded-md bg-primary hover:bg-blue-600">
            <span>{job.status === 'saved' ? 'Apply Now' : 'View Details'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
