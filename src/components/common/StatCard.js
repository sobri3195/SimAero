import React from 'react';

const StatCard = ({ icon: Icon, title, value, trend, color = 'blue' }) => {
  const colors = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
    indigo: 'bg-indigo-500'
  };

  return (
    <div className="bg-white rounded-lg shadow p-3 sm:p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-gray-600 text-xs sm:text-sm mb-1 truncate">{title}</p>
          <p className="text-xl sm:text-2xl md:text-3xl font-bold">{value}</p>
          {trend && (
            <p className={`text-xs sm:text-sm mt-1 sm:mt-2 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </p>
          )}
        </div>
        <div className={`${colors[color]} p-2 sm:p-3 md:p-4 rounded-lg flex-shrink-0 ml-2`}>
          <Icon className="text-white" size={20} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
