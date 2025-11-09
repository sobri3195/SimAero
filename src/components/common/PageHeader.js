import React from 'react';
import { Plus } from 'lucide-react';
import Breadcrumb from './Breadcrumb';

const PageHeader = ({ 
  title, 
  subtitle, 
  breadcrumbItems,
  actionLabel,
  onActionClick,
  actionIcon: ActionIcon = Plus,
  children 
}) => {
  return (
    <div className="mb-4 sm:mb-6">
      {/* Breadcrumb */}
      {breadcrumbItems && <Breadcrumb items={breadcrumbItems} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 truncate">{title}</h1>
          {subtitle && <p className="text-xs sm:text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
        
        {(actionLabel || children) && (
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {children}
            {actionLabel && onActionClick && (
              <button
                onClick={onActionClick}
                className="px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-1 sm:gap-2 transition-colors shadow-sm text-sm sm:text-base whitespace-nowrap"
              >
                <ActionIcon size={18} className="sm:w-5 sm:h-5" />
                <span className="font-medium">{actionLabel}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
