import React, { useState } from 'react';
import { ShoppingCart, TrendingUp, Users, FileText, RotateCcw } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import DataTable from '../components/common/DataTable';
import CRUDModal from '../components/common/CRUDModal';

const ProcurementPage = () => {
  const [activeTab, setActiveTab] = useState('manual-po');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  const tabs = [
    { id: 'manual-po', label: 'Purchase Order Manual', icon: ShoppingCart },
    { id: 'recommended-po', label: 'PO dari Rekomendasi', icon: TrendingUp },
    { id: 'supplier', label: 'Manajemen Supplier', icon: Users },
    { id: 'management', label: 'Manajemen PO', icon: FileText },
    { id: 'return', label: 'Retur Barang', icon: RotateCcw }
  ];

  const mockManualPO = [
    {
      id: 'PO001',
      poNumber: 'PO-2024-001',
      supplier: 'PT Alkes Medika',
      poDate: '2024-01-15',
      requestedBy: 'Kepala Gudang',
      itemCount: 5,
      totalValue: 15000000,
      deliveryDate: '2024-01-25',
      status: 'Pending Approval'
    },
    {
      id: 'PO002',
      poNumber: 'PO-2024-002',
      supplier: 'PT Medical Supplies',
      poDate: '2024-01-14',
      requestedBy: 'Kepala Farmasi',
      itemCount: 3,
      totalValue: 8500000,
      deliveryDate: '2024-01-24',
      status: 'Approved'
    }
  ];

  const mockRecommendedPO = [
    {
      id: 'RPO001',
      itemName: 'Masker N95',
      currentStock: 25,
      recommendedOrder: 175,
      supplier: 'PT Alkes Prima',
      unitPrice: 15000,
      totalValue: 2625000,
      priority: 'Tinggi',
      status: 'Draft'
    },
    {
      id: 'RPO002',
      itemName: 'Sarung Tangan Medis',
      currentStock: 45,
      recommendedOrder: 100,
      supplier: 'PT Medical Supplies',
      unitPrice: 12000,
      totalValue: 1200000,
      priority: 'Sedang',
      status: 'Not Created'
    }
  ];

  const mockSuppliers = [
    {
      id: 'SUP001',
      supplierCode: 'SUP-001',
      supplierName: 'PT Alkes Medika',
      contact: '021-1234567',
      email: 'sales@alkesmedika.com',
      address: 'Jakarta Selatan',
      category: 'Alat Kesehatan',
      paymentTerm: '30 Hari',
      status: 'Active'
    },
    {
      id: 'SUP002',
      supplierCode: 'SUP-002',
      supplierName: 'PT Medical Supplies',
      contact: '021-7654321',
      email: 'info@medicalsupplies.com',
      address: 'Jakarta Barat',
      category: 'Obat-obatan',
      paymentTerm: '45 Hari',
      status: 'Active'
    }
  ];

  const mockPOManagement = [
    {
      id: 'POM001',
      poNumber: 'PO-2024-001',
      supplier: 'PT Alkes Medika',
      poDate: '2024-01-15',
      totalValue: 15000000,
      deliveryDate: '2024-01-25',
      receivedDate: '2024-01-26',
      paymentStatus: 'Unpaid',
      status: 'Delivered'
    },
    {
      id: 'POM002',
      poNumber: 'PO-2024-002',
      supplier: 'PT Medical Supplies',
      poDate: '2024-01-14',
      totalValue: 8500000,
      deliveryDate: '2024-01-24',
      receivedDate: '',
      paymentStatus: 'Unpaid',
      status: 'In Transit'
    }
  ];

  const mockReturns = [
    {
      id: 'RET001',
      returnNumber: 'RET-2024-001',
      poNumber: 'PO-2024-001',
      supplier: 'PT Alkes Medika',
      itemName: 'Sarung Tangan Medis',
      quantity: 5,
      reason: 'Barang Rusak',
      returnDate: '2024-01-16',
      status: 'Approved'
    },
    {
      id: 'RET002',
      returnNumber: 'RET-2024-002',
      poNumber: 'PO-2024-002',
      supplier: 'PT Medical Supplies',
      itemName: 'Masker Bedah',
      quantity: 10,
      reason: 'Tidak Sesuai Spesifikasi',
      returnDate: '2024-01-17',
      status: 'Pending'
    }
  ];

  const getStatusColor = (status) => {
    const statusColors = {
      'Pending Approval': 'bg-yellow-100 text-yellow-800',
      'Approved': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800',
      'Draft': 'bg-gray-100 text-gray-800',
      'Not Created': 'bg-gray-100 text-gray-800',
      'Active': 'bg-green-100 text-green-800',
      'Inactive': 'bg-red-100 text-red-800',
      'Delivered': 'bg-green-100 text-green-800',
      'In Transit': 'bg-blue-100 text-blue-800',
      'Unpaid': 'bg-yellow-100 text-yellow-800',
      'Paid': 'bg-green-100 text-green-800',
      'Pending': 'bg-yellow-100 text-yellow-800'
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

  const manualPOColumns = [
    { key: 'poNumber', label: 'No. PO' },
    { key: 'supplier', label: 'Supplier' },
    { key: 'poDate', label: 'Tanggal PO' },
    { key: 'requestedBy', label: 'Diminta Oleh' },
    { key: 'itemCount', label: 'Jumlah Item' },
    { 
      key: 'totalValue', 
      label: 'Total Nilai',
      render: (row) => formatRupiah(row.totalValue)
    },
    { key: 'deliveryDate', label: 'Tgl Kirim' },
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

  const recommendedPOColumns = [
    { key: 'itemName', label: 'Nama Barang' },
    { key: 'currentStock', label: 'Stok' },
    { key: 'recommendedOrder', label: 'Rekomendasi' },
    { key: 'supplier', label: 'Supplier' },
    { 
      key: 'unitPrice', 
      label: 'Harga Satuan',
      render: (row) => formatRupiah(row.unitPrice)
    },
    { 
      key: 'totalValue', 
      label: 'Total',
      render: (row) => formatRupiah(row.totalValue)
    },
    {
      key: 'priority',
      label: 'Prioritas',
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          row.priority === 'Tinggi' ? 'bg-red-100 text-red-800' :
          row.priority === 'Sedang' ? 'bg-yellow-100 text-yellow-800' :
          'bg-green-100 text-green-800'
        }`}>
          {row.priority}
        </span>
      )
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
    { key: 'actions', label: 'Aksi', actions: true }
  ];

  const supplierColumns = [
    { key: 'supplierCode', label: 'Kode' },
    { key: 'supplierName', label: 'Nama Supplier' },
    { key: 'contact', label: 'Telepon' },
    { key: 'email', label: 'Email' },
    { key: 'address', label: 'Alamat' },
    { key: 'category', label: 'Kategori' },
    { key: 'paymentTerm', label: 'Term Pembayaran' },
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
    { key: 'poNumber', label: 'No. PO' },
    { key: 'supplier', label: 'Supplier' },
    { key: 'poDate', label: 'Tgl PO' },
    { 
      key: 'totalValue', 
      label: 'Total Nilai',
      render: (row) => formatRupiah(row.totalValue)
    },
    { key: 'deliveryDate', label: 'Tgl Kirim' },
    { key: 'receivedDate', label: 'Tgl Terima' },
    {
      key: 'paymentStatus',
      label: 'Status Bayar',
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(row.paymentStatus)}`}>
          {row.paymentStatus}
        </span>
      )
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
    { key: 'actions', label: 'Aksi', actions: true }
  ];

  const returnColumns = [
    { key: 'returnNumber', label: 'No. Retur' },
    { key: 'poNumber', label: 'No. PO' },
    { key: 'supplier', label: 'Supplier' },
    { key: 'itemName', label: 'Nama Barang' },
    { key: 'quantity', label: 'Jumlah' },
    { key: 'reason', label: 'Alasan' },
    { key: 'returnDate', label: 'Tanggal' },
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
      case 'manual-po':
        return (
          <DataTable
            columns={manualPOColumns}
            data={mockManualPO}
            title="Purchase Order Manual"
            searchable
            exportable
            onView={(row) => { setSelectedItem(row); setModalType('view'); setIsModalOpen(true); }}
            onEdit={(row) => { setSelectedItem(row); setModalType('edit'); setIsModalOpen(true); }}
          />
        );
      case 'recommended-po':
        return (
          <DataTable
            columns={recommendedPOColumns}
            data={mockRecommendedPO}
            title="Purchase Order dari Rekomendasi"
            searchable
            exportable
            onView={(row) => { setSelectedItem(row); setModalType('view'); setIsModalOpen(true); }}
          />
        );
      case 'supplier':
        return (
          <DataTable
            columns={supplierColumns}
            data={mockSuppliers}
            title="Manajemen Supplier"
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
            data={mockPOManagement}
            title="Manajemen Purchase Order"
            searchable
            exportable
            onView={(row) => { setSelectedItem(row); setModalType('view'); setIsModalOpen(true); }}
            onEdit={(row) => { setSelectedItem(row); setModalType('edit'); setIsModalOpen(true); }}
          />
        );
      case 'return':
        return (
          <DataTable
            columns={returnColumns}
            data={mockReturns}
            title="Retur Barang"
            searchable
            exportable
            onView={(row) => { setSelectedItem(row); setModalType('view'); setIsModalOpen(true); }}
            onEdit={(row) => { setSelectedItem(row); setModalType('edit'); setIsModalOpen(true); }}
          />
        );
      default:
        return null;
    }
  };

  const breadcrumbItems = [
    { label: 'Back Office', path: '#' },
    { label: 'Pengadaan/Pembelian', path: '/procurement' }
  ];

  return (
    <div className="p-6">
      <PageHeader
        title="Pengadaan/Pembelian"
        subtitle="Manajemen Purchase Order dan Supplier"
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

export default ProcurementPage;
