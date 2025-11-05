import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, updateDoc, doc, addDoc } from '../../mockDb';
import { db } from '../../mockDb';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { AlertCircle, Calendar, Plus } from 'lucide-react';
import Card from '../common/Card';

const AssetsManagement = () => {
  const { selectedFaskes } = useAuth();
  const { addNotification } = useApp();
  
  const [assets, setAssets] = useState([]);
  const [calibrations, setCalibrations] = useState([]);
  const [activeTab, setActiveTab] = useState('assets');
  const [showAddAsset, setShowAddAsset] = useState(false);

  const [assetForm, setAssetForm] = useState({
    name: '',
    category: 'Medical Equipment',
    serialNumber: '',
    manufacturer: '',
    purchaseDate: '',
    lastCalibration: '',
    nextCalibration: '',
    status: 'operational'
  });

  useEffect(() => {
    if (!selectedFaskes) return;

    const assetsQuery = query(collection(db, 'assets'), where('faskesId', '==', selectedFaskes));
    const calibrationsQuery = query(collection(db, 'calibrations'), where('faskesId', '==', selectedFaskes));

    const unsubAssets = onSnapshot(assetsQuery, (snapshot) => {
      const data = [];
      snapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));
      setAssets(data);
    });

    const unsubCalibrations = onSnapshot(calibrationsQuery, (snapshot) => {
      const data = [];
      snapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setCalibrations(data.slice(0, 20));
    });

    return () => {
      unsubAssets();
      unsubCalibrations();
    };
  }, [selectedFaskes]);

  const addAsset = async () => {
    if (!assetForm.name) {
      addNotification({ type: 'warning', message: 'Nama aset harus diisi' });
      return;
    }

    try {
      await addDoc(collection(db, 'assets'), {
        ...assetForm,
        faskesId: selectedFaskes,
        createdAt: new Date().toISOString()
      });
      setAssetForm({ name: '', category: 'Medical Equipment', serialNumber: '', manufacturer: '', purchaseDate: '', lastCalibration: '', nextCalibration: '', status: 'operational' });
      setShowAddAsset(false);
      addNotification({ type: 'success', message: 'Aset berhasil ditambahkan' });
    } catch (error) {
      console.error('Error adding asset:', error);
    }
  };

  const recordCalibration = async (assetId, assetName) => {
    try {
      const today = new Date();
      const nextCal = new Date(today);
      nextCal.setMonth(nextCal.getMonth() + 6);

      await addDoc(collection(db, 'calibrations'), {
        assetId,
        assetName,
        faskesId: selectedFaskes,
        date: today.toISOString(),
        nextDate: nextCal.toISOString(),
        result: 'Pass',
        technician: 'Teknisi',
        createdAt: today.toISOString()
      });

      await updateDoc(doc(db, 'assets', assetId), {
        lastCalibration: today.toISOString(),
        nextCalibration: nextCal.toISOString()
      });

      addNotification({ type: 'success', message: 'Kalibrasi berhasil dicatat' });
    } catch (error) {
      console.error('Error recording calibration:', error);
    }
  };

  const needsCalibration = assets.filter(asset => {
    if (!asset.nextCalibration) return false;
    const nextCal = new Date(asset.nextCalibration);
    const today = new Date();
    const daysUntil = Math.ceil((nextCal - today) / (1000 * 60 * 60 * 24));
    return daysUntil <= 30;
  });

  return (
    <div className="space-y-6">
      <Card 
        title="Manajemen Aset & Kalibrasi"
        actions={
          <button onClick={() => setShowAddAsset(!showAddAsset)} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2">
            <Plus size={16} />
            Tambah Aset
          </button>
        }
      >
        {needsCalibration.length > 0 && (
          <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800">
            <div className="flex items-center gap-2">
              <AlertCircle size={20} />
              <span className="font-medium">{needsCalibration.length} aset perlu kalibrasi dalam 30 hari</span>
            </div>
          </div>
        )}

        {showAddAsset && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-3">Tambah Aset Baru</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input type="text" placeholder="Nama Aset" value={assetForm.name} onChange={(e) => setAssetForm(prev => ({ ...prev, name: e.target.value }))} className="p-2 border rounded" />
              <select value={assetForm.category} onChange={(e) => setAssetForm(prev => ({ ...prev, category: e.target.value }))} className="p-2 border rounded">
                <option value="Medical Equipment">Medical Equipment</option>
                <option value="IT Equipment">IT Equipment</option>
                <option value="Furniture">Furniture</option>
                <option value="Vehicle">Vehicle</option>
              </select>
              <input type="text" placeholder="Serial Number" value={assetForm.serialNumber} onChange={(e) => setAssetForm(prev => ({ ...prev, serialNumber: e.target.value }))} className="p-2 border rounded" />
              <input type="text" placeholder="Manufacturer" value={assetForm.manufacturer} onChange={(e) => setAssetForm(prev => ({ ...prev, manufacturer: e.target.value }))} className="p-2 border rounded" />
              <input type="date" placeholder="Tanggal Pembelian" value={assetForm.purchaseDate} onChange={(e) => setAssetForm(prev => ({ ...prev, purchaseDate: e.target.value }))} className="p-2 border rounded" />
              <select value={assetForm.status} onChange={(e) => setAssetForm(prev => ({ ...prev, status: e.target.value }))} className="p-2 border rounded">
                <option value="operational">Operational</option>
                <option value="maintenance">Maintenance</option>
                <option value="retired">Retired</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button onClick={addAsset} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Simpan</button>
              <button onClick={() => setShowAddAsset(false)} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">Batal</button>
            </div>
          </div>
        )}

        <div className="mb-4 flex gap-2 border-b">
          <button onClick={() => setActiveTab('assets')} className={`px-4 py-2 ${activeTab === 'assets' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}>
            Aset
          </button>
          <button onClick={() => setActiveTab('calibrations')} className={`px-4 py-2 ${activeTab === 'calibrations' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}>
            Riwayat Kalibrasi
          </button>
        </div>

        {activeTab === 'assets' && (
          <div className="space-y-2">
            {assets.map(asset => {
              const needsCal = needsCalibration.find(a => a.id === asset.id);
              return (
                <div key={asset.id} className={`p-3 bg-white border rounded-lg ${needsCal ? 'border-l-4 border-l-yellow-500' : ''}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-medium">{asset.name}</h5>
                      <p className="text-sm text-gray-600">{asset.category} - {asset.manufacturer}</p>
                      <div className="text-xs text-gray-500 mt-1">
                        <div>Serial: {asset.serialNumber}</div>
                        {asset.lastCalibration && <div>Kalibrasi Terakhir: {new Date(asset.lastCalibration).toLocaleDateString('id-ID')}</div>}
                        {asset.nextCalibration && <div>Kalibrasi Berikutnya: {new Date(asset.nextCalibration).toLocaleDateString('id-ID')}</div>}
                      </div>
                      <span className={`inline-block mt-2 px-2 py-1 rounded text-xs ${
                        asset.status === 'operational' ? 'bg-green-100 text-green-800' :
                        asset.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {asset.status}
                      </span>
                    </div>
                    <button onClick={() => recordCalibration(asset.id, asset.name)} className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 flex items-center gap-1">
                      <Calendar size={14} />
                      Catat Kalibrasi
                    </button>
                  </div>
                </div>
              );
            })}
            {assets.length === 0 && (
              <div className="text-center py-8 text-gray-500">Belum ada data aset</div>
            )}
          </div>
        )}

        {activeTab === 'calibrations' && (
          <div className="space-y-2">
            {calibrations.map(cal => (
              <div key={cal.id} className="p-3 bg-white border rounded-lg">
                <h5 className="font-medium">{cal.assetName}</h5>
                <div className="text-sm text-gray-600 mt-1">
                  <div>Tanggal: {new Date(cal.date).toLocaleDateString('id-ID')}</div>
                  <div>Berikutnya: {new Date(cal.nextDate).toLocaleDateString('id-ID')}</div>
                  <div>Hasil: {cal.result}</div>
                  <div>Teknisi: {cal.technician}</div>
                </div>
              </div>
            ))}
            {calibrations.length === 0 && (
              <div className="text-center py-8 text-gray-500">Belum ada riwayat kalibrasi</div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default AssetsManagement;
