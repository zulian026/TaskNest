import React from 'react';
import { clsx } from 'clsx';

const StatsCard = ({ title, value, icon, color = 'blue', change, changeType }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
  };

  return (
    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={clsx('p-3 rounded-full', colorClasses[color])}>
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
              </svg>
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="text-lg font-medium text-gray-900">
                {value}
              </dd>
            </dl>
          </div>
        </div>
        {change && (
          <div className="mt-4">
            <div className="flex items-center text-sm">
              <span className={clsx(
                'font-medium',
                changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              )}>
                {changeType === 'increase' ? '+' : '-'}{Math.abs(change)}%
              </span>
              <span className="text-gray-500 ml-1">from last week</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;