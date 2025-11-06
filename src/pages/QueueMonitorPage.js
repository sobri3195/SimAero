import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import QueueMonitor from '../components/registration/QueueMonitor';
import { useAuth } from '../contexts/AuthContext';

const QueueMonitorPage = () => {
  const { poliName } = useParams();
  const { selectedFaskes } = useAuth();
  const [decodedPoliName, setDecodedPoliName] = useState('');

  useEffect(() => {
    if (poliName) {
      setDecodedPoliName(decodeURIComponent(poliName));
    }
  }, [poliName]);

  if (!selectedFaskes) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Monitor Antrean</h1>
          <p className="text-gray-600 mb-6">Silakan pilih faskes terlebih dahulu</p>
          <a href="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Kembali ke Dashboard
          </a>
        </div>
      </div>
    );
  }

  if (!decodedPoliName) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Monitor Antrean</h1>
          <p className="text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  return <QueueMonitor poliName={decodedPoliName} />;
};

export default QueueMonitorPage;
