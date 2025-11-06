import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, updateDoc, doc } from '../../mockDb';
import { db } from '../../mockDb';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { Search, ArrowRightLeft, Clock, AlertCircle, Filter, Users, ExternalLink, Tv } from 'lucide-react';
import Card from '../common/Card';

const QueueManagement = () => {
  const { selectedFaskes } = useAuth();
  const { addNotification } = useApp();
  const [queues, setQueues] = useState([]);
  const [polis, setPolis] = useState([]);
  const [selectedPoli, setSelectedPoli] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [targetPoli, setTargetPoli] = useState('');

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
      const queueData = [];
      const poliSet = new Set();
      
      snapshot.forEach((doc) => {
        const data = { id: doc.id, ...doc.data() };
        queueData.push(data);
        poliSet.add(data.poliTujuan);
      });

      queueData.sort((a, b) => {
        if (a.poliTujuan !== b.poliTujuan) {
          return a.poliTujuan.localeCompare(b.poliTujuan);
        }
        return a.nomorAntrean - b.nomorAntrean;
      });

      setQueues(queueData);
      setPolis(Array.from(poliSet).sort());
    });

    return () => unsubscribe();
  }, [selectedFaskes]);

  const updateStatus = async (queueId, newStatus) => {
    try {
      await updateDoc(doc(db, 'registrations', queueId), {
        status: newStatus,
        updatedAt: new Date()
      });
      addNotification({ 
        type: 'success', 
        message: `Status antrean berhasil diubah menjadi ${newStatus}` 
      });
    } catch (error) {
      console.error('Error updating status:', error);
      addNotification({ type: 'error', message: 'Gagal mengubah status antrean' });
    }
  };

  const openTransferModal = (patient) => {
    setSelectedPatient(patient);
    setTargetPoli('');
    setTransferModalOpen(true);
  };

  const handleTransferPoli = async () => {
    if (!targetPoli || !selectedPatient) {
      addNotification({ type: 'warning', message: 'Pilih poli tujuan' });
      return;
    }

    if (targetPoli === selectedPatient.poliTujuan) {
      addNotification({ type: 'warning', message: 'Poli tujuan sama dengan poli saat ini' });
      return;
    }

    try {
      // Get the maximum queue number for target poli
      const targetPoliQueues = queues.filter(q => q.poliTujuan === targetPoli);
      const maxQueueNumber = targetPoliQueues.length > 0 
        ? Math.max(...targetPoliQueues.map(q => q.nomorAntrean))
        : 0;

      await updateDoc(doc(db, 'registrations', selectedPatient.id), {
        poliTujuan: targetPoli,
        nomorAntrean: maxQueueNumber + 1,
        status: 'menunggu',
        transferredFrom: selectedPatient.poliTujuan,
        transferredAt: new Date(),
        updatedAt: new Date()
      });

      addNotification({ 
        type: 'success', 
        message: `Pasien ${selectedPatient.nama} berhasil dipindahkan ke ${targetPoli}` 
      });
      setTransferModalOpen(false);
      setSelectedPatient(null);
      setTargetPoli('');
    } catch (error) {
      console.error('Error transferring patient:', error);
      addNotification({ type: 'error', message: 'Gagal memindahkan pasien' });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'menunggu': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'dipanggil': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'dilayani': return 'bg-green-100 text-green-800 border-green-300';
      case 'selesai': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const calculateWaitTime = (tanggalDaftar) => {
    const now = new Date();
    const registered = new Date(tanggalDaftar);
    const diffMinutes = Math.floor((now - registered) / 1000 / 60);
    return diffMinutes;
  };

  const getWaitTimeColor = (minutes) => {
    if (minutes < 15) return 'text-green-600';
    if (minutes < 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSLAStatus = (minutes) => {
    if (minutes < 15) return { text: 'Normal', color: 'bg-green-100 text-green-800' };
    if (minutes < 30) return { text: 'Perhatian', color: 'bg-yellow-100 text-yellow-800' };
    return { text: 'Kritis', color: 'bg-red-100 text-red-800' };
  };

  const filteredQueues = queues.filter(q => {
    const matchPoli = selectedPoli === 'all' || q.poliTujuan === selectedPoli;
    const matchStatus = selectedStatus === 'all' || q.status === selectedStatus;
    const matchSearch = searchTerm === '' || 
      q.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.nik?.includes(searchTerm) ||
      q.nrp?.includes(searchTerm) ||
      q.nomorAntrean?.toString().includes(searchTerm);
    return matchPoli && matchStatus && matchSearch;
  });

  const getStatusCounts = () => {
    const counts = {
      total: queues.length,
      menunggu: queues.filter(q => q.status === 'menunggu').length,
      dipanggil: queues.filter(q => q.status === 'dipanggil').length,
      dilayani: queues.filter(q => q.status === 'dilayani').length,
      selesai: queues.filter(q => q.status === 'selesai').length,
    };
    return counts;
  };

  const statusCounts = getStatusCounts();

  const openMonitorWindow = (poliName) => {
    const url = `/queue-monitor/${encodeURIComponent(poliName)}`;
    window.open(url, '_blank', 'width=1920,height=1080,fullscreen=yes');
  };

  return (
    <div>
      {/* Quick Monitor Access */}
      {polis.length > 0 && (
        <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3 mb-4">
            <Tv className="text-blue-600" size={24} />
            <h3 className="font-bold text-lg">Monitor Display - Buka di Layar Terpisah</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {polis.map((poli, idx) => (
              <button
                key={idx}
                onClick={() => openMonitorWindow(poli)}
                className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2 text-sm"
              >
                <ExternalLink size={14} />
                {poli}
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <Card className="text-center">
          <Users className="mx-auto mb-2 text-gray-600" size={24} />
          <div className="text-2xl font-bold">{statusCounts.total}</div>
          <div className="text-xs text-gray-600">Total Antrean</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-yellow-600">{statusCounts.menunggu}</div>
          <div className="text-xs text-gray-600">Menunggu</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-blue-600">{statusCounts.dipanggil}</div>
          <div className="text-xs text-gray-600">Dipanggil</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-green-600">{statusCounts.dilayani}</div>
          <div className="text-xs text-gray-600">Dilayani</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-gray-600">{statusCounts.selesai}</div>
          <div className="text-xs text-gray-600">Selesai</div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              <Search size={16} className="inline mr-1" />
              Cari Pasien
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nama, NIK, NRP, No. Antrean"
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              <Filter size={16} className="inline mr-1" />
              Filter Poli
            </label>
            <select
              value={selectedPoli}
              onChange={(e) => setSelectedPoli(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="all">Semua Poli ({queues.length})</option>
              {polis.map((poli, idx) => (
                <option key={idx} value={poli}>
                  {poli} ({queues.filter(q => q.poliTujuan === poli).length})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              <Filter size={16} className="inline mr-1" />
              Filter Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="all">Semua Status</option>
              <option value="menunggu">Menunggu</option>
              <option value="dipanggil">Dipanggil</option>
              <option value="dilayani">Dilayani</option>
              <option value="selesai">Selesai</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSelectedPoli('all');
                setSelectedStatus('all');
                setSearchTerm('');
              }}
              className="w-full p-2 border rounded hover:bg-gray-50"
            >
              Reset Filter
            </button>
          </div>
        </div>
      </Card>

      {/* Queue List */}
      <Card title={`Daftar Antrean (${filteredQueues.length})`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left p-3 text-sm font-medium">No. Antrean</th>
                <th className="text-left p-3 text-sm font-medium">Poli</th>
                <th className="text-left p-3 text-sm font-medium">Nama Pasien</th>
                <th className="text-left p-3 text-sm font-medium">NIK/NRP</th>
                <th className="text-left p-3 text-sm font-medium">Keluhan</th>
                <th className="text-left p-3 text-sm font-medium">Waktu Tunggu</th>
                <th className="text-left p-3 text-sm font-medium">Status</th>
                <th className="text-center p-3 text-sm font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredQueues.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center p-8 text-gray-500">
                    Tidak ada antrean ditemukan
                  </td>
                </tr>
              ) : (
                filteredQueues.map((patient) => {
                  const waitTime = calculateWaitTime(patient.tanggalDaftar);
                  const slaStatus = getSLAStatus(waitTime);
                  return (
                    <tr key={patient.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div className="text-2xl font-bold text-blue-600">
                          {patient.nomorAntrean}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="font-medium text-sm">{patient.poliTujuan}</div>
                        {patient.transferredFrom && (
                          <div className="text-xs text-gray-500">
                            ↪ dari {patient.transferredFrom}
                          </div>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="font-medium">{patient.nama}</div>
                        <div className="text-xs text-gray-500">
                          {patient.statusPasien === 'prajurit' && '👤 Prajurit'}
                          {patient.statusPasien === 'pns' && '👤 PNS'}
                          {patient.statusPasien === 'keluarga' && '👨‍👩‍👧 Keluarga'}
                          {patient.statusPasien === 'umum' && '👤 Umum'}
                        </div>
                      </td>
                      <td className="p-3 text-sm">
                        {patient.identitasType === 'nik' ? patient.nik : patient.nrp}
                      </td>
                      <td className="p-3 text-sm text-gray-600 max-w-xs truncate">
                        {patient.keluhanUtama || '-'}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Clock size={16} className={getWaitTimeColor(waitTime)} />
                          <span className={`text-sm font-medium ${getWaitTimeColor(waitTime)}`}>
                            {waitTime} menit
                          </span>
                        </div>
                        {patient.status === 'menunggu' && (
                          <span className={`text-xs px-2 py-1 rounded inline-block mt-1 ${slaStatus.color}`}>
                            {waitTime >= 30 && <AlertCircle size={10} className="inline mr-1" />}
                            {slaStatus.text}
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        <span className={`text-xs px-2 py-1 rounded border ${getStatusColor(patient.status)}`}>
                          {patient.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-col gap-2">
                          {patient.status === 'menunggu' && (
                            <button
                              onClick={() => updateStatus(patient.id, 'dipanggil')}
                              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 whitespace-nowrap"
                            >
                              Panggil
                            </button>
                          )}
                          {patient.status === 'dipanggil' && (
                            <button
                              onClick={() => updateStatus(patient.id, 'dilayani')}
                              className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 whitespace-nowrap"
                            >
                              Layani
                            </button>
                          )}
                          {patient.status === 'dilayani' && (
                            <button
                              onClick={() => updateStatus(patient.id, 'selesai')}
                              className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 whitespace-nowrap"
                            >
                              Selesai
                            </button>
                          )}
                          {patient.status !== 'selesai' && (
                            <button
                              onClick={() => openTransferModal(patient)}
                              className="px-3 py-1 border border-orange-500 text-orange-600 rounded text-sm hover:bg-orange-50 whitespace-nowrap flex items-center gap-1 justify-center"
                            >
                              <ArrowRightLeft size={14} />
                              Pindah Poli
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Transfer Modal */}
      {transferModalOpen && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Pindah Poli</h3>
            
            <div className="mb-4">
              <div className="bg-blue-50 p-3 rounded mb-4">
                <div className="text-sm text-gray-600 mb-1">Pasien:</div>
                <div className="font-medium">{selectedPatient.nama}</div>
                <div className="text-sm text-gray-600 mt-2">Poli Saat Ini:</div>
                <div className="font-medium">{selectedPatient.poliTujuan}</div>
                <div className="text-sm text-gray-600 mt-2">No. Antrean Saat Ini:</div>
                <div className="font-medium text-2xl text-blue-600">{selectedPatient.nomorAntrean}</div>
              </div>

              <label className="block text-sm font-medium mb-2">Pindah ke Poli:</label>
              <select
                value={targetPoli}
                onChange={(e) => setTargetPoli(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Pilih Poli Tujuan...</option>
                {polis
                  .filter(poli => poli !== selectedPatient.poliTujuan)
                  .map((poli, idx) => (
                    <option key={idx} value={poli}>{poli}</option>
                  ))}
              </select>

              {targetPoli && (
                <div className="mt-3 p-3 bg-yellow-50 rounded">
                  <div className="text-sm text-yellow-800">
                    ⚠️ Pasien akan mendapatkan nomor antrean baru di {targetPoli} dan 
                    status akan kembali ke "menunggu".
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setTransferModalOpen(false);
                  setSelectedPatient(null);
                  setTargetPoli('');
                }}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={handleTransferPoli}
                disabled={!targetPoli}
                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50 flex items-center gap-2"
              >
                <ArrowRightLeft size={16} />
                Pindahkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QueueManagement;
