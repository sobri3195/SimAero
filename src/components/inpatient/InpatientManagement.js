import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, updateDoc, doc, addDoc, getDocs } from '../../mockDb';
import { db } from '../../mockDb';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { UserPlus, FileText, LayoutGrid, BarChart3 } from 'lucide-react';
import Card from '../common/Card';
import BedLayout from './BedLayout';
import BORStatistics from './BORStatistics';

const InpatientManagement = () => {
  const { selectedFaskes } = useAuth();
  const { addNotification } = useApp();
  
  const [beds, setBeds] = useState([]);
  const [inpatients, setInpatients] = useState([]);
  const [dischargedPatients, setDischargedPatients] = useState([]);
  const [showAdmitForm, setShowAdmitForm] = useState(false);
  const [showNurseNotes, setShowNurseNotes] = useState(null);
  const [activeTab, setActiveTab] = useState('layout');
  const [selectedRoom, setSelectedRoom] = useState(null);
  
  const [admitForm, setAdmitForm] = useState({
    patientId: '',
    patientName: '',
    diagnosis: '',
    roomType: 'VIP',
    doctor: ''
  });

  const [nurseNote, setNurseNote] = useState({
    note: '',
    vitals: {
      bp: '',
      pulse: '',
      temp: '',
      resp: ''
    }
  });

  useEffect(() => {
    if (!selectedFaskes) return;

    const bedsQuery = query(
      collection(db, 'beds'),
      where('faskesId', '==', selectedFaskes)
    );

    const unsubscribeBeds = onSnapshot(bedsQuery, (snapshot) => {
      const bedsData = [];
      snapshot.forEach((doc) => {
        bedsData.push({ id: doc.id, ...doc.data() });
      });
      setBeds(bedsData);
    });

    const inpatientsQuery = query(
      collection(db, 'inpatients'),
      where('faskesId', '==', selectedFaskes),
      where('status', '==', 'aktif')
    );

    const unsubscribeInpatients = onSnapshot(inpatientsQuery, (snapshot) => {
      const inpatientsData = [];
      snapshot.forEach((doc) => {
        inpatientsData.push({ id: doc.id, ...doc.data() });
      });
      setInpatients(inpatientsData);
    });

    const loadDischargedPatients = async () => {
      const dischargedQuery = query(
        collection(db, 'inpatients'),
        where('faskesId', '==', selectedFaskes),
        where('status', '==', 'keluar')
      );
      const snapshot = await getDocs(dischargedQuery);
      const discharged = [];
      snapshot.forEach((doc) => {
        discharged.push({ id: doc.id, ...doc.data() });
      });
      setDischargedPatients(discharged);
    };

    loadDischargedPatients();

    return () => {
      unsubscribeBeds();
      unsubscribeInpatients();
    };
  }, [selectedFaskes]);

  const admitPatient = async () => {
    if (!admitForm.patientName || !admitForm.diagnosis) {
      addNotification({ type: 'warning', message: 'Nama pasien dan diagnosis harus diisi' });
      return;
    }

    try {
      const availableBed = beds.find(b => b.status === 'kosong' && b.roomType === admitForm.roomType);
      
      if (!availableBed) {
        addNotification({ type: 'error', message: `Tidak ada tempat tidur ${admitForm.roomType} yang tersedia` });
        return;
      }

      await addDoc(collection(db, 'inpatients'), {
        ...admitForm,
        faskesId: selectedFaskes,
        bedId: availableBed.id,
        roomNumber: availableBed.roomNumber,
        bedNumber: availableBed.bedNumber,
        admitDate: new Date().toISOString(),
        status: 'aktif',
        nurseNotes: []
      });

      await updateDoc(doc(db, 'beds', availableBed.id), {
        status: 'terisi',
        occupiedBy: admitForm.patientName
      });

      setAdmitForm({
        patientId: '',
        patientName: '',
        diagnosis: '',
        roomType: 'VIP',
        doctor: ''
      });
      setShowAdmitForm(false);
      addNotification({ type: 'success', message: 'Pasien berhasil dirawat inap' });
    } catch (error) {
      console.error('Error admitting patient:', error);
      addNotification({ type: 'error', message: 'Gagal merawat inap pasien' });
    }
  };

  const dischargePatient = async (inpatient) => {
    try {
      await updateDoc(doc(db, 'inpatients', inpatient.id), {
        status: 'keluar',
        dischargeDate: new Date().toISOString()
      });

      await updateDoc(doc(db, 'beds', inpatient.bedId), {
        status: 'kosong',
        occupiedBy: null
      });

      addNotification({ type: 'success', message: 'Pasien berhasil keluar' });
    } catch (error) {
      console.error('Error discharging patient:', error);
      addNotification({ type: 'error', message: 'Gagal mengeluarkan pasien' });
    }
  };

  const addNurseNote = async () => {
    if (!nurseNote.note || !showNurseNotes) return;

    try {
      const inpatient = inpatients.find(i => i.id === showNurseNotes);
      const notes = inpatient.nurseNotes || [];
      
      notes.push({
        timestamp: new Date().toISOString(),
        note: nurseNote.note,
        vitals: nurseNote.vitals,
        nurse: 'Perawat Jaga'
      });

      await updateDoc(doc(db, 'inpatients', showNurseNotes), {
        nurseNotes: notes
      });

      setNurseNote({
        note: '',
        vitals: { bp: '', pulse: '', temp: '', resp: '' }
      });
      addNotification({ type: 'success', message: 'Catatan perawat ditambahkan' });
    } catch (error) {
      console.error('Error adding nurse note:', error);
    }
  };

  const moveBed = async (inpatient, targetBed) => {
    try {
      const oldBed = beds.find(b => b.id === inpatient.bedId);

      await updateDoc(doc(db, 'beds', oldBed.id), {
        status: 'dibersihkan',
        occupiedBy: null
      });

      await updateDoc(doc(db, 'beds', targetBed.id), {
        status: 'terisi',
        occupiedBy: inpatient.patientName
      });

      await updateDoc(doc(db, 'inpatients', inpatient.id), {
        bedId: targetBed.id,
        roomNumber: targetBed.roomNumber,
        bedNumber: targetBed.bedNumber,
        transferHistory: [...(inpatient.transferHistory || []), {
          from: `${oldBed.roomNumber} - ${oldBed.bedNumber}`,
          to: `${targetBed.roomNumber} - ${targetBed.bedNumber}`,
          timestamp: new Date().toISOString()
        }]
      });

      addNotification({ type: 'success', message: 'Pasien berhasil dipindahkan' });
    } catch (error) {
      console.error('Error moving patient:', error);
      addNotification({ type: 'error', message: 'Gagal memindahkan pasien' });
    }
  };

  const setBedStatus = async (bedId, status) => {
    try {
      await updateDoc(doc(db, 'beds', bedId), { status });
      addNotification({ type: 'success', message: 'Status tempat tidur berhasil diupdate' });
    } catch (error) {
      console.error('Error updating bed status:', error);
      addNotification({ type: 'error', message: 'Gagal mengupdate status' });
    }
  };

  const roomTypes = [...new Set(beds.map(b => b.roomType))].filter(Boolean);

  return (
    <div className="space-y-6">
      <Card 
        title="Manajemen Rawat Inap"
        actions={
          <button
            onClick={() => setShowAdmitForm(!showAdmitForm)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
          >
            <UserPlus size={16} />
            Rawat Inap Pasien
          </button>
        }
      >
        <div className="mb-6 flex border-b">
          <button
            onClick={() => setActiveTab('layout')}
            className={`px-4 py-2 font-medium flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'layout' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            <LayoutGrid size={18} />
            Denah Tempat Tidur
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 font-medium flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'list' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            <FileText size={18} />
            Daftar Pasien
          </button>
          <button
            onClick={() => setActiveTab('statistics')}
            className={`px-4 py-2 font-medium flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'statistics' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            <BarChart3 size={18} />
            Statistik BOR
          </button>
        </div>

        {showAdmitForm && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-3">Form Rawat Inap</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Nama Pasien"
                value={admitForm.patientName}
                onChange={(e) => setAdmitForm(prev => ({ ...prev, patientName: e.target.value }))}
                className="p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Dokter Penanggung Jawab"
                value={admitForm.doctor}
                onChange={(e) => setAdmitForm(prev => ({ ...prev, doctor: e.target.value }))}
                className="p-2 border rounded"
              />
              <select
                value={admitForm.roomType}
                onChange={(e) => setAdmitForm(prev => ({ ...prev, roomType: e.target.value }))}
                className="p-2 border rounded"
              >
                <option value="VIP">VIP</option>
                <option value="Kelas 1">Kelas 1</option>
                <option value="Kelas 2">Kelas 2</option>
                <option value="Kelas 3">Kelas 3</option>
                <option value="ICU">ICU</option>
              </select>
              <input
                type="text"
                placeholder="Diagnosis"
                value={admitForm.diagnosis}
                onChange={(e) => setAdmitForm(prev => ({ ...prev, diagnosis: e.target.value }))}
                className="p-2 border rounded"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={admitPatient}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Rawat Inap
              </button>
              <button
                onClick={() => setShowAdmitForm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Batal
              </button>
            </div>
          </div>
        )}

        {activeTab === 'layout' && (
          <div>
            {roomTypes.length > 0 && (
              <div className="mb-4 flex gap-2 flex-wrap">
                <button
                  onClick={() => setSelectedRoom(null)}
                  className={`px-3 py-1 rounded text-sm ${
                    selectedRoom === null 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Semua Ruangan
                </button>
                {roomTypes.map(roomType => (
                  <button
                    key={roomType}
                    onClick={() => setSelectedRoom(roomType)}
                    className={`px-3 py-1 rounded text-sm ${
                      selectedRoom === roomType 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {roomType}
                  </button>
                ))}
              </div>
            )}
            <BedLayout 
              beds={beds}
              inpatients={inpatients}
              onMoveBed={moveBed}
              onDischarge={dischargePatient}
              onSetBedStatus={setBedStatus}
              selectedRoom={selectedRoom}
            />
          </div>
        )}

        {activeTab === 'statistics' && (
          <BORStatistics 
            beds={beds}
            inpatients={inpatients}
            dischargedPatients={dischargedPatients}
          />
        )}

        {activeTab === 'list' && (
          <div>
            <h3 className="font-medium mb-3">Pasien Rawat Inap Aktif</h3>
          <div className="space-y-3">
            {inpatients.map(inpatient => (
              <div key={inpatient.id} className="p-4 bg-white border rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium text-lg">{inpatient.patientName}</h4>
                    <p className="text-sm text-gray-600">{inpatient.diagnosis}</p>
                    <div className="flex gap-4 mt-2 text-xs text-gray-500">
                      <span>Ruang: {inpatient.roomNumber} - {inpatient.bedNumber}</span>
                      <span>DPJP: {inpatient.doctor}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowNurseNotes(inpatient.id)}
                      className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 flex items-center gap-1"
                    >
                      <FileText size={14} />
                      Catatan
                    </button>
                    <button
                      onClick={() => dischargePatient(inpatient)}
                      className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                    >
                      Keluar
                    </button>
                  </div>
                </div>
                
                {showNurseNotes === inpatient.id && (
                  <div className="mt-4 p-3 bg-gray-50 rounded">
                    <h5 className="font-medium mb-2">Catatan Perawat</h5>
                    
                    <div className="mb-3 space-y-2 max-h-40 overflow-y-auto">
                      {(inpatient.nurseNotes || []).map((note, idx) => (
                        <div key={idx} className="text-sm p-2 bg-white rounded">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>{note.nurse}</span>
                            <span>{new Date(note.timestamp).toLocaleString('id-ID')}</span>
                          </div>
                          <p>{note.note}</p>
                          {note.vitals.bp && (
                            <div className="text-xs text-gray-600 mt-1">
                              TD: {note.vitals.bp} | Nadi: {note.vitals.pulse} | Suhu: {note.vitals.temp}°C | Resp: {note.vitals.resp}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <textarea
                        placeholder="Catatan perawat..."
                        value={nurseNote.note}
                        onChange={(e) => setNurseNote(prev => ({ ...prev, note: e.target.value }))}
                        className="w-full p-2 border rounded text-sm"
                        rows="2"
                      />
                      <div className="grid grid-cols-4 gap-2">
                        <input
                          type="text"
                          placeholder="TD"
                          value={nurseNote.vitals.bp}
                          onChange={(e) => setNurseNote(prev => ({ ...prev, vitals: { ...prev.vitals, bp: e.target.value }}))}
                          className="p-2 border rounded text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Nadi"
                          value={nurseNote.vitals.pulse}
                          onChange={(e) => setNurseNote(prev => ({ ...prev, vitals: { ...prev.vitals, pulse: e.target.value }}))}
                          className="p-2 border rounded text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Suhu"
                          value={nurseNote.vitals.temp}
                          onChange={(e) => setNurseNote(prev => ({ ...prev, vitals: { ...prev.vitals, temp: e.target.value }}))}
                          className="p-2 border rounded text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Resp"
                          value={nurseNote.vitals.resp}
                          onChange={(e) => setNurseNote(prev => ({ ...prev, vitals: { ...prev.vitals, resp: e.target.value }}))}
                          className="p-2 border rounded text-sm"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={addNurseNote}
                          className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                        >
                          Simpan Catatan
                        </button>
                        <button
                          onClick={() => setShowNurseNotes(null)}
                          className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                        >
                          Tutup
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {inpatients.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Tidak ada pasien rawat inap aktif
              </div>
            )}
          </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default InpatientManagement;
