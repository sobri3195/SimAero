import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, updateDoc, doc, addDoc } from '../../mockDb';
import { db } from '../../mockDb';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { Package, CheckCircle, Activity } from 'lucide-react';
import Card from '../common/Card';

const CssdManagement = () => {
  const { selectedFaskes } = useAuth();
  const { addNotification } = useApp();
  
  const [instruments, setInstruments] = useState([]);
  const [sterilizationCycles, setSterilizationCycles] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCycleForm, setShowCycleForm] = useState(false);
  
  const [instrumentForm, setInstrumentForm] = useState({
    name: '',
    type: 'Surgical',
    quantity: '1',
    location: ''
  });

  const [cycleForm, setCycleForm] = useState({
    cycleNumber: '',
    sterilizer: 'Autoclave 1',
    method: 'Steam',
    temperature: '121',
    duration: '20',
    operator: '',
    items: []
  });

  useEffect(() => {
    if (!selectedFaskes) return;

    const instrumentsQuery = query(
      collection(db, 'cssd_instruments'),
      where('faskesId', '==', selectedFaskes)
    );

    const unsubscribeInstruments = onSnapshot(instrumentsQuery, (snapshot) => {
      const instrumentsData = [];
      snapshot.forEach((doc) => {
        instrumentsData.push({ id: doc.id, ...doc.data() });
      });
      setInstruments(instrumentsData);
    });

    const cyclesQuery = query(
      collection(db, 'sterilization_cycles'),
      where('faskesId', '==', selectedFaskes)
    );

    const unsubscribeCycles = onSnapshot(cyclesQuery, (snapshot) => {
      const cyclesData = [];
      snapshot.forEach((doc) => {
        cyclesData.push({ id: doc.id, ...doc.data() });
      });
      cyclesData.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
      setSterilizationCycles(cyclesData);
    });

    return () => {
      unsubscribeInstruments();
      unsubscribeCycles();
    };
  }, [selectedFaskes]);

  const addInstrument = async () => {
    if (!instrumentForm.name) {
      addNotification({ type: 'warning', message: 'Nama instrumen harus diisi' });
      return;
    }

    try {
      await addDoc(collection(db, 'cssd_instruments'), {
        ...instrumentForm,
        faskesId: selectedFaskes,
        status: 'bersih',
        lastSterilized: null,
        nextCalibration: null,
        createdAt: new Date().toISOString()
      });

      setInstrumentForm({
        name: '',
        type: 'Surgical',
        quantity: '1',
        location: ''
      });
      setShowAddForm(false);
      addNotification({ type: 'success', message: 'Instrumen berhasil ditambahkan' });
    } catch (error) {
      console.error('Error adding instrument:', error);
      addNotification({ type: 'error', message: 'Gagal menambahkan instrumen' });
    }
  };

  const startSterilizationCycle = async () => {
    if (!cycleForm.cycleNumber || !cycleForm.operator) {
      addNotification({ type: 'warning', message: 'Nomor siklus dan operator harus diisi' });
      return;
    }

    try {
      await addDoc(collection(db, 'sterilization_cycles'), {
        ...cycleForm,
        faskesId: selectedFaskes,
        status: 'berlangsung',
        startTime: new Date().toISOString(),
        createdAt: new Date().toISOString()
      });

      setCycleForm({
        cycleNumber: '',
        sterilizer: 'Autoclave 1',
        method: 'Steam',
        temperature: '121',
        duration: '20',
        operator: '',
        items: []
      });
      setShowCycleForm(false);
      addNotification({ type: 'success', message: 'Siklus sterilisasi dimulai' });
    } catch (error) {
      console.error('Error starting cycle:', error);
      addNotification({ type: 'error', message: 'Gagal memulai siklus sterilisasi' });
    }
  };

  const completeCycle = async (cycleId) => {
    try {
      await updateDoc(doc(db, 'sterilization_cycles', cycleId), {
        status: 'selesai',
        endTime: new Date().toISOString(),
        result: 'Pass'
      });
      addNotification({ type: 'success', message: 'Siklus sterilisasi selesai' });
    } catch (error) {
      console.error('Error completing cycle:', error);
    }
  };

  const updateInstrumentStatus = async (instrumentId, newStatus) => {
    try {
      const updateData = {
        status: newStatus,
        updatedAt: new Date().toISOString()
      };
      
      if (newStatus === 'steril') {
        updateData.lastSterilized = new Date().toISOString();
      }

      await updateDoc(doc(db, 'cssd_instruments', instrumentId), updateData);
      addNotification({ type: 'success', message: `Status instrumen diubah menjadi ${newStatus}` });
    } catch (error) {
      console.error('Error updating instrument status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'steril': return 'bg-green-100 text-green-800';
      case 'kotor': return 'bg-red-100 text-red-800';
      case 'bersih': return 'bg-blue-100 text-blue-800';
      case 'dalam_proses': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCycleStatusColor = (status) => {
    switch (status) {
      case 'berlangsung': return 'bg-yellow-100 text-yellow-800';
      case 'selesai': return 'bg-green-100 text-green-800';
      case 'gagal': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const instrumentsByType = instruments.reduce((acc, instrument) => {
    if (!acc[instrument.type]) acc[instrument.type] = [];
    acc[instrument.type].push(instrument);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <Card 
        title="Manajemen CSSD"
        actions={
          <div className="flex gap-2">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
            >
              <Package size={16} />
              Tambah Instrumen
            </button>
            <button
              onClick={() => setShowCycleForm(!showCycleForm)}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2"
            >
              <Activity size={16} />
              Mulai Sterilisasi
            </button>
          </div>
        }
      >
        {showAddForm && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-3">Tambah Instrumen Baru</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Nama Instrumen"
                value={instrumentForm.name}
                onChange={(e) => setInstrumentForm(prev => ({ ...prev, name: e.target.value }))}
                className="p-2 border rounded"
              />
              <select
                value={instrumentForm.type}
                onChange={(e) => setInstrumentForm(prev => ({ ...prev, type: e.target.value }))}
                className="p-2 border rounded"
              >
                <option value="Surgical">Surgical</option>
                <option value="Dental">Dental</option>
                <option value="Gynecology">Gynecology</option>
                <option value="Orthopedic">Orthopedic</option>
                <option value="General">General</option>
              </select>
              <input
                type="number"
                placeholder="Jumlah"
                value={instrumentForm.quantity}
                onChange={(e) => setInstrumentForm(prev => ({ ...prev, quantity: e.target.value }))}
                className="p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Lokasi Penyimpanan"
                value={instrumentForm.location}
                onChange={(e) => setInstrumentForm(prev => ({ ...prev, location: e.target.value }))}
                className="p-2 border rounded"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={addInstrument}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Tambah
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Batal
              </button>
            </div>
          </div>
        )}

        {showCycleForm && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium mb-3">Mulai Siklus Sterilisasi</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Nomor Siklus (e.g., AUTO-001)"
                value={cycleForm.cycleNumber}
                onChange={(e) => setCycleForm(prev => ({ ...prev, cycleNumber: e.target.value }))}
                className="p-2 border rounded"
              />
              <select
                value={cycleForm.sterilizer}
                onChange={(e) => setCycleForm(prev => ({ ...prev, sterilizer: e.target.value }))}
                className="p-2 border rounded"
              >
                <option value="Autoclave 1">Autoclave 1</option>
                <option value="Autoclave 2">Autoclave 2</option>
                <option value="ETO Sterilizer">ETO Sterilizer</option>
                <option value="Plasma Sterilizer">Plasma Sterilizer</option>
              </select>
              <select
                value={cycleForm.method}
                onChange={(e) => setCycleForm(prev => ({ ...prev, method: e.target.value }))}
                className="p-2 border rounded"
              >
                <option value="Steam">Steam</option>
                <option value="ETO">ETO</option>
                <option value="Plasma">Plasma</option>
                <option value="Dry Heat">Dry Heat</option>
              </select>
              <input
                type="number"
                placeholder="Suhu (°C)"
                value={cycleForm.temperature}
                onChange={(e) => setCycleForm(prev => ({ ...prev, temperature: e.target.value }))}
                className="p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Durasi (menit)"
                value={cycleForm.duration}
                onChange={(e) => setCycleForm(prev => ({ ...prev, duration: e.target.value }))}
                className="p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Nama Operator"
                value={cycleForm.operator}
                onChange={(e) => setCycleForm(prev => ({ ...prev, operator: e.target.value }))}
                className="p-2 border rounded"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={startSterilizationCycle}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Mulai Siklus
              </button>
              <button
                onClick={() => setShowCycleForm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Batal
              </button>
            </div>
          </div>
        )}

        <div className="mb-6">
          <h3 className="font-medium mb-3">Daftar Instrumen</h3>
          {Object.entries(instrumentsByType).map(([type, typeInstruments]) => (
            <div key={type} className="mb-4">
              <h4 className="text-sm font-medium text-gray-600 mb-2">{type}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {typeInstruments.map(instrument => (
                  <div key={instrument.id} className="p-3 bg-white border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h5 className="font-medium">{instrument.name}</h5>
                        <p className="text-xs text-gray-500">Qty: {instrument.quantity}</p>
                        {instrument.location && (
                          <p className="text-xs text-gray-500">Lokasi: {instrument.location}</p>
                        )}
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(instrument.status)}`}>
                        {instrument.status}
                      </span>
                    </div>
                    {instrument.lastSterilized && (
                      <p className="text-xs text-gray-500 mb-2">
                        Terakhir disterilkan: {new Date(instrument.lastSterilized).toLocaleDateString('id-ID')}
                      </p>
                    )}
                    <div className="flex gap-1">
                      <button
                        onClick={() => updateInstrumentStatus(instrument.id, 'dalam_proses')}
                        className="flex-1 px-2 py-1 bg-yellow-500 text-white rounded text-xs hover:bg-yellow-600"
                      >
                        Proses
                      </button>
                      <button
                        onClick={() => updateInstrumentStatus(instrument.id, 'steril')}
                        className="flex-1 px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                      >
                        Steril
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {instruments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Belum ada instrumen terdaftar
            </div>
          )}
        </div>
      </Card>

      <Card title="Riwayat Sterilisasi">
        <div className="space-y-3">
          {sterilizationCycles.map(cycle => (
            <div key={cycle.id} className="p-4 bg-white border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium">{cycle.cycleNumber}</h4>
                  <p className="text-sm text-gray-600">{cycle.sterilizer} - {cycle.method}</p>
                  <div className="flex gap-4 mt-1 text-xs text-gray-500">
                    <span>Suhu: {cycle.temperature}°C</span>
                    <span>Durasi: {cycle.duration} menit</span>
                    <span>Operator: {cycle.operator}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Mulai: {new Date(cycle.startTime).toLocaleString('id-ID')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs ${getCycleStatusColor(cycle.status)}`}>
                    {cycle.status}
                  </span>
                  {cycle.status === 'berlangsung' && (
                    <button
                      onClick={() => completeCycle(cycle.id)}
                      className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 flex items-center gap-1"
                    >
                      <CheckCircle size={14} />
                      Selesai
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {sterilizationCycles.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Belum ada riwayat sterilisasi
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default CssdManagement;
