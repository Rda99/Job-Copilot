import React, { useState } from 'react';
import { ActivityItem } from '@/types';
import { ACTIVITY_ICONS } from '@/lib/constants';

const RecentActivity: React.FC = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      id: 1,
      type: 'applied',
      title: 'Applied to Senior Frontend Developer',
      subtitle: 'Acme Technology • 2 hours ago',
      timestamp: '2023-05-15T14:30:00'
    },
    {
      id: 2,
      type: 'resume',
      title: 'Resume updated with AI suggestions',
      subtitle: 'Yesterday at 4:23 PM',
      timestamp: '2023-05-14T16:23:00'
    },
    {
      id: 3,
      type: 'interview',
      title: 'Interview scheduled with InnovateTech',
      subtitle: 'May 15, 2023 at 2:00 PM',
      timestamp: '2023-05-15T14:00:00'
    },
    {
      id: 4,
      type: 'cover_letter',
      title: 'Cover letter generated for DataFlow',
      subtitle: 'May 12, 2023 at 10:15 AM',
      timestamp: '2023-05-12T10:15:00'
    }
  ]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm dark:bg-neutral-800">
      <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex">
            <div className="flex-shrink-0">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${ACTIVITY_ICONS[activity.type].bgClass}`}>
                <i className={`${ACTIVITY_ICONS[activity.type].textClass} bx ${ACTIVITY_ICONS[activity.type].icon}`}></i>
              </div>
            </div>
            <div className="flex-1 ml-4">
              <p className="text-sm font-medium text-gray-800 dark:text-white">{activity.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{activity.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
      
      <button className="flex items-center justify-center w-full px-4 py-2 mt-4 text-sm font-medium text-primary bg-white border border-gray-200 rounded-md dark:bg-neutral-800 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-700">
        View all activity
      </button>
    </div>
  );
};

export default RecentActivity;
