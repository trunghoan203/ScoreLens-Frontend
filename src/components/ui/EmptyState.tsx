import React from 'react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    loading?: boolean;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  additionalInfo?: string;
  showAdditionalInfo?: boolean;
}

export default function EmptyState({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  additionalInfo,
  showAdditionalInfo = true
}: EmptyStateProps) {
  return (
    <div className="relative overflow-hidden">
      <div className="relative py-8 sm:py-12 flex flex-col items-center justify-center w-full">
        <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 w-full">
          <div className="relative mb-4 sm:mb-6 flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 sm:w-28 sm:h-28 bg-gradient-to-br from-lime-400 to-lime-600 rounded-full flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="w-10 h-10 sm:w-14 sm:h-14 text-white flex-shrink-0 flex items-center justify-center">
                  {icon}
                </div>
              </div>

              <div className="absolute inset-0 w-20 h-20 sm:w-28 sm:h-28 border-4 border-lime-200 rounded-full animate-ping opacity-20"></div>
              <div className="absolute inset-0 w-20 h-20 sm:w-28 sm:h-28 border-2 border-lime-300 rounded-full animate-pulse"></div>

              <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-6 sm:h-6 bg-lime-400 rounded-full shadow-lg animate-bounce"></div>
              <div className="absolute -bottom-1 -left-1 w-3 h-3 sm:w-4 sm:h-4 bg-lime-300 rounded-full shadow-md animate-bounce" style={{ animationDelay: '0.5s' }}></div>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-3 sm:mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              {title}
            </h2>

            <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
              {description}
            </p>

            {(primaryAction || secondaryAction) && (
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 sm:mb-8">
                {primaryAction && (
                  <button
                    onClick={primaryAction.onClick}
                    disabled={primaryAction.loading}
                    className="group relative inline-flex items-center px-6 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-lime-500 to-lime-600 text-white font-semibold rounded-xl sm:rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden text-sm sm:text-base touch-manipulation"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                    {primaryAction.loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white relative z-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="relative z-10">Vui lòng đợi...</span>
                      </>
                    ) : (
                      <>
                        {primaryAction.icon && (
                          <span className="relative z-10 mr-3">
                            {primaryAction.icon}
                          </span>
                        )}
                        <span className="relative z-10">{primaryAction.label}</span>
                      </>
                    )}
                  </button>
                )}

                {secondaryAction && (
                  <button
                    onClick={secondaryAction.onClick}
                    className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 text-gray-600 font-medium rounded-xl sm:rounded-2xl border-2 border-gray-200 hover:border-lime-300 hover:bg-lime-50 transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base touch-manipulation"
                  >
                    {secondaryAction.icon && (
                      <span className="mr-2">
                        {secondaryAction.icon}
                      </span>
                    )}
                    {secondaryAction.label}
                  </button>
                )}
              </div>
            )}

            {showAdditionalInfo && additionalInfo && (
              <div className="pt-6 sm:pt-8">
                <div className="flex items-center justify-center text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-lime-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {additionalInfo}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 