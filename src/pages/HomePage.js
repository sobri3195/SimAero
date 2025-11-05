import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import DashboardPusat from '../components/dashboard/DashboardPusat';
import DashboardFaskes from '../components/dashboard/DashboardFaskes';

const HomePage = () => {
  const { userRole } = useAuth();

  return (
    <div>
      {userRole === 'PUSAT' ? <DashboardPusat /> : <DashboardFaskes />}
    </div>
  );
};

export default HomePage;
