import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, updateDoc, doc, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { aiService } from '../../services/aiService';
import { Clock, CheckCircle, Sparkles } from 'lucide-react';
import Card from '../common/Card';

const TriageBoard = () => {
  const { selectedFaskes } = useAuth();
  const { addNotification } = useApp();
  
  const [patients, setPatients] = useState({
    RESUSITASI: [],
    DARURAT: [],
    MENDESAK: [],
    TIDAK_MENDESAK: []
  });

  const [newPatient, setNewPatient] = useState({
    nama: '',
    keluhan: '',
    tekananDarah: '',
    nadi: '',
    respirasi: '',
    suhu: ''
  });

  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (!selectedFaskes) return;

    const q = query(
      collection(db, 'igd_patients'),
      where('faskesId', '==', selectedFaskes),
      where('status', '==', 'aktif')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const patientsByTriage = {
        RESUSITASI: [],
        DARURAT: [],
        MENDESAK: [],
        TIDAK_MENDESAK: []
      };

      snapshot.forEach((doc) => {
        const data = { id: doc.id, ...doc.data() };
        if (patientsByTriage[data.triase]) {
          patientsByTriage[data.triase].push(data);
        }
      });

      setPatients(patientsByTriage);
    });

    return () => unsubscribe();
  }, [selectedFaskes]);

  const getTriageColor = (level) => {
    switch (level) {
      case 'RESUSITASI': return { bg: 'bg-black', text: 'text-white', badge: 'bg-black' };
      case 'DARURAT': return { bg: 'bg-red-100', text: 'text-red-900', badge: 'bg-red-500' };
      case 'MENDESAK': return { bg: 'bg-yellow-100', text: 'text-yellow-900', badge: 'bg-yellow-500' };
      case 'TIDAK_MENDESAK': return { bg: 'bg-green-100', text: 'text-green-900', badge: 'bg-green-500' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-900', badge: 'bg-gray-500' };
    }
  };

  const getSuggestedTriage = async () => {
    const vitals = {
      tekananDarah: newPatient.tekananDarah,
      nadi: newPatient.nadi,
      respirasi: newPatient.respirasi,
      suhu: newPatient.suhu
    };

    const suggestion = await aiService.suggestTriage(newPatient.keluhan, vitals);
    
    if (suggestion) {
      addNotification({ 
        type: 'info', 
        message: `Saran AI: ${suggestion}` 
      });
    }
  };

  const addPatient = async (triaseLevel) => {
    if (!newPatient.nama || !newPatient.keluhan) {
      addNotification({ type: 'warning', message: 'Nama dan keluhan harus diisi' });
      return;
    }

    try {
      await addDoc(collection(db, 'igd_patients'), {
        ...newPatient,
        faskesId: selectedFaskes,
        triase: triaseLevel,
        status: 'aktif',
        waktuMasuk: new Date(),
        createdAt: new Date()
      });

      setNewPatient({
        nama: '',
        keluhan: '',
        tekananDarah: '',
        nadi: '',
        respirasi: '',
        suhu: ''
      });
      setShowAddForm(false);
      addNotification({ type: 'success', message: 'Pasien berhasil ditambahkan' });
    } catch (error) {
      console.error('Error adding patient:', error);
      addNotification({ type: 'error', message: 'Gagal menambahkan pasien' });
    }
  };

  // Function for future drag-and-drop triage update
  // const updateTriage = async (patientId, newTriase) => {
  //   try {
  //     await updateDoc(doc(db, 'igd_patients', patientId), {
  //       triase: newTriase,
  //       updatedAt: new Date()
  //     });
  //     addNotification({ type: 'success', message: 'Triase berhasil diupdate' });
  //   } catch (error) {
  //     console.error('Error updating triage:', error);
  //   }
  // };

  const completePatient = async (patientId) => {
    try {
      await updateDoc(doc(db, 'igd_patients', patientId), {
        status: 'selesai',
        waktuSelesai: new Date()
      });
      addNotification({ type: 'success', message: 'Pasien selesai ditangani' });
    } catch (error) {
      console.error('Error completing patient:', error);
    }
  };

  return (
    <div>
      <Card 
        title="Papan Triase Digital IGD"
        actions={
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            + Tambah Pasien
          </button>
        }
      >
        {showAddForm && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-3">Tambah Pasien Baru</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Nama Pasien"
                value={newPatient.nama}
                onChange={(e) => setNewPatient(prev => ({ ...prev, nama: e.target.value }))}
                className="p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Keluhan Utama"
                value={newPatient.keluhan}
                onChange={(e) => setNewPatient(prev => ({ ...prev, keluhan: e.target.value }))}
                className="p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Tekanan Darah (mmHg)"
                value={newPatient.tekananDarah}
                onChange={(e) => setNewPatient(prev => ({ ...prev, tekananDarah: e.target.value }))}
                className="p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Nadi (x/menit)"
                value={newPatient.nadi}
                onChange={(e) => setNewPatient(prev => ({ ...prev, nadi: e.target.value }))}
                className="p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Respirasi (x/menit)"
                value={newPatient.respirasi}
                onChange={(e) => setNewPatient(prev => ({ ...prev, respirasi: e.target.value }))}
                className="p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Suhu (°C)"
                value={newPatient.suhu}
                onChange={(e) => setNewPatient(prev => ({ ...prev, suhu: e.target.value }))}
                className="p-2 border rounded"
              />
            </div>
            <div className="flex gap-2 mb-4">
              <button
                onClick={getSuggestedTriage}
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 flex items-center gap-2"
              >
                <Sparkles size={16} />
                Saran Triase AI
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => addPatient('RESUSITASI')}
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
              >
                + Resusitasi
              </button>
              <button
                onClick={() => addPatient('DARURAT')}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                + Darurat
              </button>
              <button
                onClick={() => addPatient('MENDESAK')}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                + Mendesak
              </button>
              <button
                onClick={() => addPatient('TIDAK_MENDESAK')}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                + Tidak Mendesak
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(patients).map(([level, patientList]) => {
            const colors = getTriageColor(level);
            return (
              <div key={level} className={`${colors.bg} rounded-lg p-4 min-h-[300px]`}>
                <div className="flex items-center gap-2 mb-4">
                  <div className={`${colors.badge} w-3 h-3 rounded-full`}></div>
                  <h3 className={`font-bold ${colors.text}`}>{level}</h3>
                  <span className={`ml-auto ${colors.text} opacity-75`}>
                    {patientList.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {patientList.map((patient) => (
                    <div 
                      key={patient.id}
                      className="bg-white p-3 rounded-lg shadow-sm"
                      draggable
                    >
                      <h4 className="font-medium mb-1">{patient.nama}</h4>
                      <p className="text-sm text-gray-600 mb-2">{patient.keluhan}</p>
                      
                      {patient.tekananDarah && (
                        <div className="text-xs text-gray-500 mb-2">
                          <div>TD: {patient.tekananDarah}</div>
                          <div>Nadi: {patient.nadi} | Resp: {patient.respirasi} | Suhu: {patient.suhu}</div>
                        </div>
                      )}

                      <div className="flex items-center text-xs text-gray-500 mb-2">
                        <Clock size={12} className="mr-1" />
                        {new Date(patient.waktuMasuk?.toDate()).toLocaleTimeString('id-ID')}
                      </div>

                      <div className="flex gap-1">
                        <button
                          onClick={() => completePatient(patient.id)}
                          className="flex-1 px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                          title="Selesai"
                        >
                          <CheckCircle size={14} className="mx-auto" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default TriageBoard;
