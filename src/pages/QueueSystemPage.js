import React, { useState, useEffect, useCallback } from 'react';
import { Clock, Users, Activity, Pill, DollarSign, User } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import DataTable from '../components/common/DataTable';

const QueueSystemPage = () => {
  const [activeTab, setActiveTab] = useState('registration');
  const [queues, setQueues] = useState({
    registration: [],
    support: [],
    cashier: [],
    pharmacy: [],
    doctor: []
  });

  const tabs = [
    { id: 'registration', label: 'Antrean Pendaftaran', icon: Users },
    { id: 'support', label: 'Antrean Penunjang', icon: Activity },
    { id: 'cashier', label: 'Antrean Kasir', icon: DollarSign },
    { id: 'pharmacy', label: 'Antrean Apotek', icon: Pill },
    { id: 'doctor', label: 'Kuota Dokter', icon: User }
  ];

  const loadQueueData = useCallback(() => {
    const mockQueues = {
      registration: [
        { id: 'Q001', patientName: 'Mayor Budi Santoso', type: 'Rawat Jalan', queueNumber: 'A001', status: 'Menunggu', estimatedTime: '10 menit', registrationTime: '08:00' },
        { id: 'Q002', patientName: 'Kapten Ahmad Yani', type: 'Rawat Inap', queueNumber: 'A002', status: 'Dipanggil', estimatedTime: '5 menit', registrationTime: '08:15' },
        { id: 'Q003', patientName: 'Letnan Sari Dewi', type: 'Gawat Darurat', queueNumber: 'A003', status: 'Dilayani', estimatedTime: '0 menit', registrationTime: '08:30' }
      ],
      support: [
        { id: 'L001', patientName: 'Mayor Budi Santoso', service: 'Laboratorium', queueNumber: 'L001', status: 'Menunggu', estimatedTime: '15 menit', requestTime: '09:00' },
        { id: 'R001', patientName: 'Kapten Ahmad Yani', service: 'Radiologi', queueNumber: 'R001', status: 'Dipanggil', estimatedTime: '10 menit', requestTime: '09:15' },
        { id: 'L002', patientName: 'Letnan Sari Dewi', service: 'Laboratorium', queueNumber: 'L002', status: 'Dilayani', estimatedTime: '0 menit', requestTime: '09:30' }
      ],
      cashier: [
        { id: 'C001', patientName: 'Mayor Budi Santoso', service: 'Rawat Jalan', queueNumber: 'K001', status: 'Menunggu', totalBill: 'Rp 500.000', estimatedTime: '8 menit', arrivalTime: '10:00' },
        { id: 'C002', patientName: 'Kapten Ahmad Yani', service: 'Laboratorium', queueNumber: 'K002', status: 'Dilayani', totalBill: 'Rp 250.000', estimatedTime: '0 menit', arrivalTime: '10:15' }
      ],
      pharmacy: [
        { id: 'P001', patientName: 'Mayor Budi Santoso', prescriptionType: 'Rawat Jalan', queueNumber: 'F001', status: 'Menunggu', itemCount: '5 item', estimatedTime: '12 menit', requestTime: '11:00' },
        { id: 'P002', patientName: 'Kapten Ahmad Yani', prescriptionType: 'Rawat Inap', queueNumber: 'F002', status: 'Diproses', itemCount: '3 item', estimatedTime: '5 menit', requestTime: '11:15' },
        { id: 'P003', patientName: 'Letnan Sari Dewi', prescriptionType: 'Gawat Darurat', queueNumber: 'F003', status: 'Siap Diambil', itemCount: '2 item', estimatedTime: '0 menit', requestTime: '11:30' }
      ],
      doctor: [
        { id: 'D001', doctorName: 'dr. Kolonel Ahmad Yusuf, Sp.PD', specialty: 'Penyakit Dalam', totalQuota: 20, usedQuota: 15, remainingQuota: 5, schedule: '08:00 - 12:00' },
        { id: 'D002', doctorName: 'dr. Mayor Siti Nurhaliza, Sp.A', specialty: 'Anak', totalQuota: 15, usedQuota: 12, remainingQuota: 3, schedule: '08:00 - 11:00' },
        { id: 'D003', doctorName: 'dr. Kapten Budi Hartono, Sp.OG', specialty: 'Kebidanan', totalQuota: 12, usedQuota: 8, remainingQuota: 4, schedule: '13:00 - 16:00' }
      ]
    };
    setQueues(mockQueues);
  }, []);

  useEffect(() => {
    loadQueueData();
    const interval = setInterval(loadQueueData, 5000);
    return () => clearInterval(interval);
  }, [loadQueueData]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Menunggu': return 'bg-yellow-100 text-yellow-800';
      case 'Dipanggil': return 'bg-blue-100 text-blue-800';
      case 'Dilayani': return 'bg-green-100 text-green-800';
      case 'Diproses': return 'bg-orange-100 text-orange-800';
      case 'Siap Diambil': return 'bg-green-100 text-green-800';
      case 'Selesai': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const callNextQueue = () => {
    alert('Memanggil antrean berikutnya...');
  };

  const skipQueue = () => {
    alert('Melewati antrean...');
  };

  const renderQueueContent = () => {
    switch (activeTab) {
      case 'registration':
        return (
          <DataTable
            columns={[
              { key: 'queueNumber', label: 'No Antrean', sortable: true },
              { key: 'patientName', label: 'Nama Pasien', sortable: true },
              { key: 'type', label: 'Jenis Pendaftaran', sortable: true },
              { key: 'registrationTime', label: 'Jam Daftar', sortable: true },
              { key: 'estimatedTime', label: 'Estimasi Waktu' },
              { 
                key: 'status', 
                label: 'Status',
                render: (row) => (
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(row.status)}`}>
                    {row.status}
                  </span>
                )
              }
            ]}
            data={queues.registration}
            title="Antrean Pendaftaran"
            searchable
            exportable
          />
        );

      case 'support':
        return (
          <DataTable
            columns={[
              { key: 'queueNumber', label: 'No Antrean', sortable: true },
              { key: 'patientName', label: 'Nama Pasien', sortable: true },
              { key: 'service', label: 'Layanan', sortable: true },
              { key: 'requestTime', label: 'Jam Permintaan', sortable: true },
              { key: 'estimatedTime', label: 'Estimasi Waktu' },
              { 
                key: 'status', 
                label: 'Status',
                render: (row) => (
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(row.status)}`}>
                    {row.status}
                  </span>
                )
              }
            ]}
            data={queues.support}
            title="Antrean Penunjang (Lab & Radiologi)"
            searchable
            exportable
          />
        );

      case 'cashier':
        return (
          <DataTable
            columns={[
              { key: 'queueNumber', label: 'No Antrean', sortable: true },
              { key: 'patientName', label: 'Nama Pasien', sortable: true },
              { key: 'service', label: 'Layanan', sortable: true },
              { key: 'totalBill', label: 'Total Tagihan', sortable: true },
              { key: 'arrivalTime', label: 'Jam Datang', sortable: true },
              { key: 'estimatedTime', label: 'Estimasi Waktu' },
              { 
                key: 'status', 
                label: 'Status',
                render: (row) => (
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(row.status)}`}>
                    {row.status}
                  </span>
                )
              }
            ]}
            data={queues.cashier}
            title="Antrean Kasir"
            searchable
            exportable
          />
        );

      case 'pharmacy':
        return (
          <DataTable
            columns={[
              { key: 'queueNumber', label: 'No Antrean', sortable: true },
              { key: 'patientName', label: 'Nama Pasien', sortable: true },
              { key: 'prescriptionType', label: 'Jenis Resep', sortable: true },
              { key: 'itemCount', label: 'Jumlah Item' },
              { key: 'requestTime', label: 'Jam Permintaan', sortable: true },
              { key: 'estimatedTime', label: 'Estimasi Waktu' },
              { 
                key: 'status', 
                label: 'Status',
                render: (row) => (
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(row.status)}`}>
                    {row.status}
                  </span>
                )
              }
            ]}
            data={queues.pharmacy}
            title="Antrean Apotek"
            searchable
            exportable
          />
        );

      case 'doctor':
        return (
          <DataTable
            columns={[
              { key: 'doctorName', label: 'Nama Dokter', sortable: true },
              { key: 'specialty', label: 'Spesialisasi', sortable: true },
              { key: 'schedule', label: 'Jadwal' },
              { key: 'totalQuota', label: 'Kuota Total', sortable: true },
              { key: 'usedQuota', label: 'Kuota Terpakai', sortable: true },
              { 
                key: 'remainingQuota', 
                label: 'Sisa Kuota',
                sortable: true,
                render: (row) => (
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    row.remainingQuota > 5 ? 'bg-green-100 text-green-800' : 
                    row.remainingQuota > 2 ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {row.remainingQuota}
                  </span>
                )
              }
            ]}
            data={queues.doctor}
            title="Kuota Dokter Hari Ini"
            searchable
            exportable
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sistem Antrean"
        subtitle="Manajemen antrean pendaftaran, penunjang, kasir, apotek, dan kuota dokter"
        breadcrumbItems={[
          { label: 'Front Office', path: '/' },
          { label: 'Sistem Antrean', path: '/queue-system' }
        ]}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Antrean Pendaftaran</p>
              <p className="text-2xl font-bold text-blue-600">{queues.registration.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Antrean Penunjang</p>
              <p className="text-2xl font-bold text-purple-600">{queues.support.length}</p>
            </div>
            <Activity className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Antrean Kasir</p>
              <p className="text-2xl font-bold text-green-600">{queues.cashier.length}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Antrean Apotek</p>
              <p className="text-2xl font-bold text-orange-600">{queues.pharmacy.length}</p>
            </div>
            <Pill className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Dokter Tersedia</p>
              <p className="text-2xl font-bold text-red-600">{queues.doctor.length}</p>
            </div>
            <User className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
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
          {/* Action Buttons */}
          <div className="mb-4 flex space-x-2">
            <button
              onClick={callNextQueue}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Clock className="w-4 h-4 inline mr-2" />
              Panggil Berikutnya
            </button>
            <button
              onClick={skipQueue}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Lewati Antrean
            </button>
          </div>

          {renderQueueContent()}
        </div>
      </div>
    </div>
  );
};

export default QueueSystemPage;
