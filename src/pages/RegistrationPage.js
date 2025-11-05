import React, { useState } from 'react';
import RegistrationForm from '../components/registration/RegistrationForm';
import QueueBoard from '../components/registration/QueueBoard';

const RegistrationPage = () => {
  const [activeTab, setActiveTab] = useState('registration');

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Pendaftaran & Antrean</h1>
        <div className="flex gap-2 border-b">
          <button
            onClick={() => setActiveTab('registration')}
            className={`px-4 py-2 ${activeTab === 'registration' ? 'border-b-2 border-blue-500 text-blue-600 font-medium' : 'text-gray-600'}`}
          >
            Pendaftaran Pasien
          </button>
          <button
            onClick={() => setActiveTab('queue')}
            className={`px-4 py-2 ${activeTab === 'queue' ? 'border-b-2 border-blue-500 text-blue-600 font-medium' : 'text-gray-600'}`}
          >
            Antrean Real-time
          </button>
        </div>
      </div>

      {activeTab === 'registration' && <RegistrationForm />}
      {activeTab === 'queue' && <QueueBoard />}
    </div>
  );
};

export default RegistrationPage;
