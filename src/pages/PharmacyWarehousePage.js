import React, { useState } from 'react';
import { Package, TrendingUp, AlertTriangle, RefreshCw, Trash2, ArrowRightLeft, DollarSign } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import DataTable from '../components/common/DataTable';
import CRUDModal from '../components/common/CRUDModal';

const PharmacyWarehousePage = () => {
  const [activeTab, setActiveTab] = useState('inventory');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');

  const tabs = [
    { id: 'inventory', label: 'Informasi Obat & Alkes', icon: Package },
    { id: 'reorder', label: 'Rekomendasi Pemesanan', icon: TrendingUp },
    { id: 'receiving', label: 'Penerimaan', icon: Package },
    { id: 'expired', label: 'Pemusnahan Expired', icon: Trash2 },
    { id: 'transfer', label: 'Mutasi Obat', icon: ArrowRightLeft },
    { id: 'stockopname', label: 'Stok Opname', icon: RefreshCw }
  ];

  const mockInventory = [
    {
      id: 'OB001',
      code: 'OB-001',
      name: 'Paracetamol 500mg',
      category: 'Obat',
      unit: 'Tablet',
      stock: 500,
      minStock: 200,
      maxStock: 1000,
      price: 500,
      location: 'Rak A1',
      expiryDate: '2025-12-31',
      supplier: 'PT Kimia Farma'
    },
    {
      id: 'OB002',
      code: 'OB-002',
      name: 'Amoxicillin 500mg',
      category: 'Obat',
      unit: 'Kapsul',
      stock: 150,
      minStock: 200,
      maxStock: 800,
      price: 800,
      location: 'Rak A2',
      expiryDate: '2025-06-30',
      supplier: 'PT Kalbe Farma'
    },
    {
      id: 'AL001',
      code: 'AL-001',
      name: 'Spuit 3cc',
      category: 'Alkes',
      unit: 'Pcs',
      stock: 800,
      minStock: 500,
      maxStock: 2000,
      price: 1500,
      location: 'Rak B1',
      expiryDate: '2026-12-31',
      supplier: 'PT Medika'
    }
  ];

  const mockReorders = [
    {
      id: 'R001',
      name: 'Amoxicillin 500mg',
      currentStock: 150,
      minStock: 200,
      avgUsage: 50,
      recommendedOrder: 300,
      estimatedCost: 240000,
      priority: 'Tinggi',
      lastOrder: '2024-01-01'
    },
    {
      id: 'R002',
      name: 'Insulin Injection',
      currentStock: 30,
      minStock: 50,
      avgUsage: 15,
      recommendedOrder: 100,
      estimatedCost: 5000000,
      priority: 'Mendesak',
      lastOrder: '2023-12-15'
    }
  ];

  const mockReceiving = [
    {
      id: 'PO001',
      receiptNumber: 'PO-2024-001',
      supplier: 'PT Kimia Farma',
      receiptDate: '2024-01-15',
      totalItems: 5,
      totalAmount: 5000000,
      status: 'Diterima',
      receivedBy: 'apt. Sari Dewi'
    }
  ];

  const mockExpired = [
    {
      id: 'EX001',
      name: 'Antibiotik Amoxicillin 250mg',
      batch: 'BATCH-001',
      quantity: 50,
      unit: 'Kapsul',
      expiryDate: '2024-01-10',
      disposalDate: '2024-01-15',
      disposalMethod: 'Dimusnahkan',
      witnessedBy: 'dr. Ahmad Yusuf',
      documentNumber: 'BA-001/2024'
    }
  ];

  const mockTransfers = [
    {
      id: 'MUT001',
      transferNumber: 'MUT-2024-001',
      itemName: 'Paracetamol 500mg',
      quantity: 100,
      unit: 'Tablet',
      fromLocation: 'Gudang Utama',
      toLocation: 'Apotek Rawat Jalan',
      transferDate: '2024-01-15',
      requestedBy: 'apt. Budi Santoso',
      approvedBy: 'apt. Sari Dewi',
      status: 'Selesai'
    }
  ];

  const mockStockOpname = [
    {
      id: 'SO001',
      opnameNumber: 'SO-2024-001',
      opnameDate: '2024-01-15',
      totalItems: 150,
      matched: 145,
      shortage: 3,
      excess: 2,
      status: 'Selesai',
      executor: 'apt. Sari Dewi, S.Farm',
      supervisor: 'apt. Ahmad Yusuf, S.Farm'
    }
  ];

  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    alert('Data berhasil disimpan');
    setIsModalOpen(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStockStatus = (stock, minStock) => {
    if (stock <= minStock * 0.5) return { color: 'bg-red-100 text-red-800', label: 'Kritis' };
    if (stock <= minStock) return { color: 'bg-yellow-100 text-yellow-800', label: 'Rendah' };
    return { color: 'bg-green-100 text-green-800', label: 'Aman' };
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'inventory':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Daftar Obat dan Alat Kesehatan</h3>
              <button
                onClick={() => openModal('add-item')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                + Tambah Item
              </button>
            </div>
            <DataTable
              columns={[
                { key: 'code', label: 'Kode', sortable: true },
                { key: 'name', label: 'Nama Item', sortable: true },
                { key: 'category', label: 'Kategori', sortable: true },
                { 
                  key: 'stock', 
                  label: 'Stok',
                  sortable: true,
                  render: (row) => {
                    const status = getStockStatus(row.stock, row.minStock);
                    return (
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">{row.stock} {row.unit}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                    );
                  }
                },
                { key: 'minStock', label: 'Stok Min', render: (row) => `${row.minStock} ${row.unit}` },
                { key: 'location', label: 'Lokasi' },
                { key: 'expiryDate', label: 'Expired', sortable: true },
                { key: 'supplier', label: 'Supplier' }
              ]}
              data={mockInventory}
              searchable
              exportable
              onView={(item) => alert(`Detail: ${item.name}`)}
              onEdit={(item) => alert(`Edit: ${item.name}`)}
            />
          </div>
        );

      case 'reorder':
        return (
          <div className="space-y-4">
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-yellow-800">Rekomendasi Pemesanan Otomatis</p>
                  <p className="text-sm text-yellow-700">Sistem secara otomatis merekomendasikan pemesanan berdasarkan stok minimal dan rata-rata penggunaan</p>
                </div>
              </div>
            </div>
            <DataTable
              columns={[
                { key: 'name', label: 'Nama Item', sortable: true },
                { key: 'currentStock', label: 'Stok Saat Ini', sortable: true },
                { key: 'minStock', label: 'Stok Minimal' },
                { key: 'avgUsage', label: 'Rata-rata Pemakaian/Hari' },
                { key: 'recommendedOrder', label: 'Rekomendasi Pesan', sortable: true },
                { 
                  key: 'estimatedCost', 
                  label: 'Estimasi Biaya',
                  render: (row) => formatCurrency(row.estimatedCost)
                },
                { 
                  key: 'priority', 
                  label: 'Prioritas',
                  render: (row) => (
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      row.priority === 'Mendesak' ? 'bg-red-100 text-red-800' :
                      row.priority === 'Tinggi' ? 'bg-orange-100 text-orange-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {row.priority}
                    </span>
                  )
                },
                { key: 'lastOrder', label: 'Pemesanan Terakhir', sortable: true }
              ]}
              data={mockReorders}
              searchable
              exportable
            />
          </div>
        );

      case 'receiving':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Penerimaan Obat dan Alkes</h3>
              <button
                onClick={() => openModal('receiving')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                + Terima Barang
              </button>
            </div>
            <DataTable
              columns={[
                { key: 'receiptNumber', label: 'No. Penerimaan', sortable: true },
                { key: 'supplier', label: 'Supplier', sortable: true },
                { key: 'receiptDate', label: 'Tanggal Terima', sortable: true },
                { key: 'totalItems', label: 'Jumlah Item' },
                { 
                  key: 'totalAmount', 
                  label: 'Total Nilai',
                  render: (row) => formatCurrency(row.totalAmount)
                },
                { 
                  key: 'status', 
                  label: 'Status',
                  render: (row) => (
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      row.status === 'Diterima' ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {row.status}
                    </span>
                  )
                },
                { key: 'receivedBy', label: 'Diterima Oleh' }
              ]}
              data={mockReceiving}
              searchable
              exportable
              onView={(item) => alert(`Detail penerimaan: ${item.receiptNumber}`)}
            />
          </div>
        );

      case 'expired':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Pemusnahan Obat Expired</h3>
              <button
                onClick={() => openModal('disposal')}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                + Buat Berita Acara Pemusnahan
              </button>
            </div>
            <DataTable
              columns={[
                { key: 'name', label: 'Nama Item', sortable: true },
                { key: 'batch', label: 'Batch Number' },
                { key: 'quantity', label: 'Jumlah', render: (row) => `${row.quantity} ${row.unit}` },
                { key: 'expiryDate', label: 'Tanggal Expired', sortable: true },
                { key: 'disposalDate', label: 'Tanggal Pemusnahan', sortable: true },
                { key: 'disposalMethod', label: 'Metode' },
                { key: 'witnessedBy', label: 'Disaksikan Oleh' },
                { key: 'documentNumber', label: 'No. Dokumen' }
              ]}
              data={mockExpired}
              searchable
              exportable
            />
          </div>
        );

      case 'transfer':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Mutasi Obat dan Alkes</h3>
              <button
                onClick={() => openModal('transfer')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                + Buat Mutasi
              </button>
            </div>
            <DataTable
              columns={[
                { key: 'transferNumber', label: 'No. Mutasi', sortable: true },
                { key: 'itemName', label: 'Nama Item', sortable: true },
                { key: 'quantity', label: 'Jumlah', render: (row) => `${row.quantity} ${row.unit}` },
                { key: 'fromLocation', label: 'Dari' },
                { key: 'toLocation', label: 'Ke' },
                { key: 'transferDate', label: 'Tanggal', sortable: true },
                { key: 'requestedBy', label: 'Diminta Oleh' },
                { key: 'approvedBy', label: 'Disetujui Oleh' },
                { 
                  key: 'status', 
                  label: 'Status',
                  render: (row) => (
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      row.status === 'Selesai' ? 'bg-green-100 text-green-800' :
                      row.status === 'Proses' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {row.status}
                    </span>
                  )
                }
              ]}
              data={mockTransfers}
              searchable
              exportable
            />
          </div>
        );

      case 'stockopname':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Stok Opname</h3>
              <button
                onClick={() => openModal('stockopname')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                + Buat Stok Opname
              </button>
            </div>
            <DataTable
              columns={[
                { key: 'opnameNumber', label: 'No. Stok Opname', sortable: true },
                { key: 'opnameDate', label: 'Tanggal', sortable: true },
                { key: 'totalItems', label: 'Total Item' },
                { 
                  key: 'matched', 
                  label: 'Sesuai',
                  render: (row) => <span className="text-green-600 font-semibold">{row.matched}</span>
                },
                { 
                  key: 'shortage', 
                  label: 'Kurang',
                  render: (row) => <span className="text-red-600 font-semibold">{row.shortage}</span>
                },
                { 
                  key: 'excess', 
                  label: 'Lebih',
                  render: (row) => <span className="text-blue-600 font-semibold">{row.excess}</span>
                },
                { 
                  key: 'status', 
                  label: 'Status',
                  render: (row) => (
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      row.status === 'Selesai' ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {row.status}
                    </span>
                  )
                },
                { key: 'executor', label: 'Pelaksana' },
                { key: 'supervisor', label: 'Supervisor' }
              ]}
              data={mockStockOpname}
              searchable
              exportable
              onView={(item) => alert(`Detail: ${item.opnameNumber}`)}
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
        title="Gudang Farmasi"
        subtitle="Manajemen inventory obat dan alat kesehatan, pemesanan, penerimaan, dan stok opname"
        breadcrumbItems={[
          { label: 'Front Office', path: '/' },
          { label: 'Gudang Farmasi', path: '/pharmacy-warehouse' }
        ]}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Item</p>
              <p className="text-2xl font-bold text-blue-600">1,250</p>
            </div>
            <Package className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Stok Rendah</p>
              <p className="text-2xl font-bold text-yellow-600">25</p>
            </div>
            <TrendingUp className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Akan Expired (3 bulan)</p>
              <p className="text-2xl font-bold text-orange-600">12</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Nilai Inventory</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(150000000)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
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

      {/* Modal */}
      <CRUDModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          modalType === 'add-item' ? 'Tambah Item Baru' :
          modalType === 'receiving' ? 'Penerimaan Barang' :
          modalType === 'disposal' ? 'Berita Acara Pemusnahan' :
          modalType === 'transfer' ? 'Mutasi Obat/Alkes' :
          'Stok Opname'
        }
        onSubmit={handleSave}
        size="xl"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Form untuk {modalType}</p>
        </div>
      </CRUDModal>
    </div>
  );
};

export default PharmacyWarehousePage;
