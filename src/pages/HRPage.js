import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import HREnhanced from '../components/fktp/HREnhanced';
import HRManagement from '../components/hr/HRManagement';

const HRPage = () => {
  const { userRole } = useAuth();

  // Use enhanced version for FKTP, basic for others
  if (userRole === 'FKTP') {
    return (
      <div className="p-4 md:p-6">
        <HREnhanced />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Manajemen SDM & Penjadwalan</h1>
      <HRManagement />
    </div>
  );
};

export default HRPage;
