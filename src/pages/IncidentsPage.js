import React from 'react';
import IncidentManagement from '../components/incidents/IncidentManagement';

const IncidentsPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Laporan Insiden</h1>
      <IncidentManagement />
    </div>
  );
};

export default IncidentsPage;
