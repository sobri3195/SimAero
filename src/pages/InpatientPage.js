import React from 'react';
import InpatientManagement from '../components/inpatient/InpatientManagement';

const InpatientPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manajemen Rawat Inap</h1>
      <InpatientManagement />
    </div>
  );
};

export default InpatientPage;
