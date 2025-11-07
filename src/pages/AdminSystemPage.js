import React, { useState } from 'react';
import { BedDouble, Calendar, Users, DollarSign, Activity, User } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import DataTable from '../components/common/DataTable';
import CRUDModal from '../components/common/CRUDModal';

const AdminSystemPage = () => {
  const [activeTab, setActiveTab] = useState('room-dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');

  const tabs = [
    { id: 'room-dashboard', label: 'Dashboard Kamar', icon: BedDouble },
    { id: 'doctor-schedule', label: 'Jadwal Dokter', icon: Calendar },
    { id: 'doctor-quota', label: 'Kuota Dokter', icon: Users },
    { id: 'room-management', label: 'Manajemen Ruangan', icon: BedDouble },
    { id: 'tariff', label: 'Manajemen Tarif', icon: DollarSign },
    { id: 'procedures', label: 'Manajemen Tindakan', icon: Activity },
    { id: 'employees', label: 'Manajemen Pegawai', icon: User }
  ];

  const mockRooms = [
    { id: 'R001', roomNumber: 'VIP-101', roomClass: 'VIP', bedCount: 1, occupied: 1, available: 0, status: 'Terisi', patientName: 'Kolonel Budi', admissionDate: '2024-01-10' },
    { id: 'R002', roomNumber: 'K1-201', roomClass: 'Kelas I', bedCount: 2, occupied: 1, available: 1, status: 'Terisi Sebagian', patientName: 'Mayor Ahmad', admissionDate: '2024-01-12' },
    { id: 'R003', roomNumber: 'K2-301', roomClass: 'Kelas II', bedCount: 4, occupied: 0, available: 4, status: 'Tersedia', patientName: '-', admissionDate: '-' }
  ];

  const mockDoctorSchedules = [
    { id: 'SCH001', doctorName: 'dr. Kolonel Ahmad Yusuf, Sp.PD', specialty: 'Penyakit Dalam', day: 'Senin', startTime: '08:00', endTime: '12:00', poly: 'Poli Penyakit Dalam', quota: 20 },
    { id: 'SCH002', doctorName: 'dr. Mayor Siti Nurhaliza, Sp.A', specialty: 'Anak', day: 'Senin', startTime: '08:00', endTime: '11:00', poly: 'Poli Anak', quota: 15 },
    { id: 'SCH003', doctorName: 'dr. Kapten Budi Hartono, Sp.OG', specialty: 'Kebidanan', day: 'Senin', startTime: '13:00', endTime: '16:00', poly: 'Poli Kebidanan', quota: 12 }
  ];

  const mockDoctorQuotas = [
    { id: 'Q001', doctorName: 'dr. Kolonel Ahmad Yusuf, Sp.PD', specialty: 'Penyakit Dalam', date: '2024-01-15', totalQuota: 20, usedQuota: 15, remainingQuota: 5, status: 'Aktif' },
    { id: 'Q002', doctorName: 'dr. Mayor Siti Nurhaliza, Sp.A', specialty: 'Anak', date: '2024-01-15', totalQuota: 15, usedQuota: 15, remainingQuota: 0, status: 'Penuh' }
  ];

  const mockRoomManagement = [
    { id: 'RM001', roomNumber: 'VIP-101', roomClass: 'VIP', bedCount: 1, floor: 'Lantai 1', building: 'Gedung A', facilities: 'AC, TV, Kamar Mandi Dalam', tariff: 'Rp 500.000/hari', status: 'Aktif' },
    { id: 'RM002', roomNumber: 'K1-201', roomClass: 'Kelas I', bedCount: 2, floor: 'Lantai 2', building: 'Gedung A', facilities: 'AC, TV Bersama', tariff: 'Rp 300.000/hari', status: 'Aktif' }
  ];

  const mockTariffs = [
    { id: 'T001', code: 'KONSUL-SP', name: 'Konsultasi Dokter Spesialis', category: 'Konsultasi', price: 'Rp 150.000', effectiveDate: '2024-01-01', status: 'Aktif' },
    { id: 'T002', code: 'KONSUL-UM', name: 'Konsultasi Dokter Umum', category: 'Konsultasi', price: 'Rp 75.000', effectiveDate: '2024-01-01', status: 'Aktif' },
    { id: 'T003', code: 'LAB-DL', name: 'Pemeriksaan Darah Lengkap', category: 'Laboratorium', price: 'Rp 100.000', effectiveDate: '2024-01-01', status: 'Aktif' }
  ];

  const mockProcedures = [
    { id: 'PR001', code: 'INFUS', name: 'Pemasangan Infus', category: 'Tindakan Keperawatan', duration: '15 menit', price: 'Rp 50.000', status: 'Aktif' },
    { id: 'PR002', code: 'JAHIT', name: 'Jahit Luka', category: 'Tindakan Medis', duration: '30 menit', price: 'Rp 200.000', status: 'Aktif' },
    { id: 'PR003', code: 'KATETER', name: 'Pemasangan Kateter', category: 'Tindakan Keperawatan', duration: '20 menit', price: 'Rp 75.000', status: 'Aktif' }
  ];

  const mockEmployees = [
    { id: 'EMP001', nip: '198501012010011001', name: 'dr. Kolonel Ahmad Yusuf, Sp.PD', rank: 'Kolonel', position: 'Dokter Spesialis', specialty: 'Penyakit Dalam', unit: 'Poli Penyakit Dalam', employmentStatus: 'PNS' },
    { id: 'EMP002', nip: '199001012015012001', name: 'apt. Sari Dewi, S.Farm', rank: 'Mayor', position: 'Apoteker', specialty: '-', unit: 'Farmasi', employmentStatus: 'PNS' },
    { id: 'EMP003', nip: '199501012018011001', name: 'Ns. Budi Santoso, S.Kep', rank: 'Kapten', position: 'Perawat', specialty: '-', unit: 'Rawat Inap', employmentStatus: 'PNS' }
  ];

  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    alert('Data berhasil disimpan');
    setIsModalOpen(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'room-dashboard':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-600">Total Kamar</p>
                <p className="text-2xl font-bold text-blue-600">120</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-sm text-gray-600">Kamar Tersedia</p>
                <p className="text-2xl font-bold text-green-600">45</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <p className="text-sm text-gray-600">Kamar Terisi</p>
                <p className="text-2xl font-bold text-red-600">75</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <p className="text-sm text-gray-600">Tingkat Okupansi</p>
                <p className="text-2xl font-bold text-orange-600">62.5%</p>
              </div>
            </div>
            <DataTable
              columns={[
                { key: 'roomNumber', label: 'No. Kamar', sortable: true },
                { key: 'roomClass', label: 'Kelas', sortable: true },
                { key: 'bedCount', label: 'Kapasitas Tempat Tidur' },
                { key: 'occupied', label: 'Terisi' },
                { key: 'available', label: 'Tersedia' },
                { 
                  key: 'status', 
                  label: 'Status',
                  render: (row) => (
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      row.status === 'Tersedia' ? 'bg-green-100 text-green-800' :
                      row.status === 'Terisi' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {row.status}
                    </span>
                  )
                },
                { key: 'patientName', label: 'Nama Pasien' },
                { key: 'admissionDate', label: 'Tanggal Masuk', sortable: true }
              ]}
              data={mockRooms}
              title="Status Kamar Real-Time"
              searchable
              exportable
            />
          </div>
        );

      case 'doctor-schedule':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Jadwal Dokter</h3>
              <button
                onClick={() => openModal('schedule')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                + Tambah Jadwal
              </button>
            </div>
            <DataTable
              columns={[
                { key: 'doctorName', label: 'Nama Dokter', sortable: true },
                { key: 'specialty', label: 'Spesialisasi' },
                { key: 'day', label: 'Hari', sortable: true },
                { key: 'startTime', label: 'Jam Mulai', sortable: true },
                { key: 'endTime', label: 'Jam Selesai' },
                { key: 'poly', label: 'Poliklinik' },
                { key: 'quota', label: 'Kuota', sortable: true }
              ]}
              data={mockDoctorSchedules}
              searchable
              exportable
              onEdit={(item) => alert(`Edit jadwal: ${item.doctorName}`)}
              onDelete={(item) => alert(`Hapus jadwal: ${item.doctorName}`)}
            />
          </div>
        );

      case 'doctor-quota':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Kuota Dokter</h3>
              <button
                onClick={() => openModal('quota')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                + Atur Kuota
              </button>
            </div>
            <DataTable
              columns={[
                { key: 'doctorName', label: 'Nama Dokter', sortable: true },
                { key: 'specialty', label: 'Spesialisasi' },
                { key: 'date', label: 'Tanggal', sortable: true },
                { key: 'totalQuota', label: 'Total Kuota', sortable: true },
                { key: 'usedQuota', label: 'Terpakai' },
                { 
                  key: 'remainingQuota', 
                  label: 'Sisa',
                  render: (row) => (
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      row.remainingQuota > 5 ? 'bg-green-100 text-green-800' :
                      row.remainingQuota > 0 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {row.remainingQuota}
                    </span>
                  )
                },
                { 
                  key: 'status', 
                  label: 'Status',
                  render: (row) => (
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      row.status === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {row.status}
                    </span>
                  )
                }
              ]}
              data={mockDoctorQuotas}
              searchable
              exportable
            />
          </div>
        );

      case 'room-management':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Manajemen Ruangan</h3>
              <button
                onClick={() => openModal('room')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                + Tambah Ruangan
              </button>
            </div>
            <DataTable
              columns={[
                { key: 'roomNumber', label: 'No. Kamar', sortable: true },
                { key: 'roomClass', label: 'Kelas', sortable: true },
                { key: 'bedCount', label: 'Kapasitas' },
                { key: 'floor', label: 'Lantai' },
                { key: 'building', label: 'Gedung' },
                { key: 'facilities', label: 'Fasilitas' },
                { key: 'tariff', label: 'Tarif' },
                { 
                  key: 'status', 
                  label: 'Status',
                  render: (row) => (
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      row.status === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {row.status}
                    </span>
                  )
                }
              ]}
              data={mockRoomManagement}
              searchable
              exportable
              onEdit={(item) => alert(`Edit: ${item.roomNumber}`)}
            />
          </div>
        );

      case 'tariff':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Manajemen Tarif</h3>
              <button
                onClick={() => openModal('tariff')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                + Tambah Tarif
              </button>
            </div>
            <DataTable
              columns={[
                { key: 'code', label: 'Kode', sortable: true },
                { key: 'name', label: 'Nama Layanan', sortable: true },
                { key: 'category', label: 'Kategori', sortable: true },
                { key: 'price', label: 'Tarif', sortable: true },
                { key: 'effectiveDate', label: 'Berlaku Sejak', sortable: true },
                { 
                  key: 'status', 
                  label: 'Status',
                  render: (row) => (
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      row.status === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {row.status}
                    </span>
                  )
                }
              ]}
              data={mockTariffs}
              searchable
              exportable
              onEdit={(item) => alert(`Edit: ${item.name}`)}
              onDelete={(item) => alert(`Hapus: ${item.name}`)}
            />
          </div>
        );

      case 'procedures':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Manajemen Tindakan</h3>
              <button
                onClick={() => openModal('procedure')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                + Tambah Tindakan
              </button>
            </div>
            <DataTable
              columns={[
                { key: 'code', label: 'Kode', sortable: true },
                { key: 'name', label: 'Nama Tindakan', sortable: true },
                { key: 'category', label: 'Kategori', sortable: true },
                { key: 'duration', label: 'Durasi' },
                { key: 'price', label: 'Tarif', sortable: true },
                { 
                  key: 'status', 
                  label: 'Status',
                  render: (row) => (
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      row.status === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {row.status}
                    </span>
                  )
                }
              ]}
              data={mockProcedures}
              searchable
              exportable
              onEdit={(item) => alert(`Edit: ${item.name}`)}
              onDelete={(item) => alert(`Hapus: ${item.name}`)}
            />
          </div>
        );

      case 'employees':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Manajemen Pegawai</h3>
              <button
                onClick={() => openModal('employee')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                + Tambah Pegawai
              </button>
            </div>
            <DataTable
              columns={[
                { key: 'nip', label: 'NIP', sortable: true },
                { key: 'name', label: 'Nama', sortable: true },
                { key: 'rank', label: 'Pangkat' },
                { key: 'position', label: 'Jabatan' },
                { key: 'specialty', label: 'Spesialisasi' },
                { key: 'unit', label: 'Unit' },
                { key: 'employmentStatus', label: 'Status Kepegawaian' }
              ]}
              data={mockEmployees}
              searchable
              exportable
              onView={(item) => alert(`Detail: ${item.name}`)}
              onEdit={(item) => alert(`Edit: ${item.name}`)}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sistem Administrasi"
        subtitle="Manajemen kamar, jadwal dokter, kuota, tarif, tindakan, dan pegawai"
        breadcrumbItems={[
          { label: 'Front Office', path: '/' },
          { label: 'Sistem Administrasi', path: '/admin-system' }
        ]}
      />

      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>

      <CRUDModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Tambah ${modalType === 'schedule' ? 'Jadwal' : modalType === 'quota' ? 'Kuota' : modalType === 'room' ? 'Ruangan' : modalType === 'tariff' ? 'Tarif' : modalType === 'procedure' ? 'Tindakan' : 'Pegawai'}`}
        onSubmit={handleSave}
        size="xl"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Form untuk menambah {modalType}</p>
        </div>
      </CRUDModal>
    </div>
  );
};

export default AdminSystemPage;
