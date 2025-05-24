import React, { useEffect } from "react";

const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md", 
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    "2xl": "max-w-6xl",
    "3xl": "max-w-7xl",
    full: "max-w-full mx-4",
    landscape: "max-w-6xl w-full", // New landscape size
  };

  const heightClasses = {
    sm: "max-h-[90vh]",
    md: "max-h-[90vh]",
    lg: "max-h-[90vh]", 
    xl: "max-h-[95vh]",
    "2xl": "max-h-[95vh]",
    "3xl": "max-h-[95vh]",
    full: "max-h-[98vh]",
    landscape: "max-h-[95vh]", // Optimized height for landscape
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Enhanced Backdrop with Blur */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300 ease-out"
        onClick={onClose}
        style={{
          background:
            "radial-gradient(circle at center, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 100%)",
        }}
      >
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-24 h-24 bg-indigo-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
          
          {/* Additional particles for landscape */}
          <div className="absolute top-1/2 left-1/6 w-28 h-28 bg-cyan-500/10 rounded-full blur-3xl animate-pulse animation-delay-3000"></div>
          <div className="absolute bottom-1/3 right-1/6 w-36 h-36 bg-pink-500/10 rounded-full blur-3xl animate-pulse animation-delay-4000"></div>
        </div>
      </div>

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-3 sm:p-4 lg:p-6">
        <div
          className={`relative ${sizeClasses[size]} ${heightClasses[size]} transform transition-all duration-300 ease-out`}
          onClick={(e) => e.stopPropagation()}
          style={{
            animation: isOpen
              ? "modalSlideIn 0.3s ease-out"
              : "modalSlideOut 0.3s ease-in",
          }}
        >
          {/* Glass Card Effect */}
          <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden h-full">
            {/* Enhanced Decorative Elements for Landscape */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 pointer-events-none"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500"></div>
            
            {/* Enhanced gradient bars for landscape */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 opacity-60"></div>
            <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-blue-500/30 via-purple-500/30 to-indigo-500/30"></div>
            <div className="absolute right-0 top-0 w-1 h-full bg-gradient-to-b from-indigo-500/30 via-blue-500/30 to-purple-500/30"></div>

            {/* Enhanced Floating Orbs for Landscape */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-32 h-32 bg-gradient-to-br from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 -left-16 w-24 h-24 bg-gradient-to-br from-cyan-400/15 to-blue-400/15 rounded-full blur-2xl"></div>
            <div className="absolute top-1/3 -right-16 w-28 h-28 bg-gradient-to-br from-purple-400/15 to-pink-400/15 rounded-full blur-2xl"></div>

            {/* Header - Only show if title exists */}
            {title && (
              <div className="relative z-10 flex items-center justify-between p-6 border-b border-gray-200/50 bg-white/30 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  {title}
                </h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-all duration-200 hover:rotate-90 p-2 rounded-full hover:bg-gray-100/50"
                  aria-label="Close modal"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            )}

            {/* Content */}
            <div className="relative z-10 bg-transparent overflow-y-auto max-h-full">
              {children}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Custom Styles */}
      <style jsx>{`
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes modalSlideOut {
          from {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          to {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-3000 {
          animation-delay: 3s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        /* Custom scrollbar for landscape modal content */
        .relative.z-10.bg-transparent::-webkit-scrollbar {
          width: 6px;
        }

        .relative.z-10.bg-transparent::-webkit-scrollbar-track {
          background: rgba(243, 244, 246, 0.3);
          border-radius: 3px;
        }

        .relative.z-10.bg-transparent::-webkit-scrollbar-thumb {
          background: rgba(79, 70, 229, 0.3);
          border-radius: 3px;
        }

        .relative.z-10.bg-transparent::-webkit-scrollbar-thumb:hover {
          background: rgba(79, 70, 229, 0.5);
        }

        /* Responsive adjustments for landscape */
        @media (max-width: 1024px) {
          .max-w-6xl.w-full {
            max-width: 95vw;
          }
        }

        @media (max-width: 768px) {
          .max-w-6xl.w-full {
            max-width: 98vw;
          }
        }
      `}</style>
    </div>
  );
};

export default Modal;