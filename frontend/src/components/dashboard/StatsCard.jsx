import React from "react";
import { clsx } from "clsx";

const StatsCard = ({
  title,
  value,
  icon,
  color = "blue",
  change,
  changeType,
}) => {
  const colorClasses = {
    blue: {
      bg: "bg-gradient-to-br from-blue-500 to-blue-600",
      light: "bg-gradient-to-br from-blue-50 to-indigo-50",
      border: "border-blue-100",
      text: "text-blue-700",
    },
    green: {
      bg: "bg-gradient-to-br from-emerald-500 to-green-600",
      light: "bg-gradient-to-br from-emerald-50 to-green-50",
      border: "border-emerald-100",
      text: "text-emerald-700",
    },
    yellow: {
      bg: "bg-gradient-to-br from-amber-500 to-yellow-600",
      light: "bg-gradient-to-br from-amber-50 to-yellow-50",
      border: "border-amber-100",
      text: "text-amber-700",
    },
    red: {
      bg: "bg-gradient-to-br from-rose-500 to-red-600",
      light: "bg-gradient-to-br from-rose-50 to-red-50",
      border: "border-rose-100",
      text: "text-rose-700",
    },
    purple: {
      bg: "bg-gradient-to-br from-purple-500 to-violet-600",
      light: "bg-gradient-to-br from-purple-50 to-violet-50",
      border: "border-purple-100",
      text: "text-purple-700",
    },
  };

  const currentColor = colorClasses[color];

  return (
    <div
      className={clsx(
        "relative overflow-hidden rounded-2xl border shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer",
        currentColor.light,
        currentColor.border
      )}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8">
        <div
          className={clsx(
            "w-full h-full rounded-full opacity-10",
            currentColor.bg
          )}
        ></div>
      </div>

      <div className="relative p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-4">
              {/* Icon container */}
              <div
                className={clsx(
                  "flex-shrink-0 p-3 rounded-xl shadow-lg transform group-hover:scale-110 transition-transform duration-200",
                  currentColor.bg
                )}
              >
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={icon}
                  />
                </svg>
              </div>

              {/* Title and Value */}
              <div className="flex-1 min-w-0">
                <dt className="text-sm font-medium text-gray-600 mb-1 truncate">
                  {title}
                </dt>
                <dd
                  className={clsx(
                    "text-2xl font-bold tracking-tight",
                    currentColor.text
                  )}
                >
                  {value}
                </dd>
              </div>
            </div>

            {/* Change indicator */}
            {change !== undefined && (
              <div className="flex items-center space-x-2">
                <div
                  className={clsx(
                    "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border",
                    changeType === "increase"
                      ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                      : "text-rose-700 bg-rose-50 border-rose-200"
                  )}
                >
                  <svg
                    className={clsx(
                      "w-3 h-3 mr-1",
                      changeType === "increase"
                        ? "transform rotate-0"
                        : "transform rotate-180"
                    )}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 10l7-7m0 0l7 7m-7-7v18"
                    />
                  </svg>
                  {Math.abs(change)}%
                </div>
                <span className="text-xs text-gray-500 font-medium">
                  from last week
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none transform -skew-x-12"></div>
    </div>
  );
};

export default StatsCard;
