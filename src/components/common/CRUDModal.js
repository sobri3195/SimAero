import React from 'react';
import { X } from 'lucide-react';

const CRUDModal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  onSubmit,
  submitLabel = 'Simpan',
  size = 'medium' // small, medium, large, xl
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    small: 'max-w-md',
    medium: 'max-w-2xl',
    large: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4"
      onClick={handleBackdropClick}
    >
      <div className={`bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} max-h-[95vh] sm:max-h-[90vh] flex flex-col`}>
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 truncate pr-2">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          >
            <X size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 sm:gap-3 p-3 sm:p-4 border-t bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-3 sm:px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors text-sm sm:text-base"
          >
            Batal
          </button>
          <button
            type="submit"
            onClick={onSubmit}
            className="px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm sm:text-base"
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CRUDModal;
