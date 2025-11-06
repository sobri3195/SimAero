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
  const [showInteractionCheck, setShowInteractionCheck] = useState(false);
  const [selectedDrugsForCheck, setSelectedDrugsForCheck] = useState([]);
  const [interactionResults, setInteractionResults] = useState(null);

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

  const checkDrugInteractions = () => {
    if (selectedDrugsForCheck.length < 2) {
      addNotification({ type: 'warning', message: 'Pilih minimal 2 obat untuk cek interaksi' });
      return;
    }

    const interactions = [];
    const commonInteractions = {
      'Warfarin': ['Aspirin', 'Ibuprofen', 'Naproxen'],
      'Aspirin': ['Warfarin', 'Ibuprofen'],
      'Metformin': ['Kontras media'],
      'ACE Inhibitor': ['Spironolactone', 'Kalium'],
    };

    selectedDrugsForCheck.forEach((drug1, i) => {
      selectedDrugsForCheck.slice(i + 1).forEach(drug2 => {
        Object.keys(commonInteractions).forEach(key => {
          if ((drug1.includes(key) && commonInteractions[key].some(d => drug2.includes(d))) ||
              (drug2.includes(key) && commonInteractions[key].some(d => drug1.includes(d)))) {
            interactions.push({
              drug1,
              drug2,
              severity: 'Major',
              description: `Potensi interaksi obat antara ${drug1} dan ${drug2}. Konsultasikan dengan dokter.`
            });
          }
        });
      });
    });

    if (interactions.length === 0) {
      interactions.push({
        severity: 'None',
        description: 'Tidak ditemukan interaksi obat yang signifikan.'
      });
    }

    setInteractionResults(interactions);
    addNotification({ type: 'info', message: `Ditemukan ${interactions.length} potensi interaksi` });
  };

  const getGenericSubstitute = (brandName) => {
    const substitutes = {
      'Panadol': 'Parasetamol Generik',
      'Bodrex': 'Parasetamol Generik',
      'Sanmol': 'Parasetamol Generik',
      'Amoxil': 'Amoksisilin Generik',
      'Voltaren': 'Diklofenak Generik',
      'Neurobion': 'Vitamin B Complex Generik'
    };
    return substitutes[brandName] || 'Tidak ada substitusi generik';
  };

  const lowStockDrugs = drugs.filter(drug => parseInt(drug.stock) < 10);

  return (
    <div className="space-y-6">
      <Card 
        title="Manajemen Farmasi"
        actions={
          <div className="flex gap-2">
            <button
              onClick={() => setShowInteractionCheck(!showInteractionCheck)}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 flex items-center gap-2"
            >
              <AlertTriangle size={16} />
              Cek Interaksi Obat
            </button>
            <button
              onClick={() => setShowAddDrug(!showAddDrug)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
            >
              <Pill size={16} />
              Tambah Obat
            </button>
          </div>
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

        {showInteractionCheck && (
          <div className="mb-6 p-4 bg-orange-50 rounded-lg">
            <h4 className="font-medium mb-3">Cek Interaksi Obat</h4>
            <p className="text-sm text-gray-600 mb-3">Pilih obat yang akan dicek interaksinya (minimal 2 obat)</p>
            <div className="mb-3">
              <select
                multiple
                value={selectedDrugsForCheck}
                onChange={(e) => {
                  const options = e.target.options;
                  const selected = [];
                  for (let i = 0; i < options.length; i++) {
                    if (options[i].selected) {
                      selected.push(options[i].value);
                    }
                  }
                  setSelectedDrugsForCheck(selected);
                }}
                className="w-full p-2 border rounded"
                size="5"
              >
                {drugs.map((drug, idx) => (
                  <option key={idx} value={drug.name}>{drug.name} ({drug.genericName})</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Tekan Ctrl/Cmd untuk pilih multiple</p>
            </div>
            <button
              onClick={checkDrugInteractions}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
            >
              Cek Interaksi
            </button>

            {interactionResults && (
              <div className="mt-4 space-y-2">
                <h5 className="font-medium">Hasil Pemeriksaan:</h5>
                {interactionResults.map((result, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded ${
                      result.severity === 'Major' ? 'bg-red-100 border-l-4 border-red-500' : 
                      result.severity === 'Moderate' ? 'bg-yellow-100 border-l-4 border-yellow-500' : 
                      'bg-green-100 border-l-4 border-green-500'
                    }`}
                  >
                    {result.drug1 && result.drug2 && (
                      <div className="font-medium text-sm mb-1">
                        {result.drug1} ⚠️ {result.drug2}
                      </div>
                    )}
                    <div className="text-sm">{result.description}</div>
                    <div className="text-xs mt-1 font-medium">
                      Tingkat: <span className={result.severity === 'None' ? 'text-green-600' : 'text-red-600'}>{result.severity}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
            {drugs.map(drug => {
              const genericSub = getGenericSubstitute(drug.name);
              return (
                <div key={drug.id} className={`p-3 bg-white border rounded-lg ${parseInt(drug.stock) < 10 ? 'border-l-4 border-l-yellow-500' : ''}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium">{drug.name}</h4>
                      <p className="text-sm text-gray-600">{drug.genericName} - {drug.category}</p>
                      {genericSub !== 'Tidak ada substitusi generik' && (
                        <p className="text-xs text-blue-600 mt-1">
                          💊 Substitusi Generik: {genericSub}
                        </p>
                      )}
                      <div className="flex gap-4 mt-1 text-xs text-gray-500">
                        <span>Stok: {drug.stock} {drug.unit}</span>
                        <span>Harga: Rp {parseInt(drug.price).toLocaleString('id-ID')}</span>
                        {drug.expiryDate && <span>Exp: {new Date(drug.expiryDate).toLocaleDateString('id-ID')}</span>}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                      {parseInt(drug.stock) < 10 && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">Stok Rendah</span>
                      )}
                      {drug.genericName && drug.genericName.toLowerCase().includes('generik') && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Generik</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
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
