import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy } from '../../mockDb';
import { db } from '../../mockDb';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { UserPlus, Calendar, Users, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import DataTable from '../common/DataTable';
import PageHeader from '../common/PageHeader';
import CRUDModal from '../common/CRUDModal';
import { format, startOfWeek, addDays, parse, isWithinInterval } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import * as XLSX from 'xlsx';

const HREnhanced = () => {
  const { selectedFaskes } = useAuth();
  const { addNotification } = useApp();
  
  const [activeTab, setActiveTab] = useState('employees');
  const [employees, setEmployees] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  
  const [currentWeek, setCurrentWeek] = useState(new Date());
  
  const [formData, setFormData] = useState({
    name: '',
    nrp: '',
    position: 'Dokter',
    specialization: '',
    competencies: [],
    phone: '',
    email: '',
    address: '',
    joinDate: format(new Date(), 'yyyy-MM-dd'),
    status: 'aktif'
  });

  const [scheduleFormData, setScheduleFormData] = useState({
    employeeId: '',
    employeeName: '',
    shift: 'pagi',
    date: format(new Date(), 'yyyy-MM-dd'),
    location: '',
    notes: ''
  });

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFaskes]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const empQuery = query(
        collection(db, 'employees'),
        where('faskesId', '==', selectedFaskes || 'default')
      );
      const empSnapshot = await getDocs(empQuery);
      const empList = empSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEmployees(empList);

      const schedQuery = query(
        collection(db, 'schedules'),
        where('faskesId', '==', selectedFaskes || 'default'),
        orderBy('date', 'desc')
      );
      const schedSnapshot = await getDocs(schedQuery);
      const schedList = schedSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSchedules(schedList);
    } catch (error) {
      console.error('Error loading data:', error);
      addNotification({ type: 'error', message: 'Gagal memuat data SDM' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setFormData({
      name: '',
      nrp: '',
      position: 'Dokter',
      specialization: '',
      competencies: [],
      phone: '',
      email: '',
      address: '',
      joinDate: format(new Date(), 'yyyy-MM-dd'),
      status: 'aktif'
    });
    setModalOpen(true);
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setFormData({
      name: employee.name || '',
      nrp: employee.nrp || '',
      position: employee.position || 'Dokter',
      specialization: employee.specialization || '',
      competencies: employee.competencies || [],
      phone: employee.phone || '',
      email: employee.email || '',
      address: employee.address || '',
      joinDate: employee.joinDate || format(new Date(), 'yyyy-MM-dd'),
      status: employee.status || 'aktif'
    });
    setModalOpen(true);
  };

  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee);
    setViewModalOpen(true);
  };

  const handleDeleteEmployee = async (employee) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus pegawai ${employee.name}?`)) {
      try {
        await deleteDoc(doc(db, 'employees', employee.id));
        addNotification({ type: 'success', message: 'Pegawai berhasil dihapus' });
        loadData();
      } catch (error) {
        console.error('Error deleting employee:', error);
        addNotification({ type: 'error', message: 'Gagal menghapus pegawai' });
      }
    }
  };

  const handleSubmitEmployee = async (e) => {
    if (e) e.preventDefault();

    if (!formData.name || !formData.position) {
      addNotification({ type: 'error', message: 'Nama dan posisi wajib diisi' });
      return;
    }

    try {
      const employeeData = {
        ...formData,
        faskesId: selectedFaskes || 'default',
        updatedAt: new Date().toISOString()
      };

      if (selectedEmployee) {
        await updateDoc(doc(db, 'employees', selectedEmployee.id), employeeData);
        addNotification({ type: 'success', message: 'Data pegawai berhasil diperbarui' });
      } else {
        await addDoc(collection(db, 'employees'), {
          ...employeeData,
          createdAt: new Date().toISOString()
        });
        addNotification({ type: 'success', message: 'Pegawai baru berhasil ditambahkan' });
      }

      setModalOpen(false);
      loadData();
    } catch (error) {
      console.error('Error saving employee:', error);
      addNotification({ type: 'error', message: 'Gagal menyimpan data pegawai' });
    }
  };

  const handleAddSchedule = () => {
    setScheduleFormData({
      employeeId: '',
      employeeName: '',
      shift: 'pagi',
      date: format(new Date(), 'yyyy-MM-dd'),
      location: '',
      notes: ''
    });
    setScheduleModalOpen(true);
  };

  const handleSubmitSchedule = async (e) => {
    if (e) e.preventDefault();

    if (!scheduleFormData.employeeName || !scheduleFormData.date) {
      addNotification({ type: 'error', message: 'Pegawai dan tanggal wajib diisi' });
      return;
    }

    try {
      await addDoc(collection(db, 'schedules'), {
        ...scheduleFormData,
        faskesId: selectedFaskes || 'default',
        createdAt: new Date().toISOString(),
        createdBy: 'Admin'
      });

      addNotification({ type: 'success', message: 'Jadwal berhasil ditambahkan' });
      setScheduleModalOpen(false);
      loadData();
    } catch (error) {
      console.error('Error saving schedule:', error);
      addNotification({ type: 'error', message: 'Gagal menyimpan jadwal' });
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus jadwal ini?')) {
      try {
        await deleteDoc(doc(db, 'schedules', scheduleId));
        addNotification({ type: 'success', message: 'Jadwal berhasil dihapus' });
        loadData();
      } catch (error) {
        console.error('Error deleting schedule:', error);
        addNotification({ type: 'error', message: 'Gagal menghapus jadwal' });
      }
    }
  };

  const addCompetency = (competency) => {
    if (competency && !formData.competencies.includes(competency)) {
      setFormData({
        ...formData,
        competencies: [...formData.competencies, competency]
      });
    }
  };

  const removeCompetency = (competency) => {
    setFormData({
      ...formData,
      competencies: formData.competencies.filter(c => c !== competency)
    });
  };

  const exportEmployeesToExcel = () => {
    const data = employees.map(emp => ({
      'Nama': emp.name,
      'NRP': emp.nrp || '-',
      'Posisi': emp.position,
      'Spesialisasi': emp.specialization || '-',
      'Kompetensi': (emp.competencies || []).join(', ') || '-',
      'Telepon': emp.phone || '-',
      'Email': emp.email || '-',
      'Tanggal Bergabung': emp.joinDate ? new Date(emp.joinDate).toLocaleDateString('id-ID') : '-',
      'Status': emp.status
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data Pegawai');
    XLSX.writeFile(wb, `Data_Pegawai_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
    
    addNotification({ type: 'success', message: 'Data berhasil diekspor ke Excel' });
  };

  const exportAttendanceReport = () => {
    const startDate = startOfWeek(currentWeek, { weekStartsOn: 1 });
    const endDate = addDays(startDate, 6);

    const weekSchedules = schedules.filter(s => {
      const schedDate = parse(s.date, 'yyyy-MM-dd', new Date());
      return isWithinInterval(schedDate, { start: startDate, end: endDate });
    });

    const data = employees.map(emp => {
      const empSchedules = weekSchedules.filter(s => s.employeeName === emp.name);
      const row = {
        'Nama': emp.name,
        'NRP': emp.nrp || '-',
        'Posisi': emp.position
      };

      for (let i = 0; i < 7; i++) {
        const day = addDays(startDate, i);
        const daySchedule = empSchedules.find(s => s.date === format(day, 'yyyy-MM-dd'));
        row[format(day, 'EEE dd/MM', { locale: localeId })] = daySchedule 
          ? `${daySchedule.shift} - ${daySchedule.location || '-'}` 
          : '-';
      }

      return row;
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Laporan Absensi');
    XLSX.writeFile(wb, `Laporan_Absensi_${format(startDate, 'dd-MM-yyyy')}_${format(endDate, 'dd-MM-yyyy')}.xlsx`);
    
    addNotification({ type: 'success', message: 'Laporan absensi berhasil diekspor' });
  };

  const getWeekDates = () => {
    const start = startOfWeek(currentWeek, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  const getSchedulesForDateAndEmployee = (date, employeeName) => {
    return schedules.filter(s => 
      s.date === format(date, 'yyyy-MM-dd') && 
      s.employeeName === employeeName
    );
  };

  const employeeColumns = [
    { key: 'name', label: 'Nama' },
    { key: 'nrp', label: 'NRP', render: (row) => row.nrp || '-' },
    { key: 'position', label: 'Posisi' },
    { key: 'specialization', label: 'Spesialisasi', render: (row) => row.specialization || '-' },
    { 
      key: 'competencies', 
      label: 'Kompetensi',
      render: (row) => {
        const comps = row.competencies || [];
        return comps.length > 0 
          ? <div className="flex flex-wrap gap-1">
              {comps.map((c, i) => (
                <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                  {c}
                </span>
              ))}
            </div>
          : '-';
      }
    },
    { key: 'phone', label: 'Telepon', render: (row) => row.phone || '-' },
    { 
      key: 'status', 
      label: 'Status',
      render: (row) => (
        <span className={`px-2 py-1 text-xs font-semibold rounded ${
          row.status === 'aktif' ? 'bg-green-100 text-green-800' :
          row.status === 'cuti' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {row.status}
        </span>
      )
    },
    { key: 'actions', label: 'Aksi', actions: true, className: 'text-center' }
  ];

  const breadcrumbItems = [
    { label: 'Dashboard', path: '/' },
    { label: 'SDM & Penjadwalan', path: '/hr' }
  ];

  const weekDates = getWeekDates();
  const shiftColors = {
    pagi: 'bg-blue-100 border-blue-300 text-blue-800',
    siang: 'bg-orange-100 border-orange-300 text-orange-800',
    malam: 'bg-purple-100 border-purple-300 text-purple-800'
  };

  if (loading) {
    return (
      <div>
        <PageHeader 
          title="Manajemen SDM & Penjadwalan"
          subtitle="Kelola data pegawai, kompetensi, dan jadwal kerja"
          breadcrumbItems={breadcrumbItems}
        />
        <div className="text-center py-12">
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Manajemen SDM & Penjadwalan"
        subtitle="Kelola data pegawai, kompetensi, dan jadwal kerja"
        breadcrumbItems={breadcrumbItems}
        actionLabel={activeTab === 'employees' ? 'Tambah Pegawai' : 'Buat Jadwal'}
        actionIcon={activeTab === 'employees' ? UserPlus : Calendar}
        onActionClick={activeTab === 'employees' ? handleAddEmployee : handleAddSchedule}
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Pegawai</p>
              <p className="text-2xl font-bold text-blue-900">{employees.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Pegawai Aktif</p>
              <p className="text-2xl font-bold text-green-900">
                {employees.filter(e => e.status === 'aktif').length}
              </p>
            </div>
            <Users className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 font-medium">Sedang Cuti</p>
              <p className="text-2xl font-bold text-yellow-900">
                {employees.filter(e => e.status === 'cuti').length}
              </p>
            </div>
            <Users className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Jadwal Minggu Ini</p>
              <p className="text-2xl font-bold text-purple-900">
                {schedules.filter(s => {
                  const schedDate = parse(s.date, 'yyyy-MM-dd', new Date());
                  return isWithinInterval(schedDate, { 
                    start: startOfWeek(currentWeek, { weekStartsOn: 1 }), 
                    end: addDays(startOfWeek(currentWeek, { weekStartsOn: 1 }), 6) 
                  });
                }).length}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('employees')}
            className={`flex-1 px-6 py-3 font-medium transition-colors ${
              activeTab === 'employees'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Users className="w-5 h-5" />
              Data Pegawai
            </div>
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex-1 px-6 py-3 font-medium transition-colors ${
              activeTab === 'calendar'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Calendar className="w-5 h-5" />
              Kalender Jadwal
            </div>
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'employees' && (
            <div>
              <div className="mb-4 flex justify-end">
                <button
                  onClick={exportEmployeesToExcel}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export Excel
                </button>
              </div>
              <DataTable
                columns={employeeColumns}
                data={employees}
                title="Data Pegawai"
                searchable={true}
                exportable={false}
                pagination={true}
                itemsPerPage={10}
                onView={handleViewEmployee}
                onEdit={handleEditEmployee}
                onDelete={handleDeleteEmployee}
              />
            </div>
          )}

          {activeTab === 'calendar' && (
            <div>
              {/* Calendar Header */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setCurrentWeek(addDays(currentWeek, -7))}
                    className="p-2 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h3 className="text-lg font-semibold">
                    Minggu {format(weekDates[0], 'dd MMM', { locale: localeId })} - {format(weekDates[6], 'dd MMM yyyy', { locale: localeId })}
                  </h3>
                  <button
                    onClick={() => setCurrentWeek(addDays(currentWeek, 7))}
                    className="p-2 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentWeek(new Date())}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Hari Ini
                  </button>
                </div>
                <button
                  onClick={exportAttendanceReport}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export Absensi
                </button>
              </div>

              {/* Legend */}
              <div className="mb-4 flex gap-4 items-center text-sm">
                <span className="font-medium">Shift:</span>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
                  <span>Pagi (07:00-14:00)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-100 border border-orange-300 rounded"></div>
                  <span>Siang (14:00-21:00)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-100 border border-purple-300 rounded"></div>
                  <span>Malam (21:00-07:00)</span>
                </div>
              </div>

              {/* Weekly Calendar Grid */}
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left w-40">Pegawai</th>
                      {weekDates.map((date, idx) => (
                        <th key={idx} className="border border-gray-300 px-2 py-2 text-center min-w-[120px]">
                          <div className="font-semibold">{format(date, 'EEE', { locale: localeId })}</div>
                          <div className="text-sm text-gray-600">{format(date, 'dd/MM')}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {employees.filter(e => e.status === 'aktif').map((employee) => (
                      <tr key={employee.id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">
                          <div className="font-medium">{employee.name}</div>
                          <div className="text-xs text-gray-500">{employee.position}</div>
                        </td>
                        {weekDates.map((date, idx) => {
                          const daySchedules = getSchedulesForDateAndEmployee(date, employee.name);
                          return (
                            <td key={idx} className="border border-gray-300 px-2 py-2">
                              {daySchedules.length > 0 ? (
                                <div className="space-y-1">
                                  {daySchedules.map((schedule) => (
                                    <div 
                                      key={schedule.id}
                                      className={`text-xs p-1 rounded border ${shiftColors[schedule.shift]}`}
                                    >
                                      <div className="font-semibold capitalize">{schedule.shift}</div>
                                      {schedule.location && (
                                        <div className="truncate">{schedule.location}</div>
                                      )}
                                      <button
                                        onClick={() => handleDeleteSchedule(schedule.id)}
                                        className="text-red-600 hover:text-red-800 text-xs mt-1"
                                      >
                                        Hapus
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-gray-400 text-center">-</div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {employees.filter(e => e.status === 'aktif').length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  Tidak ada pegawai aktif
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Employee Form Modal */}
      <CRUDModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedEmployee ? 'Edit Data Pegawai' : 'Tambah Pegawai Baru'}
        onSubmit={handleSubmitEmployee}
        size="large"
      >
        <form onSubmit={handleSubmitEmployee} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                NRP (Nomor Registrasi Pegawai)
              </label>
              <input
                type="text"
                value={formData.nrp}
                onChange={(e) => setFormData({ ...formData, nrp: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Posisi <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="Dokter">Dokter</option>
                <option value="Perawat">Perawat</option>
                <option value="Bidan">Bidan</option>
                <option value="Apoteker">Apoteker</option>
                <option value="Analis">Analis</option>
                <option value="Radiografer">Radiografer</option>
                <option value="Admin">Admin</option>
                <option value="Cleaning Service">Cleaning Service</option>
                <option value="Security">Security</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Spesialisasi / Keahlian
              </label>
              <input
                type="text"
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Contoh: Dokter Umum, Perawat ICU, dll"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kompetensi
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  id="competency-input"
                  placeholder="Tambah kompetensi (tekan Enter)"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCompetency(e.target.value.trim());
                      e.target.value = '';
                    }
                  }}
                  className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById('competency-input');
                    addCompetency(input.value.trim());
                    input.value = '';
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Tambah
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.competencies.map((comp, idx) => (
                  <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2">
                    {comp}
                    <button
                      type="button"
                      onClick={() => removeCompetency(comp)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Contoh: BTCLS, ACLS, Penanganan Trauma, dll
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telepon
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alamat
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Bergabung
              </label>
              <input
                type="date"
                value={formData.joinDate}
                onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="aktif">Aktif</option>
                <option value="cuti">Cuti</option>
                <option value="nonaktif">Non-Aktif</option>
              </select>
            </div>
          </div>
        </form>
      </CRUDModal>

      {/* View Employee Modal */}
      <CRUDModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="Detail Pegawai"
        size="large"
        submitLabel={null}
      >
        {selectedEmployee && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Nama</p>
                <p className="font-medium">{selectedEmployee.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">NRP</p>
                <p className="font-medium">{selectedEmployee.nrp || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Posisi</p>
                <p className="font-medium">{selectedEmployee.position}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Spesialisasi</p>
                <p className="font-medium">{selectedEmployee.specialization || '-'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500 mb-2">Kompetensi</p>
                <div className="flex flex-wrap gap-2">
                  {(selectedEmployee.competencies || []).length > 0 ? (
                    selectedEmployee.competencies.map((comp, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {comp}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-400">-</p>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Telepon</p>
                <p className="font-medium">{selectedEmployee.phone || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{selectedEmployee.email || '-'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Alamat</p>
                <p className="font-medium">{selectedEmployee.address || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tanggal Bergabung</p>
                <p className="font-medium">
                  {selectedEmployee.joinDate 
                    ? new Date(selectedEmployee.joinDate).toLocaleDateString('id-ID')
                    : '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span className={`inline-block px-3 py-1 text-xs font-semibold rounded ${
                  selectedEmployee.status === 'aktif' ? 'bg-green-100 text-green-800' :
                  selectedEmployee.status === 'cuti' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {selectedEmployee.status}
                </span>
              </div>
            </div>
          </div>
        )}
      </CRUDModal>

      {/* Schedule Form Modal */}
      <CRUDModal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        title="Buat Jadwal Baru"
        onSubmit={handleSubmitSchedule}
        size="medium"
      >
        <form onSubmit={handleSubmitSchedule} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pegawai <span className="text-red-500">*</span>
            </label>
            <select
              value={scheduleFormData.employeeName}
              onChange={(e) => setScheduleFormData({ ...scheduleFormData, employeeName: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">-- Pilih Pegawai --</option>
              {employees.filter(e => e.status === 'aktif').map((emp) => (
                <option key={emp.id} value={emp.name}>
                  {emp.name} - {emp.position}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tanggal <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={scheduleFormData.date}
              onChange={(e) => setScheduleFormData({ ...scheduleFormData, date: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shift <span className="text-red-500">*</span>
            </label>
            <select
              value={scheduleFormData.shift}
              onChange={(e) => setScheduleFormData({ ...scheduleFormData, shift: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="pagi">Pagi (07:00 - 14:00)</option>
              <option value="siang">Siang (14:00 - 21:00)</option>
              <option value="malam">Malam (21:00 - 07:00)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lokasi / Unit
            </label>
            <input
              type="text"
              value={scheduleFormData.location}
              onChange={(e) => setScheduleFormData({ ...scheduleFormData, location: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Contoh: Poli Umum, IGD, dll"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catatan
            </label>
            <textarea
              value={scheduleFormData.notes}
              onChange={(e) => setScheduleFormData({ ...scheduleFormData, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tambahkan catatan jika diperlukan..."
            />
          </div>
        </form>
      </CRUDModal>
    </div>
  );
};

export default HREnhanced;
