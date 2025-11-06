import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from '../mockDb';
import { db } from '../mockDb';
import { Pill, Plus, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import DataTable from '../components/common/DataTable';
import PageHeader from '../components/common/PageHeader';
import CRUDModal from '../components/common/CRUDModal';

const PharmacyPage = () => {
  const [drugs, setDrugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    genericName: '',
    category: 'Antibiotik',
    stock: '0',
    minStock: '10',
    unit: 'tablet',
    price: '0',
    expiryDate: '',
    batchNumber: '',
    supplier: '',
    description: ''
  });

  const { selectedFaskes, userRole } = useAuth();
  const { addNotification } = useApp();

  useEffect(() => {
    loadDrugs();
  }, [selectedFaskes]);

  const loadDrugs = async () => {
    try {
      setLoading(true);
      let q;
      if (userRole === 'PUSKESAU') {
        q = collection(db, 'drugs');
      } else {
        q = query(collection(db, 'drugs'), where('faskesId', '==', selectedFaskes || 'default'));
      }
      const querySnapshot = await getDocs(q);
      const drugList = [];
      querySnapshot.forEach((doc) => {
        drugList.push({ id: doc.id, ...doc.data() });
      });
      setDrugs(drugList);
    } catch (error) {
      console.error('Error loading drugs:', error);
      addNotification({ type: 'error', message: 'Gagal memuat data obat' });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedDrug(null);
    setFormData({
      name: '',
      genericName: '',
      category: 'Antibiotik',
      stock: '0',
      minStock: '10',
      unit: 'tablet',
      price: '0',
      expiryDate: '',
      batchNumber: '',
      supplier: '',
      description: ''
    });
    setModalOpen(true);
  };

  const handleEdit = (drug) => {
    setSelectedDrug(drug);
    setFormData({
      name: drug.name || '',
      genericName: drug.genericName || '',
      category: drug.category || 'Antibiotik',
      stock: drug.stock || '0',
      minStock: drug.minStock || '10',
      unit: drug.unit || 'tablet',
      price: drug.price || '0',
      expiryDate: drug.expiryDate || '',
      batchNumber: drug.batchNumber || '',
      supplier: drug.supplier || '',
      description: drug.description || ''
    });
    setModalOpen(true);
  };

  const handleView = (drug) => {
    setSelectedDrug(drug);
    setViewModalOpen(true);
  };

  const handleDelete = async (drug) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus obat ${drug.name}?`)) {
      try {
        await deleteDoc(doc(db, 'drugs', drug.id));
        addNotification({ type: 'success', message: 'Obat berhasil dihapus' });
        loadDrugs();
      } catch (error) {
        console.error('Error deleting drug:', error);
        addNotification({ type: 'error', message: 'Gagal menghapus obat' });
      }
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!formData.name) {
      addNotification({ type: 'error', message: 'Nama obat wajib diisi' });
      return;
    }

    try {
      const drugData = {
        ...formData,
        faskesId: selectedFaskes || 'default',
        updatedAt: new Date().toISOString()
      };

      if (selectedDrug) {
        await updateDoc(doc(db, 'drugs', selectedDrug.id), drugData);
        addNotification({ type: 'success', message: 'Data obat berhasil diperbarui' });
      } else {
        await addDoc(collection(db, 'drugs'), {
          ...drugData,
          createdAt: new Date().toISOString()
        });
        addNotification({ type: 'success', message: 'Obat baru berhasil ditambahkan' });
      }

      setModalOpen(false);
      loadDrugs();
    } catch (error) {
      console.error('Error saving drug:', error);
      addNotification({ type: 'error', message: 'Gagal menyimpan data obat' });
    }
  };

  const lowStockDrugs = drugs.filter(drug => {
    const stock = parseInt(drug.stock) || 0;
    const minStock = parseInt(drug.minStock) || 10;
    return stock < minStock;
  });

  const columns = [
    { key: 'name', label: 'Nama Obat' },
    { key: 'genericName', label: 'Nama Generik', render: (row) => row.genericName || '-' },
    { key: 'category', label: 'Kategori' },
    { 
      key: 'stock', 
      label: 'Stok',
      render: (row) => {
        const stock = parseInt(row.stock) || 0;
        const minStock = parseInt(row.minStock) || 10;
        const isLow = stock < minStock;
        return (
          <span className={`font-medium ${isLow ? 'text-red-600' : 'text-green-600'}`}>
            {stock} {row.unit}
            {isLow && ' ⚠️'}
          </span>
        );
      }
    },
    { 
      key: 'price', 
      label: 'Harga',
      render: (row) => `Rp ${parseInt(row.price || 0).toLocaleString('id-ID')}`
    },
    { 
      key: 'expiryDate', 
      label: 'Kadaluarsa',
      render: (row) => {
        if (!row.expiryDate) return '-';
        const expDate = new Date(row.expiryDate);
        const today = new Date();
        const monthsUntilExp = (expDate - today) / (1000 * 60 * 60 * 24 * 30);
        const isExpiringSoon = monthsUntilExp < 3 && monthsUntilExp > 0;
        const isExpired = expDate < today;
        
        return (
          <span className={`${
            isExpired ? 'text-red-600 font-medium' :
            isExpiringSoon ? 'text-orange-600 font-medium' :
            'text-gray-600'
          }`}>
            {expDate.toLocaleDateString('id-ID')}
            {isExpired && ' (Expired)'}
            {isExpiringSoon && !isExpired && ' (Segera Exp)'}
          </span>
        );
      }
    },
    { key: 'supplier', label: 'Supplier', render: (row) => row.supplier || '-' },
    { key: 'actions', label: 'Aksi', actions: true, className: 'text-center' }
  ];

  if (loading) {
    return (
      <div>
        <PageHeader 
          title="Farmasi & Apotek" 
          subtitle="Manajemen persediaan obat dan farmasi"
          breadcrumbItems={[
            { label: 'Home', path: '/' },
            { label: 'Farmasi', path: '/pharmacy' }
          ]}
        />
        <div className="text-center py-12">
          <p className="text-gray-600">Memuat data obat...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader 
        title="Farmasi & Apotek" 
        subtitle="Manajemen persediaan obat dan farmasi"
        breadcrumbItems={[
          { label: 'Home', path: '/' },
          { label: 'Farmasi', path: '/pharmacy' }
        ]}
        actionLabel="Tambah Obat"
        actionIcon={Pill}
        onActionClick={handleAdd}
      />

      {/* Alert for low stock */}
      {lowStockDrugs.length > 0 && (
        <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-yellow-600" size={24} />
            <div>
              <p className="font-semibold text-yellow-800">Peringatan Stok Rendah</p>
              <p className="text-sm text-yellow-700">
                Terdapat {lowStockDrugs.length} obat dengan stok di bawah batas minimum
              </p>
            </div>
          </div>
        </div>
      )}

      <DataTable
        columns={columns}
        data={drugs}
        title="Data Obat"
        searchable={true}
        exportable={true}
        pagination={true}
        itemsPerPage={10}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Create/Edit Modal */}
      <CRUDModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedDrug ? 'Edit Data Obat' : 'Tambah Obat Baru'}
        onSubmit={handleSubmit}
        size="large"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Obat <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Generik
              </label>
              <input
                type="text"
                value={formData.genericName}
                onChange={(e) => setFormData({ ...formData, genericName: e.target.value })}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Antibiotik">Antibiotik</option>
                <option value="Analgesik">Analgesik</option>
                <option value="Antipiretik">Antipiretik</option>
                <option value="Antihipertensi">Antihipertensi</option>
                <option value="Antidiabetes">Antidiabetes</option>
                <option value="Antihistamin">Antihistamin</option>
                <option value="Vitamin">Vitamin & Suplemen</option>
                <option value="Obat Luar">Obat Luar</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Satuan
              </label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="tablet">Tablet</option>
                <option value="kapsul">Kapsul</option>
                <option value="botol">Botol</option>
                <option value="ampul">Ampul</option>
                <option value="tube">Tube</option>
                <option value="box">Box</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stok
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stok Minimum
              </label>
              <input
                type="number"
                value={formData.minStock}
                onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Harga (Rp)
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Kadaluarsa
              </label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nomor Batch
              </label>
              <input
                type="text"
                value={formData.batchNumber}
                onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supplier
              </label>
              <input
                type="text"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi / Keterangan
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </form>
      </CRUDModal>

      {/* View Modal */}
      <CRUDModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="Detail Obat"
        submitLabel="Tutup"
        onSubmit={() => setViewModalOpen(false)}
        size="large"
      >
        {selectedDrug && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Nama Obat</p>
                <p className="font-semibold">{selectedDrug.name}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Nama Generik</p>
                <p className="font-semibold">{selectedDrug.genericName || '-'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Kategori</p>
                <p className="font-semibold">{selectedDrug.category}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Stok</p>
                <p className="font-semibold">{selectedDrug.stock} {selectedDrug.unit}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Stok Minimum</p>
                <p className="font-semibold">{selectedDrug.minStock || '10'} {selectedDrug.unit}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Harga</p>
                <p className="font-semibold">Rp {parseInt(selectedDrug.price || 0).toLocaleString('id-ID')}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Tanggal Kadaluarsa</p>
                <p className="font-semibold">
                  {selectedDrug.expiryDate 
                    ? new Date(selectedDrug.expiryDate).toLocaleDateString('id-ID')
                    : '-'
                  }
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Nomor Batch</p>
                <p className="font-semibold">{selectedDrug.batchNumber || '-'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg md:col-span-2">
                <p className="text-sm text-gray-600">Supplier</p>
                <p className="font-semibold">{selectedDrug.supplier || '-'}</p>
              </div>
              {selectedDrug.description && (
                <div className="p-4 bg-gray-50 rounded-lg md:col-span-2">
                  <p className="text-sm text-gray-600">Deskripsi</p>
                  <p className="font-semibold">{selectedDrug.description}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </CRUDModal>
    </div>
  );
};

export default PharmacyPage;
