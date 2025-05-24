import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { tasksAPI } from "../../services/api";
import { clsx } from "clsx";

const RecentTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentTasks();
  }, []);

  const fetchRecentTasks = async () => {
    try {
      const response = await tasksAPI.getAll({
        sort_by: "created_at",
        sort_order: "desc",
      });
      setTasks(response.data.data.data.slice(0, 5)); // Get latest 5 tasks
    } catch (error) {
      console.error("Failed to fetch recent tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const priorityColors = {
    low: "text-emerald-700 bg-emerald-50 border-emerald-200",
    medium: "text-amber-700 bg-amber-50 border-amber-200",
    high: "text-rose-700 bg-rose-50 border-rose-200",
  };

  const statusColors = {
    completed: "text-emerald-700 bg-emerald-50 border-emerald-200",
    in_progress: "text-blue-700 bg-blue-50 border-blue-200",
    pending: "text-slate-700 bg-slate-50 border-slate-200",
  };

  if (loading) {
    return (
      <div className="bg-white shadow-lg rounded-2xl border border-gray-100 p-6 backdrop-blur-sm">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Recent Tasks
          </h3>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded-lg w-3/4"></div>
                  <div className="flex space-x-2">
                    <div className="h-3 bg-gray-300 rounded-full w-16"></div>
                    <div className="h-3 bg-gray-300 rounded-full w-20"></div>
                  </div>
                </div>
                <div className="h-6 bg-gray-300 rounded-full w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-2xl border border-gray-100 p-6 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Recent Tasks
        </h3>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">No tasks yet</p>
          <p className="text-gray-400 text-sm mt-1">
            Create your first task to get started!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task, index) => (
            <div
              key={task.id}
              className={clsx(
                "group relative overflow-hidden rounded-xl border transition-all duration-200 hover:shadow-md",
                task.status === "completed"
                  ? "bg-gradient-to-r from-green-50 to-emerald-50 border-emerald-100"
                  : task.status === "in_progress"
                  ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100"
                  : "bg-gradient-to-r from-gray-50 to-slate-50 border-gray-100"
              )}
            >
              <div className="flex items-center p-4">
                {/* Status indicator dot */}
                <div
                  className={clsx(
                    "w-3 h-3 rounded-full mr-4 shadow-sm",
                    task.status === "completed"
                      ? "bg-emerald-500"
                      : task.status === "in_progress"
                      ? "bg-blue-500"
                      : "bg-gray-400"
                  )}
                ></div>

                <div className="flex-1 min-w-0">
                  <p
                    className={clsx(
                      "font-medium text-sm leading-5 mb-2",
                      task.status === "completed"
                        ? "line-through text-gray-500"
                        : "text-gray-900"
                    )}
                  >
                    {task.title}
                  </p>
                  <div className="flex items-center space-x-3">
                    <span
                      className={clsx(
                        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border",
                        priorityColors[task.priority]
                      )}
                    >
                      <span
                        className={clsx(
                          "w-1.5 h-1.5 rounded-full mr-1.5",
                          task.priority === "high"
                            ? "bg-rose-500"
                            : task.priority === "medium"
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                        )}
                      ></span>
                      {task.priority}
                    </span>
                    {task.due_date && (
                      <span className="inline-flex items-center text-xs text-gray-600 bg-white/60 px-2 py-1 rounded-full border border-gray-200">
                        <svg
                          className="w-3 h-3 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        Due {format(new Date(task.due_date), "MMM dd")}
                      </span>
                    )}
                  </div>
                </div>

                <div className="ml-4 flex-shrink-0">
                  <span
                    className={clsx(
                      "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border shadow-sm",
                      statusColors[task.status] || statusColors.pending
                    )}
                  >
                    {task.status.replace("_", " ")}
                  </span>
                </div>
              </div>

              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentTasks;
