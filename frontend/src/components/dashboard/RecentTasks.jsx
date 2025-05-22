import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { tasksAPI } from '../../services/api';
import { clsx } from 'clsx';

const RecentTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentTasks();
  }, []);

  const fetchRecentTasks = async () => {
    try {
      const response = await tasksAPI.getAll({ 
        sort_by: 'created_at',
        sort_order: 'desc'
      });
      setTasks(response.data.data.data.slice(0, 5)); // Get latest 5 tasks
    } catch (error) {
      console.error('Failed to fetch recent tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const priorityColors = {
    low: 'text-green-600 bg-green-100',
    medium: 'text-yellow-600 bg-yellow-100',
    high: 'text-red-600 bg-red-100',
  };

  if (loading) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Tasks</h3>
        <div className="animate-pulse space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Tasks</h3>
      {tasks.length === 0 ? (
        <p className="text-gray-500 text-sm">No tasks yet. Create your first task!</p>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <p className={clsx(
                  'font-medium text-sm',
                  task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'
                )}>
                  {task.title}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={clsx(
                    'px-2 py-1 rounded-full text-xs font-medium',
                    priorityColors[task.priority]
                  )}>
                    {task.priority}
                  </span>
                  {task.due_date && (
                    <span className="text-xs text-gray-500">
                      Due: {format(new Date(task.due_date), 'MMM dd')}
                    </span>
                  )}
                </div>
              </div>
              <div className="ml-4">
                <span className={clsx(
                  'px-2 py-1 rounded-full text-xs font-medium',
                  task.status === 'completed' ? 'bg-green-100 text-green-800' :
                  task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                )}>
                  {task.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentTasks;
