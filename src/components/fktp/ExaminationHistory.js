import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from '../../mockDb';
import { db } from '../../mockDb';
import { useAuth } from '../../contexts/AuthContext';
import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale';
import { Calendar, User, FileText, Activity, Pill, ExternalLink, ChevronDown, ChevronUp, Search } from 'lucide-react';
import DataTable from '../common/DataTable';

const ExaminationHistory = () => {
  const { selectedFaskes } = useAuth();
  const [examinations, setExaminations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all'); // all, today, week, month
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    loadExaminations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFaskes, dateFilter]);

  const loadExaminations = async () => {
    try {
      setLoading(true);
      let examQuery = query(
        collection(db, 'daily_examinations'),
        where('faskesId', '==', selectedFaskes || 'default'),
        orderBy('tanggalPemeriksaan', 'desc')
      );

      const snapshot = await getDocs(examQuery);
      let data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Apply date filter
      const now = new Date();
      const today = format(now, 'yyyy-MM-dd');
      
      if (dateFilter === 'today') {
        data = data.filter(e => e.tanggalPemeriksaan === today);
      } else if (dateFilter === 'week') {
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        const weekAgoStr = format(weekAgo, 'yyyy-MM-dd');
        data = data.filter(e => e.tanggalPemeriksaan >= weekAgoStr);
      } else if (dateFilter === 'month') {
        const monthAgo = new Date(now);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        const monthAgoStr = format(monthAgo, 'yyyy-MM-dd');
        data = data.filter(e => e.tanggalPemeriksaan >= monthAgoStr);
      }

      setExaminations(data);
    } catch (error) {
      console.error('Error loading examinations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredExaminations = examinations.filter(exam =>
    exam.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.keluhan?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      key: 'tanggalPemeriksaan',
      label: 'Tanggal & Waktu',
      render: (row) => (
        <div>
          <div className="font-medium">
            {format(new Date(row.tanggalPemeriksaan), 'dd MMM yyyy', { locale: localeID })}
          </div>
          <div className="text-sm text-gray-500">
            {row.waktuPemeriksaan || '-'}
          </div>
        </div>
      )
    },
    {
      key: 'patientName',
      label: 'Nama Pasien',
      render: (row) => (
        <div>
          <div className="font-medium">{row.patientName}</div>
          <div className="text-sm text-gray-500">{row.poli}</div>
        </div>
      )
    },
    {
      key: 'keluhan',
      label: 'Keluhan',
      render: (row) => (
        <div className="max-w-xs truncate" title={row.keluhan}>
          {row.keluhan}
        </div>
      )
    },
    {
      key: 'diagnosis',
      label: 'Diagnosis',
      render: (row) => (
        <div>
          <div className="font-medium">{row.diagnosis}</div>
          {row.diagnosisKode && (
            <div className="text-sm text-gray-500">{row.diagnosisKode}</div>
          )}
        </div>
      )
    },
    {
      key: 'dokter',
      label: 'Dokter',
      render: (row) => row.dokter || '-'
    },
    {
      key: 'actions',
      label: 'Aksi',
      actions: true,
      className: 'text-center'
    }
  ];

  const handleView = (exam) => {
    setExpandedId(expandedId === exam.id ? null : exam.id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Search className="w-4 h-4 inline mr-2" />
              Cari Pasien/Diagnosis
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nama pasien, diagnosis, atau keluhan..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Filter Periode
            </label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Semua Waktu</option>
              <option value="today">Hari Ini</option>
              <option value="week">7 Hari Terakhir</option>
              <option value="month">30 Hari Terakhir</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="text-sm text-blue-600 font-medium">Total Pemeriksaan</div>
          <div className="text-2xl font-bold text-blue-900">{filteredExaminations.length}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="text-sm text-green-600 font-medium">Rujukan</div>
          <div className="text-2xl font-bold text-green-900">
            {filteredExaminations.filter(e => e.rujukan?.isRujukan).length}
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="text-sm text-purple-600 font-medium">Tindakan Medis</div>
          <div className="text-2xl font-bold text-purple-900">
            {filteredExaminations.reduce((acc, e) => acc + (e.tindakanMedis?.length || 0), 0)}
          </div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="text-sm text-yellow-600 font-medium">Resep Obat</div>
          <div className="text-2xl font-bold text-yellow-900">
            {filteredExaminations.reduce((acc, e) => acc + (e.resepObat?.length || 0), 0)}
          </div>
        </div>
      </div>

      {/* Table with expandable rows */}
      <div className="space-y-3">
        {filteredExaminations.map((exam) => (
          <div key={exam.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div
              className="p-4 hover:bg-gray-50 cursor-pointer"
              onClick={() => handleView(exam)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Tanggal</div>
                    <div className="font-medium">
                      {format(new Date(exam.tanggalPemeriksaan), 'dd MMM yyyy', { locale: localeID })}
                    </div>
                    <div className="text-sm text-gray-500">{exam.waktuPemeriksaan}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Pasien</div>
                    <div className="font-medium">{exam.patientName}</div>
                    <div className="text-sm text-gray-500">{exam.poli}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Keluhan</div>
                    <div className="font-medium truncate" title={exam.keluhan}>
                      {exam.keluhan}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Diagnosis</div>
                    <div className="font-medium">{exam.diagnosis}</div>
                    {exam.diagnosisKode && (
                      <div className="text-sm text-gray-500">{exam.diagnosisKode}</div>
                    )}
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Dokter</div>
                    <div className="font-medium">{exam.dokter || '-'}</div>
                  </div>
                </div>
                <div>
                  {expandedId === exam.id ? (
                    <ChevronUp className="w-6 h-6 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-gray-400" />
                  )}
                </div>
              </div>
            </div>

            {expandedId === exam.id && (
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    {/* Riwayat Penyakit */}
                    {exam.riwayatPenyakit && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <span>Riwayat Penyakit</span>
                        </h4>
                        <p className="text-gray-700 text-sm">{exam.riwayatPenyakit}</p>
                      </div>
                    )}

                    {/* Vital Signs */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                        <Activity className="w-4 h-4 text-red-600" />
                        <span>Pemeriksaan Fisik & Vital Signs</span>
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {exam.pemeriksaanFisik?.tekananDarah && (
                          <div>
                            <span className="text-gray-600">Tekanan Darah:</span>
                            <span className="ml-2 font-medium">{exam.pemeriksaanFisik.tekananDarah}</span>
                          </div>
                        )}
                        {exam.pemeriksaanFisik?.nadi && (
                          <div>
                            <span className="text-gray-600">Nadi:</span>
                            <span className="ml-2 font-medium">{exam.pemeriksaanFisik.nadi} x/mnt</span>
                          </div>
                        )}
                        {exam.pemeriksaanFisik?.suhu && (
                          <div>
                            <span className="text-gray-600">Suhu:</span>
                            <span className="ml-2 font-medium">{exam.pemeriksaanFisik.suhu}°C</span>
                          </div>
                        )}
                        {exam.pemeriksaanFisik?.respirasi && (
                          <div>
                            <span className="text-gray-600">Respirasi:</span>
                            <span className="ml-2 font-medium">{exam.pemeriksaanFisik.respirasi} x/mnt</span>
                          </div>
                        )}
                        {exam.pemeriksaanFisik?.beratBadan && (
                          <div>
                            <span className="text-gray-600">BB:</span>
                            <span className="ml-2 font-medium">{exam.pemeriksaanFisik.beratBadan} kg</span>
                          </div>
                        )}
                        {exam.pemeriksaanFisik?.tinggiBadan && (
                          <div>
                            <span className="text-gray-600">TB:</span>
                            <span className="ml-2 font-medium">{exam.pemeriksaanFisik.tinggiBadan} cm</span>
                          </div>
                        )}
                      </div>
                      {exam.pemeriksaanFisik?.pemeriksaanLain && (
                        <p className="text-gray-700 text-sm mt-2">{exam.pemeriksaanFisik.pemeriksaanLain}</p>
                      )}
                    </div>

                    {/* Tindakan Medis */}
                    {exam.tindakanMedis && exam.tindakanMedis.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                          <Activity className="w-4 h-4 text-purple-600" />
                          <span>Tindakan Medis</span>
                        </h4>
                        <ul className="space-y-1">
                          {exam.tindakanMedis.map((tindakan, idx) => (
                            <li key={idx} className="text-sm text-gray-700">
                              • {tindakan.nama}
                              {tindakan.keterangan && ` - ${tindakan.keterangan}`}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    {/* Resep Obat */}
                    {exam.resepObat && exam.resepObat.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                          <Pill className="w-4 h-4 text-yellow-600" />
                          <span>Resep Obat</span>
                        </h4>
                        <div className="space-y-2">
                          {exam.resepObat.map((obat, idx) => (
                            <div key={idx} className="bg-white p-2 rounded border border-gray-200 text-sm">
                              <div className="font-medium">{obat.nama} - {obat.dosis}</div>
                              <div className="text-gray-600">
                                Jumlah: {obat.jumlah} • {obat.aturanPakai}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Rujukan */}
                    {exam.rujukan?.isRujukan && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                          <ExternalLink className="w-4 h-4 text-orange-600" />
                          <span>Rujukan</span>
                        </h4>
                        <div className="bg-orange-50 p-3 rounded border border-orange-200 text-sm space-y-1">
                          <div>
                            <span className="text-gray-600">Tujuan:</span>
                            <span className="ml-2 font-medium">{exam.rujukan.tujuan}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Alasan:</span>
                            <span className="ml-2">{exam.rujukan.alasan}</span>
                          </div>
                          {exam.rujukan.diagnosa && (
                            <div>
                              <span className="text-gray-600">Diagnosa:</span>
                              <span className="ml-2">{exam.rujukan.diagnosa}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Catatan Tambahan */}
                    {exam.catatanTambahan && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Catatan Tambahan</h4>
                        <p className="text-sm text-gray-700">{exam.catatanTambahan}</p>
                      </div>
                    )}

                    {/* Petugas */}
                    <div className="bg-gray-100 p-3 rounded text-sm">
                      <div className="flex items-center space-x-2 text-gray-600 mb-1">
                        <User className="w-4 h-4" />
                        <span className="font-medium">Petugas yang Memeriksa:</span>
                      </div>
                      <div className="ml-6">
                        <div>Dokter: <span className="font-medium">{exam.dokter || '-'}</span></div>
                        <div>Pencatat: <span className="font-medium">{exam.petugas}</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredExaminations.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Tidak ada riwayat pemeriksaan</p>
            <p className="text-sm text-gray-500 mt-2">
              {searchTerm ? 'Coba ubah kata kunci pencarian' : 'Belum ada pemeriksaan yang tercatat'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExaminationHistory;
