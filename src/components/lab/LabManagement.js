import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, updateDoc, doc, addDoc } from '../../mockDb';
import { db } from '../../mockDb';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { TestTube, CheckCircle } from 'lucide-react';
import Card from '../common/Card';

const LabManagement = () => {
  const { selectedFaskes } = useAuth();
  const { addNotification } = useApp();
  
  const [labOrders, setLabOrders] = useState([]);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [orderForm, setOrderForm] = useState({
    patientName: '',
    doctor: '',
    testType: 'Hematologi',
    tests: '',
    urgency: 'normal'
  });

  const [resultForm, setResultForm] = useState({
    results: '',
    notes: '',
    analyst: ''
  });

  useEffect(() => {
    if (!selectedFaskes) return;

    const ordersQuery = query(
      collection(db, 'lab_orders'),
      where('faskesId', '==', selectedFaskes)
    );

    const unsubOrders = onSnapshot(ordersQuery, (snapshot) => {
      const data = [];
      snapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setLabOrders(data);
    });

    return () => unsubOrders();
  }, [selectedFaskes]);

  const createOrder = async () => {
    if (!orderForm.patientName || !orderForm.tests) {
      addNotification({ type: 'warning', message: 'Nama pasien dan jenis tes harus diisi' });
      return;
    }

    try {
      await addDoc(collection(db, 'lab_orders'), {
        ...orderForm,
        faskesId: selectedFaskes,
        status: 'pending',
        orderDate: new Date().toISOString(),
        createdAt: new Date().toISOString()
      });
      setOrderForm({ patientName: '', doctor: '', testType: 'Hematologi', tests: '', urgency: 'normal' });
      setShowOrderForm(false);
      addNotification({ type: 'success', message: 'Order lab dibuat' });
    } catch (error) {
      console.error('Error creating lab order:', error);
    }
  };

  const submitResults = async () => {
    if (!selectedOrder || !resultForm.results) return;

    try {
      await updateDoc(doc(db, 'lab_orders', selectedOrder), {
        ...resultForm,
        status: 'completed',
        completedDate: new Date().toISOString()
      });
      setSelectedOrder(null);
      setResultForm({ results: '', notes: '', analyst: '' });
      addNotification({ type: 'success', message: 'Hasil lab disimpan' });
    } catch (error) {
      console.error('Error submitting results:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card 
        title="Manajemen Laboratorium"
        actions={
          <button onClick={() => setShowOrderForm(!showOrderForm)} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2">
            <TestTube size={16} />
            Order Lab
          </button>
        }
      >
        {showOrderForm && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-3">Form Order Lab</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input type="text" placeholder="Nama Pasien" value={orderForm.patientName} onChange={(e) => setOrderForm(prev => ({ ...prev, patientName: e.target.value }))} className="p-2 border rounded" />
              <input type="text" placeholder="Dokter Pengirim" value={orderForm.doctor} onChange={(e) => setOrderForm(prev => ({ ...prev, doctor: e.target.value }))} className="p-2 border rounded" />
              <select value={orderForm.testType} onChange={(e) => setOrderForm(prev => ({ ...prev, testType: e.target.value }))} className="p-2 border rounded">
                <option value="Hematologi">Hematologi</option>
                <option value="Kimia Darah">Kimia Darah</option>
                <option value="Urinalisis">Urinalisis</option>
                <option value="Mikrobiologi">Mikrobiologi</option>
                <option value="Serologi">Serologi</option>
              </select>
              <select value={orderForm.urgency} onChange={(e) => setOrderForm(prev => ({ ...prev, urgency: e.target.value }))} className="p-2 border rounded">
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
                <option value="stat">STAT</option>
              </select>
              <textarea placeholder="Daftar pemeriksaan (pisahkan dengan koma)" value={orderForm.tests} onChange={(e) => setOrderForm(prev => ({ ...prev, tests: e.target.value }))} className="p-2 border rounded col-span-2" rows="2" />
            </div>
            <div className="flex gap-2">
              <button onClick={createOrder} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Buat Order</button>
              <button onClick={() => setShowOrderForm(false)} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">Batal</button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {labOrders.map(order => (
            <div key={order.id} className="p-4 bg-white border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{order.patientName}</h4>
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(order.status)}`}>{order.status}</span>
                    {order.urgency !== 'normal' && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">{order.urgency}</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{order.testType} - {order.tests}</p>
                  <p className="text-xs text-gray-500 mt-1">Dokter: {order.doctor}</p>
                  <p className="text-xs text-gray-500">Order: {new Date(order.orderDate).toLocaleString('id-ID')}</p>
                  {order.results && (
                    <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                      <p className="font-medium">Hasil:</p>
                      <p className="whitespace-pre-wrap">{order.results}</p>
                      {order.notes && <p className="text-xs text-gray-600 mt-1">Catatan: {order.notes}</p>}
                      <p className="text-xs text-gray-500 mt-1">Analis: {order.analyst}</p>
                    </div>
                  )}
                </div>
                {order.status !== 'completed' && (
                  <button onClick={() => setSelectedOrder(order.id)} className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
                    Input Hasil
                  </button>
                )}
              </div>

              {selectedOrder === order.id && (
                <div className="mt-3 p-3 bg-gray-50 rounded">
                  <h5 className="font-medium mb-2">Input Hasil Lab</h5>
                  <div className="space-y-2">
                    <textarea placeholder="Hasil pemeriksaan..." value={resultForm.results} onChange={(e) => setResultForm(prev => ({ ...prev, results: e.target.value }))} className="w-full p-2 border rounded" rows="4" />
                    <textarea placeholder="Catatan tambahan..." value={resultForm.notes} onChange={(e) => setResultForm(prev => ({ ...prev, notes: e.target.value }))} className="w-full p-2 border rounded" rows="2" />
                    <input type="text" placeholder="Nama Analis" value={resultForm.analyst} onChange={(e) => setResultForm(prev => ({ ...prev, analyst: e.target.value }))} className="w-full p-2 border rounded" />
                    <div className="flex gap-2">
                      <button onClick={submitResults} className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 flex items-center gap-1">
                        <CheckCircle size={14} />
                        Simpan Hasil
                      </button>
                      <button onClick={() => setSelectedOrder(null)} className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400">Batal</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          {labOrders.length === 0 && (
            <div className="text-center py-8 text-gray-500">Belum ada order lab</div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default LabManagement;
