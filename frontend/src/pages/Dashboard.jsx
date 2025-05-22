import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import StatsCard from '../components/dashboard/StatsCard';
import RecentTasks from '../components/dashboard/RecentTasks';
import TaskList from '../components/tasks/TaskList';
import CategoryManager from '../components/categories/CategoryManager';
import { tasksAPI } from '../services/api';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [filter, setFilter] = useState(null);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
  });

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchStats();
    }
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const response = await tasksAPI.getAll();
      const tasks = response.data.data.data || [];
      
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(task => task.status === 'completed').length;
      const pendingTasks = tasks.filter(task => task.status === 'pending').length;
      const overdueTasks = tasks.filter(task => task.is_overdue && task.status !== 'completed').length;

      setStats({
        totalTasks,
        completedTasks,
        pendingTasks,
        overdueTasks,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleTabChange = (tab, filterType = null) => {
    setActiveTab(tab);
    setFilter(filterType);
  };

  const renderContent = () => {
    if (activeTab === 'tasks') {
      return <TaskList filter={filter} />;
    }
    
    if (activeTab === 'categories') {
      return <CategoryManager />;
    }

    // Dashboard view
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600">Welcome back! Here's what's happening with your tasks.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Tasks"
            value={stats.totalTasks}
            icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            color="blue"
          />
          <StatsCard
            title="Completed"
            value={stats.completedTasks}
            icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            color="green"
          />
          <StatsCard
            title="Pending"
            value={stats.pendingTasks}
            icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            color="yellow"
          />
          <StatsCard
            title="Overdue"
            value={stats.overdueTasks}
            icon="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            color="red"
          />
        </div>

        {/* Recent Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentTasks />
          
          {/* Quick Actions */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => handleTabChange('tasks')}
                className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <div className="font-medium text-blue-900">View All Tasks</div>
                <div className="text-sm text-blue-700">Manage and organize your tasks</div>
              </button>
              
              <button
                onClick={() => handleTabChange('tasks', 'overdue')}
                className="w-full text-left p-3 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
              >
                <div className="font-medium text-red-900">Check Overdue Tasks</div>
                <div className="text-sm text-red-700">Review tasks that need attention</div>
              </button>
              
              <button
                onClick={() => handleTabChange('categories')}
                className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
              >
                <div className="font-medium text-purple-900">Manage Categories</div>
                <div className="text-sm text-purple-700">Organize your task categories</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout activeTab={activeTab} onTabChange={handleTabChange}>
      {renderContent()}
    </Layout>
  );
};

export default Dashboard;