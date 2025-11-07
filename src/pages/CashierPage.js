import React, { useState } from 'react';
import { DollarSign, Users, CreditCard, FileText, TrendingUp, Printer, ArrowDownCircle, RefreshCcw } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import DataTable from '../components/common/DataTable';
import CRUDModal from '../components/common/CRUDModal';

const CashierPage = () => {
  const [activeTab, setActiveTab] = useState('discharge');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);

  const tabs = [
    { id: 'discharge', label: 'Pasien Pulang', icon: Users },
    { id: 'deposit', label: 'Uang Muka', icon: ArrowDownCircle },
    { id: 'payment', label: 'Pembayaran', icon: CreditCard },
    { id: 'billing', label: 'Rincian Tagihan', icon: FileText },
    { id: 'return', label: 'Retur Tagihan', icon: RefreshCcw },
    { id: 'doctor-fee', label: 'Jasa Dokter', icon: TrendingUp },
    { id: 'closing', label: 'Closing Kasir', icon: DollarSign }
  ];

  const mockDischargePatients = [
    {
      id: 'P001',
      registrationNumber: 'RJ-2024-001',
      patientName: 'Mayor Budi Santoso',
      service: 'Rawat Jalan',
      doctor: 'dr. Kolonel Ahmad, Sp.PD',
      dischargeTime: '10:30',
      totalBill: 215000,
      depositAmount: 0,
      remainingBill: 215000,
      paymentStatus: 'Belum Bayar'
    },
    {
      id: 'P002',
      registrationNumber: 'RI-2024-005',
      patientName: 'Kapten Ahmad Yani',
      service: 'Rawat Inap',
      doctor: 'dr. Mayor Siti, Sp.B',
      dischargeTime: '11:00',
      totalBill: 5500000,
      depositAmount: 3000000,
      remainingBill: 2500000,
      paymentStatus: 'Uang Muka'
    }
  ];

  const mockDeposits = [
    {
      id: 'D001',
      receiptNumber: 'DP-2024-001',
      patientName: 'Kapten Ahmad Yani',
      registrationNumber: 'RI-2024-005',
      depositAmount: 3000000,
      depositDate: '2024-01-15',
      depositTime: '08:00',
      paymentMethod: 'Transfer Bank',
      cashier: 'Anis Rahmawati'
    }
  ];

  const mockPayments = [
    {
      id: 'PAY001',
      receiptNumber: 'INV-2024-001',
      patientName: 'Mayor Budi Santoso',
      registrationNumber: 'RJ-2024-001',
      totalBill: 215000,
      depositUsed: 0,
      paymentAmount: 215000,
      paymentMethod: 'Tunai',
      paymentDate: '2024-01-15',
      paymentTime: '10:45',
      cashier: 'Anis Rahmawati'
    }
  ];

  const mockBillingDetails = [
    {
      category: 'Konsultasi',
      item: 'Konsultasi Dokter Spesialis',
      quantity: 1,
      unitPrice: 150000,
      total: 150000
    },
    {
      category: 'Tindakan',
      item: 'Pemasangan Infus',
      quantity: 1,
      unitPrice: 50000,
      total: 50000
    },
    {
      category: 'Obat',
      item: 'Paracetamol 500mg',
      quantity: 30,
      unitPrice: 500,
      total: 15000
    }
  ];

  const mockReturns = [
    {
      id: 'RET001',
      returnNumber: 'RET-2024-001',
      originalReceipt: 'INV-2024-001',
      patientName: 'Letnan Sari Dewi',
      returnAmount: 25000,
      returnReason: 'Obat tidak terpakai',
      returnDate: '2024-01-15',
      approvedBy: 'dr. Kolonel Ahmad'
    }
  ];

  const mockDoctorFees = [
    {
      id: 'DF001',
      doctorName: 'dr. Kolonel Ahmad Yusuf, Sp.PD',
      specialty: 'Penyakit Dalam',
      totalPatients: 15,
      consultationFee: 750000,
      procedureFee: 250000,
      totalFee: 1000000,
      status: 'Belum Dibayar'
    },
    {
      id: 'DF002',
      doctorName: 'dr. Mayor Siti Nurhaliza, Sp.A',
      specialty: 'Anak',
      totalPatients: 12,
      consultationFee: 600000,
      procedureFee: 150000,
      totalFee: 750000,
      status: 'Belum Dibayar'
    }
  ];

  const openModal = (type, data = null) => {
    setModalType(type);
    setSelectedPatient(data);
    setIsModalOpen(true);
  };

  const handlePayment = () => {
    alert('Memproses pembayaran...');
    setIsModalOpen(false);
  };

  const handleDeposit = () => {
    alert('Menyimpan uang muka...');
    setIsModalOpen(false);
  };

  const handleClosing = () => {
    if (window.confirm('Apakah Anda yakin ingin melakukan closing kasir?')) {
      alert('Closing kasir berhasil');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'discharge':
        return (
          <DataTable
            columns={[
              { key: 'registrationNumber', label: 'No. Registrasi', sortable: true },
              { key: 'patientName', label: 'Nama Pasien', sortable: true },
              { key: 'service', label: 'Layanan' },
              { key: 'doctor', label: 'Dokter' },
              { key: 'dischargeTime', label: 'Jam Pulang', sortable: true },
              { 
                key: 'totalBill', 
                label: 'Total Tagihan',
                render: (row) => formatCurrency(row.totalBill)
              },
              { 
                key: 'depositAmount', 
                label: 'Uang Muka',
                render: (row) => formatCurrency(row.depositAmount)
              },
              { 
                key: 'remainingBill', 
                label: 'Sisa Tagihan',
                render: (row) => <span className="font-semibold text-red-600">{formatCurrency(row.remainingBill)}</span>
              },
              {
                key: 'paymentStatus',
                label: 'Status',
                render: (row) => (
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    row.paymentStatus === 'Lunas' ? 'bg-green-100 text-green-800' :
                    row.paymentStatus === 'Uang Muka' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {row.paymentStatus}
                  </span>
                )
              }
            ]}
            data={mockDischargePatients}
            title="Daftar Pasien Pulang"
            searchable
            exportable
            onView={(patient) => openModal('payment', patient)}
          />
        );

      case 'deposit':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Daftar Uang Muka</h3>
              <button
                onClick={() => openModal('deposit')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                + Tambah Uang Muka
              </button>
            </div>
            <DataTable
              columns={[
                { key: 'receiptNumber', label: 'No. Kwitansi', sortable: true },
                { key: 'patientName', label: 'Nama Pasien', sortable: true },
                { key: 'registrationNumber', label: 'No. Registrasi' },
                { 
                  key: 'depositAmount', 
                  label: 'Jumlah',
                  render: (row) => <span className="font-semibold">{formatCurrency(row.depositAmount)}</span>
                },
                { key: 'depositDate', label: 'Tanggal', sortable: true },
                { key: 'depositTime', label: 'Waktu' },
                { key: 'paymentMethod', label: 'Metode Bayar' },
                { key: 'cashier', label: 'Kasir' }
              ]}
              data={mockDeposits}
              searchable
              exportable
            />
          </div>
        );

      case 'payment':
        return (
          <DataTable
            columns={[
              { key: 'receiptNumber', label: 'No. Kwitansi', sortable: true },
              { key: 'patientName', label: 'Nama Pasien', sortable: true },
              { key: 'registrationNumber', label: 'No. Registrasi' },
              { 
                key: 'totalBill', 
                label: 'Total Tagihan',
                render: (row) => formatCurrency(row.totalBill)
              },
              { 
                key: 'depositUsed', 
                label: 'Uang Muka',
                render: (row) => formatCurrency(row.depositUsed)
              },
              { 
                key: 'paymentAmount', 
                label: 'Dibayar',
                render: (row) => <span className="font-semibold text-green-600">{formatCurrency(row.paymentAmount)}</span>
              },
              { key: 'paymentMethod', label: 'Metode Bayar' },
              { key: 'paymentDate', label: 'Tanggal', sortable: true },
              { key: 'cashier', label: 'Kasir' }
            ]}
            data={mockPayments}
            title="Riwayat Pembayaran"
            searchable
            exportable
            onView={(payment) => alert(`Cetak kwitansi: ${payment.receiptNumber}`)}
          />
        );

      case 'billing':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Rincian Tagihan - Mayor Budi Santoso (RJ-2024-001)</h3>
            <DataTable
              columns={[
                { key: 'category', label: 'Kategori', sortable: true },
                { key: 'item', label: 'Item/Layanan' },
                { key: 'quantity', label: 'Jumlah' },
                { 
                  key: 'unitPrice', 
                  label: 'Harga Satuan',
                  render: (row) => formatCurrency(row.unitPrice)
                },
                { 
                  key: 'total', 
                  label: 'Total',
                  render: (row) => <span className="font-semibold">{formatCurrency(row.total)}</span>
                }
              ]}
              data={mockBillingDetails}
              exportable
            />
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold">{formatCurrency(215000)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Diskon:</span>
                  <span className="font-semibold text-red-600">{formatCurrency(0)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-lg font-semibold">Total Tagihan:</span>
                  <span className="text-2xl font-bold text-blue-600">{formatCurrency(215000)}</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'return':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Retur Tagihan Pasien</h3>
              <button
                onClick={() => openModal('return')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                + Buat Retur
              </button>
            </div>
            <DataTable
              columns={[
                { key: 'returnNumber', label: 'No. Retur', sortable: true },
                { key: 'originalReceipt', label: 'No. Kwitansi Asli' },
                { key: 'patientName', label: 'Nama Pasien', sortable: true },
                { 
                  key: 'returnAmount', 
                  label: 'Jumlah Retur',
                  render: (row) => <span className="font-semibold text-red-600">{formatCurrency(row.returnAmount)}</span>
                },
                { key: 'returnReason', label: 'Alasan' },
                { key: 'returnDate', label: 'Tanggal', sortable: true },
                { key: 'approvedBy', label: 'Disetujui Oleh' }
              ]}
              data={mockReturns}
              searchable
              exportable
            />
          </div>
        );

      case 'doctor-fee':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Rekapitulasi Jasa Dokter</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-600">Total Dokter</p>
                <p className="text-2xl font-bold text-blue-600">{mockDoctorFees.length}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-sm text-gray-600">Total Pasien</p>
                <p className="text-2xl font-bold text-green-600">
                  {mockDoctorFees.reduce((sum, doc) => sum + doc.totalPatients, 0)}
                </p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <p className="text-sm text-gray-600">Total Jasa</p>
                <p className="text-2xl font-bold text-orange-600">
                  {formatCurrency(mockDoctorFees.reduce((sum, doc) => sum + doc.totalFee, 0))}
                </p>
              </div>
            </div>
            <DataTable
              columns={[
                { key: 'doctorName', label: 'Nama Dokter', sortable: true },
                { key: 'specialty', label: 'Spesialisasi' },
                { key: 'totalPatients', label: 'Jumlah Pasien', sortable: true },
                { 
                  key: 'consultationFee', 
                  label: 'Jasa Konsultasi',
                  render: (row) => formatCurrency(row.consultationFee)
                },
                { 
                  key: 'procedureFee', 
                  label: 'Jasa Tindakan',
                  render: (row) => formatCurrency(row.procedureFee)
                },
                { 
                  key: 'totalFee', 
                  label: 'Total Jasa',
                  render: (row) => <span className="font-semibold">{formatCurrency(row.totalFee)}</span>
                },
                {
                  key: 'status',
                  label: 'Status',
                  render: (row) => (
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      row.status === 'Sudah Dibayar' ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {row.status}
                    </span>
                  )
                }
              ]}
              data={mockDoctorFees}
              searchable
              exportable
            />
          </div>
        );

      case 'closing':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Closing Kasir</h3>
            <div className="bg-white p-6 rounded-lg border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-4 text-lg">Penerimaan Hari Ini</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span>Tunai:</span>
                      <span className="font-semibold">{formatCurrency(5000000)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span>Transfer Bank:</span>
                      <span className="font-semibold">{formatCurrency(8000000)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span>Kartu Debit/Kredit:</span>
                      <span className="font-semibold">{formatCurrency(3000000)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-100 rounded border border-blue-300">
                      <span className="font-semibold">Total Penerimaan:</span>
                      <span className="text-xl font-bold text-blue-600">{formatCurrency(16000000)}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-4 text-lg">Pengeluaran Hari Ini</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span>Retur Pasien:</span>
                      <span className="font-semibold text-red-600">{formatCurrency(250000)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span>Lain-lain:</span>
                      <span className="font-semibold text-red-600">{formatCurrency(100000)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-red-100 rounded border border-red-300">
                      <span className="font-semibold">Total Pengeluaran:</span>
                      <span className="text-xl font-bold text-red-600">{formatCurrency(350000)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-300">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Saldo Akhir Kasir:</span>
                  <span className="text-3xl font-bold text-green-600">{formatCurrency(15650000)}</span>
                </div>
              </div>

              <div className="mt-6 flex space-x-3">
                <button
                  onClick={handleClosing}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                >
                  <DollarSign className="w-5 h-5 inline mr-2" />
                  Lakukan Closing Kasir
                </button>
                <button
                  className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  <Printer className="w-5 h-5 inline mr-2" />
                  Cetak Laporan
                </button>
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
        title="Kasir"
        subtitle="Manajemen pembayaran, uang muka, closing kasir, dan jasa dokter"
        breadcrumbItems={[
          { label: 'Front Office', path: '/' },
          { label: 'Kasir', path: '/cashier' }
        ]}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pasien Hari Ini</p>
              <p className="text-2xl font-bold text-blue-600">45</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Penerimaan</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(16000000)}</p>
            </div>
            <CreditCard className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Belum Dibayar</p>
              <p className="text-2xl font-bold text-red-600">8</p>
            </div>
            <FileText className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Jasa Dokter</p>
              <p className="text-2xl font-bold text-orange-600">{formatCurrency(1750000)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-600" />
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

      {/* Payment Modal */}
      <CRUDModal
        isOpen={isModalOpen && modalType === 'payment'}
        onClose={() => setIsModalOpen(false)}
        title="Proses Pembayaran"
        onSubmit={handlePayment}
        submitLabel="Proses Bayar"
        size="xl"
      >
        {selectedPatient && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">{selectedPatient.patientName}</h4>
              <p className="text-sm text-gray-600">No. Registrasi: {selectedPatient.registrationNumber}</p>
              <p className="text-sm text-gray-600">Layanan: {selectedPatient.service}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between p-3 bg-gray-50 rounded">
                <span>Total Tagihan:</span>
                <span className="font-semibold">{formatCurrency(selectedPatient.totalBill)}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded">
                <span>Uang Muka:</span>
                <span className="font-semibold text-green-600">{formatCurrency(selectedPatient.depositAmount)}</span>
              </div>
              <div className="flex justify-between p-3 bg-blue-100 rounded border border-blue-300">
                <span className="font-semibold">Sisa Tagihan:</span>
                <span className="text-xl font-bold text-blue-600">{formatCurrency(selectedPatient.remainingBill)}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Metode Pembayaran</label>
              <select className="w-full px-3 py-2 border rounded-lg">
                <option>Tunai</option>
                <option>Transfer Bank</option>
                <option>Kartu Debit/Kredit</option>
                <option>BPJS</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Dibayar</label>
              <input 
                type="number" 
                className="w-full px-3 py-2 border rounded-lg" 
                defaultValue={selectedPatient.remainingBill}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
              <textarea className="w-full px-3 py-2 border rounded-lg" rows="2"></textarea>
            </div>
          </div>
        )}
      </CRUDModal>

      {/* Deposit Modal */}
      <CRUDModal
        isOpen={isModalOpen && modalType === 'deposit'}
        onClose={() => setIsModalOpen(false)}
        title="Tambah Uang Muka"
        onSubmit={handleDeposit}
        submitLabel="Simpan Uang Muka"
        size="large"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pasien</label>
            <input type="text" className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">No. Registrasi</label>
            <input type="text" className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Uang Muka</label>
            <input type="number" className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Metode Pembayaran</label>
            <select className="w-full px-3 py-2 border rounded-lg">
              <option>Tunai</option>
              <option>Transfer Bank</option>
              <option>Kartu Debit/Kredit</option>
            </select>
          </div>
        </div>
      </CRUDModal>
    </div>
  );
};

export default CashierPage;
