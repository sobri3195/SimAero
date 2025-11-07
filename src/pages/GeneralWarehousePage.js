import React, { useState } from 'react';
import { Package, TrendingUp, Inbox, Trash2, ArrowRightLeft, ClipboardCheck } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import DataTable from '../components/common/DataTable';
import CRUDModal from '../components/common/CRUDModal';

const GeneralWarehousePage = () => {
  const [activeTab, setActiveTab] = useState('info');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  const tabs = [
    { id: 'info', label: 'Informasi Barang', icon: Package },
    { id: 'auto-order', label: 'Rekomendasi Pemesanan', icon: TrendingUp },
    { id: 'receiving', label: 'Penerimaan Barang', icon: Inbox },
    { id: 'disposal', label: 'Pemusnahan Barang', icon: Trash2 },
    { id: 'transfer', label: 'Mutasi Barang', icon: ArrowRightLeft },
    { id: 'opname', label: 'Stok Opname', icon: ClipboardCheck }
  ];

  const mockItems = [
    {
      id: 'I001',
      itemCode: 'BRG-2024-001',
      itemName: 'Sarung Tangan Medis (Box)',
      category: 'Alat Kesehatan',
      unit: 'Box',
      currentStock: 150,
      minStock: 50,
      maxStock: 300,
      location: 'Gudang A - Rak 1',
      lastRestockDate: '2024-01-10',
      status: 'Aman'
    },
    {
      id: 'I002',
      itemCode: 'BRG-2024-002',
      itemName: 'Masker N95',
      category: 'Alat Pelindung Diri',
      unit: 'Pcs',
      currentStock: 25,
      minStock: 30,
      maxStock: 200,
      location: 'Gudang A - Rak 2',
      lastRestockDate: '2024-01-05',
      status: 'Rendah'
    }
  ];

  const mockAutoOrders = [
    {
      id: 'AO001',
      itemCode: 'BRG-2024-002',
      itemName: 'Masker N95',
      currentStock: 25,
      minStock: 30,
      averageUsage: 15,
      recommendedOrder: 175,
      estimatedDuration: '3 bulan',
      priority: 'Tinggi',
      status: 'Perlu Dipesan'
    },
    {
      id: 'AO002',
      itemCode: 'BRG-2024-005',
      itemName: 'Alkohol 70%',
      currentStock: 40,
      minStock: 50,
      averageUsage: 10,
      recommendedOrder: 150,
      estimatedDuration: '3 bulan',
      priority: 'Sedang',
      status: 'Monitoring'
    }
  ];

  const mockReceiving = [
    {
      id: 'RC001',
      receiptNumber: 'RCV-2024-001',
      poNumber: 'PO-2024-010',
      supplier: 'PT Alkes Medika',
      receiptDate: '2024-01-15',
      receivedBy: 'Siti Nurhaliza',
      itemCount: 5,
      totalValue: 15000000,
      status: 'Selesai'
    },
    {
      id: 'RC002',
      receiptNumber: 'RCV-2024-002',
      poNumber: 'PO-2024-011',
      supplier: 'PT Medical Supplies',
      receiptDate: '2024-01-16',
      receivedBy: 'Ahmad Fauzi',
      itemCount: 3,
      totalValue: 8500000,
      status: 'Pending Verifikasi'
    }
  ];

  const mockDisposal = [
    {
      id: 'DS001',
      disposalNumber: 'DSP-2024-001',
      itemName: 'Sarung Tangan Medis (Box)',
      quantity: 10,
      unit: 'Box',
      reason: 'Kadaluarsa',
      expiryDate: '2023-12-31',
      disposalDate: '2024-01-15',
      approvedBy: 'dr. Mayor Hendra',
      status: 'Approved'
    },
    {
      id: 'DS002',
      disposalNumber: 'DSP-2024-002',
      itemName: 'Masker Bedah',
      quantity: 50,
      unit: 'Box',
      reason: 'Rusak/Cacat',
      expiryDate: '-',
      disposalDate: '2024-01-16',
      approvedBy: 'dr. Kolonel Dewi',
      status: 'Pending'
    }
  ];

  const mockTransfer = [
    {
      id: 'TR001',
      transferNumber: 'TRF-2024-001',
      itemName: 'Sarung Tangan Medis',
      quantity: 20,
      unit: 'Box',
      fromLocation: 'Gudang Umum',
      toLocation: 'Ruang IGD',
      transferDate: '2024-01-15',
      requestedBy: 'Kepala IGD',
      status: 'Completed'
    },
    {
      id: 'TR002',
      transferNumber: 'TRF-2024-002',
      itemName: 'Alkohol 70%',
      quantity: 10,
      unit: 'Liter',
      fromLocation: 'Gudang Umum',
      toLocation: 'Instalasi Farmasi',
      transferDate: '2024-01-16',
      requestedBy: 'Kepala Farmasi',
      status: 'In Transit'
    }
  ];

  const mockOpname = [
    {
      id: 'OP001',
      opnameNumber: 'OPN-2024-001',
      opnameDate: '2024-01-15',
      location: 'Gudang A',
      itemsChecked: 150,
      discrepancies: 3,
      performedBy: 'Tim Gudang',
      status: 'Completed'
    },
    {
      id: 'OP002',
      opnameNumber: 'OPN-2024-002',
      opnameDate: '2024-01-16',
      location: 'Gudang B',
      itemsChecked: 0,
      discrepancies: 0,
      performedBy: 'Tim Gudang',
      status: 'In Progress'
    }
  ];

  const getStatusColor = (status) => {
    const statusColors = {
      'Aman': 'bg-green-100 text-green-800',
      'Rendah': 'bg-yellow-100 text-yellow-800',
      'Kritis': 'bg-red-100 text-red-800',
      'Perlu Dipesan': 'bg-red-100 text-red-800',
      'Monitoring': 'bg-yellow-100 text-yellow-800',
      'Selesai': 'bg-green-100 text-green-800',
      'Pending Verifikasi': 'bg-yellow-100 text-yellow-800',
      'Approved': 'bg-green-100 text-green-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Completed': 'bg-green-100 text-green-800',
      'In Transit': 'bg-blue-100 text-blue-800',
      'In Progress': 'bg-blue-100 text-blue-800'
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

  const itemColumns = [
    { key: 'itemCode', label: 'Kode Barang' },
    { key: 'itemName', label: 'Nama Barang' },
    { key: 'category', label: 'Kategori' },
    { key: 'currentStock', label: 'Stok' },
    { key: 'unit', label: 'Satuan' },
    { key: 'location', label: 'Lokasi' },
    { key: 'lastRestockDate', label: 'Terakhir Restock' },
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

  const autoOrderColumns = [
    { key: 'itemCode', label: 'Kode' },
    { key: 'itemName', label: 'Nama Barang' },
    { key: 'currentStock', label: 'Stok' },
    { key: 'averageUsage', label: 'Rata-rata Pakai/Hari' },
    { key: 'recommendedOrder', label: 'Rekomendasi Order' },
    { key: 'estimatedDuration', label: 'Estimasi Durasi' },
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
    { key: 'actions', label: 'Aksi', actions: true }
  ];

  const receivingColumns = [
    { key: 'receiptNumber', label: 'No. Penerimaan' },
    { key: 'poNumber', label: 'No. PO' },
    { key: 'supplier', label: 'Supplier' },
    { key: 'receiptDate', label: 'Tanggal' },
    { key: 'receivedBy', label: 'Diterima Oleh' },
    { key: 'itemCount', label: 'Jumlah Item' },
    { 
      key: 'totalValue', 
      label: 'Total Nilai',
      render: (row) => formatRupiah(row.totalValue)
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

  const disposalColumns = [
    { key: 'disposalNumber', label: 'No. Pemusnahan' },
    { key: 'itemName', label: 'Nama Barang' },
    { key: 'quantity', label: 'Jumlah' },
    { key: 'unit', label: 'Satuan' },
    { key: 'reason', label: 'Alasan' },
    { key: 'disposalDate', label: 'Tanggal' },
    { key: 'approvedBy', label: 'Disetujui Oleh' },
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

  const transferColumns = [
    { key: 'transferNumber', label: 'No. Mutasi' },
    { key: 'itemName', label: 'Nama Barang' },
    { key: 'quantity', label: 'Jumlah' },
    { key: 'fromLocation', label: 'Dari' },
    { key: 'toLocation', label: 'Ke' },
    { key: 'transferDate', label: 'Tanggal' },
    { key: 'requestedBy', label: 'Diminta Oleh' },
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

  const opnameColumns = [
    { key: 'opnameNumber', label: 'No. Opname' },
    { key: 'opnameDate', label: 'Tanggal' },
    { key: 'location', label: 'Lokasi' },
    { key: 'itemsChecked', label: 'Item Diperiksa' },
    { key: 'discrepancies', label: 'Selisih' },
    { key: 'performedBy', label: 'Dilakukan Oleh' },
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
      case 'info':
        return (
          <DataTable
            columns={itemColumns}
            data={mockItems}
            title="Informasi Barang"
            searchable
            exportable
            onView={(row) => { setSelectedItem(row); setModalType('view'); setIsModalOpen(true); }}
            onEdit={(row) => { setSelectedItem(row); setModalType('edit'); setIsModalOpen(true); }}
          />
        );
      case 'auto-order':
        return (
          <DataTable
            columns={autoOrderColumns}
            data={mockAutoOrders}
            title="Rekomendasi Pemesanan Otomatis"
            searchable
            exportable
            onView={(row) => { setSelectedItem(row); setModalType('view'); setIsModalOpen(true); }}
          />
        );
      case 'receiving':
        return (
          <DataTable
            columns={receivingColumns}
            data={mockReceiving}
            title="Penerimaan Barang"
            searchable
            exportable
            onView={(row) => { setSelectedItem(row); setModalType('view'); setIsModalOpen(true); }}
            onEdit={(row) => { setSelectedItem(row); setModalType('edit'); setIsModalOpen(true); }}
          />
        );
      case 'disposal':
        return (
          <DataTable
            columns={disposalColumns}
            data={mockDisposal}
            title="Pemusnahan Barang"
            searchable
            exportable
            onView={(row) => { setSelectedItem(row); setModalType('view'); setIsModalOpen(true); }}
            onEdit={(row) => { setSelectedItem(row); setModalType('edit'); setIsModalOpen(true); }}
          />
        );
      case 'transfer':
        return (
          <DataTable
            columns={transferColumns}
            data={mockTransfer}
            title="Mutasi Barang"
            searchable
            exportable
            onView={(row) => { setSelectedItem(row); setModalType('view'); setIsModalOpen(true); }}
            onEdit={(row) => { setSelectedItem(row); setModalType('edit'); setIsModalOpen(true); }}
          />
        );
      case 'opname':
        return (
          <DataTable
            columns={opnameColumns}
            data={mockOpname}
            title="Stok Opname"
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
    { label: 'Gudang Umum', path: '/general-warehouse' }
  ];

  return (
    <div className="p-6">
      <PageHeader
        title="Gudang Umum"
        subtitle="Manajemen Gudang dan Inventori Barang"
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

export default GeneralWarehousePage;
