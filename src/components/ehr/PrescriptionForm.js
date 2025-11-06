import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc } from '../../mockDb';
import { db } from '../../mockDb';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { Plus, Trash2, Send } from 'lucide-react';

const PrescriptionForm = ({ patientId, patientName, onSuccess }) => {
  const { selectedFaskes } = useAuth();
  const { addNotification } = useApp();
  
  const [drugs, setDrugs] = useState([]);
  const [items, setItems] = useState([
    { drugName: '', quantity: '', unit: 'tablet', dosage: '', instructions: '', price: 0 }
  ]);
  const [notes, setNotes] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [poli, setPoli] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDrugs();
  }, [selectedFaskes]);

  const loadDrugs = async () => {
    if (!selectedFaskes) return;

    try {
      const q = query(
        collection(db, 'drugs'),
        where('faskesId', '==', selectedFaskes)
      );
      const snapshot = await getDocs(q);
      const drugList = [];
      snapshot.forEach((doc) => {
        drugList.push({ id: doc.id, ...doc.data() });
      });
      setDrugs(drugList);
    } catch (error) {
      console.error('Error loading drugs:', error);
    }
  };

  const addItem = () => {
    setItems([
      ...items,
      { drugName: '', quantity: '', unit: 'tablet', dosage: '', instructions: '', price: 0 }
    ]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;

    if (field === 'drugName') {
      const selectedDrug = drugs.find(d => d.name === value);
      if (selectedDrug) {
        newItems[index].price = parseInt(selectedDrug.price) || 0;
        newItems[index].unit = selectedDrug.unit || 'tablet';
      }
    }

    setItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!doctorName || !poli) {
      addNotification({ type: 'error', message: 'Nama dokter dan poli harus diisi' });
      return;
    }

    const validItems = items.filter(item => item.drugName && item.quantity);
    if (validItems.length === 0) {
      addNotification({ type: 'error', message: 'Minimal harus ada 1 obat yang diresepkan' });
      return;
    }

    setLoading(true);
    try {
      const prescription = {
        patientId,
        patientName,
        doctorName,
        poli,
        items: validItems.map(item => ({
          ...item,
          quantity: parseInt(item.quantity),
          price: parseInt(item.price)
        })),
        notes,
        status: 'menunggu',
        isPaid: false,
        faskesId: selectedFaskes,
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'prescriptions'), prescription);
      
      addNotification({ 
        type: 'success', 
        message: 'Resep berhasil dibuat dan dikirim ke apotek' 
      });

      setItems([{ drugName: '', quantity: '', unit: 'tablet', dosage: '', instructions: '', price: 0 }]);
      setNotes('');
      setDoctorName('');
      setPoli('');

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error creating prescription:', error);
      addNotification({ type: 'error', message: 'Gagal membuat resep' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Buat Resep Obat</h3>
        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Pasien:</span> {patientName}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Resep akan langsung masuk ke antrean apotek setelah disetujui
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Doctor Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Dokter <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan nama dokter"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Poli <span className="text-red-500">*</span>
            </label>
            <select
              value={poli}
              onChange={(e) => setPoli(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Pilih Poli</option>
              <option value="Poli Umum">Poli Umum</option>
              <option value="Poli Gigi">Poli Gigi</option>
              <option value="Poli Jantung">Poli Jantung</option>
              <option value="Poli Paru">Poli Paru</option>
              <option value="Poli Bedah">Poli Bedah</option>
              <option value="Poli Saraf">Poli Saraf</option>
              <option value="Poli Mata">Poli Mata</option>
              <option value="Poli THT">Poli THT</option>
              <option value="Poli Kulit & Kelamin">Poli Kulit & Kelamin</option>
            </select>
          </div>
        </div>

        {/* Prescription Items */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Daftar Obat <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
            >
              <Plus size={16} />
              Tambah Obat
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="p-4 border rounded-lg bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                  <div className="md:col-span-3">
                    <label className="block text-xs text-gray-600 mb-1">Nama Obat</label>
                    <select
                      value={item.drugName}
                      onChange={(e) => updateItem(index, 'drugName', e.target.value)}
                      className="w-full p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Pilih Obat</option>
                      {drugs.map((drug) => (
                        <option key={drug.id} value={drug.name}>
                          {drug.name} ({drug.genericName || 'Generik'})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs text-gray-600 mb-1">Jumlah</label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                      className="w-full p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                      min="1"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs text-gray-600 mb-1">Satuan</label>
                    <select
                      value={item.unit}
                      onChange={(e) => updateItem(index, 'unit', e.target.value)}
                      className="w-full p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="tablet">Tablet</option>
                      <option value="kapsul">Kapsul</option>
                      <option value="botol">Botol</option>
                      <option value="ampul">Ampul</option>
                      <option value="tube">Tube</option>
                      <option value="box">Box</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs text-gray-600 mb-1">Dosis</label>
                    <input
                      type="text"
                      value={item.dosage}
                      onChange={(e) => updateItem(index, 'dosage', e.target.value)}
                      className="w-full p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="3x1"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs text-gray-600 mb-1">Instruksi</label>
                    <input
                      type="text"
                      value={item.instructions}
                      onChange={(e) => updateItem(index, 'instructions', e.target.value)}
                      className="w-full p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Setelah makan"
                    />
                  </div>

                  <div className="md:col-span-1 flex items-end">
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="w-full p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center justify-center"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>

                {item.drugName && item.price > 0 && (
                  <div className="mt-2 text-xs text-gray-600">
                    Harga: Rp {parseInt(item.price).toLocaleString('id-ID')} / {item.unit}
                    {item.quantity && ` • Total: Rp ${(item.price * item.quantity).toLocaleString('id-ID')}`}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Catatan Tambahan
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows="3"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Catatan untuk apoteker (opsional)"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Send size={18} />
            {loading ? 'Mengirim...' : 'Kirim ke Apotek'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PrescriptionForm;
