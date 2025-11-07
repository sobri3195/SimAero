import React, { useState } from 'react';
import { Package, Pill, FileText } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import DataTable from '../components/common/DataTable';

const InventoryPage = () => {
  const [activeTab, setActiveTab] = useState('drugs-stock');

  const tabs = [
    { id: 'drugs-stock', label: 'Stok Obat & Alkes', icon: Pill },
    { id: 'goods-stock', label: 'Stok Barang', icon: Package },
    { id: 'drugs-card', label: 'Kartu Stok Obat & Alkes', icon: FileText },
    { id: 'goods-card', label: 'Kartu Stok Barang', icon: FileText }
  ];

  const mockDrugsStock = [
    { id: 'OB001', code: 'OB-001', name: 'Paracetamol 500mg', category: 'Obat', unit: 'Tablet', currentStock: 500, minStock: 200, value: 'Rp 250.000', location: 'Rak A1' },
    { id: 'OB002', code: 'OB-002', name: 'Amoxicillin 500mg', category: 'Obat', unit: 'Kapsul', currentStock: 150, minStock: 200, value: 'Rp 120.000', location: 'Rak A2' },
    { id: 'AL001', code: 'AL-001', name: 'Spuit 3cc', category: 'Alkes', unit: 'Pcs', currentStock: 800, minStock: 500, value: 'Rp 1.200.000', location: 'Rak B1' }
  ];

  const mockGoodsStock = [
    { id: 'BR001', code: 'BR-001', name: 'Kertas A4', category: 'ATK', unit: 'Rim', currentStock: 50, minStock: 20, value: 'Rp 2.000.000', location: 'Gudang ATK' },
    { id: 'BR002', code: 'BR-002', name: 'Tinta Printer', category: 'ATK', unit: 'Botol', currentStock: 15, minStock: 10, value: 'Rp 1.500.000', location: 'Gudang ATK' },
    { id: 'BR003', code: 'BR-003', name: 'Sarung Tangan Medis', category: 'Consumable', unit: 'Box', currentStock: 100, minStock: 50, value: 'Rp 5.000.000', location: 'Gudang Medis' }
  ];

  const mockDrugsStockCard = [
    { id: 'KS001', date: '2024-01-15', itemName: 'Paracetamol 500mg', transactionType: 'Masuk', quantity: 200, balance: 500, reference: 'PO-2024-001', note: 'Pembelian' },
    { id: 'KS002', date: '2024-01-16', itemName: 'Paracetamol 500mg', transactionType: 'Keluar', quantity: 50, balance: 450, reference: 'RJ-2024-001', note: 'Resep Pasien' }
  ];

  const mockGoodsStockCard = [
    { id: 'KB001', date: '2024-01-15', itemName: 'Kertas A4', transactionType: 'Masuk', quantity: 20, balance: 50, reference: 'PO-2024-002', note: 'Pembelian' },
    { id: 'KB002', date: '2024-01-16', itemName: 'Kertas A4', transactionType: 'Keluar', quantity: 5, balance: 45, reference: 'REQ-001', note: 'Permintaan Unit' }
  ];

  const getStockStatus = (stock, minStock) => {
    if (stock <= minStock * 0.5) return { color: 'bg-red-100 text-red-800', label: 'Kritis' };
    if (stock <= minStock) return { color: 'bg-yellow-100 text-yellow-800', label: 'Rendah' };
    return { color: 'bg-green-100 text-green-800', label: 'Aman' };
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'drugs-stock':
        return (
          <DataTable
            columns={[
              { key: 'code', label: 'Kode', sortable: true },
              { key: 'name', label: 'Nama Item', sortable: true },
              { key: 'category', label: 'Kategori', sortable: true },
              { 
                key: 'currentStock', 
                label: 'Stok Saat Ini',
                sortable: true,
                render: (row) => {
                  const status = getStockStatus(row.currentStock, row.minStock);
                  return (
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">{row.currentStock} {row.unit}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                  );
                }
              },
              { key: 'minStock', label: 'Stok Minimal', render: (row) => `${row.minStock} ${row.unit}` },
              { key: 'value', label: 'Nilai', sortable: true },
              { key: 'location', label: 'Lokasi' }
            ]}
            data={mockDrugsStock}
            title="Informasi Stok Obat dan Alat Kesehatan"
            searchable
            exportable
            onView={(item) => alert(`Detail: ${item.name}`)}
          />
        );

      case 'goods-stock':
        return (
          <DataTable
            columns={[
              { key: 'code', label: 'Kode', sortable: true },
              { key: 'name', label: 'Nama Barang', sortable: true },
              { key: 'category', label: 'Kategori', sortable: true },
              { 
                key: 'currentStock', 
                label: 'Stok Saat Ini',
                sortable: true,
                render: (row) => {
                  const status = getStockStatus(row.currentStock, row.minStock);
                  return (
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">{row.currentStock} {row.unit}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                  );
                }
              },
              { key: 'minStock', label: 'Stok Minimal', render: (row) => `${row.minStock} ${row.unit}` },
              { key: 'value', label: 'Nilai', sortable: true },
              { key: 'location', label: 'Lokasi' }
            ]}
            data={mockGoodsStock}
            title="Informasi Stok Barang"
            searchable
            exportable
            onView={(item) => alert(`Detail: ${item.name}`)}
          />
        );

      case 'drugs-card':
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
              <h4 className="font-semibold text-blue-900">Paracetamol 500mg</h4>
              <p className="text-sm text-blue-700">Kode: OB-001 | Unit: Tablet | Stok Saat Ini: 450</p>
            </div>
            <DataTable
              columns={[
                { key: 'date', label: 'Tanggal', sortable: true },
                { 
                  key: 'transactionType', 
                  label: 'Jenis Transaksi',
                  render: (row) => (
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      row.transactionType === 'Masuk' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {row.transactionType}
                    </span>
                  )
                },
                { key: 'quantity', label: 'Jumlah', sortable: true },
                { key: 'balance', label: 'Saldo', sortable: true },
                { key: 'reference', label: 'Referensi' },
                { key: 'note', label: 'Keterangan' }
              ]}
              data={mockDrugsStockCard}
              title="Kartu Stok Obat dan Alkes"
              searchable
              exportable
            />
          </div>
        );

      case 'goods-card':
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
              <h4 className="font-semibold text-blue-900">Kertas A4</h4>
              <p className="text-sm text-blue-700">Kode: BR-001 | Unit: Rim | Stok Saat Ini: 45</p>
            </div>
            <DataTable
              columns={[
                { key: 'date', label: 'Tanggal', sortable: true },
                { 
                  key: 'transactionType', 
                  label: 'Jenis Transaksi',
                  render: (row) => (
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      row.transactionType === 'Masuk' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {row.transactionType}
                    </span>
                  )
                },
                { key: 'quantity', label: 'Jumlah', sortable: true },
                { key: 'balance', label: 'Saldo', sortable: true },
                { key: 'reference', label: 'Referensi' },
                { key: 'note', label: 'Keterangan' }
              ]}
              data={mockGoodsStockCard}
              title="Kartu Stok Barang"
              searchable
              exportable
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
        title="Inventory"
        subtitle="Informasi stok dan kartu stok obat, alkes, dan barang"
        breadcrumbItems={[
          { label: 'Front Office', path: '/' },
          { label: 'Inventory', path: '/inventory' }
        ]}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Obat & Alkes</p>
              <p className="text-2xl font-bold text-blue-600">1,250 Item</p>
            </div>
            <Pill className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Barang</p>
              <p className="text-2xl font-bold text-green-600">350 Item</p>
            </div>
            <Package className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Item Stok Rendah</p>
              <p className="text-2xl font-bold text-red-600">28 Item</p>
            </div>
            <FileText className="w-8 h-8 text-red-600" />
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
    </div>
  );
};

export default InventoryPage;
