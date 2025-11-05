import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, updateDoc, doc, addDoc } from '../../mockDb';
import { db } from '../../mockDb';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { Calendar, Clock, Users, Activity, CheckCircle, XCircle } from 'lucide-react';
import Card from '../common/Card';

const SurgerySchedule = () => {
  const { selectedFaskes } = useAuth();
  const { addNotification } = useApp();
  
  const [surgeries, setSurgeries] = useState([]);
  const [operatingRooms, setOperatingRooms] = useState([]);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [scheduleForm, setScheduleForm] = useState({
    patientName: '',
    surgeryType: '',
    surgeon: '',
    anesthesiologist: '',
    roomId: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '08:00',
    estimatedDuration: '60',
    notes: ''
  });

  useEffect(() => {
    if (!selectedFaskes) return;

    const roomsQuery = query(
      collection(db, 'operating_rooms'),
      where('faskesId', '==', selectedFaskes)
    );

    const unsubscribeRooms = onSnapshot(roomsQuery, (snapshot) => {
      const roomsData = [];
      snapshot.forEach((doc) => {
        roomsData.push({ id: doc.id, ...doc.data() });
      });
      setOperatingRooms(roomsData);
    });

    const surgeriesQuery = query(
      collection(db, 'surgeries'),
      where('faskesId', '==', selectedFaskes),
      where('date', '==', selectedDate)
    );

    const unsubscribeSurgeries = onSnapshot(surgeriesQuery, (snapshot) => {
      const surgeriesData = [];
      snapshot.forEach((doc) => {
        surgeriesData.push({ id: doc.id, ...doc.data() });
      });
      surgeriesData.sort((a, b) => a.startTime.localeCompare(b.startTime));
      setSurgeries(surgeriesData);
    });

    return () => {
      unsubscribeRooms();
      unsubscribeSurgeries();
    };
  }, [selectedFaskes, selectedDate]);

  const scheduleSurgery = async () => {
    if (!scheduleForm.patientName || !scheduleForm.surgeryType || !scheduleForm.surgeon) {
      addNotification({ type: 'warning', message: 'Nama pasien, jenis operasi, dan dokter bedah harus diisi' });
      return;
    }

    try {
      await addDoc(collection(db, 'surgeries'), {
        ...scheduleForm,
        faskesId: selectedFaskes,
        status: 'dijadwalkan',
        createdAt: new Date().toISOString()
      });

      setScheduleForm({
        patientName: '',
        surgeryType: '',
        surgeon: '',
        anesthesiologist: '',
        roomId: '',
        date: new Date().toISOString().split('T')[0],
        startTime: '08:00',
        estimatedDuration: '60',
        notes: ''
      });
      setShowScheduleForm(false);
      addNotification({ type: 'success', message: 'Operasi berhasil dijadwalkan' });
    } catch (error) {
      console.error('Error scheduling surgery:', error);
      addNotification({ type: 'error', message: 'Gagal menjadwalkan operasi' });
    }
  };

  const updateSurgeryStatus = async (surgeryId, newStatus) => {
    try {
      await updateDoc(doc(db, 'surgeries', surgeryId), {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
      addNotification({ type: 'success', message: `Status operasi diubah menjadi ${newStatus}` });
    } catch (error) {
      console.error('Error updating surgery status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'dijadwalkan': return 'bg-blue-100 text-blue-800';
      case 'berlangsung': return 'bg-yellow-100 text-yellow-800';
      case 'selesai': return 'bg-green-100 text-green-800';
      case 'dibatalkan': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const surgeriesByRoom = surgeries.reduce((acc, surgery) => {
    const roomName = operatingRooms.find(r => r.id === surgery.roomId)?.name || 'Ruang Tidak Ditentukan';
    if (!acc[roomName]) acc[roomName] = [];
    acc[roomName].push(surgery);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <Card 
        title="Jadwal Operasi"
        actions={
          <div className="flex gap-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border rounded"
            />
            <button
              onClick={() => setShowScheduleForm(!showScheduleForm)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
            >
              <Calendar size={16} />
              Jadwalkan Operasi
            </button>
          </div>
        }
      >
        {showScheduleForm && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-3">Form Jadwal Operasi</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Nama Pasien"
                value={scheduleForm.patientName}
                onChange={(e) => setScheduleForm(prev => ({ ...prev, patientName: e.target.value }))}
                className="p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Jenis Operasi"
                value={scheduleForm.surgeryType}
                onChange={(e) => setScheduleForm(prev => ({ ...prev, surgeryType: e.target.value }))}
                className="p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Dokter Bedah"
                value={scheduleForm.surgeon}
                onChange={(e) => setScheduleForm(prev => ({ ...prev, surgeon: e.target.value }))}
                className="p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Dokter Anestesi"
                value={scheduleForm.anesthesiologist}
                onChange={(e) => setScheduleForm(prev => ({ ...prev, anesthesiologist: e.target.value }))}
                className="p-2 border rounded"
              />
              <select
                value={scheduleForm.roomId}
                onChange={(e) => setScheduleForm(prev => ({ ...prev, roomId: e.target.value }))}
                className="p-2 border rounded"
              >
                <option value="">Pilih Ruang Operasi</option>
                {operatingRooms.map(room => (
                  <option key={room.id} value={room.id}>{room.name}</option>
                ))}
              </select>
              <input
                type="date"
                value={scheduleForm.date}
                onChange={(e) => setScheduleForm(prev => ({ ...prev, date: e.target.value }))}
                className="p-2 border rounded"
              />
              <input
                type="time"
                value={scheduleForm.startTime}
                onChange={(e) => setScheduleForm(prev => ({ ...prev, startTime: e.target.value }))}
                className="p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Durasi (menit)"
                value={scheduleForm.estimatedDuration}
                onChange={(e) => setScheduleForm(prev => ({ ...prev, estimatedDuration: e.target.value }))}
                className="p-2 border rounded"
              />
              <textarea
                placeholder="Catatan"
                value={scheduleForm.notes}
                onChange={(e) => setScheduleForm(prev => ({ ...prev, notes: e.target.value }))}
                className="p-2 border rounded col-span-2"
                rows="2"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={scheduleSurgery}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Jadwalkan
              </button>
              <button
                onClick={() => setShowScheduleForm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Batal
              </button>
            </div>
          </div>
        )}

        <div className="mb-4">
          <h3 className="font-medium mb-3">
            Jadwal Tanggal: {new Date(selectedDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </h3>
        </div>

        {Object.keys(surgeriesByRoom).length > 0 ? (
          Object.entries(surgeriesByRoom).map(([roomName, roomSurgeries]) => (
            <div key={roomName} className="mb-6">
              <h4 className="font-medium text-sm text-gray-600 mb-3 flex items-center gap-2">
                <Activity size={16} />
                {roomName}
              </h4>
              <div className="space-y-3">
                {roomSurgeries.map(surgery => (
                  <div key={surgery.id} className="p-4 bg-white border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(surgery.status)}`}>
                            {surgery.status}
                          </span>
                          <span className="flex items-center gap-1 text-sm text-gray-600">
                            <Clock size={14} />
                            {surgery.startTime} ({surgery.estimatedDuration} menit)
                          </span>
                        </div>
                        <h4 className="font-medium text-lg">{surgery.patientName}</h4>
                        <p className="text-sm text-gray-600">{surgery.surgeryType}</p>
                        <div className="flex gap-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Users size={12} />
                            Bedah: {surgery.surgeon}
                          </span>
                          {surgery.anesthesiologist && (
                            <span>Anestesi: {surgery.anesthesiologist}</span>
                          )}
                        </div>
                        {surgery.notes && (
                          <p className="text-xs text-gray-500 mt-2 italic">{surgery.notes}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {surgery.status === 'dijadwalkan' && (
                          <>
                            <button
                              onClick={() => updateSurgeryStatus(surgery.id, 'berlangsung')}
                              className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
                            >
                              Mulai
                            </button>
                            <button
                              onClick={() => updateSurgeryStatus(surgery.id, 'dibatalkan')}
                              className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 flex items-center gap-1"
                            >
                              <XCircle size={14} />
                              Batal
                            </button>
                          </>
                        )}
                        {surgery.status === 'berlangsung' && (
                          <button
                            onClick={() => updateSurgeryStatus(surgery.id, 'selesai')}
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
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            Tidak ada jadwal operasi untuk tanggal ini
          </div>
        )}
      </Card>

      <Card title="Ruang Operasi">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {operatingRooms.map(room => {
            const roomSurgeriesToday = surgeries.filter(s => s.roomId === room.id && s.status !== 'selesai' && s.status !== 'dibatalkan');
            const isOccupied = roomSurgeriesToday.some(s => s.status === 'berlangsung');
            
            return (
              <div key={room.id} className={`p-4 rounded-lg border-2 ${isOccupied ? 'bg-red-50 border-red-300' : 'bg-green-50 border-green-300'}`}>
                <h4 className="font-medium mb-2">{room.name}</h4>
                <div className="text-sm text-gray-600">
                  <div>Status: {isOccupied ? 'Sedang Digunakan' : 'Tersedia'}</div>
                  <div>Jadwal Hari Ini: {roomSurgeriesToday.length} operasi</div>
                </div>
              </div>
            );
          })}
          
          {operatingRooms.length === 0 && (
            <div className="col-span-3 text-center py-8 text-gray-500">
              Belum ada ruang operasi terdaftar
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default SurgerySchedule;
