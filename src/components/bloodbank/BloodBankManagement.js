import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, updateDoc, doc, addDoc } from '../../mockDb';
import { db } from '../../mockDb';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { Droplet, Plus, CheckCircle } from 'lucide-react';
import Card from '../common/Card';

const BloodBankManagement = () => {
  const { selectedFaskes } = useAuth();
  const { addNotification } = useApp();
  
  const [bloodInventory, setBloodInventory] = useState([]);
  const [bloodRequests, setBloodRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('inventory');
  const [showAddStock, setShowAddStock] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);

  const [stockForm, setStockForm] = useState({
    bloodType: 'A',
    rhFactor: '+',
    component: 'WB',
    units: '1',
    donorId: '',
    expiryDate: ''
  });

  const [requestForm, setRequestForm] = useState({
    patientName: '',
    bloodType: 'A',
    rhFactor: '+',
    component: 'WB',
    units: '1',
    urgency: 'normal',
    reason: ''
  });

  useEffect(() => {
    if (!selectedFaskes) return;

    const inventoryQuery = query(
      collection(db, 'blood_inventory'),
      where('faskesId', '==', selectedFaskes),
      where('status', '==', 'available')
    );

    const requestsQuery = query(
      collection(db, 'blood_requests'),
      where('faskesId', '==', selectedFaskes),
      where('status', '!=', 'completed')
    );

    const unsubInventory = onSnapshot(inventoryQuery, (snapshot) => {
      const data = [];
      snapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));
      setBloodInventory(data);
    });

    const unsubRequests = onSnapshot(requestsQuery, (snapshot) => {
      const data = [];
      snapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));
      setBloodRequests(data);
    });

    return () => {
      unsubInventory();
      unsubRequests();
    };
  }, [selectedFaskes]);

  const addBloodStock = async () => {
    try {
      await addDoc(collection(db, 'blood_inventory'), {
        ...stockForm,
        faskesId: selectedFaskes,
        status: 'available',
        receivedDate: new Date().toISOString(),
        createdAt: new Date().toISOString()
      });
      setStockForm({ bloodType: 'A', rhFactor: '+', component: 'WB', units: '1', donorId: '', expiryDate: '' });
      setShowAddStock(false);
      addNotification({ type: 'success', message: 'Stok darah ditambahkan' });
    } catch (error) {
      console.error('Error adding blood stock:', error);
      addNotification({ type: 'error', message: 'Gagal menambahkan stok' });
    }
  };

  const createBloodRequest = async () => {
    try {
      await addDoc(collection(db, 'blood_requests'), {
        ...requestForm,
        faskesId: selectedFaskes,
        status: 'pending',
        requestDate: new Date().toISOString(),
        createdAt: new Date().toISOString()
      });
      setRequestForm({ patientName: '', bloodType: 'A', rhFactor: '+', component: 'WB', units: '1', urgency: 'normal', reason: '' });
      setShowRequestForm(false);
      addNotification({ type: 'success', message: 'Permintaan darah dibuat' });
    } catch (error) {
      console.error('Error creating blood request:', error);
    }
  };

  const fulfillRequest = async (requestId) => {
    try {
      await updateDoc(doc(db, 'blood_requests', requestId), {
        status: 'completed',
        completedDate: new Date().toISOString()
      });
      addNotification({ type: 'success', message: 'Permintaan darah dipenuhi' });
    } catch (error) {
      console.error('Error fulfilling request:', error);
    }
  };

  const bloodTypeGroups = bloodInventory.reduce((acc, item) => {
    const key = `${item.bloodType}${item.rhFactor}-${item.component}`;
    if (!acc[key]) acc[key] = { ...item, totalUnits: 0 };
    acc[key].totalUnits += parseInt(item.units);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <Card 
        title="Manajemen Bank Darah"
        actions={
          <div className="flex gap-2">
            <button
              onClick={() => setShowAddStock(!showAddStock)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
            >
              <Plus size={16} />
              Tambah Stok
            </button>
            <button
              onClick={() => setShowRequestForm(!showRequestForm)}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Permintaan Darah
            </button>
          </div>
        }
      >
        {showAddStock && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-3">Tambah Stok Darah</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              <select
                value={stockForm.bloodType}
                onChange={(e) => setStockForm(prev => ({ ...prev, bloodType: e.target.value }))}
                className="p-2 border rounded"
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="AB">AB</option>
                <option value="O">O</option>
              </select>
              <select
                value={stockForm.rhFactor}
                onChange={(e) => setStockForm(prev => ({ ...prev, rhFactor: e.target.value }))}
                className="p-2 border rounded"
              >
                <option value="+">+</option>
                <option value="-">-</option>
              </select>
              <select
                value={stockForm.component}
                onChange={(e) => setStockForm(prev => ({ ...prev, component: e.target.value }))}
                className="p-2 border rounded"
              >
                <option value="WB">Whole Blood</option>
                <option value="PRC">Packed Red Cells</option>
                <option value="FFP">Fresh Frozen Plasma</option>
                <option value="TC">Thrombocyte Concentrate</option>
              </select>
              <input
                type="number"
                placeholder="Jumlah Unit"
                value={stockForm.units}
                onChange={(e) => setStockForm(prev => ({ ...prev, units: e.target.value }))}
                className="p-2 border rounded"
              />
              <input
                type="text"
                placeholder="ID Donor"
                value={stockForm.donorId}
                onChange={(e) => setStockForm(prev => ({ ...prev, donorId: e.target.value }))}
                className="p-2 border rounded"
              />
              <input
                type="date"
                placeholder="Tanggal Kadaluarsa"
                value={stockForm.expiryDate}
                onChange={(e) => setStockForm(prev => ({ ...prev, expiryDate: e.target.value }))}
                className="p-2 border rounded"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={addBloodStock} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                Simpan
              </button>
              <button onClick={() => setShowAddStock(false)} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
                Batal
              </button>
            </div>
          </div>
        )}

        {showRequestForm && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium mb-3">Form Permintaan Darah</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              <input
                type="text"
                placeholder="Nama Pasien"
                value={requestForm.patientName}
                onChange={(e) => setRequestForm(prev => ({ ...prev, patientName: e.target.value }))}
                className="p-2 border rounded col-span-2"
              />
              <select
                value={requestForm.bloodType}
                onChange={(e) => setRequestForm(prev => ({ ...prev, bloodType: e.target.value }))}
                className="p-2 border rounded"
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="AB">AB</option>
                <option value="O">O</option>
              </select>
              <select
                value={requestForm.rhFactor}
                onChange={(e) => setRequestForm(prev => ({ ...prev, rhFactor: e.target.value }))}
                className="p-2 border rounded"
              >
                <option value="+">+</option>
                <option value="-">-</option>
              </select>
              <select
                value={requestForm.component}
                onChange={(e) => setRequestForm(prev => ({ ...prev, component: e.target.value }))}
                className="p-2 border rounded"
              >
                <option value="WB">Whole Blood</option>
                <option value="PRC">Packed Red Cells</option>
                <option value="FFP">Fresh Frozen Plasma</option>
                <option value="TC">Thrombocyte Concentrate</option>
              </select>
              <input
                type="number"
                placeholder="Jumlah Unit"
                value={requestForm.units}
                onChange={(e) => setRequestForm(prev => ({ ...prev, units: e.target.value }))}
                className="p-2 border rounded"
              />
              <select
                value={requestForm.urgency}
                onChange={(e) => setRequestForm(prev => ({ ...prev, urgency: e.target.value }))}
                className="p-2 border rounded"
              >
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
                <option value="emergency">Emergency</option>
              </select>
              <textarea
                placeholder="Alasan"
                value={requestForm.reason}
                onChange={(e) => setRequestForm(prev => ({ ...prev, reason: e.target.value }))}
                className="p-2 border rounded col-span-2"
                rows="2"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={createBloodRequest} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                Buat Permintaan
              </button>
              <button onClick={() => setShowRequestForm(false)} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
                Batal
              </button>
            </div>
          </div>
        )}

        <div className="mb-4 flex gap-2 border-b">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 ${activeTab === 'inventory' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          >
            Inventori
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 ${activeTab === 'requests' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          >
            Permintaan
          </button>
        </div>

        {activeTab === 'inventory' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.values(bloodTypeGroups).map((group, idx) => (
              <div key={idx} className="p-4 bg-white border rounded-lg text-center">
                <Droplet size={32} className="mx-auto mb-2 text-red-500" />
                <h4 className="font-bold text-lg">{group.bloodType}{group.rhFactor}</h4>
                <p className="text-sm text-gray-600">{group.component}</p>
                <p className="text-2xl font-bold text-blue-600 mt-2">{group.totalUnits}</p>
                <p className="text-xs text-gray-500">unit tersedia</p>
              </div>
            ))}
            {Object.keys(bloodTypeGroups).length === 0 && (
              <div className="col-span-4 text-center py-8 text-gray-500">
                Belum ada stok darah
              </div>
            )}
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="space-y-3">
            {bloodRequests.map(request => (
              <div key={request.id} className="p-4 bg-white border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{request.patientName}</h4>
                    <p className="text-sm text-gray-600">
                      {request.bloodType}{request.rhFactor} - {request.component} - {request.units} unit
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Alasan: {request.reason}</p>
                    <span className={`inline-block mt-2 px-2 py-1 rounded text-xs ${
                      request.urgency === 'emergency' ? 'bg-red-100 text-red-800' :
                      request.urgency === 'urgent' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {request.urgency}
                    </span>
                  </div>
                  <button
                    onClick={() => fulfillRequest(request.id)}
                    className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 flex items-center gap-1"
                  >
                    <CheckCircle size={14} />
                    Penuhi
                  </button>
                </div>
              </div>
            ))}
            {bloodRequests.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Tidak ada permintaan darah aktif
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default BloodBankManagement;
