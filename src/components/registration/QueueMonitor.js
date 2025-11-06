import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from '../../mockDb';
import { db } from '../../mockDb';
import { useAuth } from '../../contexts/AuthContext';
import { Clock, AlertCircle, Activity } from 'lucide-react';

const QueueMonitor = ({ poliName }) => {
  const { selectedFaskes } = useAuth();
  const [queues, setQueues] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentServing, setCurrentServing] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!selectedFaskes || !poliName) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const q = query(
      collection(db, 'registrations'),
      where('faskesId', '==', selectedFaskes),
      where('poliTujuan', '==', poliName),
      where('tanggalDaftar', '>=', today)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const queueData = [];
      let serving = null;
      
      snapshot.forEach((doc) => {
        const data = { id: doc.id, ...doc.data() };
        queueData.push(data);
        
        if (data.status === 'dilayani' || data.status === 'dipanggil') {
          serving = data;
        }
      });

      queueData.sort((a, b) => {
        const statusOrder = { dilayani: 0, dipanggil: 1, menunggu: 2, selesai: 3 };
        if (statusOrder[a.status] !== statusOrder[b.status]) {
          return statusOrder[a.status] - statusOrder[b.status];
        }
        return a.nomorAntrean - b.nomorAntrean;
      });

      setQueues(queueData);
      setCurrentServing(serving);
    });

    return () => unsubscribe();
  }, [selectedFaskes, poliName]);

  const formatTime = (date) => {
    return date.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('id-ID', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'menunggu': return 'bg-yellow-100 text-yellow-800';
      case 'dipanggil': return 'bg-blue-100 text-blue-800';
      case 'dilayani': return 'bg-green-100 text-green-800';
      case 'selesai': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const waitingQueues = queues.filter(q => q.status === 'menunggu' || q.status === 'dipanggil');
  const totalWaiting = waitingQueues.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 p-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-2xl p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">{poliName}</h1>
            <p className="text-lg text-gray-600">Monitor Antrean Real-time</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">{formatTime(currentTime)}</div>
            <div className="text-sm text-gray-600">{formatDate(currentTime)}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Current Serving - Large Display */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Activity className="text-green-600" size={32} />
              <h2 className="text-3xl font-bold text-gray-800">Sedang Dilayani</h2>
            </div>
            
            {currentServing ? (
              <div className="text-center py-12">
                <div className="text-9xl font-bold text-green-600 mb-6 animate-pulse">
                  {currentServing.nomorAntrean}
                </div>
                <div className="text-3xl font-medium text-gray-700 mb-4">
                  {currentServing.nama}
                </div>
                <div className={`inline-block px-6 py-3 rounded-full text-xl font-medium ${getStatusColor(currentServing.status)}`}>
                  {currentServing.status === 'dilayani' ? '🏥 Sedang Dilayani' : '📢 Dipanggil - Silakan Masuk'}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <div className="text-6xl mb-4">⏳</div>
                <div className="text-2xl">Tidak ada pasien yang sedang dilayani</div>
              </div>
            )}
          </div>

          {/* Waiting Statistics */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="text-blue-600" size={32} />
              <h2 className="text-3xl font-bold text-gray-800">Statistik Antrean</h2>
            </div>
            
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center p-6 bg-blue-50 rounded-xl">
                <div className="text-5xl font-bold text-blue-600 mb-2">{totalWaiting}</div>
                <div className="text-lg text-gray-600">Menunggu</div>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-xl">
                <div className="text-5xl font-bold text-green-600 mb-2">
                  {queues.filter(q => q.status === 'dilayani').length}
                </div>
                <div className="text-lg text-gray-600">Dilayani</div>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="text-5xl font-bold text-gray-600 mb-2">
                  {queues.filter(q => q.status === 'selesai').length}
                </div>
                <div className="text-lg text-gray-600">Selesai</div>
              </div>
            </div>
          </div>
        </div>

        {/* Waiting List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-h-[calc(100vh-120px)] overflow-y-auto">
            <div className="flex items-center gap-3 mb-6 sticky top-0 bg-white pb-4 border-b">
              <AlertCircle className="text-yellow-600" size={28} />
              <h2 className="text-2xl font-bold text-gray-800">
                Daftar Tunggu ({totalWaiting})
              </h2>
            </div>
            
            <div className="space-y-4">
              {waitingQueues.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <div className="text-4xl mb-2">✓</div>
                  <div className="text-lg">Tidak ada antrean</div>
                </div>
              ) : (
                waitingQueues.map((patient, index) => (
                  <div 
                    key={patient.id}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      patient.status === 'dipanggil' 
                        ? 'border-blue-400 bg-blue-50 shadow-lg' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-4xl font-bold text-blue-600">
                        {patient.nomorAntrean}
                      </div>
                      {patient.status === 'dipanggil' && (
                        <span className="animate-pulse bg-blue-500 text-white text-xs px-2 py-1 rounded">
                          DIPANGGIL
                        </span>
                      )}
                    </div>
                    <div className="font-medium text-lg mb-1">{patient.nama}</div>
                    <div className="text-sm text-gray-500">
                      {patient.statusPasien === 'prajurit' && '👤 Prajurit'}
                      {patient.statusPasien === 'pns' && '👤 PNS'}
                      {patient.statusPasien === 'keluarga' && '👨‍👩‍👧 Keluarga'}
                      {patient.statusPasien === 'umum' && '👤 Umum'}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-white text-sm opacity-75">
        <p>RSAU - Sistem Informasi Manajemen Rumah Sakit TNI Angkatan Udara</p>
      </div>
    </div>
  );
};

export default QueueMonitor;
