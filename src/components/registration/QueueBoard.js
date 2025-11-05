import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, updateDoc, doc } from '../../mockDb';
import { db } from '../../mockDb';
import { useAuth } from '../../contexts/AuthContext';
import { Clock } from 'lucide-react';
import Card from '../common/Card';

const QueueBoard = () => {
  const { selectedFaskes } = useAuth();
  const [queues, setQueues] = useState({});
  const [selectedPoli, setSelectedPoli] = useState('all');

  useEffect(() => {
    if (!selectedFaskes) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const q = query(
      collection(db, 'registrations'),
      where('faskesId', '==', selectedFaskes),
      where('tanggalDaftar', '>=', today)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const queueData = {};
      
      snapshot.forEach((doc) => {
        const data = { id: doc.id, ...doc.data() };
        const poli = data.poliTujuan;
        
        if (!queueData[poli]) {
          queueData[poli] = [];
        }
        queueData[poli].push(data);
      });

      Object.keys(queueData).forEach(poli => {
        queueData[poli].sort((a, b) => a.nomorAntrean - b.nomorAntrean);
      });

      setQueues(queueData);
    });

    return () => unsubscribe();
  }, [selectedFaskes]);

  const updateStatus = async (queueId, newStatus) => {
    try {
      await updateDoc(doc(db, 'registrations', queueId), {
        status: newStatus,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating status:', error);
    }
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

  const filteredQueues = selectedPoli === 'all' 
    ? queues 
    : { [selectedPoli]: queues[selectedPoli] || [] };

  return (
    <div>
      <Card title="Antrean Real-time" className="mb-6">
        <div className="mb-4">
          <select
            value={selectedPoli}
            onChange={(e) => setSelectedPoli(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="all">Semua Poli</option>
            {Object.keys(queues).map((poli, idx) => (
              <option key={idx} value={poli}>{poli}</option>
            ))}
          </select>
        </div>

        {Object.entries(filteredQueues).map(([poli, queue]) => (
          <div key={poli} className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center justify-between">
              <span>{poli}</span>
              <span className="text-sm font-normal text-gray-600">
                {queue.length} pasien
              </span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {queue.length === 0 ? (
                <p className="text-gray-500 col-span-full">Tidak ada antrean</p>
              ) : (
                queue.map((patient) => (
                  <div 
                    key={patient.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="text-3xl font-bold text-blue-600">
                          {patient.nomorAntrean}
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${getStatusColor(patient.status)}`}>
                          {patient.status}
                        </span>
                      </div>
                      <Clock size={20} className="text-gray-400" />
                    </div>
                    
                    <h4 className="font-medium mb-1">{patient.nama}</h4>
                    <p className="text-sm text-gray-600 mb-3">{patient.keluhanUtama || 'Tidak ada keluhan'}</p>
                    
                    <div className="flex gap-2">
                      {patient.status === 'menunggu' && (
                        <button
                          onClick={() => updateStatus(patient.id, 'dipanggil')}
                          className="flex-1 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                        >
                          Panggil
                        </button>
                      )}
                      {patient.status === 'dipanggil' && (
                        <button
                          onClick={() => updateStatus(patient.id, 'dilayani')}
                          className="flex-1 px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                        >
                          Layani
                        </button>
                      )}
                      {patient.status === 'dilayani' && (
                        <button
                          onClick={() => updateStatus(patient.id, 'selesai')}
                          className="flex-1 px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                        >
                          Selesai
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
};

export default QueueBoard;
