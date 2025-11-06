import React, { useState, useEffect } from 'react';
import { addDoc, updateDoc, doc, collection } from '../../mockDb';
import { db } from '../../mockDb';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { format } from 'date-fns';
import { Save, X, AlertTriangle, Heart, Thermometer, Activity, Weight, Ruler, FileText, Pill, ExternalLink, User } from 'lucide-react';

const DailyExaminationForm = ({ registration, examination, onClose, onSave }) => {
  const { selectedFaskes, user } = useAuth();
  const { addNotification } = useApp();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    keluhan: '',
    riwayatPenyakit: '',
    pemeriksaanFisik: {
      tekananDarah: '',
      nadi: '',
      suhu: '',
      respirasi: '',
      beratBadan: '',
      tinggiBadan: '',
      lingkarPerut: '',
      pemeriksaanLain: ''
    },
    diagnosis: '',
    diagnosisKode: '',
    tindakanMedis: [],
    resepObat: [],
    catatanTambahan: '',
    rujukan: {
      isRujukan: false,
      tujuan: '',
      alasan: '',
      diagnosa: ''
    },
    petugas: user?.nama || 'Petugas FKTP',
    dokter: ''
  });

  const [newTindakan, setNewTindakan] = useState({ nama: '', keterangan: '' });
  const [newObat, setNewObat] = useState({ nama: '', dosis: '', jumlah: '', aturanPakai: '' });

  useEffect(() => {
    if (examination) {
      setFormData({
        keluhan: examination.keluhan || '',
        riwayatPenyakit: examination.riwayatPenyakit || '',
        pemeriksaanFisik: examination.pemeriksaanFisik || {
          tekananDarah: '',
          nadi: '',
          suhu: '',
          respirasi: '',
          beratBadan: '',
          tinggiBadan: '',
          lingkarPerut: '',
          pemeriksaanLain: ''
        },
        diagnosis: examination.diagnosis || '',
        diagnosisKode: examination.diagnosisKode || '',
        tindakanMedis: examination.tindakanMedis || [],
        resepObat: examination.resepObat || [],
        catatanTambahan: examination.catatanTambahan || '',
        rujukan: examination.rujukan || {
          isRujukan: false,
          tujuan: '',
          alasan: '',
          diagnosa: ''
        },
        petugas: examination.petugas || user?.nama || 'Petugas FKTP',
        dokter: examination.dokter || ''
      });
    }
  }, [examination, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFisikChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      pemeriksaanFisik: { ...prev.pemeriksaanFisik, [name]: value }
    }));
  };

  const handleRujukanChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      rujukan: {
        ...prev.rujukan,
        [name]: type === 'checkbox' ? checked : value
      }
    }));
  };

  const addTindakan = () => {
    if (!newTindakan.nama.trim()) {
      addNotification({ type: 'warning', message: 'Nama tindakan harus diisi' });
      return;
    }
    setFormData(prev => ({
      ...prev,
      tindakanMedis: [...prev.tindakanMedis, { ...newTindakan, id: Date.now() }]
    }));
    setNewTindakan({ nama: '', keterangan: '' });
  };

  const removeTindakan = (id) => {
    setFormData(prev => ({
      ...prev,
      tindakanMedis: prev.tindakanMedis.filter(t => t.id !== id)
    }));
  };

  const addObat = () => {
    if (!newObat.nama.trim() || !newObat.dosis.trim() || !newObat.jumlah.trim()) {
      addNotification({ type: 'warning', message: 'Nama obat, dosis, dan jumlah harus diisi' });
      return;
    }
    setFormData(prev => ({
      ...prev,
      resepObat: [...prev.resepObat, { ...newObat, id: Date.now() }]
    }));
    setNewObat({ nama: '', dosis: '', jumlah: '', aturanPakai: '' });
  };

  const removeObat = (id) => {
    setFormData(prev => ({
      ...prev,
      resepObat: prev.resepObat.filter(o => o.id !== id)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.keluhan.trim()) {
      addNotification({ type: 'warning', message: 'Keluhan pasien harus diisi' });
      return;
    }

    if (!formData.diagnosis.trim()) {
      addNotification({ type: 'warning', message: 'Diagnosis harus diisi' });
      return;
    }

    try {
      setLoading(true);
      const now = new Date();
      const examData = {
        ...formData,
        patientId: registration.patientId || registration.nik,
        patientName: registration.namaPasien,
        registrationId: registration.id,
        poli: registration.poli,
        tanggalPemeriksaan: format(now, 'yyyy-MM-dd'),
        waktuPemeriksaan: format(now, 'HH:mm:ss'),
        status: 'completed',
        waktuSelesai: format(now, 'HH:mm:ss'),
        faskesId: selectedFaskes || 'default'
      };

      if (examination) {
        await updateDoc(doc(db, 'daily_examinations', examination.id), examData);
        addNotification({ type: 'success', message: 'Pemeriksaan berhasil diperbarui' });
      } else {
        examData.waktuMulai = format(now, 'HH:mm:ss');
        await addDoc(collection(db, 'daily_examinations'), examData);
        addNotification({ type: 'success', message: 'Pemeriksaan berhasil disimpan' });
      }

      onSave();
    } catch (error) {
      console.error('Error saving examination:', error);
      addNotification({ type: 'error', message: 'Gagal menyimpan pemeriksaan' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-blue-600 text-white p-4 flex justify-between items-center z-10">
          <div>
            <h2 className="text-xl font-bold">Pemeriksaan Pasien</h2>
            <p className="text-sm text-blue-100">
              {registration.namaPasien} • {registration.nrp ? `NRP: ${registration.nrp}` : `NIK: ${registration.nik}`}
            </p>
          </div>
          <button onClick={onClose} className="text-white hover:bg-blue-700 p-2 rounded-lg transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Keluhan Utama */}
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <label className="flex items-center space-x-2 text-sm font-semibold text-red-900 mb-2">
              <AlertTriangle className="w-5 h-5" />
              <span>Keluhan Utama *</span>
            </label>
            <textarea
              name="keluhan"
              value={formData.keluhan}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Tuliskan keluhan utama pasien..."
              required
            />
          </div>

          {/* Riwayat Penyakit */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Riwayat Penyakit
            </label>
            <textarea
              name="riwayatPenyakit"
              value={formData.riwayatPenyakit}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Riwayat penyakit sebelumnya, alergi, dll..."
            />
          </div>

          {/* Pemeriksaan Fisik */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-4 flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>Pemeriksaan Fisik & Vital Signs</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span>Tekanan Darah</span>
                </label>
                <input
                  type="text"
                  name="tekananDarah"
                  value={formData.pemeriksaanFisik.tekananDarah}
                  onChange={handleFisikChange}
                  placeholder="120/80"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
                  <Activity className="w-4 h-4 text-blue-500" />
                  <span>Nadi (x/menit)</span>
                </label>
                <input
                  type="text"
                  name="nadi"
                  value={formData.pemeriksaanFisik.nadi}
                  onChange={handleFisikChange}
                  placeholder="80"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
                  <Thermometer className="w-4 h-4 text-orange-500" />
                  <span>Suhu (°C)</span>
                </label>
                <input
                  type="text"
                  name="suhu"
                  value={formData.pemeriksaanFisik.suhu}
                  onChange={handleFisikChange}
                  placeholder="36.5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
                  <Activity className="w-4 h-4 text-green-500" />
                  <span>Respirasi (x/menit)</span>
                </label>
                <input
                  type="text"
                  name="respirasi"
                  value={formData.pemeriksaanFisik.respirasi}
                  onChange={handleFisikChange}
                  placeholder="20"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
                  <Weight className="w-4 h-4 text-purple-500" />
                  <span>Berat Badan (kg)</span>
                </label>
                <input
                  type="text"
                  name="beratBadan"
                  value={formData.pemeriksaanFisik.beratBadan}
                  onChange={handleFisikChange}
                  placeholder="70"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
                  <Ruler className="w-4 h-4 text-indigo-500" />
                  <span>Tinggi Badan (cm)</span>
                </label>
                <input
                  type="text"
                  name="tinggiBadan"
                  value={formData.pemeriksaanFisik.tinggiBadan}
                  onChange={handleFisikChange}
                  placeholder="170"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
                  <Ruler className="w-4 h-4 text-pink-500" />
                  <span>Lingkar Perut (cm)</span>
                </label>
                <input
                  type="text"
                  name="lingkarPerut"
                  value={formData.pemeriksaanFisik.lingkarPerut}
                  onChange={handleFisikChange}
                  placeholder="80"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pemeriksaan Fisik Lainnya
              </label>
              <textarea
                name="pemeriksaanLain"
                value={formData.pemeriksaanFisik.pemeriksaanLain}
                onChange={handleFisikChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Hasil pemeriksaan fisik lainnya (kepala, leher, thorax, abdomen, ekstremitas, dll)..."
              />
            </div>
          </div>

          {/* Diagnosis */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <label className="flex items-center space-x-2 text-sm font-semibold text-green-900 mb-2">
              <FileText className="w-5 h-5" />
              <span>Diagnosis *</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <input
                  type="text"
                  name="diagnosis"
                  value={formData.diagnosis}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Diagnosis utama..."
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  name="diagnosisKode"
                  value={formData.diagnosisKode}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Kode ICD-10 (opsional)"
                />
              </div>
            </div>
          </div>

          {/* Tindakan Medis */}
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h3 className="font-semibold text-purple-900 mb-3 flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>Tindakan Medis</span>
            </h3>
            <div className="space-y-3">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newTindakan.nama}
                  onChange={(e) => setNewTindakan({ ...newTindakan, nama: e.target.value })}
                  placeholder="Nama tindakan"
                  className="flex-1 px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="text"
                  value={newTindakan.keterangan}
                  onChange={(e) => setNewTindakan({ ...newTindakan, keterangan: e.target.value })}
                  placeholder="Keterangan"
                  className="flex-1 px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
                <button
                  type="button"
                  onClick={addTindakan}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Tambah
                </button>
              </div>
              {formData.tindakanMedis.length > 0 && (
                <div className="space-y-2">
                  {formData.tindakanMedis.map((tindakan) => (
                    <div key={tindakan.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-purple-200">
                      <div>
                        <p className="font-medium text-gray-900">{tindakan.nama}</p>
                        {tindakan.keterangan && (
                          <p className="text-sm text-gray-600">{tindakan.keterangan}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeTindakan(tindakan.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Resep Obat */}
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h3 className="font-semibold text-yellow-900 mb-3 flex items-center space-x-2">
              <Pill className="w-5 h-5" />
              <span>Resep Obat</span>
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <input
                  type="text"
                  value={newObat.nama}
                  onChange={(e) => setNewObat({ ...newObat, nama: e.target.value })}
                  placeholder="Nama obat"
                  className="px-3 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                />
                <input
                  type="text"
                  value={newObat.dosis}
                  onChange={(e) => setNewObat({ ...newObat, dosis: e.target.value })}
                  placeholder="Dosis (mg)"
                  className="px-3 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                />
                <input
                  type="text"
                  value={newObat.jumlah}
                  onChange={(e) => setNewObat({ ...newObat, jumlah: e.target.value })}
                  placeholder="Jumlah"
                  className="px-3 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                />
                <input
                  type="text"
                  value={newObat.aturanPakai}
                  onChange={(e) => setNewObat({ ...newObat, aturanPakai: e.target.value })}
                  placeholder="Aturan pakai"
                  className="px-3 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <button
                type="button"
                onClick={addObat}
                className="w-full md:w-auto px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
              >
                Tambah Obat
              </button>
              {formData.resepObat.length > 0 && (
                <div className="space-y-2">
                  {formData.resepObat.map((obat) => (
                    <div key={obat.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-yellow-200">
                      <div>
                        <p className="font-medium text-gray-900">{obat.nama} - {obat.dosis}</p>
                        <p className="text-sm text-gray-600">Jumlah: {obat.jumlah} • {obat.aturanPakai}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeObat(obat.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Rujukan */}
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <div className="flex items-center space-x-2 mb-3">
              <input
                type="checkbox"
                name="isRujukan"
                checked={formData.rujukan.isRujukan}
                onChange={handleRujukanChange}
                className="w-4 h-4 text-orange-600 focus:ring-orange-500"
              />
              <label className="font-semibold text-orange-900 flex items-center space-x-2">
                <ExternalLink className="w-5 h-5" />
                <span>Perlu Rujukan</span>
              </label>
            </div>
            {formData.rujukan.isRujukan && (
              <div className="space-y-3 mt-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tujuan Rujukan</label>
                  <input
                    type="text"
                    name="tujuan"
                    value={formData.rujukan.tujuan}
                    onChange={handleRujukanChange}
                    className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="RSAU atau faskes lain..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alasan Rujukan</label>
                  <textarea
                    name="alasan"
                    value={formData.rujukan.alasan}
                    onChange={handleRujukanChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="Alasan rujukan..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosa Rujukan</label>
                  <input
                    type="text"
                    name="diagnosa"
                    value={formData.rujukan.diagnosa}
                    onChange={handleRujukanChange}
                    className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="Diagnosa untuk rujukan..."
                  />
                </div>
              </div>
            )}
          </div>

          {/* Catatan Tambahan & Petugas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catatan Tambahan</label>
              <textarea
                name="catatanTambahan"
                value={formData.catatanTambahan}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Catatan tambahan untuk rekam medis..."
              />
            </div>
            <div className="space-y-3">
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
                  <User className="w-4 h-4" />
                  <span>Dokter/Petugas yang Memeriksa *</span>
                </label>
                <input
                  type="text"
                  name="dokter"
                  value={formData.dokter}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Nama dokter/petugas"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pencatat</label>
                <input
                  type="text"
                  name="petugas"
                  value={formData.petugas}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Simpan Pemeriksaan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DailyExaminationForm;
