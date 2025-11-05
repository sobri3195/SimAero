import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import DashboardPuskesau from '../components/dashboard/DashboardPuskesau';
import DashboardFaskes from '../components/dashboard/DashboardFaskes';

const HomePage = () => {
  const { userRole } = useAuth();

  const renderDashboard = () => {
    switch (userRole) {
      case 'PUSKESAU':
        return <DashboardPuskesau />;
      case 'RSAU':
      case 'FKTP':
        return <DashboardFaskes />;
      default:
        return <DashboardPuskesau />;
    }
  };

  return (
    <div>
      {renderDashboard()}
    </div>
  );
};

export default HomePage;
