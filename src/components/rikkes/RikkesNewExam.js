import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { collection, addDoc } from '../../mockDb';
import { db } from '../../mockDb';
import { ArrowLeft, Plus } from 'lucide-react';

const RikkesNewExam = () => {
  const navigate = useNavigate();
  const { selectedFaskes } = useAuth();
  const { theme, addNotification } = useApp();
  const [formData, setFormData] = useState({
    nrp: '',
    patientName: '',
    rank: '',
    unit: '',
    examDate: new Date().toISOString().split('T')[0],
    purpose: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nrp || !formData.patientName || !formData.rank) {
      addNotification({ type: 'error', message: 'Mohon lengkapi data wajib' });
      return;
    }

    try {
      setLoading(true);

      const newExam = {
        ...formData,
        faskesId: selectedFaskes,
        status: 'in_progress',
        sections: {
          identity: { status: 'draft' },
          clinical: { status: 'draft' },
          dental: { status: 'draft' },
          lab: { status: 'draft' },
          radiology: { status: 'draft' },
          conclusion: { status: 'draft' }
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'rikkes_examinations'), newExam);

      addNotification({ type: 'success', message: 'Pemeriksaan baru berhasil dibuat' });
      navigate(`/rikkes/exam/${docRef.id}`);
    } catch (error) {
      console.error('Error creating examination:', error);
      addNotification({ type: 'error', message: 'Gagal membuat pemeriksaan' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/rikkes')}
          className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors mb-4"
        >
          <ArrowLeft size={20} />
          Kembali
        </button>
        <h1 className="text-3xl font-bold" style={{ color: theme.primaryColor }}>
          Pemeriksaan Kesehatan Baru
        </h1>
        <p className="text-gray-600 mt-1">
          Buat pemeriksaan kesehatan baru untuk personel
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              NRP <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.nrp}
              onChange={(e) => handleChange('nrp', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.patientName}
              onChange={(e) => handleChange('patientName', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Pangkat <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.rank}
              onChange={(e) => handleChange('rank', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Pilih Pangkat</option>
              <option value="Jenderal TNI">Jenderal TNI</option>
              <option value="Letjen TNI">Letjen TNI</option>
              <option value="Mayjen TNI">Mayjen TNI</option>
              <option value="Brigjen TNI">Brigjen TNI</option>
              <option value="Kolonel">Kolonel</option>
              <option value="Letnan Kolonel">Letnan Kolonel</option>
              <option value="Mayor">Mayor</option>
              <option value="Kapten">Kapten</option>
              <option value="Letnan Satu">Letnan Satu</option>
              <option value="Letnan Dua">Letnan Dua</option>
              <option value="Sersan Mayor">Sersan Mayor</option>
              <option value="Sersan Kepala">Sersan Kepala</option>
              <option value="Sersan Satu">Sersan Satu</option>
              <option value="Sersan Dua">Sersan Dua</option>
              <option value="Kopral Kepala">Kopral Kepala</option>
              <option value="Kopral Satu">Kopral Satu</option>
              <option value="Kopral Dua">Kopral Dua</option>
              <option value="Prajurit Kepala">Prajurit Kepala</option>
              <option value="Prajurit Satu">Prajurit Satu</option>
              <option value="Prajurit Dua">Prajurit Dua</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Satuan
            </label>
            <input
              type="text"
              value={formData.unit}
              onChange={(e) => handleChange('unit', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tanggal Pemeriksaan
            </label>
            <input
              type="date"
              value={formData.examDate}
              onChange={(e) => handleChange('examDate', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tujuan Pemeriksaan
            </label>
            <select
              value={formData.purpose}
              onChange={(e) => handleChange('purpose', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Pilih Tujuan</option>
              <option value="Masuk Dinas">Masuk Dinas</option>
              <option value="Kenaikan Pangkat">Kenaikan Pangkat</option>
              <option value="Pensiun">Pensiun</option>
              <option value="Tugas Khusus">Tugas Khusus</option>
              <option value="Berkala">Berkala</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          <div className="flex gap-3 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate('/rikkes')}
              className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              style={{ backgroundColor: theme.primaryColor }}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Membuat...
                </>
              ) : (
                <>
                  <Plus size={20} />
                  Buat Pemeriksaan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RikkesNewExam;
