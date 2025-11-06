import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc } from '../../mockDb';
import { db } from '../../mockDb';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { CreditCard, Receipt, DollarSign, FileText, TrendingUp } from 'lucide-react';
import Card from '../common/Card';

const BillingManagement = () => {
  const { selectedFaskes } = useAuth();
  const { addNotification } = useApp();
  
  const [bills, setBills] = useState([]);
  const [payments, setPayments] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [showNewBill, setShowNewBill] = useState(false);
  const [stats, setStats] = useState({ today: 0, month: 0, pending: 0 });

  const [billForm, setBillForm] = useState({
    patientName: '',
    patientNIK: '',
    registrationId: '',
    items: [],
    paymentMethod: 'tunai',
    insuranceType: 'umum'
  });

  const [newItem, setNewItem] = useState({
    type: 'layanan',
    name: '',
    price: '',
    quantity: '1'
  });

  const serviceTypes = [
    { name: 'Konsultasi Dokter Umum', price: 50000 },
    { name: 'Konsultasi Dokter Gigi', price: 75000 },
    { name: 'Pemeriksaan KIA', price: 30000 },
    { name: 'Pemeriksaan MTBS', price: 35000 },
    { name: 'Penapisan PTM', price: 40000 },
    { name: 'Vaksinasi', price: 100000 },
    { name: 'Tindakan Kecil', price: 150000 },
    { name: 'Pemeriksaan Lab Dasar', price: 75000 },
    { name: 'Foto Rontgen', price: 125000 },
  ];

  useEffect(() => {
    if (!selectedFaskes) return;

    const billsQuery = query(collection(db, 'bills'), where('faskesId', '==', selectedFaskes));
    const paymentsQuery = query(collection(db, 'payments'), where('faskesId', '==', selectedFaskes));

    const unsubBills = onSnapshot(billsQuery, (snapshot) => {
      const data = [];
      snapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));
      setBills(data);

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      const todayTotal = data
        .filter(b => b.status === 'paid' && new Date(b.paymentDate) >= today)
        .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

      const monthTotal = data
        .filter(b => b.status === 'paid' && new Date(b.paymentDate) >= thisMonth)
        .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

      const pendingCount = data.filter(b => b.status === 'pending').length;

      setStats({ today: todayTotal, month: monthTotal, pending: pendingCount });
    });

    const unsubPayments = onSnapshot(paymentsQuery, (snapshot) => {
      const data = [];
      snapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));
      setPayments(data);
    });

    return () => {
      unsubBills();
      unsubPayments();
    };
  }, [selectedFaskes]);

  const addItemToBill = () => {
    if (!newItem.name || !newItem.price) {
      addNotification({ type: 'warning', message: 'Nama dan harga item harus diisi' });
      return;
    }

    setBillForm(prev => ({
      ...prev,
      items: [...prev.items, { ...newItem, subtotal: parseInt(newItem.price) * parseInt(newItem.quantity) }]
    }));

    setNewItem({ type: 'layanan', name: '', price: '', quantity: '1' });
  };

  const removeItem = (index) => {
    setBillForm(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const calculateTotal = () => {
    return billForm.items.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const createBill = async () => {
    if (!billForm.patientName || billForm.items.length === 0) {
      addNotification({ type: 'warning', message: 'Nama pasien dan minimal 1 item harus diisi' });
      return;
    }

    try {
      const total = calculateTotal();
      await addDoc(collection(db, 'bills'), {
        ...billForm,
        totalAmount: total,
        status: 'pending',
        faskesId: selectedFaskes,
        createdAt: new Date().toISOString()
      });

      addNotification({ type: 'success', message: 'Tagihan berhasil dibuat' });
      setBillForm({ patientName: '', patientNIK: '', registrationId: '', items: [], paymentMethod: 'tunai', insuranceType: 'umum' });
      setShowNewBill(false);
    } catch (error) {
      console.error('Error creating bill:', error);
      addNotification({ type: 'error', message: 'Gagal membuat tagihan' });
    }
  };

  const processBill = async (billId, bill) => {
    try {
      await updateDoc(doc(db, 'bills', billId), {
        status: 'paid',
        paymentDate: new Date().toISOString()
      });

      await addDoc(collection(db, 'payments'), {
        billId,
        patientName: bill.patientName,
        amount: bill.totalAmount,
        paymentMethod: bill.paymentMethod,
        insuranceType: bill.insuranceType,
        faskesId: selectedFaskes,
        paymentDate: new Date().toISOString()
      });

      addNotification({ type: 'success', message: 'Pembayaran berhasil diproses' });
    } catch (error) {
      console.error('Error processing payment:', error);
      addNotification({ type: 'error', message: 'Gagal memproses pembayaran' });
    }
  };

  const filteredBills = bills.filter(b => {
    if (activeTab === 'pending') return b.status === 'pending';
    if (activeTab === 'paid') return b.status === 'paid';
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pendapatan Hari Ini</p>
              <h3 className="text-2xl font-bold text-green-600">
                Rp {stats.today.toLocaleString('id-ID')}
              </h3>
            </div>
            <DollarSign size={40} className="text-green-500" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pendapatan Bulan Ini</p>
              <h3 className="text-2xl font-bold text-blue-600">
                Rp {stats.month.toLocaleString('id-ID')}
              </h3>
            </div>
            <TrendingUp size={40} className="text-blue-500" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tagihan Pending</p>
              <h3 className="text-2xl font-bold text-yellow-600">{stats.pending}</h3>
            </div>
            <FileText size={40} className="text-yellow-500" />
          </div>
        </Card>
      </div>

      <Card 
        title="Manajemen Billing"
        actions={
          <button
            onClick={() => setShowNewBill(!showNewBill)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
          >
            <Receipt size={16} />
            Buat Tagihan Baru
          </button>
        }
      >
        {showNewBill && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-3">Buat Tagihan Baru</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nama Pasien</label>
                <input
                  type="text"
                  value={billForm.patientName}
                  onChange={(e) => setBillForm(prev => ({ ...prev, patientName: e.target.value }))}
                  className="w-full p-2 border rounded"
                  placeholder="Nama lengkap pasien"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">NIK/NRP Pasien</label>
                <input
                  type="text"
                  value={billForm.patientNIK}
                  onChange={(e) => setBillForm(prev => ({ ...prev, patientNIK: e.target.value }))}
                  className="w-full p-2 border rounded"
                  placeholder="NIK atau NRP"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Metode Pembayaran</label>
                <select
                  value={billForm.paymentMethod}
                  onChange={(e) => setBillForm(prev => ({ ...prev, paymentMethod: e.target.value }))}
                  className="w-full p-2 border rounded"
                >
                  <option value="tunai">Tunai</option>
                  <option value="debit">Kartu Debit</option>
                  <option value="kredit">Kartu Kredit</option>
                  <option value="transfer">Transfer Bank</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Jenis Asuransi</label>
                <select
                  value={billForm.insuranceType}
                  onChange={(e) => setBillForm(prev => ({ ...prev, insuranceType: e.target.value }))}
                  className="w-full p-2 border rounded"
                >
                  <option value="umum">Umum (Bayar Sendiri)</option>
                  <option value="bpjs">BPJS Kesehatan</option>
                  <option value="askes">ASKES TNI</option>
                  <option value="asuransi_lain">Asuransi Lain</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <h5 className="font-medium mb-2">Tambah Item Layanan/Obat</h5>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-2">
                <select
                  value={newItem.type}
                  onChange={(e) => setNewItem(prev => ({ ...prev, type: e.target.value }))}
                  className="p-2 border rounded"
                >
                  <option value="layanan">Layanan</option>
                  <option value="obat">Obat</option>
                  <option value="alkes">Alat Kesehatan</option>
                </select>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                  className="p-2 border rounded md:col-span-2"
                  placeholder="Nama item"
                  list="service-suggestions"
                />
                <datalist id="service-suggestions">
                  {serviceTypes.map((service, idx) => (
                    <option key={idx} value={service.name} />
                  ))}
                </datalist>
                <input
                  type="number"
                  value={newItem.price}
                  onChange={(e) => setNewItem(prev => ({ ...prev, price: e.target.value }))}
                  className="p-2 border rounded"
                  placeholder="Harga"
                />
                <input
                  type="number"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem(prev => ({ ...prev, quantity: e.target.value }))}
                  className="p-2 border rounded"
                  placeholder="Qty"
                  min="1"
                />
              </div>
              <button
                onClick={addItemToBill}
                className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
              >
                + Tambah Item
              </button>

              {billForm.items.length > 0 && (
                <div className="mt-3 space-y-2">
                  {billForm.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 bg-white border rounded">
                      <div className="flex-1">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-sm text-gray-600 ml-2">({item.type})</span>
                        <div className="text-sm text-gray-500">
                          Rp {parseInt(item.price).toLocaleString('id-ID')} x {item.quantity} = 
                          Rp {item.subtotal.toLocaleString('id-ID')}
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(idx)}
                        className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                      >
                        Hapus
                      </button>
                    </div>
                  ))}
                  <div className="p-3 bg-blue-50 rounded font-medium text-lg">
                    Total: Rp {calculateTotal().toLocaleString('id-ID')}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={createBill}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Buat Tagihan
              </button>
              <button
                onClick={() => {
                  setShowNewBill(false);
                  setBillForm({ patientName: '', patientNIK: '', registrationId: '', items: [], paymentMethod: 'tunai', insuranceType: 'umum' });
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Batal
              </button>
            </div>
          </div>
        )}

        <div className="mb-4 flex gap-2 border-b">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 ${activeTab === 'pending' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          >
            Pending ({bills.filter(b => b.status === 'pending').length})
          </button>
          <button
            onClick={() => setActiveTab('paid')}
            className={`px-4 py-2 ${activeTab === 'paid' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          >
            Lunas ({bills.filter(b => b.status === 'paid').length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 ${activeTab === 'all' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          >
            Semua ({bills.length})
          </button>
        </div>

        <div className="space-y-3">
          {filteredBills.map(bill => (
            <div key={bill.id} className="p-4 bg-white border rounded-lg">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-lg">{bill.patientName}</h4>
                    <span className={`text-xs px-2 py-1 rounded ${
                      bill.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {bill.status === 'paid' ? 'Lunas' : 'Pending'}
                    </span>
                    <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
                      {bill.insuranceType}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">NIK/NRP: {bill.patientNIK || '-'}</p>
                  <div className="space-y-1">
                    {bill.items && bill.items.map((item, idx) => (
                      <div key={idx} className="text-sm text-gray-600">
                        • {item.name} - Rp {item.subtotal.toLocaleString('id-ID')}
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 text-lg font-bold text-blue-600">
                    Total: Rp {bill.totalAmount.toLocaleString('id-ID')}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Dibuat: {new Date(bill.createdAt).toLocaleString('id-ID')}
                    {bill.paymentDate && ` | Dibayar: ${new Date(bill.paymentDate).toLocaleString('id-ID')}`}
                  </p>
                </div>
                {bill.status === 'pending' && (
                  <button
                    onClick={() => processBill(bill.id, bill)}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2"
                  >
                    <CreditCard size={16} />
                    Proses Pembayaran
                  </button>
                )}
              </div>
            </div>
          ))}
          {filteredBills.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Tidak ada tagihan {activeTab !== 'all' && activeTab}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default BillingManagement;
