import React, { useState } from 'react';
import { FileText, Archive, Send, DollarSign, BarChart3 } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import DataTable from '../components/common/DataTable';

const MedicalRecordsPage = () => {
  const [activeTab, setActiveTab] = useState('recording');

  const tabs = [
    { id: 'recording', label: 'Pencatatan Dokumen', icon: FileText },
    { id: 'storage', label: 'Penyimpanan Dokumen', icon: Archive },
    { id: 'distribution', label: 'Distribusi Dokumen', icon: Send },
    { id: 'claims', label: 'Pengajuan Klaim', icon: DollarSign },
    { id: 'sirs', label: 'Laporan SIRS', icon: BarChart3 }
  ];

  const mockRecordings = [
    { id: 'RM001', medicalRecordNumber: 'RM-2024-001', patientName: 'Mayor Budi Santoso', visitDate: '2024-01-15', documentType: 'Rekam Medis Rawat Jalan', status: 'Lengkap', recordedBy: 'Ns. Sari' },
    { id: 'RM002', medicalRecordNumber: 'RM-2024-002', patientName: 'Kapten Ahmad Yani', visitDate: '2024-01-15', documentType: 'Rekam Medis Rawat Inap', status: 'Belum Lengkap', recordedBy: 'Ns. Dewi' }
  ];

  const mockStorage = [
    { id: 'ST001', medicalRecordNumber: 'RM-2024-001', patientName: 'Mayor Budi Santoso', storageLocation: 'Rak A1-001', storageDate: '2024-01-15', documentCount: 5, status: 'Tersimpan' },
    { id: 'ST002', medicalRecordNumber: 'RM-2024-002', patientName: 'Kapten Ahmad Yani', storageLocation: 'Rak A1-002', storageDate: '2024-01-15', documentCount: 12, status: 'Tersimpan' }
  ];

  const mockDistribution = [
    { id: 'DS001', medicalRecordNumber: 'RM-2024-001', patientName: 'Mayor Budi Santoso', requestDate: '2024-01-16', requestedBy: 'Poli Penyakit Dalam', purpose: 'Kunjungan Ulang', distributionDate: '2024-01-16', status: 'Dikembalikan' }
  ];

  const mockClaims = [
    { id: 'CL001', claimNumber: 'CLAIM-2024-001', patientName: 'Mayor Budi Santoso', service: 'Rawat Jalan', claimDate: '2024-01-16', totalClaim: 'Rp 215.000', status: 'Diajukan', claimType: 'BPJS' },
    { id: 'CL002', claimNumber: 'CLAIM-2024-002', patientName: 'Kapten Ahmad Yani', service: 'Rawat Inap', claimDate: '2024-01-16', totalClaim: 'Rp 5.500.000', status: 'Disetujui', claimType: 'BPJS' }
  ];

  const mockSIRS = [
    { id: 'SIRS001', reportType: 'RL 1.1 - Data Kegiatan Pelayanan', period: 'Januari 2024', generatedDate: '2024-01-31', generatedBy: 'Admin Rekam Medik', status: 'Terkirim' },
    { id: 'SIRS002', reportType: 'RL 1.2 - Data Ketenagaan', period: 'Januari 2024', generatedDate: '2024-01-31', generatedBy: 'Admin Rekam Medik', status: 'Draft' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'recording':
        return (
          <DataTable
            columns={[
              { key: 'medicalRecordNumber', label: 'No. Rekam Medis', sortable: true },
              { key: 'patientName', label: 'Nama Pasien', sortable: true },
              { key: 'visitDate', label: 'Tanggal Kunjungan', sortable: true },
              { key: 'documentType', label: 'Jenis Dokumen' },
              { 
                key: 'status', 
                label: 'Status',
                render: (row) => (
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    row.status === 'Lengkap' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {row.status}
                  </span>
                )
              },
              { key: 'recordedBy', label: 'Dicatat Oleh' }
            ]}
            data={mockRecordings}
            title="Pencatatan Dokumen Rekam Medis"
            searchable
            exportable
          />
        );

      case 'storage':
        return (
          <DataTable
            columns={[
              { key: 'medicalRecordNumber', label: 'No. Rekam Medis', sortable: true },
              { key: 'patientName', label: 'Nama Pasien', sortable: true },
              { key: 'storageLocation', label: 'Lokasi Penyimpanan', sortable: true },
              { key: 'storageDate', label: 'Tanggal Simpan', sortable: true },
              { key: 'documentCount', label: 'Jumlah Dokumen' },
              { 
                key: 'status', 
                label: 'Status',
                render: (row) => (
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                    {row.status}
                  </span>
                )
              }
            ]}
            data={mockStorage}
            title="Penyimpanan Dokumen Rekam Medis"
            searchable
            exportable
          />
        );

      case 'distribution':
        return (
          <DataTable
            columns={[
              { key: 'medicalRecordNumber', label: 'No. Rekam Medis', sortable: true },
              { key: 'patientName', label: 'Nama Pasien', sortable: true },
              { key: 'requestDate', label: 'Tanggal Permintaan', sortable: true },
              { key: 'requestedBy', label: 'Diminta Oleh' },
              { key: 'purpose', label: 'Tujuan' },
              { key: 'distributionDate', label: 'Tanggal Distribusi' },
              { 
                key: 'status', 
                label: 'Status',
                render: (row) => (
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    row.status === 'Dikembalikan' ? 'bg-green-100 text-green-800' : 
                    row.status === 'Dipinjam' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {row.status}
                  </span>
                )
              }
            ]}
            data={mockDistribution}
            title="Distribusi Dokumen Rekam Medis"
            searchable
            exportable
          />
        );

      case 'claims':
        return (
          <DataTable
            columns={[
              { key: 'claimNumber', label: 'No. Klaim', sortable: true },
              { key: 'patientName', label: 'Nama Pasien', sortable: true },
              { key: 'service', label: 'Layanan' },
              { key: 'claimDate', label: 'Tanggal Klaim', sortable: true },
              { key: 'totalClaim', label: 'Total Klaim', sortable: true },
              { key: 'claimType', label: 'Jenis Klaim' },
              { 
                key: 'status', 
                label: 'Status',
                render: (row) => (
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    row.status === 'Disetujui' ? 'bg-green-100 text-green-800' : 
                    row.status === 'Diajukan' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {row.status}
                  </span>
                )
              }
            ]}
            data={mockClaims}
            title="Pengajuan Klaim"
            searchable
            exportable
          />
        );

      case 'sirs':
        return (
          <DataTable
            columns={[
              { key: 'reportType', label: 'Jenis Laporan', sortable: true },
              { key: 'period', label: 'Periode', sortable: true },
              { key: 'generatedDate', label: 'Tanggal Generate', sortable: true },
              { key: 'generatedBy', label: 'Dibuat Oleh' },
              { 
                key: 'status', 
                label: 'Status',
                render: (row) => (
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    row.status === 'Terkirim' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {row.status}
                  </span>
                )
              }
            ]}
            data={mockSIRS}
            title="Rekapitulasi Laporan SIRS"
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
        title="Rekam Medik"
        subtitle="Manajemen pencatatan, penyimpanan, distribusi dokumen rekam medis dan klaim"
        breadcrumbItems={[
          { label: 'Front Office', path: '/' },
          { label: 'Rekam Medik', path: '/medical-records' }
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
    </div>
  );
};

export default MedicalRecordsPage;
