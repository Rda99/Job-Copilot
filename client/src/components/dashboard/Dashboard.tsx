import React, { useState } from 'react';
import StatsCard from './StatsCard';
import AIAssistant from './AIAssistant';
import RecentActivity from './RecentActivity';
import { ApplicationsData } from '@/types';
import { STATS_CARDS } from '@/lib/constants';

const Dashboard: React.FC = () => {
  const [applicationsData, setApplicationsData] = useState<ApplicationsData>({
    total: 48,
    applied: 32,
    interviews: 7,
    offers: 2
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Welcome back, Alex!</h1>
        <p className="text-gray-600 dark:text-gray-300">Here's an overview of your job search progress</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
        {STATS_CARDS.map((card) => (
          <StatsCard
            key={card.key}
            title={card.title}
            icon={card.icon}
            iconBg={card.iconBg}
            iconColor={card.iconColor}
            value={applicationsData[card.key as keyof ApplicationsData]}
          />
        ))}
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* AI Assistant Card */}
        <AIAssistant className="lg:col-span-2" />
        
        {/* Recent Activity Card */}
        <RecentActivity />
      </div>
    </div>
  );
};

export default Dashboard;
