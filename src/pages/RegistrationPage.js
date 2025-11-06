import React, { useState } from 'react';
import RegistrationForm from '../components/registration/RegistrationForm';
import QueueBoard from '../components/registration/QueueBoard';
import QueueManagement from '../components/registration/QueueManagement';
import QueueStats from '../components/registration/QueueStats';
import PageHeader from '../components/common/PageHeader';

const RegistrationPage = () => {
  const [activeTab, setActiveTab] = useState('registration');

  const breadcrumbItems = [
    { label: 'Dashboard', path: '/' },
    { label: 'Pendaftaran & Antrean', path: '/registration' }
  ];

  return (
    <div>
      <PageHeader
        title="Pendaftaran & Antrean Terpadu"
        subtitle="Sistem pendaftaran pasien dengan integrasi database nasional dan monitoring antrean real-time"
        breadcrumbItems={breadcrumbItems}
      />

      <div className="mb-6">
        <div className="flex gap-2 border-b overflow-x-auto">
          <button
            onClick={() => setActiveTab('registration')}
            className={`px-4 py-2 whitespace-nowrap ${activeTab === 'registration' ? 'border-b-2 border-blue-500 text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
          >
            📝 Pendaftaran Pasien
          </button>
          <button
            onClick={() => setActiveTab('queue')}
            className={`px-4 py-2 whitespace-nowrap ${activeTab === 'queue' ? 'border-b-2 border-blue-500 text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
          >
            📺 Monitor Antrean
          </button>
          <button
            onClick={() => setActiveTab('management')}
            className={`px-4 py-2 whitespace-nowrap ${activeTab === 'management' ? 'border-b-2 border-blue-500 text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
          >
            🎯 Manajemen Antrean
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 whitespace-nowrap ${activeTab === 'stats' ? 'border-b-2 border-blue-500 text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
          >
            📊 Statistik & Analitik
          </button>
        </div>
      </div>

      {activeTab === 'registration' && <RegistrationForm />}
      {activeTab === 'queue' && <QueueBoard />}
      {activeTab === 'management' && <QueueManagement />}
      {activeTab === 'stats' && <QueueStats />}
    </div>
  );
};

export default RegistrationPage;
