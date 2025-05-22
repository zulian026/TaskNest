import React from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { clsx } from 'clsx';
import Button from '../ui/Button';

const TaskCard = ({ task, onEdit, onDelete, onToggleStatus }) => {
  const priorityConfig = {
    low: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-700',
      badge: 'bg-emerald-100 text-emerald-800',
      icon: '🟢'
    },
    medium: {
      bg: 'bg-amber-50',
      border: 'border-amber-200', 
      text: 'text-amber-700',
      badge: 'bg-amber-100 text-amber-800',
      icon: '🟡'
    },
    high: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-700', 
      badge: 'bg-red-100 text-red-800',
      icon: '🔴'
    },
  };

  const statusConfig = {
    pending: {
      badge: 'bg-slate-100 text-slate-700',
      icon: '⏳',
      label: 'Tertunda'
    },
    in_progress: {
      badge: 'bg-blue-100 text-blue-700',
      icon: '🔄',
      label: 'Sedang Dikerjakan'
    },
    completed: {
      badge: 'bg-green-100 text-green-700',
      icon: '✅',
      label: 'Selesai'
    },
  };

  const priorityLabels = {
    low: 'Rendah',
    medium: 'Sedang', 
    high: 'Tinggi',
  };

  const isOverdue = task.is_overdue && task.status !== 'completed';
  const isCompleted = task.status === 'completed';
  const priority = priorityConfig[task.priority];
  const status = statusConfig[task.status];

  return (
    <div className={clsx(
      'group relative rounded-xl shadow-sm border transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5',
      'bg-gradient-to-br from-white to-gray-50/30',
      isOverdue && !isCompleted && 'border-red-300 bg-gradient-to-br from-red-50 to-red-100/30',
      isCompleted && 'border-green-200 bg-gradient-to-br from-green-50/50 to-emerald-50/30',
      !isOverdue && !isCompleted && 'border-gray-200 hover:border-gray-300'
    )}>
      {/* Priority indicator bar */}
      <div className={clsx(
        'absolute top-0 left-0 w-1 h-full rounded-l-xl',
        priority.bg.replace('bg-', 'bg-gradient-to-b from-').replace('-50', '-400 to-' + task.priority === 'high' ? 'red' : task.priority === 'medium' ? 'amber' : 'emerald' + '-600')
      )} />
      
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{priority.icon}</span>
              <h3 className={clsx(
                'text-lg font-semibold transition-colors',
                isCompleted 
                  ? 'line-through text-gray-500' 
                  : 'text-gray-900 group-hover:text-gray-800'
              )}>
                {task.title}
              </h3>
            </div>
            
            {task.description && (
              <p className={clsx(
                'text-sm leading-relaxed mt-2',
                isCompleted ? 'text-gray-400' : 'text-gray-600'
              )}>
                {task.description}
              </p>
            )}
          </div>
          
          <div className="flex gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(task)}
              className="shadow-sm hover:shadow-md transition-shadow"
            >
              ✏️ Edit
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => onDelete(task.id)}
              className="shadow-sm hover:shadow-md transition-shadow"
            >
              🗑️ Hapus
            </Button>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className={clsx(
            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium shadow-sm',
            priority.badge
          )}>
            <span>{priority.icon}</span>
            {priorityLabels[task.priority]}
          </span>
          
          <span className={clsx(
            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium shadow-sm',
            status.badge
          )}>
            <span>{status.icon}</span>
            {status.label}
          </span>
          
          {task.category && (
            <span 
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white shadow-sm"
              style={{ backgroundColor: task.category.color }}
            >
              📂 {task.category.name}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-3">
            {task.due_date && (
              <div className={clsx(
                'flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg',
                isOverdue && !isCompleted
                  ? 'bg-red-100 text-red-700'
                  : isCompleted
                  ? 'bg-gray-100 text-gray-500'
                  : 'bg-blue-50 text-blue-700'
              )}>
                <span>📅</span>
                <span>
                  {isOverdue && !isCompleted && 'Terlambat: '}
                  {format(new Date(task.due_date), 'dd MMM yyyy', { locale: id })}
                </span>
              </div>
            )}
            
            <div className="text-xs text-gray-400">
              📝 {format(new Date(task.created_at || Date.now()), 'dd MMM', { locale: id })}
            </div>
          </div>
          
          <button
            onClick={() => onToggleStatus(task)}
            className={clsx(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105',
              isCompleted
                ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200 shadow-sm hover:shadow-md'
            )}
          >
            <span>{isCompleted ? '↩️' : '✅'}</span>
            {isCompleted ? 'Tandai Tertunda' : 'Tandai Selesai'}
          </button>
        </div>
      </div>

      {/* Completed overlay effect */}
      {isCompleted && (
        <div className="absolute inset-0 bg-green-500/5 rounded-xl pointer-events-none" />
      )}
      
      {/* Overdue pulse effect */}
      {isOverdue && !isCompleted && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
      )}
    </div>
  );
};

export default TaskCard;