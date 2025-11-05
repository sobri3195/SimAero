import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc } from '../../mockDb';
import { db } from '../../mockDb';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { CheckCircle, XCircle, RefreshCw, Database } from 'lucide-react';
import Card from '../common/Card';

const BridgingManagement = () => {
  const { selectedFaskes } = useAuth();
  const { addNotification } = useApp();
  
  const [bridgingLogs, setBridgingLogs] = useState([]);
  const [connections, setConnections] = useState([
    { id: '1', name: 'BPJS VClaim', status: 'connected', lastSync: new Date().toISOString(), type: 'BPJS' },
    { id: '2', name: 'SATUSEHAT', status: 'connected', lastSync: new Date().toISOString(), type: 'SATUSEHAT' },
    { id: '3', name: 'SIMRSInternal', status: 'disconnected', lastSync: null, type: 'Internal' }
  ]);

  const [selectedSystem, setSelectedSystem] = useState('');
  const [syncType, setSyncType] = useState('patients');

  useEffect(() => {
    if (!selectedFaskes) return;

    const logsQuery = query(
      collection(db, 'bridging_logs'),
      where('faskesId', '==', selectedFaskes)
    );

    const unsubLogs = onSnapshot(logsQuery, (snapshot) => {
      const data = [];
      snapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));
      data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setBridgingLogs(data.slice(0, 50));
    });

    return () => unsubLogs();
  }, [selectedFaskes]);

  const testConnection = async (systemId, systemName) => {
    try {
      addNotification({ type: 'info', message: `Testing connection to ${systemName}...` });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setConnections(prev => prev.map(conn => 
        conn.id === systemId 
          ? { ...conn, status: 'connected', lastSync: new Date().toISOString() }
          : conn
      ));

      await addDoc(collection(db, 'bridging_logs'), {
        faskesId: selectedFaskes,
        system: systemName,
        action: 'test_connection',
        status: 'success',
        timestamp: new Date().toISOString()
      });

      addNotification({ type: 'success', message: `Connected to ${systemName}` });
    } catch (error) {
      console.error('Error testing connection:', error);
      addNotification({ type: 'error', message: `Failed to connect to ${systemName}` });
    }
  };

  const syncData = async () => {
    if (!selectedSystem) {
      addNotification({ type: 'warning', message: 'Pilih sistem terlebih dahulu' });
      return;
    }

    try {
      const system = connections.find(c => c.id === selectedSystem);
      addNotification({ type: 'info', message: `Syncing ${syncType} to ${system.name}...` });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await addDoc(collection(db, 'bridging_logs'), {
        faskesId: selectedFaskes,
        system: system.name,
        action: `sync_${syncType}`,
        status: 'success',
        recordCount: Math.floor(Math.random() * 100) + 1,
        timestamp: new Date().toISOString()
      });

      setConnections(prev => prev.map(conn => 
        conn.id === selectedSystem 
          ? { ...conn, lastSync: new Date().toISOString() }
          : conn
      ));

      addNotification({ type: 'success', message: `Data synced successfully` });
    } catch (error) {
      console.error('Error syncing data:', error);
      addNotification({ type: 'error', message: 'Sync failed' });
    }
  };

  return (
    <div className="space-y-6">
      <Card title="Bridging & Integrasi Sistem">
        <div className="mb-6">
          <h4 className="font-medium mb-3">Status Koneksi</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {connections.map(conn => (
              <div key={conn.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium">{conn.name}</h5>
                  {conn.status === 'connected' ? (
                    <CheckCircle size={20} className="text-green-500" />
                  ) : (
                    <XCircle size={20} className="text-red-500" />
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-1">Type: {conn.type}</p>
                <p className="text-xs text-gray-500">
                  Last Sync: {conn.lastSync ? new Date(conn.lastSync).toLocaleString('id-ID') : 'Never'}
                </p>
                <button
                  onClick={() => testConnection(conn.id, conn.name)}
                  className="mt-3 w-full px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 flex items-center justify-center gap-1"
                >
                  <RefreshCw size={14} />
                  Test Connection
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-3">Sinkronisasi Data</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <select
              value={selectedSystem}
              onChange={(e) => setSelectedSystem(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="">Pilih Sistem</option>
              {connections.filter(c => c.status === 'connected').map(conn => (
                <option key={conn.id} value={conn.id}>{conn.name}</option>
              ))}
            </select>
            <select
              value={syncType}
              onChange={(e) => setSyncType(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="patients">Pasien</option>
              <option value="registrations">Registrasi</option>
              <option value="medical_records">Rekam Medis</option>
              <option value="lab_results">Hasil Lab</option>
              <option value="radiology_results">Hasil Radiologi</option>
            </select>
            <button
              onClick={syncData}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center justify-center gap-2"
            >
              <Database size={16} />
              Sinkronisasi
            </button>
          </div>
          <p className="text-xs text-gray-500">
            * Sinkronisasi data akan mengirim data dari sistem lokal ke sistem eksternal yang dipilih
          </p>
        </div>

        <div>
          <h4 className="font-medium mb-3">Log Aktivitas Bridging</h4>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {bridgingLogs.map(log => (
              <div key={log.id} className="p-3 bg-white border rounded text-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-medium">{log.system}</span>
                    <span className="text-gray-600"> - {log.action}</span>
                    {log.recordCount && (
                      <span className="text-gray-500"> ({log.recordCount} records)</span>
                    )}
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    log.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {log.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(log.timestamp).toLocaleString('id-ID')}
                </p>
              </div>
            ))}
            {bridgingLogs.length === 0 && (
              <div className="text-center py-8 text-gray-500">Belum ada log aktivitas</div>
            )}
          </div>
        </div>
      </Card>

      <Card title="Integrasi BPJS">
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h5 className="font-medium mb-2">VClaim API</h5>
            <p className="text-sm text-gray-600 mb-2">Integrasi dengan sistem BPJS VClaim untuk verifikasi peserta dan klaim</p>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
                Cek Eligibilitas
              </button>
              <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
                Submit Klaim
              </button>
            </div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h5 className="font-medium mb-2">SATUSEHAT</h5>
            <p className="text-sm text-gray-600 mb-2">Integrasi dengan platform SATUSEHAT Kemenkes</p>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600">
                Kirim Data Pasien
              </button>
              <button className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600">
                Kirim Data Kunjungan
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BridgingManagement;
