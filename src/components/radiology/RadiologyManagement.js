import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, updateDoc, doc, addDoc } from '../../mockDb';
import { db } from '../../mockDb';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { Scan, CheckCircle } from 'lucide-react';
import Card from '../common/Card';

const RadiologyManagement = () => {
  const { selectedFaskes } = useAuth();
  const { addNotification } = useApp();
  
  const [radiologyOrders, setRadiologyOrders] = useState([]);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [orderForm, setOrderForm] = useState({
    patientName: '',
    doctor: '',
    modality: 'X-Ray',
    bodyPart: '',
    clinicalInfo: '',
    urgency: 'normal'
  });

  const [reportForm, setReportForm] = useState({
    findings: '',
    impression: '',
    radiologist: ''
  });

  useEffect(() => {
    if (!selectedFaskes) return;

    const ordersQuery = query(
      collection(db, 'radiology_orders'),
      where('faskesId', '==', selectedFaskes)
    );

    const unsubOrders = onSnapshot(ordersQuery, (snapshot) => {
      const data = [];
      snapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setRadiologyOrders(data);
    });

    return () => unsubOrders();
  }, [selectedFaskes]);

  const createOrder = async () => {
    if (!orderForm.patientName || !orderForm.bodyPart) {
      addNotification({ type: 'warning', message: 'Nama pasien dan bagian tubuh harus diisi' });
      return;
    }

    try {
      await addDoc(collection(db, 'radiology_orders'), {
        ...orderForm,
        faskesId: selectedFaskes,
        status: 'pending',
        orderDate: new Date().toISOString(),
        createdAt: new Date().toISOString()
      });
      setOrderForm({ patientName: '', doctor: '', modality: 'X-Ray', bodyPart: '', clinicalInfo: '', urgency: 'normal' });
      setShowOrderForm(false);
      addNotification({ type: 'success', message: 'Order radiologi dibuat' });
    } catch (error) {
      console.error('Error creating radiology order:', error);
    }
  };

  const submitReport = async () => {
    if (!selectedOrder || !reportForm.findings) return;

    try {
      await updateDoc(doc(db, 'radiology_orders', selectedOrder), {
        ...reportForm,
        status: 'completed',
        completedDate: new Date().toISOString()
      });
      setSelectedOrder(null);
      setReportForm({ findings: '', impression: '', radiologist: '' });
      addNotification({ type: 'success', message: 'Laporan radiologi disimpan' });
    } catch (error) {
      console.error('Error submitting report:', error);
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
        title="Manajemen Radiologi"
        actions={
          <button onClick={() => setShowOrderForm(!showOrderForm)} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2">
            <Scan size={16} />
            Order Radiologi
          </button>
        }
      >
        {showOrderForm && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-3">Form Order Radiologi</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input type="text" placeholder="Nama Pasien" value={orderForm.patientName} onChange={(e) => setOrderForm(prev => ({ ...prev, patientName: e.target.value }))} className="p-2 border rounded" />
              <input type="text" placeholder="Dokter Pengirim" value={orderForm.doctor} onChange={(e) => setOrderForm(prev => ({ ...prev, doctor: e.target.value }))} className="p-2 border rounded" />
              <select value={orderForm.modality} onChange={(e) => setOrderForm(prev => ({ ...prev, modality: e.target.value }))} className="p-2 border rounded">
                <option value="X-Ray">X-Ray</option>
                <option value="CT-Scan">CT-Scan</option>
                <option value="MRI">MRI</option>
                <option value="USG">USG</option>
                <option value="Mammografi">Mammografi</option>
              </select>
              <input type="text" placeholder="Bagian Tubuh" value={orderForm.bodyPart} onChange={(e) => setOrderForm(prev => ({ ...prev, bodyPart: e.target.value }))} className="p-2 border rounded" />
              <select value={orderForm.urgency} onChange={(e) => setOrderForm(prev => ({ ...prev, urgency: e.target.value }))} className="p-2 border rounded">
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
                <option value="stat">STAT</option>
              </select>
              <textarea placeholder="Informasi Klinis" value={orderForm.clinicalInfo} onChange={(e) => setOrderForm(prev => ({ ...prev, clinicalInfo: e.target.value }))} className="p-2 border rounded col-span-2" rows="2" />
            </div>
            <div className="flex gap-2">
              <button onClick={createOrder} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Buat Order</button>
              <button onClick={() => setShowOrderForm(false)} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">Batal</button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {radiologyOrders.map(order => (
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
                  <p className="text-sm text-gray-600">{order.modality} - {order.bodyPart}</p>
                  <p className="text-xs text-gray-500 mt-1">Info Klinis: {order.clinicalInfo}</p>
                  <p className="text-xs text-gray-500">Dokter: {order.doctor}</p>
                  <p className="text-xs text-gray-500">Order: {new Date(order.orderDate).toLocaleString('id-ID')}</p>
                  {order.findings && (
                    <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                      <p className="font-medium">Temuan:</p>
                      <p className="whitespace-pre-wrap">{order.findings}</p>
                      <p className="font-medium mt-2">Kesan:</p>
                      <p className="whitespace-pre-wrap">{order.impression}</p>
                      <p className="text-xs text-gray-500 mt-1">Radiolog: {order.radiologist}</p>
                    </div>
                  )}
                </div>
                {order.status !== 'completed' && (
                  <button onClick={() => setSelectedOrder(order.id)} className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
                    Input Laporan
                  </button>
                )}
              </div>

              {selectedOrder === order.id && (
                <div className="mt-3 p-3 bg-gray-50 rounded">
                  <h5 className="font-medium mb-2">Input Laporan Radiologi</h5>
                  <div className="space-y-2">
                    <textarea placeholder="Temuan radiologi..." value={reportForm.findings} onChange={(e) => setReportForm(prev => ({ ...prev, findings: e.target.value }))} className="w-full p-2 border rounded" rows="4" />
                    <textarea placeholder="Kesan/Kesimpulan..." value={reportForm.impression} onChange={(e) => setReportForm(prev => ({ ...prev, impression: e.target.value }))} className="w-full p-2 border rounded" rows="2" />
                    <input type="text" placeholder="Nama Radiolog" value={reportForm.radiologist} onChange={(e) => setReportForm(prev => ({ ...prev, radiologist: e.target.value }))} className="w-full p-2 border rounded" />
                    <div className="flex gap-2">
                      <button onClick={submitReport} className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 flex items-center gap-1">
                        <CheckCircle size={14} />
                        Simpan Laporan
                      </button>
                      <button onClick={() => setSelectedOrder(null)} className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400">Batal</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          {radiologyOrders.length === 0 && (
            <div className="text-center py-8 text-gray-500">Belum ada order radiologi</div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default RadiologyManagement;
