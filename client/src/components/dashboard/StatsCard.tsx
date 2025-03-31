import React from 'react';

interface StatsCardProps {
  title: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  value: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, icon, iconBg, iconColor, value }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm dark:bg-neutral-800">
      <div className="flex items-center">
        <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${iconBg}`}>
          <i className={`text-2xl ${iconColor} bx ${icon}`}></i>
        </div>
        <div className="ml-4">
          <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</h2>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
