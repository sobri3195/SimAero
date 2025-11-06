import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, deleteDoc } from '../../mockDb';
import { db } from '../../mockDb';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { Plus, Edit, Trash2, Calendar, Users, Clock } from 'lucide-react';
import Card from '../common/Card';

const PoliManagement = () => {
  const { selectedFaskes } = useAuth();
  const { addNotification } = useApp();
  
  const [polis, setPolis] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [activeTab, setActiveTab] = useState('polis');
  const [showAddPoli, setShowAddPoli] = useState(false);
  const [showAddSchedule, setShowAddSchedule] = useState(false);
  const [editingPoli, setEditingPoli] = useState(null);

  const [poliForm, setPoliForm] = useState({
    nama: '',
    tipe: 'umum',
    kuotaHarian: '50',
    jamBuka: '08:00',
    jamTutup: '14:00',
    loket: '1',
    ruangan: '',
    status: 'aktif'
  });

  const [scheduleForm, setScheduleForm] = useState({
    poliId: '',
    namaPoliDisplay: '',
    namaDokter: '',
    nrpDokter: '',
    spesialisasi: '',
    hari: 'Senin',
    jamMulai: '08:00',
    jamSelesai: '12:00',
    kuotaPasien: '20'
  });

  const poliTypes = [
    'umum',
    'gigi',
    'kia',
    'mtbs',
    'ptm',
    'mata',
    'tht',
    'fisioterapi'
  ];

  const daysOfWeek = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  useEffect(() => {
    if (!selectedFaskes) return;

    const polisQuery = query(collection(db, 'polis'), where('faskesId', '==', selectedFaskes));
    const schedulesQuery = query(collection(db, 'poli_schedules'), where('faskesId', '==', selectedFaskes));

    const unsubPolis = onSnapshot(polisQuery, (snapshot) => {
      const data = [];
      snapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));
      setPolis(data);
    });

    const unsubSchedules = onSnapshot(schedulesQuery, (snapshot) => {
      const data = [];
      snapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));
      setSchedules(data);
    });

    return () => {
      unsubPolis();
      unsubSchedules();
    };
  }, [selectedFaskes]);

  const handleAddPoli = async () => {
    if (!poliForm.nama) {
      addNotification({ type: 'warning', message: 'Nama poli harus diisi' });
      return;
    }

    try {
      if (editingPoli) {
        await updateDoc(doc(db, 'polis', editingPoli.id), {
          ...poliForm,
          updatedAt: new Date().toISOString()
        });
        addNotification({ type: 'success', message: 'Poli berhasil diupdate' });
      } else {
        await addDoc(collection(db, 'polis'), {
          ...poliForm,
          faskesId: selectedFaskes,
          createdAt: new Date().toISOString()
        });
        addNotification({ type: 'success', message: 'Poli berhasil ditambahkan' });
      }
      setPoliForm({ nama: '', tipe: 'umum', kuotaHarian: '50', jamBuka: '08:00', jamTutup: '14:00', loket: '1', ruangan: '', status: 'aktif' });
      setShowAddPoli(false);
      setEditingPoli(null);
    } catch (error) {
      console.error('Error saving poli:', error);
      addNotification({ type: 'error', message: 'Gagal menyimpan poli' });
    }
  };

  const handleEditPoli = (poli) => {
    setEditingPoli(poli);
    setPoliForm({
      nama: poli.nama,
      tipe: poli.tipe,
      kuotaHarian: poli.kuotaHarian,
      jamBuka: poli.jamBuka,
      jamTutup: poli.jamTutup,
      loket: poli.loket,
      ruangan: poli.ruangan || '',
      status: poli.status
    });
    setShowAddPoli(true);
  };

  const handleDeletePoli = async (poliId) => {
    if (window.confirm('Yakin ingin menghapus poli ini?')) {
      try {
        await deleteDoc(doc(db, 'polis', poliId));
        addNotification({ type: 'success', message: 'Poli berhasil dihapus' });
      } catch (error) {
        console.error('Error deleting poli:', error);
        addNotification({ type: 'error', message: 'Gagal menghapus poli' });
      }
    }
  };

  const handleAddSchedule = async () => {
    if (!scheduleForm.poliId || !scheduleForm.namaDokter) {
      addNotification({ type: 'warning', message: 'Poli dan nama dokter harus diisi' });
      return;
    }

    try {
      await addDoc(collection(db, 'poli_schedules'), {
        ...scheduleForm,
        faskesId: selectedFaskes,
        createdAt: new Date().toISOString()
      });
      setScheduleForm({ poliId: '', namaPoliDisplay: '', namaDokter: '', nrpDokter: '', spesialisasi: '', hari: 'Senin', jamMulai: '08:00', jamSelesai: '12:00', kuotaPasien: '20' });
      setShowAddSchedule(false);
      addNotification({ type: 'success', message: 'Jadwal berhasil ditambahkan' });
    } catch (error) {
      console.error('Error adding schedule:', error);
      addNotification({ type: 'error', message: 'Gagal menambahkan jadwal' });
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    if (window.confirm('Yakin ingin menghapus jadwal ini?')) {
      try {
        await deleteDoc(doc(db, 'poli_schedules', scheduleId));
        addNotification({ type: 'success', message: 'Jadwal berhasil dihapus' });
      } catch (error) {
        console.error('Error deleting schedule:', error);
        addNotification({ type: 'error', message: 'Gagal menghapus jadwal' });
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card title="Manajemen Poli Rawat Jalan">
        <div className="mb-4 flex gap-2 border-b">
          <button 
            onClick={() => setActiveTab('polis')}
            className={`px-4 py-2 ${activeTab === 'polis' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          >
            <Users className="inline mr-2" size={16} />
            Konfigurasi Poli
          </button>
          <button 
            onClick={() => setActiveTab('schedules')}
            className={`px-4 py-2 ${activeTab === 'schedules' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          >
            <Calendar className="inline mr-2" size={16} />
            Jadwal Dokter
          </button>
        </div>

        {activeTab === 'polis' && (
          <div>
            <div className="mb-4 flex justify-end">
              <button
                onClick={() => {
                  setShowAddPoli(!showAddPoli);
                  setEditingPoli(null);
                  setPoliForm({ nama: '', tipe: 'umum', kuotaHarian: '50', jamBuka: '08:00', jamTutup: '14:00', loket: '1', ruangan: '', status: 'aktif' });
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
              >
                <Plus size={16} />
                Tambah Poli
              </button>
            </div>

            {showAddPoli && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-3">{editingPoli ? 'Edit Poli' : 'Tambah Poli Baru'}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nama Poli</label>
                    <input
                      type="text"
                      value={poliForm.nama}
                      onChange={(e) => setPoliForm(prev => ({ ...prev, nama: e.target.value }))}
                      className="w-full p-2 border rounded"
                      placeholder="e.g., Poli Umum"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Tipe Poli</label>
                    <select
                      value={poliForm.tipe}
                      onChange={(e) => setPoliForm(prev => ({ ...prev, tipe: e.target.value }))}
                      className="w-full p-2 border rounded"
                    >
                      {poliTypes.map((type, idx) => (
                        <option key={idx} value={type}>{type.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Kuota Harian</label>
                    <input
                      type="number"
                      value={poliForm.kuotaHarian}
                      onChange={(e) => setPoliForm(prev => ({ ...prev, kuotaHarian: e.target.value }))}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Loket</label>
                    <input
                      type="text"
                      value={poliForm.loket}
                      onChange={(e) => setPoliForm(prev => ({ ...prev, loket: e.target.value }))}
                      className="w-full p-2 border rounded"
                      placeholder="Nomor loket"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Jam Buka</label>
                    <input
                      type="time"
                      value={poliForm.jamBuka}
                      onChange={(e) => setPoliForm(prev => ({ ...prev, jamBuka: e.target.value }))}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Jam Tutup</label>
                    <input
                      type="time"
                      value={poliForm.jamTutup}
                      onChange={(e) => setPoliForm(prev => ({ ...prev, jamTutup: e.target.value }))}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Ruangan</label>
                    <input
                      type="text"
                      value={poliForm.ruangan}
                      onChange={(e) => setPoliForm(prev => ({ ...prev, ruangan: e.target.value }))}
                      className="w-full p-2 border rounded"
                      placeholder="Nomor/nama ruangan"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select
                      value={poliForm.status}
                      onChange={(e) => setPoliForm(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full p-2 border rounded"
                    >
                      <option value="aktif">Aktif</option>
                      <option value="nonaktif">Non-aktif</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleAddPoli} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                    {editingPoli ? 'Update' : 'Simpan'}
                  </button>
                  <button onClick={() => { setShowAddPoli(false); setEditingPoli(null); }} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
                    Batal
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {polis.map(poli => (
                <div key={poli.id} className="p-4 bg-white border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-lg">{poli.nama}</h4>
                        <span className={`text-xs px-2 py-1 rounded ${poli.status === 'aktif' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {poli.status}
                        </span>
                        <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
                          {poli.tipe.toUpperCase()}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Users size={14} />
                          Kuota: {poli.kuotaHarian}/hari
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          {poli.jamBuka} - {poli.jamTutup}
                        </div>
                        <div>Loket: {poli.loket}</div>
                        {poli.ruangan && <div>Ruangan: {poli.ruangan}</div>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEditPoli(poli)} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDeletePoli(poli.id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {polis.length === 0 && (
                <div className="text-center py-8 text-gray-500">Belum ada poli terdaftar</div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'schedules' && (
          <div>
            <div className="mb-4 flex justify-end">
              <button
                onClick={() => setShowAddSchedule(!showAddSchedule)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
              >
                <Plus size={16} />
                Tambah Jadwal
              </button>
            </div>

            {showAddSchedule && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-3">Tambah Jadwal Dokter</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Poli</label>
                    <select
                      value={scheduleForm.poliId}
                      onChange={(e) => {
                        const selectedPoli = polis.find(p => p.id === e.target.value);
                        setScheduleForm(prev => ({ 
                          ...prev, 
                          poliId: e.target.value,
                          namaPoliDisplay: selectedPoli ? selectedPoli.nama : ''
                        }));
                      }}
                      className="w-full p-2 border rounded"
                    >
                      <option value="">Pilih Poli...</option>
                      {polis.filter(p => p.status === 'aktif').map(poli => (
                        <option key={poli.id} value={poli.id}>{poli.nama}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Nama Dokter</label>
                    <input
                      type="text"
                      value={scheduleForm.namaDokter}
                      onChange={(e) => setScheduleForm(prev => ({ ...prev, namaDokter: e.target.value }))}
                      className="w-full p-2 border rounded"
                      placeholder="dr. Nama Dokter"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">NRP Dokter (Opsional)</label>
                    <input
                      type="text"
                      value={scheduleForm.nrpDokter}
                      onChange={(e) => setScheduleForm(prev => ({ ...prev, nrpDokter: e.target.value }))}
                      className="w-full p-2 border rounded"
                      placeholder="NRP dokter"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Spesialisasi</label>
                    <input
                      type="text"
                      value={scheduleForm.spesialisasi}
                      onChange={(e) => setScheduleForm(prev => ({ ...prev, spesialisasi: e.target.value }))}
                      className="w-full p-2 border rounded"
                      placeholder="Sp.U, Sp.A, dll"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Hari</label>
                    <select
                      value={scheduleForm.hari}
                      onChange={(e) => setScheduleForm(prev => ({ ...prev, hari: e.target.value }))}
                      className="w-full p-2 border rounded"
                    >
                      {daysOfWeek.map((day, idx) => (
                        <option key={idx} value={day}>{day}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Kuota Pasien</label>
                    <input
                      type="number"
                      value={scheduleForm.kuotaPasien}
                      onChange={(e) => setScheduleForm(prev => ({ ...prev, kuotaPasien: e.target.value }))}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Jam Mulai</label>
                    <input
                      type="time"
                      value={scheduleForm.jamMulai}
                      onChange={(e) => setScheduleForm(prev => ({ ...prev, jamMulai: e.target.value }))}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Jam Selesai</label>
                    <input
                      type="time"
                      value={scheduleForm.jamSelesai}
                      onChange={(e) => setScheduleForm(prev => ({ ...prev, jamSelesai: e.target.value }))}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleAddSchedule} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                    Simpan
                  </button>
                  <button onClick={() => setShowAddSchedule(false)} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
                    Batal
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {daysOfWeek.map(day => {
                const daySchedules = schedules.filter(s => s.hari === day);
                if (daySchedules.length === 0) return null;
                
                return (
                  <div key={day} className="mb-4">
                    <h4 className="font-medium mb-2 text-lg">{day}</h4>
                    <div className="space-y-2">
                      {daySchedules.map(schedule => (
                        <div key={schedule.id} className="p-3 bg-white border rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-medium">{schedule.namaDokter} {schedule.spesialisasi && `(${schedule.spesialisasi})`}</h5>
                              <p className="text-sm text-gray-600">{schedule.namaPoliDisplay}</p>
                              <div className="flex gap-4 mt-1 text-xs text-gray-500">
                                <span>⏰ {schedule.jamMulai} - {schedule.jamSelesai}</span>
                                <span>👥 Kuota: {schedule.kuotaPasien} pasien</span>
                                {schedule.nrpDokter && <span>🪪 NRP: {schedule.nrpDokter}</span>}
                              </div>
                            </div>
                            <button onClick={() => handleDeleteSchedule(schedule.id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              {schedules.length === 0 && (
                <div className="text-center py-8 text-gray-500">Belum ada jadwal dokter</div>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default PoliManagement;
