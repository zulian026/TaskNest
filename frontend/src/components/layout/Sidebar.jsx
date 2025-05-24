import React from 'react';
import { clsx } from 'clsx';

const Sidebar = ({ activeTab, onTabChange }) => {
  const tabs = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: 'M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z',
      color: 'from-blue-500 to-indigo-600'
    },
    { 
      id: 'tasks', 
      label: 'All Tasks', 
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
      color: 'from-emerald-500 to-green-600'
    },
    { 
      id: 'categories', 
      label: 'Categories', 
      icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',
      color: 'from-purple-500 to-violet-600'
    },
  ];

  const quickFilters = [
    { id: 'pending', label: 'Pending Tasks', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-amber-600' },
    { id: 'overdue', label: 'Overdue', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.081 16.5c-.77.833.192 2.5 1.732 2.5z', color: 'text-red-600' },
    { id: 'today', label: 'Due Today', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'text-blue-600' },
    { id: 'this_week', label: 'This Week', icon: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4', color: 'text-indigo-600' },
    { id: 'high_priority', label: 'High Priority', icon: 'M5 10l7-7m0 0l7 7m-7-7v18', color: 'text-rose-600' },
    { id: 'completed', label: 'Completed Tasks', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-emerald-600' },
  ];

  return (
    <aside className="bg-gradient-to-b from-slate-50 to-white w-72 h-screen shadow-xl border-r border-gray-100/50 backdrop-blur-sm flex flex-col sticky top-0">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              TaskFlow
            </h1>
            <p className="text-xs text-gray-500 font-medium">Manage your tasks</p>
          </div>
        </div>
      </div>

      {/* Scrollable Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
        {/* Main Navigation */}
        <div className="space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={clsx(
                'group flex items-center px-4 py-3 text-sm font-medium rounded-xl w-full text-left transition-all duration-200 relative overflow-hidden',
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-md border border-blue-100'
                  : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-slate-50 hover:text-gray-900 hover:shadow-sm'
              )}
            >
              {/* Active indicator */}
              {activeTab === tab.id && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-r-full"></div>
              )}
              
              {/* Icon container */}
              <div className={clsx(
                'mr-4 p-2 rounded-lg transition-all duration-200',
                activeTab === tab.id
                  ? 'bg-gradient-to-br text-white shadow-lg transform scale-110'
                  : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200 group-hover:text-gray-700',
                activeTab === tab.id && `bg-gradient-to-br ${tab.color}`
              )}>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                </svg>
              </div>
              
              <span className="font-semibold">{tab.label}</span>
              
              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none transform -skew-x-12"></div>
            </button>
          ))}
        </div>

        {/* Quick Filters Section */}
        <div className="mt-8">
          <div className="flex items-center space-x-2 px-4 mb-4">
            <div className="w-6 h-6 bg-gradient-to-br from-gray-300 to-gray-400 rounded-lg flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </div>
            <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider">
              Quick Filters
            </h3>
          </div>
          
          <div className="space-y-1">
            {quickFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => onTabChange('tasks', filter.id)}
                className="group flex items-center px-4 py-2.5 text-sm text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-slate-50 hover:text-gray-900 w-full text-left rounded-lg transition-all duration-200 relative overflow-hidden hover:shadow-sm"
              >
                {/* Mini icon */}
                <div className="mr-3 p-1.5 rounded-md bg-gray-100 group-hover:bg-white transition-colors duration-200">
                  <svg className={clsx("h-3 w-3", filter.color)} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={filter.icon} />
                  </svg>
                </div>
                
                <span className="font-medium">{filter.label}</span>
                
                {/* Subtle hover indicator */}
                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                </div>
                
                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none transform -skew-x-12"></div>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom decoration */}
        <div className="mt-8">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
          <div className="mt-4 text-center">
            <div className="inline-flex items-center space-x-1 text-xs text-gray-400">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="font-medium">All systems operational</span>
            </div>
          </div>
        </div>

      

        {/* Additional spacing at bottom for comfortable scrolling */}
        <div className="h-6"></div>
      </nav>
    </aside>
  );
};

export default Sidebar;