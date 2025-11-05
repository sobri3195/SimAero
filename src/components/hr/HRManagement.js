import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc } from '../../mockDb';
import { db } from '../../mockDb';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { Calendar, UserPlus } from 'lucide-react';
import Card from '../common/Card';

const HRManagement = () => {
  const { selectedFaskes } = useAuth();
  const { addNotification } = useApp();
  
  const [employees, setEmployees] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [activeTab, setActiveTab] = useState('employees');
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showAddSchedule, setShowAddSchedule] = useState(false);

  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    position: 'Dokter',
    specialization: '',
    phone: '',
    email: '',
    status: 'aktif'
  });

  const [scheduleForm, setScheduleForm] = useState({
    employeeId: '',
    employeeName: '',
    shift: 'pagi',
    date: new Date().toISOString().split('T')[0],
    location: ''
  });

  useEffect(() => {
    if (!selectedFaskes) return;

    const employeesQuery = query(
      collection(db, 'employees'),
      where('faskesId', '==', selectedFaskes)
    );

    const schedulesQuery = query(
      collection(db, 'schedules'),
      where('faskesId', '==', selectedFaskes)
    );

    const unsubEmployees = onSnapshot(employeesQuery, (snapshot) => {
      const data = [];
      snapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));
      setEmployees(data);
    });

    const unsubSchedules = onSnapshot(schedulesQuery, (snapshot) => {
      const data = [];
      snapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setSchedules(data.slice(0, 50));
    });

    return () => {
      unsubEmployees();
      unsubSchedules();
    };
  }, [selectedFaskes]);

  const addEmployee = async () => {
    if (!employeeForm.name || !employeeForm.position) {
      addNotification({ type: 'warning', message: 'Nama dan posisi harus diisi' });
      return;
    }

    try {
      await addDoc(collection(db, 'employees'), {
        ...employeeForm,
        faskesId: selectedFaskes,
        createdAt: new Date().toISOString()
      });
      setEmployeeForm({ name: '', position: 'Dokter', specialization: '', phone: '', email: '', status: 'aktif' });
      setShowAddEmployee(false);
      addNotification({ type: 'success', message: 'Pegawai berhasil ditambahkan' });
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  const addSchedule = async () => {
    if (!scheduleForm.employeeName || !scheduleForm.date) {
      addNotification({ type: 'warning', message: 'Pegawai dan tanggal harus diisi' });
      return;
    }

    try {
      await addDoc(collection(db, 'schedules'), {
        ...scheduleForm,
        faskesId: selectedFaskes,
        createdAt: new Date().toISOString()
      });
      setScheduleForm({ employeeId: '', employeeName: '', shift: 'pagi', date: new Date().toISOString().split('T')[0], location: '' });
      setShowAddSchedule(false);
      addNotification({ type: 'success', message: 'Jadwal berhasil ditambahkan' });
    } catch (error) {
      console.error('Error adding schedule:', error);
    }
  };

  const employeesByPosition = employees.reduce((acc, emp) => {
    if (!acc[emp.position]) acc[emp.position] = [];
    acc[emp.position].push(emp);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <Card 
        title="Manajemen SDM & Penjadwalan"
        actions={
          <div className="flex gap-2">
            <button onClick={() => setShowAddEmployee(!showAddEmployee)} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2">
              <UserPlus size={16} />
              Tambah Pegawai
            </button>
            <button onClick={() => setShowAddSchedule(!showAddSchedule)} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2">
              <Calendar size={16} />
              Buat Jadwal
            </button>
          </div>
        }
      >
        {showAddEmployee && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-3">Tambah Pegawai Baru</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input type="text" placeholder="Nama Lengkap" value={employeeForm.name} onChange={(e) => setEmployeeForm(prev => ({ ...prev, name: e.target.value }))} className="p-2 border rounded" />
              <select value={employeeForm.position} onChange={(e) => setEmployeeForm(prev => ({ ...prev, position: e.target.value }))} className="p-2 border rounded">
                <option value="Dokter">Dokter</option>
                <option value="Perawat">Perawat</option>
                <option value="Bidan">Bidan</option>
                <option value="Apoteker">Apoteker</option>
                <option value="Analis">Analis</option>
                <option value="Radiografer">Radiografer</option>
                <option value="Admin">Admin</option>
              </select>
              <input type="text" placeholder="Spesialisasi" value={employeeForm.specialization} onChange={(e) => setEmployeeForm(prev => ({ ...prev, specialization: e.target.value }))} className="p-2 border rounded" />
              <input type="tel" placeholder="Nomor Telepon" value={employeeForm.phone} onChange={(e) => setEmployeeForm(prev => ({ ...prev, phone: e.target.value }))} className="p-2 border rounded" />
              <input type="email" placeholder="Email" value={employeeForm.email} onChange={(e) => setEmployeeForm(prev => ({ ...prev, email: e.target.value }))} className="p-2 border rounded" />
              <select value={employeeForm.status} onChange={(e) => setEmployeeForm(prev => ({ ...prev, status: e.target.value }))} className="p-2 border rounded">
                <option value="aktif">Aktif</option>
                <option value="cuti">Cuti</option>
                <option value="nonaktif">Non-Aktif</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button onClick={addEmployee} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Simpan</button>
              <button onClick={() => setShowAddEmployee(false)} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">Batal</button>
            </div>
          </div>
        )}

        {showAddSchedule && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium mb-3">Buat Jadwal</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <select value={scheduleForm.employeeName} onChange={(e) => setScheduleForm(prev => ({ ...prev, employeeName: e.target.value }))} className="p-2 border rounded">
                <option value="">Pilih Pegawai</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.name}>{emp.name} - {emp.position}</option>
                ))}
              </select>
              <input type="date" value={scheduleForm.date} onChange={(e) => setScheduleForm(prev => ({ ...prev, date: e.target.value }))} className="p-2 border rounded" />
              <select value={scheduleForm.shift} onChange={(e) => setScheduleForm(prev => ({ ...prev, shift: e.target.value }))} className="p-2 border rounded">
                <option value="pagi">Pagi (07:00 - 14:00)</option>
                <option value="siang">Siang (14:00 - 21:00)</option>
                <option value="malam">Malam (21:00 - 07:00)</option>
              </select>
              <input type="text" placeholder="Lokasi/Unit" value={scheduleForm.location} onChange={(e) => setScheduleForm(prev => ({ ...prev, location: e.target.value }))} className="p-2 border rounded" />
            </div>
            <div className="flex gap-2">
              <button onClick={addSchedule} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Simpan</button>
              <button onClick={() => setShowAddSchedule(false)} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">Batal</button>
            </div>
          </div>
        )}

        <div className="mb-4 flex gap-2 border-b">
          <button onClick={() => setActiveTab('employees')} className={`px-4 py-2 ${activeTab === 'employees' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}>
            Pegawai
          </button>
          <button onClick={() => setActiveTab('schedules')} className={`px-4 py-2 ${activeTab === 'schedules' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}>
            Jadwal
          </button>
        </div>

        {activeTab === 'employees' && (
          <div className="space-y-4">
            {Object.entries(employeesByPosition).map(([position, posEmployees]) => (
              <div key={position}>
                <h4 className="text-sm font-medium text-gray-600 mb-2">{position} ({posEmployees.length})</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {posEmployees.map(emp => (
                    <div key={emp.id} className="p-3 bg-white border rounded-lg">
                      <h5 className="font-medium">{emp.name}</h5>
                      {emp.specialization && <p className="text-sm text-gray-600">{emp.specialization}</p>}
                      <div className="text-xs text-gray-500 mt-1">
                        {emp.phone && <div>Tel: {emp.phone}</div>}
                        {emp.email && <div>Email: {emp.email}</div>}
                      </div>
                      <span className={`inline-block mt-2 px-2 py-1 rounded text-xs ${
                        emp.status === 'aktif' ? 'bg-green-100 text-green-800' :
                        emp.status === 'cuti' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {emp.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {employees.length === 0 && (
              <div className="text-center py-8 text-gray-500">Belum ada data pegawai</div>
            )}
          </div>
        )}

        {activeTab === 'schedules' && (
          <div className="space-y-2">
            {schedules.map(schedule => (
              <div key={schedule.id} className="p-3 bg-white border rounded-lg flex justify-between items-center">
                <div>
                  <h5 className="font-medium">{schedule.employeeName}</h5>
                  <p className="text-sm text-gray-600">{schedule.shift} - {schedule.location}</p>
                </div>
                <div className="text-right text-sm text-gray-600">
                  {new Date(schedule.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>
            ))}
            {schedules.length === 0 && (
              <div className="text-center py-8 text-gray-500">Belum ada jadwal</div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default HRManagement;
