import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from '../mockDb';
import { db } from '../mockDb';
import { UserPlus, Eye } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import DataTable from '../components/common/DataTable';
import PageHeader from '../components/common/PageHeader';
import CRUDModal from '../components/common/CRUDModal';

const PatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [formData, setFormData] = useState({
    nik: '',
    nrp: '',
    nama: '',
    tanggalLahir: '',
    jenisKelamin: 'L',
    alamat: '',
    telepon: '',
    email: '',
    golonganDarah: '',
    statusPasien: 'Umum',
    insuranceType: 'Umum'
  });

  const { selectedFaskes, userRole } = useAuth();
  const { addNotification } = useApp();

  useEffect(() => {
    loadPatients();
  }, [selectedFaskes]);

  const loadPatients = async () => {
    try {
      setLoading(true);
      let q;
      if (userRole === 'PUSKESAU') {
        q = collection(db, 'patients');
      } else {
        q = query(collection(db, 'patients'), where('faskesId', '==', selectedFaskes || 'default'));
      }
      const querySnapshot = await getDocs(q);
      const patientList = [];
      querySnapshot.forEach((doc) => {
        patientList.push({ id: doc.id, ...doc.data() });
      });
      setPatients(patientList);
    } catch (error) {
      console.error('Error loading patients:', error);
      addNotification({ type: 'error', message: 'Gagal memuat data pasien' });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedPatient(null);
    setFormData({
      nik: '',
      nrp: '',
      nama: '',
      tanggalLahir: '',
      jenisKelamin: 'L',
      alamat: '',
      telepon: '',
      email: '',
      golonganDarah: '',
      statusPasien: 'Umum',
      insuranceType: 'Umum'
    });
    setModalOpen(true);
  };

  const handleEdit = (patient) => {
    setSelectedPatient(patient);
    setFormData({
      nik: patient.nik || '',
      nrp: patient.nrp || '',
      nama: patient.nama || '',
      tanggalLahir: patient.tanggalLahir || '',
      jenisKelamin: patient.jenisKelamin || 'L',
      alamat: patient.alamat || '',
      telepon: patient.telepon || '',
      email: patient.email || '',
      golonganDarah: patient.golonganDarah || '',
      statusPasien: patient.statusPasien || 'Umum',
      insuranceType: patient.insuranceType || 'Umum'
    });
    setModalOpen(true);
  };

  const handleView = (patient) => {
    setSelectedPatient(patient);
    setViewModalOpen(true);
  };

  const handleDelete = async (patient) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus pasien ${patient.nama}?`)) {
      try {
        await deleteDoc(doc(db, 'patients', patient.id));
        addNotification({ type: 'success', message: 'Pasien berhasil dihapus' });
        loadPatients();
      } catch (error) {
        console.error('Error deleting patient:', error);
        addNotification({ type: 'error', message: 'Gagal menghapus pasien' });
      }
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!formData.nama || !formData.nik) {
      addNotification({ type: 'error', message: 'Nama dan NIK wajib diisi' });
      return;
    }

    try {
      const patientData = {
        ...formData,
        faskesId: selectedFaskes || 'default',
        updatedAt: new Date().toISOString()
      };

      if (selectedPatient) {
        await updateDoc(doc(db, 'patients', selectedPatient.id), patientData);
        addNotification({ type: 'success', message: 'Data pasien berhasil diperbarui' });
      } else {
        await addDoc(collection(db, 'patients'), {
          ...patientData,
          createdAt: new Date().toISOString()
        });
        addNotification({ type: 'success', message: 'Pasien baru berhasil ditambahkan' });
      }

      setModalOpen(false);
      loadPatients();
    } catch (error) {
      console.error('Error saving patient:', error);
      addNotification({ type: 'error', message: 'Gagal menyimpan data pasien' });
    }
  };

  const columns = [
    { key: 'nik', label: 'NIK' },
    { key: 'nrp', label: 'NRP', render: (row) => row.nrp || '-' },
    { key: 'nama', label: 'Nama Lengkap' },
    { key: 'tanggalLahir', label: 'Tanggal Lahir' },
    { 
      key: 'jenisKelamin', 
      label: 'Jenis Kelamin',
      render: (row) => row.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'
    },
    { key: 'telepon', label: 'Telepon' },
    { 
      key: 'statusPasien', 
      label: 'Status',
      render: (row) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          row.statusPasien === 'Prajurit' ? 'bg-green-100 text-green-800' :
          row.statusPasien === 'PNS' ? 'bg-blue-100 text-blue-800' :
          row.statusPasien === 'Keluarga' ? 'bg-purple-100 text-purple-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {row.statusPasien}
        </span>
      )
    },
    { key: 'actions', label: 'Aksi', actions: true, className: 'text-center' }
  ];

  if (loading) {
    return (
      <div>
        <PageHeader 
          title="Database Pasien" 
          subtitle="Manajemen data pasien terpusat"
          breadcrumbItems={[
            { label: 'Home', path: '/' },
            { label: 'Database Pasien', path: '/patients' }
          ]}
        />
        <div className="text-center py-12">
          <p className="text-gray-600">Memuat data pasien...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader 
        title="Database Pasien" 
        subtitle="Manajemen data pasien terpusat"
        breadcrumbItems={[
          { label: 'Home', path: '/' },
          { label: 'Database Pasien', path: '/patients' }
        ]}
        actionLabel="Tambah Pasien"
        actionIcon={UserPlus}
        onActionClick={handleAdd}
      />

      <DataTable
        columns={columns}
        data={patients}
        title="Data Pasien"
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
        title={selectedPatient ? 'Edit Data Pasien' : 'Tambah Pasien Baru'}
        onSubmit={handleSubmit}
        size="large"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                NIK <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.nik}
                onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                NRP (Opsional)
              </label>
              <input
                type="text"
                value={formData.nrp}
                onChange={(e) => setFormData({ ...formData, nrp: e.target.value })}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Lahir
              </label>
              <input
                type="date"
                value={formData.tanggalLahir}
                onChange={(e) => setFormData({ ...formData, tanggalLahir: e.target.value })}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jenis Kelamin
              </label>
              <select
                value={formData.jenisKelamin}
                onChange={(e) => setFormData({ ...formData, jenisKelamin: e.target.value })}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Golongan Darah
              </label>
              <select
                value={formData.golonganDarah}
                onChange={(e) => setFormData({ ...formData, golonganDarah: e.target.value })}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Pilih Golongan Darah</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="AB">AB</option>
                <option value="O">O</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status Pasien
              </label>
              <select
                value={formData.statusPasien}
                onChange={(e) => setFormData({ ...formData, statusPasien: e.target.value })}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Umum">Umum</option>
                <option value="Prajurit">Prajurit</option>
                <option value="PNS">PNS</option>
                <option value="Keluarga">Keluarga</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telepon
              </label>
              <input
                type="tel"
                value={formData.telepon}
                onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alamat
              </label>
              <textarea
                value={formData.alamat}
                onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                rows="3"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipe Asuransi
              </label>
              <select
                value={formData.insuranceType}
                onChange={(e) => setFormData({ ...formData, insuranceType: e.target.value })}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Umum">Umum</option>
                <option value="BPJS">BPJS</option>
                <option value="ASKES TNI">ASKES TNI</option>
              </select>
            </div>
          </div>
        </form>
      </CRUDModal>

      {/* View Modal */}
      <CRUDModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="Detail Pasien"
        submitLabel="Tutup"
        onSubmit={() => setViewModalOpen(false)}
        size="large"
      >
        {selectedPatient && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">NIK</p>
                <p className="font-semibold">{selectedPatient.nik}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">NRP</p>
                <p className="font-semibold">{selectedPatient.nrp || '-'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg md:col-span-2">
                <p className="text-sm text-gray-600">Nama Lengkap</p>
                <p className="font-semibold">{selectedPatient.nama}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Tanggal Lahir</p>
                <p className="font-semibold">{selectedPatient.tanggalLahir}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Jenis Kelamin</p>
                <p className="font-semibold">{selectedPatient.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Golongan Darah</p>
                <p className="font-semibold">{selectedPatient.golonganDarah || '-'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Status Pasien</p>
                <p className="font-semibold">{selectedPatient.statusPasien}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Telepon</p>
                <p className="font-semibold">{selectedPatient.telepon}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold">{selectedPatient.email || '-'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg md:col-span-2">
                <p className="text-sm text-gray-600">Alamat</p>
                <p className="font-semibold">{selectedPatient.alamat || '-'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Tipe Asuransi</p>
                <p className="font-semibold">{selectedPatient.insuranceType}</p>
              </div>
            </div>
          </div>
        )}
      </CRUDModal>
    </div>
  );
};

export default PatientsPage;
