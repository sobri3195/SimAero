import React from 'react';
import SurgerySchedule from '../components/surgery/SurgerySchedule';

const SurgeryPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Jadwal Operasi</h1>
      <SurgerySchedule />
    </div>
  );
};

export default SurgeryPage;
