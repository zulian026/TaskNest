import React from 'react';
import { clsx } from 'clsx';

const Sidebar = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z' },
    { id: 'tasks', label: 'All Tasks', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
    { id: 'categories', label: 'Categories', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' },
  ];

  const quickFilters = [
    { id: 'pending', label: 'Pending Tasks' },
    { id: 'overdue', label: 'Overdue' },
    { id: 'today', label: 'Due Today' },
    { id: 'this_week', label: 'This Week' },
    { id: 'high_priority', label: 'High Priority' },
    { id: 'completed', label: 'Completed Tasks' },
  ];

  return (
    <aside className="bg-white w-64 min-h-screen shadow-sm border-r">
      <nav className="mt-8 px-4">
        <div className="space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={clsx(
                'flex items-center px-4 py-2 text-sm font-medium rounded-md w-full text-left',
                activeTab === tab.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
              </svg>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-8">
          <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Quick Filters
          </h3>
          <div className="mt-2 space-y-1">
            {quickFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => onTabChange('tasks', filter.id)}
                className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 w-full text-left rounded-md"
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;