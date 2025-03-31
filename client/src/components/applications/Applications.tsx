import React, { useState } from 'react';
import { Job } from '@/types';
import { STATUS_CLASSES, STATUS_ICONS } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';

const Applications: React.FC = () => {
  const { toast } = useToast();
  
  const [applications, setApplications] = useState<Job[]>([
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
      title: 'Full Stack Developer', 
      company: 'WebSphere Solutions', 
      location: 'Seattle, WA (Remote)', 
      salary: '$110,000 - $140,000',
      match: 90,
      description: 'WebSphere Solutions is hiring a Full Stack Developer to help build our next generation platform...',
      status: 'applied',
      applied_date: '2023-05-12',
      favorite: true
    },
    { 
      id: 4, 
      title: 'Frontend Engineer', 
      company: 'TechGrowth', 
      location: 'Boston, MA (Remote)', 
      salary: '$115,000 - $140,000',
      match: 88,
      description: 'TechGrowth is looking for a Frontend Engineer to help build innovative web applications...',
      status: 'rejected',
      applied_date: '2023-05-05',
      favorite: false
    },
    { 
      id: 5, 
      title: 'UI/UX Designer', 
      company: 'DesignHub', 
      location: 'Austin, TX (Hybrid)', 
      salary: '$90,000 - $120,000',
      match: 85,
      description: 'DesignHub is seeking a talented UI/UX Designer to create beautiful and intuitive interfaces...',
      status: 'offer',
      applied_date: '2023-05-01',
      favorite: true
    }
  ]);
  
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const handleUpdateStatus = (id: number, status: Job['status']) => {
    setApplications(applications.map(app => 
      app.id === id ? { ...app, status } : app
    ));
    
    toast({
      title: 'Status Updated',
      description: `Application status has been updated to ${status}.`
    });
  };
  
  const handleToggleFavorite = (id: number) => {
    setApplications(applications.map(app => 
      app.id === id ? { ...app, favorite: !app.favorite } : app
    ));
  };
  
  const filteredApplications = applications
    .filter(app => activeFilter === 'all' || app.status === activeFilter)
    .filter(app => 
      searchTerm === '' || 
      app.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.company.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
  const statusCounts = applications.reduce((counts, app) => {
    const status = app.status;
    counts[status] = (counts[status] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Applications</h1>
        <p className="text-gray-600 dark:text-gray-300">Track and manage your job applications</p>
      </div>
      
      {/* Filters and Search */}
      <div className="p-5 mb-6 bg-white rounded-lg shadow-sm dark:bg-neutral-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <button 
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                activeFilter === 'all' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-700 dark:bg-neutral-700 dark:text-gray-200'
              }`}
            >
              All ({applications.length})
            </button>
            
            {['saved', 'applied', 'interview', 'offer', 'rejected'].map(status => (
              <button 
                key={status}
                onClick={() => setActiveFilter(status)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center ${
                  activeFilter === status 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 text-gray-700 dark:bg-neutral-700 dark:text-gray-200'
                }`}
              >
                <i className={`bx ${STATUS_ICONS[status as keyof typeof STATUS_ICONS]} mr-1`}></i>
                <span className="capitalize">{status}</span>
                <span className="ml-1">({statusCounts[status] || 0})</span>
              </button>
            ))}
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <i className="text-gray-400 bx bx-search dark:text-gray-500"></i>
            </div>
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full py-2 pl-10 pr-3 leading-5 text-gray-900 placeholder-gray-500 bg-gray-100 border border-gray-200 rounded-md dark:bg-neutral-700 dark:border-neutral-600 dark:placeholder-gray-400 dark:text-white sm:text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              placeholder="Search applications..."
            />
          </div>
        </div>
      </div>
      
      {/* Applications List */}
      <div className="bg-white rounded-lg shadow-sm dark:bg-neutral-800">
        <div className="p-5 border-b border-gray-200 dark:border-neutral-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your Applications</h2>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-neutral-700">
          {filteredApplications.length > 0 ? (
            filteredApplications.map(app => (
              <div key={app.id} className="p-5 hover:bg-gray-50 dark:hover:bg-neutral-800/60 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-2">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">{app.title}</h3>
                      <button 
                        onClick={() => handleToggleFavorite(app.id)}
                        className="p-1 text-gray-400 rounded hover:bg-gray-100 dark:hover:bg-neutral-700 hover:text-gray-500 dark:hover:text-gray-300"
                      >
                        <i className={`text-xl bx ${app.favorite ? 'bxs-heart text-red-500' : 'bx-heart'}`}></i>
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{app.company} • {app.location}</p>
                    {app.salary && (
                      <p className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-300">{app.salary}</p>
                    )}
                    <div className="flex items-center mt-2 space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_CLASSES[app.status]}`}>
                        <i className={`bx ${STATUS_ICONS[app.status]} mr-1`}></i>
                        <span className="capitalize">{app.status}</span>
                      </span>
                      {app.applied_date && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">Applied on {app.applied_date}</span>
                      )}
                      {app.match && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary text-white">
                          <i className="mr-1 bx bx-check-shield"></i>
                          <span>{app.match}% Match</span>
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-row sm:flex-col sm:items-end items-center justify-between mt-2 sm:mt-0">
                    <div className="relative inline-block text-left">
                      <select 
                        value={app.status}
                        onChange={(e) => handleUpdateStatus(app.id, e.target.value as Job['status'])}
                        className="block w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-md dark:bg-neutral-700 dark:border-neutral-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      >
                        <option value="saved">Saved</option>
                        <option value="applied">Applied</option>
                        <option value="interview">Interview</option>
                        <option value="offer">Offer</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                    
                    <div className="flex mt-2 space-x-2">
                      <button className="p-1 text-gray-400 rounded hover:bg-gray-100 dark:hover:bg-neutral-700 hover:text-gray-500 dark:hover:text-gray-300">
                        <i className="text-xl bx bx-edit"></i>
                      </button>
                      <button className="p-1 text-gray-400 rounded hover:bg-gray-100 dark:hover:bg-neutral-700 hover:text-red-500">
                        <i className="text-xl bx bx-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-8">
              <div className="flex items-center justify-center w-16 h-16 mb-4 bg-gray-100 rounded-full dark:bg-neutral-700">
                <i className="text-3xl text-gray-400 bx bx-search dark:text-gray-500"></i>
              </div>
              <h3 className="mb-1 text-lg font-medium text-gray-900 dark:text-white">No applications found</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {activeFilter !== 'all' 
                  ? `You don't have any applications with status "${activeFilter}".` 
                  : "Try adjusting your search or filters to find what you're looking for."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Applications;
