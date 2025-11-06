import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, orderBy } from '../../mockDb';
import { db } from '../../mockDb';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { Package, TrendingDown, TrendingUp, FileText, Download } from 'lucide-react';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';

const DrugLogistics = () => {
  const { selectedFaskes } = useAuth();
  const { addNotification } = useApp();
  const [activeTab, setActiveTab] = useState('receiving');
  const [transactions, setTransactions] = useState([]);
  const [drugs, setDrugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'receiving',
    drugId: '',
    drugName: '',
    quantity: '',
    unit: 'tablet',
    batchNumber: '',
    expiryDate: '',
    supplier: '',
    notes: '',
    transactionDate: format(new Date(), 'yyyy-MM-dd')
  });
  
  const [filterPeriod, setFilterPeriod] = useState('today');
  const [dateRange, setDateRange] = useState({
    start: format(new Date(), 'yyyy-MM-dd'),
    end: format(new Date(), 'yyyy-MM-dd')
  });

  useEffect(() => {
    loadData();
  }, [selectedFaskes]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const drugsQuery = query(
        collection(db, 'drugs'),
        where('faskesId', '==', selectedFaskes || 'default')
      );
      const drugsSnapshot = await getDocs(drugsQuery);
      const drugsList = drugsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDrugs(drugsList);

      const transQuery = query(
        collection(db, 'drug_transactions'),
        where('faskesId', '==', selectedFaskes || 'default'),
        orderBy('transactionDate', 'desc')
      );
      const transSnapshot = await getDocs(transQuery);
      const transList = transSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTransactions(transList);
    } catch (error) {
      console.error('Error loading data:', error);
      addNotification({ type: 'error', message: 'Gagal memuat data logistik' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.drugName || !formData.quantity) {
      addNotification({ type: 'error', message: 'Nama obat dan jumlah wajib diisi' });
      return;
    }

    try {
      await addDoc(collection(db, 'drug_transactions'), {
        ...formData,
        quantity: parseInt(formData.quantity),
        faskesId: selectedFaskes || 'default',
        createdAt: new Date().toISOString(),
        createdBy: 'Admin'
      });

      addNotification({ 
        type: 'success', 
        message: formData.type === 'receiving' 
          ? 'Penerimaan obat berhasil dicatat' 
          : 'Pengeluaran obat berhasil dicatat' 
      });

      setShowForm(false);
      setFormData({
        type: 'receiving',
        drugId: '',
        drugName: '',
        quantity: '',
        unit: 'tablet',
        batchNumber: '',
        expiryDate: '',
        supplier: '',
        notes: '',
        transactionDate: format(new Date(), 'yyyy-MM-dd')
      });
      loadData();
    } catch (error) {
      console.error('Error saving transaction:', error);
      addNotification({ type: 'error', message: 'Gagal menyimpan transaksi' });
    }
  };

  const handleDrugSelect = (e) => {
    const drugId = e.target.value;
    const drug = drugs.find(d => d.id === drugId);
    if (drug) {
      setFormData({
        ...formData,
        drugId: drug.id,
        drugName: drug.name,
        unit: drug.unit || 'tablet'
      });
    }
  };

  const calculateUsageStats = () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentDispensingTransactions = transactions.filter(t => 
      t.type === 'dispensing' && 
      new Date(t.transactionDate) >= thirtyDaysAgo
    );

    const drugUsage = {};
    recentDispensingTransactions.forEach(t => {
      if (!drugUsage[t.drugName]) {
        drugUsage[t.drugName] = 0;
      }
      drugUsage[t.drugName] += t.quantity;
    });

    return Object.entries(drugUsage).map(([drugName, totalUsed]) => {
      const drug = drugs.find(d => d.name === drugName);
      const currentStock = drug ? parseInt(drug.stock) || 0 : 0;
      const avgMonthlyUsage = totalUsed;
      const monthsRemaining = avgMonthlyUsage > 0 ? currentStock / avgMonthlyUsage : 999;
      const percentageRemaining = avgMonthlyUsage > 0 ? (currentStock / avgMonthlyUsage) * 100 : 100;
      const isCritical = percentageRemaining < 20;

      return {
        drugName,
        currentStock,
        avgMonthlyUsage,
        monthsRemaining: monthsRemaining.toFixed(1),
        percentageRemaining: percentageRemaining.toFixed(0),
        isCritical,
        unit: drug?.unit || 'unit'
      };
    }).sort((a, b) => a.percentageRemaining - b.percentageRemaining);
  };

  const filterTransactions = () => {
    let filtered = transactions;

    if (filterPeriod === 'today') {
      const today = format(new Date(), 'yyyy-MM-dd');
      filtered = transactions.filter(t => t.transactionDate === today);
    } else if (filterPeriod === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      filtered = transactions.filter(t => new Date(t.transactionDate) >= weekAgo);
    } else if (filterPeriod === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      filtered = transactions.filter(t => new Date(t.transactionDate) >= monthAgo);
    } else if (filterPeriod === 'custom') {
      filtered = transactions.filter(t => 
        t.transactionDate >= dateRange.start && 
        t.transactionDate <= dateRange.end
      );
    }

    return filtered;
  };

  const exportToExcel = () => {
    const filtered = filterTransactions();
    const data = filtered.map(t => ({
      'Tanggal': new Date(t.transactionDate).toLocaleDateString('id-ID'),
      'Tipe': t.type === 'receiving' ? 'Penerimaan' : 'Pengeluaran',
      'Nama Obat': t.drugName,
      'Jumlah': `${t.quantity} ${t.unit}`,
      'Batch': t.batchNumber || '-',
      'Kadaluarsa': t.expiryDate || '-',
      'Supplier': t.supplier || '-',
      'Keterangan': t.notes || '-',
      'Dicatat Oleh': t.createdBy
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Transaksi Obat');
    XLSX.writeFile(wb, `Logistik_Obat_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
    
    addNotification({ type: 'success', message: 'Data berhasil diekspor ke Excel' });
  };

  const usageStats = calculateUsageStats();
  const filteredTransactions = filterTransactions();
  const receivingTrans = filteredTransactions.filter(t => t.type === 'receiving');
  const dispensingTrans = filteredTransactions.filter(t => t.type === 'dispensing');

  const totalReceived = receivingTrans.reduce((sum, t) => sum + t.quantity, 0);
  const totalDispensed = dispensingTrans.reduce((sum, t) => sum + t.quantity, 0);

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Memuat data logistik...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Transaksi</p>
              <p className="text-2xl font-bold text-blue-900">{filteredTransactions.length}</p>
            </div>
            <Package className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Total Penerimaan</p>
              <p className="text-2xl font-bold text-green-900">{totalReceived}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Total Pengeluaran</p>
              <p className="text-2xl font-bold text-orange-900">{totalDispensed}</p>
            </div>
            <TrendingDown className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium">Stok Kritis</p>
              <p className="text-2xl font-bold text-red-900">{usageStats.filter(s => s.isCritical).length}</p>
            </div>
            <FileText className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Critical Stock Alert */}
      {usageStats.filter(s => s.isCritical).length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Peringatan Stok Kritis</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>Terdapat {usageStats.filter(s => s.isCritical).length} obat dengan stok tersisa &lt; 20% dari kebutuhan bulanan rata-rata:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  {usageStats.filter(s => s.isCritical).slice(0, 5).map((stat, idx) => (
                    <li key={idx}>
                      <strong>{stat.drugName}</strong> - Tersisa {stat.currentStock} {stat.unit} ({stat.percentageRemaining}% dari kebutuhan bulanan)
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Actions */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterPeriod('today')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterPeriod === 'today' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Hari Ini
            </button>
            <button
              onClick={() => setFilterPeriod('week')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterPeriod === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              7 Hari Terakhir
            </button>
            <button
              onClick={() => setFilterPeriod('month')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterPeriod === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              30 Hari Terakhir
            </button>
            <button
              onClick={() => setFilterPeriod('custom')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterPeriod === 'custom' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Custom
            </button>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => {
                setFormData({ ...formData, type: 'receiving' });
                setShowForm(true);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              Terima Barang
            </button>
            <button
              onClick={() => {
                setFormData({ ...formData, type: 'dispensing' });
                setShowForm(true);
              }}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
            >
              <TrendingDown className="w-4 h-4" />
              Keluarkan Barang
            </button>
            <button
              onClick={exportToExcel}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Excel
            </button>
          </div>
        </div>

        {filterPeriod === 'custom' && (
          <div className="mt-4 flex gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Akhir</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('receiving')}
            className={`flex-1 px-6 py-3 font-medium transition-colors ${
              activeTab === 'receiving'
                ? 'border-b-2 border-green-500 text-green-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Penerimaan ({receivingTrans.length})
          </button>
          <button
            onClick={() => setActiveTab('dispensing')}
            className={`flex-1 px-6 py-3 font-medium transition-colors ${
              activeTab === 'dispensing'
                ? 'border-b-2 border-orange-500 text-orange-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Pengeluaran ({dispensingTrans.length})
          </button>
          <button
            onClick={() => setActiveTab('usage')}
            className={`flex-1 px-6 py-3 font-medium transition-colors ${
              activeTab === 'usage'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Analisis Penggunaan
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'receiving' && (
            <div className="space-y-2">
              {receivingTrans.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Tidak ada data penerimaan</p>
              ) : (
                receivingTrans.map((trans) => (
                  <div key={trans.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{trans.drugName}</h4>
                        <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                          <div>
                            <span className="text-gray-500">Jumlah:</span>
                            <span className="ml-2 font-medium text-green-600">+{trans.quantity} {trans.unit}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Batch:</span>
                            <span className="ml-2 font-medium">{trans.batchNumber || '-'}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Kadaluarsa:</span>
                            <span className="ml-2 font-medium">{trans.expiryDate || '-'}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Supplier:</span>
                            <span className="ml-2 font-medium">{trans.supplier || '-'}</span>
                          </div>
                        </div>
                        {trans.notes && (
                          <p className="mt-2 text-sm text-gray-600 italic">Catatan: {trans.notes}</p>
                        )}
                      </div>
                      <div className="text-right text-sm">
                        <div className="text-gray-900 font-medium">
                          {new Date(trans.transactionDate).toLocaleDateString('id-ID')}
                        </div>
                        <div className="text-gray-500 mt-1">
                          Oleh: {trans.createdBy}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'dispensing' && (
            <div className="space-y-2">
              {dispensingTrans.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Tidak ada data pengeluaran</p>
              ) : (
                dispensingTrans.map((trans) => (
                  <div key={trans.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{trans.drugName}</h4>
                        <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                          <div>
                            <span className="text-gray-500">Jumlah:</span>
                            <span className="ml-2 font-medium text-orange-600">-{trans.quantity} {trans.unit}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Batch:</span>
                            <span className="ml-2 font-medium">{trans.batchNumber || '-'}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Tujuan:</span>
                            <span className="ml-2 font-medium">{trans.supplier || 'Internal'}</span>
                          </div>
                        </div>
                        {trans.notes && (
                          <p className="mt-2 text-sm text-gray-600 italic">Catatan: {trans.notes}</p>
                        )}
                      </div>
                      <div className="text-right text-sm">
                        <div className="text-gray-900 font-medium">
                          {new Date(trans.transactionDate).toLocaleDateString('id-ID')}
                        </div>
                        <div className="text-gray-500 mt-1">
                          Oleh: {trans.createdBy}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'usage' && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">Analisis Penggunaan Obat (30 Hari Terakhir)</h3>
                <p className="text-sm text-blue-700">
                  Sistem menghitung rata-rata penggunaan bulanan berdasarkan data pengeluaran 30 hari terakhir.
                  Obat dengan stok tersisa &lt; 20% dari kebutuhan bulanan ditandai sebagai <strong>Stok Kritis</strong>.
                </p>
              </div>

              {usageStats.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Belum ada data penggunaan</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nama Obat
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Stok Saat Ini
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rata-rata Pemakaian/Bulan
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estimasi Bulan
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          % Tersisa
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {usageStats.map((stat, idx) => (
                        <tr key={idx} className={stat.isCritical ? 'bg-red-50' : ''}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{stat.drugName}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{stat.currentStock} {stat.unit}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{stat.avgMonthlyUsage} {stat.unit}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{stat.monthsRemaining} bulan</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    stat.isCritical ? 'bg-red-600' : 
                                    stat.percentageRemaining < 50 ? 'bg-yellow-600' : 
                                    'bg-green-600'
                                  }`}
                                  style={{ width: `${Math.min(stat.percentageRemaining, 100)}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium">{stat.percentageRemaining}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {stat.isCritical ? (
                              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                Stok Kritis
                              </span>
                            ) : stat.percentageRemaining < 50 ? (
                              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                Perhatian
                              </span>
                            ) : (
                              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                Aman
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Transaction Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {formData.type === 'receiving' ? 'Penerimaan Barang' : 'Pengeluaran Barang'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pilih Obat <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.drugId}
                      onChange={handleDrugSelect}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">-- Pilih Obat --</option>
                      {drugs.map(drug => (
                        <option key={drug.id} value={drug.id}>
                          {drug.name} (Stok: {drug.stock} {drug.unit})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jumlah <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Satuan
                    </label>
                    <input
                      type="text"
                      value={formData.unit}
                      readOnly
                      className="w-full px-3 py-2 border rounded-lg bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal Transaksi
                    </label>
                    <input
                      type="date"
                      value={formData.transactionDate}
                      onChange={(e) => setFormData({ ...formData, transactionDate: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nomor Batch
                    </label>
                    <input
                      type="text"
                      value={formData.batchNumber}
                      onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {formData.type === 'receiving' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tanggal Kadaluarsa
                        </label>
                        <input
                          type="date"
                          value={formData.expiryDate}
                          onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Supplier
                        </label>
                        <input
                          type="text"
                          value={formData.supplier}
                          onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </>
                  )}

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Catatan
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tambahkan catatan jika diperlukan..."
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className={`px-4 py-2 rounded-lg text-white transition-colors ${
                      formData.type === 'receiving'
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-orange-600 hover:bg-orange-700'
                    }`}
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DrugLogistics;
