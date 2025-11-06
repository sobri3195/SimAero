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
    <div className="mb-6">
      {breadcrumbItems && <Breadcrumb items={breadcrumbItems} />}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{title}</h1>
          {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
        </div>
        
        {(actionLabel || children) && (
          <div className="flex items-center gap-3">
            {children}
            {actionLabel && onActionClick && (
              <button
                onClick={onActionClick}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors shadow-sm"
              >
                <ActionIcon size={20} />
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
