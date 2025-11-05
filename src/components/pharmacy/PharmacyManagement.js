import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, updateDoc, doc, addDoc } from '../../mockDb';
import { db } from '../../mockDb';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { Pill, AlertTriangle } from 'lucide-react';
import Card from '../common/Card';

const PharmacyManagement = () => {
  const { selectedFaskes } = useAuth();
  const { addNotification } = useApp();
  
  const [drugs, setDrugs] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [activeTab, setActiveTab] = useState('inventory');
  const [showAddDrug, setShowAddDrug] = useState(false);

  const [drugForm, setDrugForm] = useState({
    name: '',
    genericName: '',
    category: 'Antibiotik',
    stock: '0',
    unit: 'tablet',
    price: '0',
    expiryDate: '',
    supplier: ''
  });

  useEffect(() => {
    if (!selectedFaskes) return;

    const drugsQuery = query(collection(db, 'drugs'), where('faskesId', '==', selectedFaskes));
    const prescriptionsQuery = query(
      collection(db, 'prescriptions'),
      where('faskesId', '==', selectedFaskes),
      where('status', '==', 'pending')
    );

    const unsubDrugs = onSnapshot(drugsQuery, (snapshot) => {
      const data = [];
      snapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));
      setDrugs(data);
    });

    const unsubPrescriptions = onSnapshot(prescriptionsQuery, (snapshot) => {
      const data = [];
      snapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));
      setPrescriptions(data);
    });

    return () => {
      unsubDrugs();
      unsubPrescriptions();
    };
  }, [selectedFaskes]);

  const addDrug = async () => {
    if (!drugForm.name) {
      addNotification({ type: 'warning', message: 'Nama obat harus diisi' });
      return;
    }

    try {
      await addDoc(collection(db, 'drugs'), {
        ...drugForm,
        faskesId: selectedFaskes,
        createdAt: new Date().toISOString()
      });
      setDrugForm({ name: '', genericName: '', category: 'Antibiotik', stock: '0', unit: 'tablet', price: '0', expiryDate: '', supplier: '' });
      setShowAddDrug(false);
      addNotification({ type: 'success', message: 'Obat berhasil ditambahkan' });
    } catch (error) {
      console.error('Error adding drug:', error);
      addNotification({ type: 'error', message: 'Gagal menambahkan obat' });
    }
  };

  const dispensePrescription = async (prescriptionId) => {
    try {
      await updateDoc(doc(db, 'prescriptions', prescriptionId), {
        status: 'dispensed',
        dispensedDate: new Date().toISOString()
      });
      addNotification({ type: 'success', message: 'Resep berhasil diserahkan' });
    } catch (error) {
      console.error('Error dispensing prescription:', error);
    }
  };

  const lowStockDrugs = drugs.filter(drug => parseInt(drug.stock) < 10);

  return (
    <div className="space-y-6">
      <Card 
        title="Manajemen Farmasi"
        actions={
          <button
            onClick={() => setShowAddDrug(!showAddDrug)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
          >
            <Pill size={16} />
            Tambah Obat
          </button>
        }
      >
        {lowStockDrugs.length > 0 && (
          <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800">
            <div className="flex items-center gap-2">
              <AlertTriangle size={20} />
              <span className="font-medium">{lowStockDrugs.length} obat dengan stok menipis</span>
            </div>
          </div>
        )}

        {showAddDrug && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-3">Tambah Obat Baru</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input type="text" placeholder="Nama Obat" value={drugForm.name} onChange={(e) => setDrugForm(prev => ({ ...prev, name: e.target.value }))} className="p-2 border rounded" />
              <input type="text" placeholder="Nama Generik" value={drugForm.genericName} onChange={(e) => setDrugForm(prev => ({ ...prev, genericName: e.target.value }))} className="p-2 border rounded" />
              <select value={drugForm.category} onChange={(e) => setDrugForm(prev => ({ ...prev, category: e.target.value }))} className="p-2 border rounded">
                <option value="Antibiotik">Antibiotik</option>
                <option value="Analgesik">Analgesik</option>
                <option value="Antipiretik">Antipiretik</option>
                <option value="Antihipertensi">Antihipertensi</option>
                <option value="Antidiabetes">Antidiabetes</option>
                <option value="Vitamin">Vitamin</option>
              </select>
              <input type="number" placeholder="Stok" value={drugForm.stock} onChange={(e) => setDrugForm(prev => ({ ...prev, stock: e.target.value }))} className="p-2 border rounded" />
              <select value={drugForm.unit} onChange={(e) => setDrugForm(prev => ({ ...prev, unit: e.target.value }))} className="p-2 border rounded">
                <option value="tablet">Tablet</option>
                <option value="kapsul">Kapsul</option>
                <option value="botol">Botol</option>
                <option value="ampul">Ampul</option>
                <option value="tube">Tube</option>
              </select>
              <input type="number" placeholder="Harga" value={drugForm.price} onChange={(e) => setDrugForm(prev => ({ ...prev, price: e.target.value }))} className="p-2 border rounded" />
              <input type="date" placeholder="Tanggal Kadaluarsa" value={drugForm.expiryDate} onChange={(e) => setDrugForm(prev => ({ ...prev, expiryDate: e.target.value }))} className="p-2 border rounded" />
              <input type="text" placeholder="Supplier" value={drugForm.supplier} onChange={(e) => setDrugForm(prev => ({ ...prev, supplier: e.target.value }))} className="p-2 border rounded" />
            </div>
            <div className="flex gap-2">
              <button onClick={addDrug} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Simpan</button>
              <button onClick={() => setShowAddDrug(false)} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">Batal</button>
            </div>
          </div>
        )}

        <div className="mb-4 flex gap-2 border-b">
          <button onClick={() => setActiveTab('inventory')} className={`px-4 py-2 ${activeTab === 'inventory' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}>
            Inventori
          </button>
          <button onClick={() => setActiveTab('prescriptions')} className={`px-4 py-2 ${activeTab === 'prescriptions' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}>
            Resep
          </button>
        </div>

        {activeTab === 'inventory' && (
          <div className="space-y-2">
            {drugs.map(drug => (
              <div key={drug.id} className={`p-3 bg-white border rounded-lg ${parseInt(drug.stock) < 10 ? 'border-l-4 border-l-yellow-500' : ''}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{drug.name}</h4>
                    <p className="text-sm text-gray-600">{drug.genericName} - {drug.category}</p>
                    <div className="flex gap-4 mt-1 text-xs text-gray-500">
                      <span>Stok: {drug.stock} {drug.unit}</span>
                      <span>Harga: Rp {parseInt(drug.price).toLocaleString('id-ID')}</span>
                      {drug.expiryDate && <span>Exp: {new Date(drug.expiryDate).toLocaleDateString('id-ID')}</span>}
                    </div>
                  </div>
                  {parseInt(drug.stock) < 10 && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">Stok Rendah</span>
                  )}
                </div>
              </div>
            ))}
            {drugs.length === 0 && (
              <div className="text-center py-8 text-gray-500">Belum ada data obat</div>
            )}
          </div>
        )}

        {activeTab === 'prescriptions' && (
          <div className="space-y-3">
            {prescriptions.map(prescription => (
              <div key={prescription.id} className="p-4 bg-white border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{prescription.patientName}</h4>
                    <p className="text-sm text-gray-600">Dokter: {prescription.doctor}</p>
                    <div className="mt-2 space-y-1">
                      {prescription.items && prescription.items.map((item, idx) => (
                        <div key={idx} className="text-xs text-gray-600">
                          • {item.drug} - {item.dosage} - {item.quantity} {item.unit}
                        </div>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => dispensePrescription(prescription.id)} className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600">
                    Serahkan
                  </button>
                </div>
              </div>
            ))}
            {prescriptions.length === 0 && (
              <div className="text-center py-8 text-gray-500">Tidak ada resep pending</div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default PharmacyManagement;
