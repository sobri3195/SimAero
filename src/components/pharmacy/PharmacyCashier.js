import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, orderBy } from '../../mockDb';
import { db } from '../../mockDb';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { DollarSign, CreditCard, Printer, Search, ShoppingCart } from 'lucide-react';

const PharmacyCashier = () => {
  const { selectedFaskes } = useAuth();
  const { addNotification } = useApp();
  
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('tunai');
  const [amountPaid, setAmountPaid] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [lastTransaction, setLastTransaction] = useState(null);

  useEffect(() => {
    loadPrescriptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFaskes]);

  const loadPrescriptions = async () => {
    if (!selectedFaskes) return;

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const q = query(
        collection(db, 'prescriptions'),
        where('faskesId', '==', selectedFaskes),
        where('status', '==', 'selesai'),
        orderBy('completedAt', 'desc')
      );

      const snapshot = await getDocs(q);
      const data = [];
      snapshot.forEach((doc) => {
        const prescData = { id: doc.id, ...doc.data() };
        if (!prescData.isPaid) {
          data.push(prescData);
        }
      });
      setPrescriptions(data);
    } catch (error) {
      console.error('Error loading prescriptions:', error);
    }
  };

  const calculateTotal = (prescription) => {
    if (!prescription || !prescription.items) return 0;
    return prescription.items.reduce((sum, item) => {
      const price = parseInt(item.price) || 0;
      const quantity = parseInt(item.quantity) || 0;
      return sum + (price * quantity);
    }, 0);
  };

  const handleSelectPrescription = (prescription) => {
    setSelectedPrescription(prescription);
    const total = calculateTotal(prescription);
    setAmountPaid(total.toString());
    setShowPaymentModal(true);
  };

  const handlePayment = async () => {
    if (!selectedPrescription) return;

    const total = calculateTotal(selectedPrescription);
    const paid = parseInt(amountPaid) || 0;

    if (paid < total) {
      addNotification({ type: 'error', message: 'Jumlah pembayaran kurang dari total' });
      return;
    }

    try {
      const transaction = {
        prescriptionId: selectedPrescription.id,
        patientName: selectedPrescription.patientName,
        patientId: selectedPrescription.patientId,
        doctorName: selectedPrescription.doctorName,
        items: selectedPrescription.items,
        totalAmount: total,
        amountPaid: paid,
        change: paid - total,
        paymentMethod: paymentMethod,
        transactionDate: new Date().toISOString(),
        faskesId: selectedFaskes,
        cashierName: 'Kasir 1'
      };

      await addDoc(collection(db, 'pharmacy_transactions'), transaction);

      await updateDoc(doc(db, 'prescriptions', selectedPrescription.id), {
        isPaid: true,
        paidAt: new Date().toISOString(),
        paymentMethod: paymentMethod
      });

      for (const item of selectedPrescription.items) {
        const drugsQuery = query(
          collection(db, 'drugs'),
          where('faskesId', '==', selectedFaskes),
          where('name', '==', item.drugName)
        );
        const drugsSnapshot = await getDocs(drugsQuery);
        
        if (!drugsSnapshot.empty) {
          const drugDoc = drugsSnapshot.docs[0];
          const currentStock = parseInt(drugDoc.data().stock) || 0;
          const quantity = parseInt(item.quantity) || 0;
          await updateDoc(doc(db, 'drugs', drugDoc.id), {
            stock: Math.max(0, currentStock - quantity).toString()
          });
        }
      }

      setLastTransaction(transaction);
      setShowPaymentModal(false);
      setShowReceiptModal(true);
      addNotification({ type: 'success', message: 'Pembayaran berhasil diproses' });
      loadPrescriptions();
    } catch (error) {
      console.error('Error processing payment:', error);
      addNotification({ type: 'error', message: 'Gagal memproses pembayaran' });
    }
  };

  const printReceipt = () => {
    window.print();
  };

  const filteredPrescriptions = prescriptions.filter(p => 
    p.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.patientId && p.patientId.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Belum Dibayar</p>
              <p className="text-2xl font-bold text-orange-600">{prescriptions.length}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <ShoppingCart className="text-orange-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Pending</p>
              <p className="text-2xl font-bold text-blue-600">
                Rp {prescriptions.reduce((sum, p) => sum + calculateTotal(p), 0).toLocaleString('id-ID')}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rata-rata Nilai</p>
              <p className="text-2xl font-bold text-green-600">
                Rp {prescriptions.length > 0 
                  ? Math.floor(prescriptions.reduce((sum, p) => sum + calculateTotal(p), 0) / prescriptions.length).toLocaleString('id-ID')
                  : '0'
                }
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CreditCard className="text-green-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Cari berdasarkan nama pasien atau nomor RM..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Prescription List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-lg">Resep Siap Dibayar</h3>
          <p className="text-sm text-gray-600">Klik untuk proses pembayaran</p>
        </div>
        
        <div className="divide-y">
          {filteredPrescriptions.map((prescription) => {
            const total = calculateTotal(prescription);
            return (
              <div
                key={prescription.id}
                onClick={() => handleSelectPrescription(prescription)}
                className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{prescription.patientName}</h4>
                    <p className="text-sm text-gray-600">
                      RM: {prescription.patientId || '-'} • Dr. {prescription.doctorName}
                    </p>
                    <div className="mt-2 space-y-1">
                      {prescription.items && prescription.items.map((item, idx) => (
                        <div key={idx} className="text-xs text-gray-600">
                          • {item.drugName} - {item.quantity} {item.unit} - Rp {parseInt(item.price * item.quantity).toLocaleString('id-ID')}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-xl font-bold text-blue-600">
                      Rp {total.toLocaleString('id-ID')}
                    </div>
                    <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium">
                      Bayar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredPrescriptions.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <DollarSign size={48} className="mx-auto mb-3 text-gray-400" />
              <p className="text-lg font-medium">Tidak ada resep yang perlu dibayar</p>
              <p className="text-sm">Semua transaksi sudah selesai</p>
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedPrescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="border-b p-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">Proses Pembayaran</h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Pasien</p>
                <p className="font-semibold text-lg">{selectedPrescription.patientName}</p>
              </div>

              <div className="border-t border-b py-3 space-y-2">
                {selectedPrescription.items && selectedPrescription.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span>{item.drugName} ({item.quantity} {item.unit})</span>
                    <span className="font-medium">Rp {parseInt(item.price * item.quantity).toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span className="text-blue-600">Rp {calculateTotal(selectedPrescription).toLocaleString('id-ID')}</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Metode Pembayaran
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="tunai">Tunai</option>
                  <option value="debit">Kartu Debit</option>
                  <option value="kredit">Kartu Kredit</option>
                  <option value="transfer">Transfer Bank</option>
                  <option value="qris">QRIS</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jumlah Dibayar
                </label>
                <input
                  type="number"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan jumlah pembayaran"
                />
              </div>

              {amountPaid && parseInt(amountPaid) >= calculateTotal(selectedPrescription) && (
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">Kembalian</p>
                  <p className="text-xl font-bold text-green-600">
                    Rp {(parseInt(amountPaid) - calculateTotal(selectedPrescription)).toLocaleString('id-ID')}
                  </p>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <button
                  onClick={handlePayment}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
                >
                  Proses Pembayaran
                </button>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-medium"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceiptModal && lastTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="border-b p-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">Struk Pembayaran</h3>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-4" id="receipt">
              <div className="text-center">
                <h4 className="font-bold text-lg">Farmasi TNI AU</h4>
                <p className="text-sm text-gray-600">{selectedFaskes}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(lastTransaction.transactionDate).toLocaleString('id-ID')}
                </p>
              </div>

              <div className="border-t border-b py-3">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Pasien:</span>
                  <span className="font-medium">{lastTransaction.patientName}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">No. RM:</span>
                  <span className="font-medium">{lastTransaction.patientId || '-'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Dokter:</span>
                  <span className="font-medium">Dr. {lastTransaction.doctorName}</span>
                </div>
              </div>

              <div className="space-y-2">
                {lastTransaction.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <div className="flex-1">
                      <p className="font-medium">{item.drugName}</p>
                      <p className="text-xs text-gray-500">{item.quantity} {item.unit} × Rp {parseInt(item.price).toLocaleString('id-ID')}</p>
                    </div>
                    <span className="font-medium">Rp {parseInt(item.price * item.quantity).toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>Rp {lastTransaction.totalAmount.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Dibayar ({lastTransaction.paymentMethod})</span>
                  <span>Rp {lastTransaction.amountPaid.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-green-600">
                  <span>Kembalian</span>
                  <span>Rp {lastTransaction.change.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div className="text-center text-xs text-gray-500 pt-3 border-t">
                <p>Terima kasih atas kepercayaan Anda</p>
                <p>Semoga lekas sembuh</p>
              </div>
            </div>

            <div className="border-t p-4 flex gap-2">
              <button
                onClick={printReceipt}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium flex items-center justify-center gap-2"
              >
                <Printer size={18} />
                Cetak Struk
              </button>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-medium"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PharmacyCashier;
