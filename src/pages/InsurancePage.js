import React, { useState } from 'react';
import { Shield, FileText, Send, ClipboardCheck, DollarSign } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import DataTable from '../components/common/DataTable';
import CRUDModal from '../components/common/CRUDModal';

const InsurancePage = () => {
  const [activeTab, setActiveTab] = useState('bpjs');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  const tabs = [
    { id: 'bpjs', label: 'Pasien BPJS', icon: Shield },
    { id: 'non-bpjs', label: 'Pasien Non-BPJS', icon: FileText },
    { id: 'submission', label: 'Pengajuan Klaim', icon: Send },
    { id: 'management', label: 'Manajemen Klaim', icon: ClipboardCheck },
    { id: 'payment', label: 'Penerimaan Pembayaran', icon: DollarSign }
  ];

  const mockBPJSPatients = [
    {
      id: 'BP001',
      patientName: 'Mayor Budi Santoso',
      bpjsNumber: '0001234567890',
      registrationNumber: 'RJ-2024-001',
      service: 'Rawat Jalan',
      doctor: 'dr. Kolonel Ahmad, Sp.PD',
      diagnosis: 'Hipertensi Stage 2',
      visitDate: '2024-01-15',
      claimStatus: 'Pending',
      estimatedClaim: 215000
    },
    {
      id: 'BP002',
      patientName: 'Kapten Ahmad Yani',
      bpjsNumber: '0001234567891',
      registrationNumber: 'RI-2024-005',
      service: 'Rawat Inap',
      doctor: 'dr. Mayor Siti, Sp.B',
      diagnosis: 'Appendisitis Akut',
      visitDate: '2024-01-14',
      claimStatus: 'Approved',
      estimatedClaim: 8500000
    }
  ];

  const mockNonBPJSPatients = [
    {
      id: 'NB001',
      patientName: 'Letda Andi Wijaya',
      insuranceType: 'Asuransi Swasta - Prudential',
      policyNumber: 'PRU-2024-001',
      registrationNumber: 'RJ-2024-010',
      service: 'Rawat Jalan',
      doctor: 'dr. Mayor Hendra, Sp.JP',
      diagnosis: 'Aritmia',
      visitDate: '2024-01-15',
      claimStatus: 'Submitted',
      estimatedClaim: 450000
    },
    {
      id: 'NB002',
      patientName: 'Sertu Bambang',
      insuranceType: 'Asuransi Swasta - Allianz',
      policyNumber: 'ALL-2024-005',
      registrationNumber: 'RI-2024-012',
      service: 'Rawat Inap',
      doctor: 'dr. Kolonel Dewi, Sp.OG',
      diagnosis: 'Persalinan Normal',
      visitDate: '2024-01-13',
      claimStatus: 'Processing',
      estimatedClaim: 12000000
    }
  ];

  const mockClaimSubmissions = [
    {
      id: 'CS001',
      claimNumber: 'CLM-2024-001',
      patientName: 'Mayor Budi Santoso',
      insuranceType: 'BPJS',
      service: 'Rawat Jalan',
      submissionDate: '2024-01-16',
      claimAmount: 215000,
      status: 'Draft',
      documents: 'Resume Medis, Kwitansi'
    },
    {
      id: 'CS002',
      claimNumber: 'CLM-2024-002',
      patientName: 'Kapten Ahmad Yani',
      insuranceType: 'BPJS',
      service: 'Rawat Inap',
      submissionDate: '2024-01-15',
      claimAmount: 8500000,
      status: 'Submitted',
      documents: 'Resume Medis, Billing, Hasil Lab'
    }
  ];

  const mockClaimManagement = [
    {
      id: 'CM001',
      claimNumber: 'CLM-2024-002',
      patientName: 'Kapten Ahmad Yani',
      insuranceType: 'BPJS',
      submissionDate: '2024-01-15',
      claimAmount: 8500000,
      approvedAmount: 8500000,
      status: 'Approved',
      notes: 'Klaim disetujui penuh'
    },
    {
      id: 'CM002',
      claimNumber: 'CLM-2024-003',
      patientName: 'Letda Andi Wijaya',
      insuranceType: 'Asuransi Swasta',
      submissionDate: '2024-01-14',
      claimAmount: 450000,
      approvedAmount: 400000,
      status: 'Partially Approved',
      notes: 'Beberapa item tidak dicover'
    }
  ];

  const mockClaimPayments = [
    {
      id: 'CP001',
      receiptNumber: 'RCP-2024-001',
      claimNumber: 'CLM-2024-002',
      patientName: 'Kapten Ahmad Yani',
      insuranceType: 'BPJS',
      approvedAmount: 8500000,
      receivedAmount: 8500000,
      paymentDate: '2024-01-16',
      paymentMethod: 'Transfer Bank',
      status: 'Received'
    },
    {
      id: 'CP002',
      receiptNumber: 'RCP-2024-002',
      claimNumber: 'CLM-2024-003',
      patientName: 'Letda Andi Wijaya',
      insuranceType: 'Asuransi Swasta',
      approvedAmount: 400000,
      receivedAmount: 400000,
      paymentDate: '2024-01-17',
      paymentMethod: 'Transfer Bank',
      status: 'Received'
    }
  ];

  const getStatusColor = (status) => {
    const statusColors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Approved': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800',
      'Draft': 'bg-gray-100 text-gray-800',
      'Submitted': 'bg-blue-100 text-blue-800',
      'Processing': 'bg-purple-100 text-purple-800',
      'Partially Approved': 'bg-orange-100 text-orange-800',
      'Received': 'bg-green-100 text-green-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const bpjsColumns = [
    { key: 'patientName', label: 'Nama Pasien' },
    { key: 'bpjsNumber', label: 'No. BPJS' },
    { key: 'registrationNumber', label: 'No. Registrasi' },
    { key: 'service', label: 'Layanan' },
    { key: 'diagnosis', label: 'Diagnosis' },
    { key: 'visitDate', label: 'Tanggal Kunjungan' },
    { 
      key: 'estimatedClaim', 
      label: 'Estimasi Klaim',
      render: (row) => formatRupiah(row.estimatedClaim)
    },
    {
      key: 'claimStatus',
      label: 'Status',
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(row.claimStatus)}`}>
          {row.claimStatus}
        </span>
      )
    },
    { key: 'actions', label: 'Aksi', actions: true }
  ];

  const nonBpjsColumns = [
    { key: 'patientName', label: 'Nama Pasien' },
    { key: 'insuranceType', label: 'Jenis Asuransi' },
    { key: 'policyNumber', label: 'No. Polis' },
    { key: 'service', label: 'Layanan' },
    { key: 'diagnosis', label: 'Diagnosis' },
    { key: 'visitDate', label: 'Tanggal Kunjungan' },
    { 
      key: 'estimatedClaim', 
      label: 'Estimasi Klaim',
      render: (row) => formatRupiah(row.estimatedClaim)
    },
    {
      key: 'claimStatus',
      label: 'Status',
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(row.claimStatus)}`}>
          {row.claimStatus}
        </span>
      )
    },
    { key: 'actions', label: 'Aksi', actions: true }
  ];

  const submissionColumns = [
    { key: 'claimNumber', label: 'No. Klaim' },
    { key: 'patientName', label: 'Nama Pasien' },
    { key: 'insuranceType', label: 'Asuransi' },
    { key: 'service', label: 'Layanan' },
    { key: 'submissionDate', label: 'Tgl Pengajuan' },
    { 
      key: 'claimAmount', 
      label: 'Nilai Klaim',
      render: (row) => formatRupiah(row.claimAmount)
    },
    { key: 'documents', label: 'Dokumen' },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(row.status)}`}>
          {row.status}
        </span>
      )
    },
    { key: 'actions', label: 'Aksi', actions: true }
  ];

  const managementColumns = [
    { key: 'claimNumber', label: 'No. Klaim' },
    { key: 'patientName', label: 'Nama Pasien' },
    { key: 'insuranceType', label: 'Asuransi' },
    { key: 'submissionDate', label: 'Tgl Pengajuan' },
    { 
      key: 'claimAmount', 
      label: 'Nilai Klaim',
      render: (row) => formatRupiah(row.claimAmount)
    },
    { 
      key: 'approvedAmount', 
      label: 'Nilai Disetujui',
      render: (row) => formatRupiah(row.approvedAmount)
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(row.status)}`}>
          {row.status}
        </span>
      )
    },
    { key: 'notes', label: 'Catatan' },
    { key: 'actions', label: 'Aksi', actions: true }
  ];

  const paymentColumns = [
    { key: 'receiptNumber', label: 'No. Kwitansi' },
    { key: 'claimNumber', label: 'No. Klaim' },
    { key: 'patientName', label: 'Nama Pasien' },
    { key: 'insuranceType', label: 'Asuransi' },
    { 
      key: 'approvedAmount', 
      label: 'Nilai Disetujui',
      render: (row) => formatRupiah(row.approvedAmount)
    },
    { 
      key: 'receivedAmount', 
      label: 'Nilai Diterima',
      render: (row) => formatRupiah(row.receivedAmount)
    },
    { key: 'paymentDate', label: 'Tgl Pembayaran' },
    { key: 'paymentMethod', label: 'Metode' },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(row.status)}`}>
          {row.status}
        </span>
      )
    },
    { key: 'actions', label: 'Aksi', actions: true }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'bpjs':
        return (
          <DataTable
            columns={bpjsColumns}
            data={mockBPJSPatients}
            title="Data Pasien BPJS"
            searchable
            exportable
            onView={(row) => { setSelectedItem(row); setModalType('view'); setIsModalOpen(true); }}
            onEdit={(row) => { setSelectedItem(row); setModalType('edit'); setIsModalOpen(true); }}
          />
        );
      case 'non-bpjs':
        return (
          <DataTable
            columns={nonBpjsColumns}
            data={mockNonBPJSPatients}
            title="Data Pasien Non-BPJS"
            searchable
            exportable
            onView={(row) => { setSelectedItem(row); setModalType('view'); setIsModalOpen(true); }}
            onEdit={(row) => { setSelectedItem(row); setModalType('edit'); setIsModalOpen(true); }}
          />
        );
      case 'submission':
        return (
          <DataTable
            columns={submissionColumns}
            data={mockClaimSubmissions}
            title="Pengajuan Klaim"
            searchable
            exportable
            onView={(row) => { setSelectedItem(row); setModalType('view'); setIsModalOpen(true); }}
            onEdit={(row) => { setSelectedItem(row); setModalType('edit'); setIsModalOpen(true); }}
          />
        );
      case 'management':
        return (
          <DataTable
            columns={managementColumns}
            data={mockClaimManagement}
            title="Manajemen Klaim"
            searchable
            exportable
            onView={(row) => { setSelectedItem(row); setModalType('view'); setIsModalOpen(true); }}
            onEdit={(row) => { setSelectedItem(row); setModalType('edit'); setIsModalOpen(true); }}
          />
        );
      case 'payment':
        return (
          <DataTable
            columns={paymentColumns}
            data={mockClaimPayments}
            title="Penerimaan Pembayaran Klaim"
            searchable
            exportable
            onView={(row) => { setSelectedItem(row); setModalType('view'); setIsModalOpen(true); }}
          />
        );
      default:
        return null;
    }
  };

  const breadcrumbItems = [
    { label: 'Back Office', path: '#' },
    { label: 'Asuransi Penjamin', path: '/insurance' }
  ];

  return (
    <div className="p-6">
      <PageHeader
        title="Asuransi Penjamin"
        subtitle="Manajemen Pasien Jaminan dan Klaim Asuransi"
        breadcrumbItems={breadcrumbItems}
      />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-1 overflow-x-auto" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>

      <CRUDModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalType === 'view' ? 'Detail' : 'Edit'}
        size="large"
      >
        {selectedItem && (
          <div className="space-y-4">
            <pre className="text-sm">{JSON.stringify(selectedItem, null, 2)}</pre>
          </div>
        )}
      </CRUDModal>
    </div>
  );
};

export default InsurancePage;
