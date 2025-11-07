import React, { useState } from 'react';
import { User, FileText, Activity, Pill, MessageSquare, History, DollarSign, Send } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import DataTable from '../components/common/DataTable';
import CRUDModal from '../components/common/CRUDModal';

const OutpatientPage = () => {
  const [activeTab, setActiveTab] = useState('patients');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');

  const tabs = [
    { id: 'patients', label: 'Informasi Pasien', icon: User },
    { id: 'assessment', label: 'Assessment Awal', icon: Activity },
    { id: 'soap', label: 'SOAP', icon: FileText },
    { id: 'procedures', label: 'Tindakan & BMHP', icon: Activity },
    { id: 'prescription', label: 'Reseptur', icon: Pill },
    { id: 'cppt', label: 'CPPT', icon: MessageSquare },
    { id: 'verbal', label: 'Verbal Order', icon: Send },
    { id: 'billing', label: 'Rincian Tagihan', icon: DollarSign },
    { id: 'history', label: 'Riwayat Pasien', icon: History }
  ];

  const mockPatients = [
    { 
      id: 'P001', 
      registrationNumber: 'RJ-2024-001',
      patientName: 'Mayor Budi Santoso', 
      rank: 'Mayor',
      age: '45 tahun',
      gender: 'Laki-laki',
      poly: 'Poli Penyakit Dalam',
      doctor: 'dr. Kolonel Ahmad Yusuf, Sp.PD',
      visitTime: '08:30',
      status: 'Menunggu'
    },
    { 
      id: 'P002', 
      registrationNumber: 'RJ-2024-002',
      patientName: 'Kapten Ahmad Yani', 
      rank: 'Kapten',
      age: '38 tahun',
      gender: 'Laki-laki',
      poly: 'Poli Anak',
      doctor: 'dr. Mayor Siti Nurhaliza, Sp.A',
      visitTime: '09:00',
      status: 'Pemeriksaan'
    }
  ];

  const mockSOAP = [
    { id: 'S001', date: '2024-01-15', time: '08:30', subjective: 'Pasien mengeluh demam sejak 3 hari', objective: 'TD: 130/80, Suhu: 38.5°C', assessment: 'Febris suspect infeksi', plan: 'Paracetamol 3x500mg, observasi' }
  ];

  const mockProcedures = [
    { id: 'T001', date: '2024-01-15', procedureName: 'Pemasangan Infus', quantity: 1, price: 'Rp 50.000', total: 'Rp 50.000', executor: 'Ns. Sari, S.Kep' }
  ];

  const mockPrescriptions = [
    { id: 'R001', date: '2024-01-15', drugName: 'Paracetamol 500mg', quantity: '30 tablet', dosage: '3x1 tablet', route: 'Oral', duration: '10 hari' }
  ];

  const mockCPPT = [
    { id: 'C001', date: '2024-01-15', time: '08:30', profession: 'Dokter', note: 'Pasien demam, vital sign stabil', instruction: 'Paracetamol, monitor suhu', professional: 'dr. Kolonel Ahmad, Sp.PD' }
  ];

  const mockVerbalOrders = [
    { id: 'V001', date: '2024-01-15', time: '08:45', orderingDoctor: 'dr. Kolonel Ahmad, Sp.PD', receivingNurse: 'Ns. Sari, S.Kep', order: 'Berikan Paracetamol 500mg per oral', status: 'Dikonfirmasi' }
  ];

  const mockBilling = [
    { id: 'B001', category: 'Konsultasi', description: 'Konsultasi Dokter Spesialis', quantity: 1, price: 'Rp 150.000', total: 'Rp 150.000' },
    { id: 'B002', category: 'Tindakan', description: 'Pemasangan Infus', quantity: 1, price: 'Rp 50.000', total: 'Rp 50.000' },
    { id: 'B003', category: 'Obat', description: 'Paracetamol 500mg', quantity: 30, price: 'Rp 500', total: 'Rp 15.000' }
  ];

  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleAssessment = () => {
    alert('Menyimpan assessment awal...');
    setIsModalOpen(false);
  };

  const handleSOAP = () => {
    alert('Menyimpan SOAP...');
    setIsModalOpen(false);
  };

  const handleProcedure = () => {
    alert('Menyimpan tindakan...');
    setIsModalOpen(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'patients':
        return (
          <DataTable
            columns={[
              { key: 'registrationNumber', label: 'No. Registrasi', sortable: true },
              { key: 'patientName', label: 'Nama Pasien', sortable: true },
              { key: 'rank', label: 'Pangkat' },
              { key: 'poly', label: 'Poliklinik', sortable: true },
              { key: 'doctor', label: 'Dokter' },
              { key: 'visitTime', label: 'Jam Kunjungan', sortable: true },
              { 
                key: 'status', 
                label: 'Status',
                render: (row) => (
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    row.status === 'Menunggu' ? 'bg-yellow-100 text-yellow-800' :
                    row.status === 'Pemeriksaan' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {row.status}
                  </span>
                )
              }
            ]}
            data={mockPatients}
            title="Daftar Pasien Rawat Jalan Hari Ini"
            searchable
            exportable
            onView={(patient) => alert(`Melihat detail: ${patient.patientName}`)}
          />
        );

      case 'assessment':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Assessment Awal Pasien</h3>
              <button
                onClick={() => openModal('assessment')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                + Tambah Assessment
              </button>
            </div>
            <div className="bg-white p-6 rounded-lg border">
              <h4 className="font-semibold mb-4">Mayor Budi Santoso - RJ-2024-001</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-700">Keluhan Utama</p>
                  <p className="text-sm text-gray-600">Demam sejak 3 hari yang lalu</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Riwayat Penyakit Sekarang</p>
                  <p className="text-sm text-gray-600">Demam naik turun, disertai batuk dan pilek</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Vital Sign</p>
                  <p className="text-sm text-gray-600">TD: 130/80 mmHg, Nadi: 88x/menit, RR: 20x/menit, Suhu: 38.5°C</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Alergi</p>
                  <p className="text-sm text-gray-600">Tidak ada</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'soap':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">SOAP (Subjective, Objective, Assessment, Plan)</h3>
              <button
                onClick={() => openModal('soap')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                + Tambah SOAP
              </button>
            </div>
            <DataTable
              columns={[
                { key: 'date', label: 'Tanggal', sortable: true },
                { key: 'time', label: 'Waktu' },
                { key: 'subjective', label: 'Subjective' },
                { key: 'objective', label: 'Objective' },
                { key: 'assessment', label: 'Assessment' },
                { key: 'plan', label: 'Plan' }
              ]}
              data={mockSOAP}
              searchable
              exportable
            />
          </div>
        );

      case 'procedures':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Tindakan dan BMHP</h3>
              <button
                onClick={() => openModal('procedure')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                + Tambah Tindakan
              </button>
            </div>
            <DataTable
              columns={[
                { key: 'date', label: 'Tanggal', sortable: true },
                { key: 'procedureName', label: 'Nama Tindakan' },
                { key: 'quantity', label: 'Jumlah' },
                { key: 'price', label: 'Harga Satuan' },
                { key: 'total', label: 'Total' },
                { key: 'executor', label: 'Pelaksana' }
              ]}
              data={mockProcedures}
              searchable
              exportable
            />
          </div>
        );

      case 'prescription':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Resep Obat (E-Prescribing)</h3>
              <button
                onClick={() => openModal('prescription')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                + Tambah Resep
              </button>
            </div>
            <DataTable
              columns={[
                { key: 'date', label: 'Tanggal', sortable: true },
                { key: 'drugName', label: 'Nama Obat' },
                { key: 'quantity', label: 'Jumlah' },
                { key: 'dosage', label: 'Dosis' },
                { key: 'route', label: 'Cara Pemberian' },
                { key: 'duration', label: 'Lama Pemberian' }
              ]}
              data={mockPrescriptions}
              searchable
              exportable
            />
          </div>
        );

      case 'cppt':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">CPPT (Catatan Perkembangan Pasien Terintegrasi)</h3>
              <button
                onClick={() => openModal('cppt')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                + Tambah CPPT
              </button>
            </div>
            <DataTable
              columns={[
                { key: 'date', label: 'Tanggal', sortable: true },
                { key: 'time', label: 'Waktu' },
                { key: 'profession', label: 'Profesi' },
                { key: 'note', label: 'Catatan' },
                { key: 'instruction', label: 'Instruksi' },
                { key: 'professional', label: 'Profesional' }
              ]}
              data={mockCPPT}
              searchable
              exportable
            />
          </div>
        );

      case 'verbal':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Verbal Order</h3>
              <button
                onClick={() => openModal('verbal')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                + Tambah Verbal Order
              </button>
            </div>
            <DataTable
              columns={[
                { key: 'date', label: 'Tanggal', sortable: true },
                { key: 'time', label: 'Waktu' },
                { key: 'orderingDoctor', label: 'Dokter Pemberi Instruksi' },
                { key: 'receivingNurse', label: 'Perawat Penerima' },
                { key: 'order', label: 'Instruksi' },
                { 
                  key: 'status', 
                  label: 'Status',
                  render: (row) => (
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      row.status === 'Dikonfirmasi' ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {row.status}
                    </span>
                  )
                }
              ]}
              data={mockVerbalOrders}
              searchable
              exportable
            />
          </div>
        );

      case 'billing':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Rincian Tagihan Pasien</h3>
            <DataTable
              columns={[
                { key: 'category', label: 'Kategori', sortable: true },
                { key: 'description', label: 'Keterangan' },
                { key: 'quantity', label: 'Jumlah' },
                { key: 'price', label: 'Harga Satuan' },
                { key: 'total', label: 'Total', sortable: true }
              ]}
              data={mockBilling}
              searchable
              exportable
            />
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total Tagihan:</span>
                <span className="text-2xl font-bold text-blue-600">Rp 215.000</span>
              </div>
            </div>
          </div>
        );

      case 'history':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Riwayat Kunjungan Pasien</h3>
            <div className="bg-white p-6 rounded-lg border space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="text-sm text-gray-500">15 Januari 2024</p>
                <p className="font-semibold">Poli Penyakit Dalam</p>
                <p className="text-sm text-gray-600">Diagnosis: Febris suspect infeksi</p>
                <p className="text-sm text-gray-600">Dokter: dr. Kolonel Ahmad Yusuf, Sp.PD</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <p className="text-sm text-gray-500">10 Januari 2024</p>
                <p className="font-semibold">Poli Umum</p>
                <p className="text-sm text-gray-600">Diagnosis: Common Cold</p>
                <p className="text-sm text-gray-600">Dokter: dr. Mayor Budi Santoso</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Rawat Jalan"
        subtitle="Manajemen pasien rawat jalan, pemeriksaan, dan dokumentasi medis"
        breadcrumbItems={[
          { label: 'Front Office', path: '/' },
          { label: 'Rawat Jalan', path: '/outpatient' }
        ]}
      />

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

      {/* Modals */}
      <CRUDModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          modalType === 'assessment' ? 'Assessment Awal Pasien' :
          modalType === 'soap' ? 'Tambah SOAP' :
          modalType === 'procedure' ? 'Tambah Tindakan' :
          modalType === 'prescription' ? 'Tambah Resep' :
          modalType === 'cppt' ? 'Tambah CPPT' :
          'Tambah Verbal Order'
        }
        onSubmit={
          modalType === 'assessment' ? handleAssessment :
          modalType === 'soap' ? handleSOAP :
          handleProcedure
        }
        size="xl"
      >
        {modalType === 'assessment' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Keluhan Utama</label>
              <textarea className="w-full px-3 py-2 border rounded-lg" rows="2"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Riwayat Penyakit Sekarang</label>
              <textarea className="w-full px-3 py-2 border rounded-lg" rows="3"></textarea>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tekanan Darah</label>
                <input type="text" className="w-full px-3 py-2 border rounded-lg" placeholder="120/80" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nadi</label>
                <input type="text" className="w-full px-3 py-2 border rounded-lg" placeholder="80" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Suhu</label>
                <input type="text" className="w-full px-3 py-2 border rounded-lg" placeholder="36.5" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">RR</label>
                <input type="text" className="w-full px-3 py-2 border rounded-lg" placeholder="20" />
              </div>
            </div>
          </div>
        )}

        {modalType === 'soap' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subjective (Keluhan Pasien)</label>
              <textarea className="w-full px-3 py-2 border rounded-lg" rows="2"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Objective (Temuan Klinis)</label>
              <textarea className="w-full px-3 py-2 border rounded-lg" rows="2"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assessment (Diagnosis)</label>
              <textarea className="w-full px-3 py-2 border rounded-lg" rows="2"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plan (Rencana Tatalaksana)</label>
              <textarea className="w-full px-3 py-2 border rounded-lg" rows="2"></textarea>
            </div>
          </div>
        )}
      </CRUDModal>
    </div>
  );
};

export default OutpatientPage;
