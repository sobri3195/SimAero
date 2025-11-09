import React from 'react';

const Card = ({ children, title, actions, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow p-4 sm:p-6 ${className}`}>
      {(title || actions) && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-4 gap-2">
          {title && <h3 className="text-base sm:text-lg font-semibold truncate">{title}</h3>}
          {actions && <div className="flex gap-2 flex-shrink-0">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
