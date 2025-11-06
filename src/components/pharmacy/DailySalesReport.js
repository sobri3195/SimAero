import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from '../../mockDb';
import { db } from '../../mockDb';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign, ShoppingBag, Package, Download, Calendar } from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const DailySalesReport = () => {
  const { selectedFaskes } = useAuth();
  const { addNotification } = useApp();
  
  const [transactions, setTransactions] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState({
    totalTransactions: 0,
    totalRevenue: 0,
    totalItems: 0,
    avgTransaction: 0
  });
  const [drugSales, setDrugSales] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);

  useEffect(() => {
    loadReport();
  }, [selectedFaskes, selectedDate]);

  const loadReport = async () => {
    if (!selectedFaskes) return;

    setLoading(true);
    try {
      const startDate = new Date(selectedDate);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(selectedDate);
      endDate.setHours(23, 59, 59, 999);

      const q = query(
        collection(db, 'pharmacy_transactions'),
        where('faskesId', '==', selectedFaskes)
      );

      const snapshot = await getDocs(q);
      const data = [];
      snapshot.forEach((doc) => {
        const txData = { id: doc.id, ...doc.data() };
        const txDate = new Date(txData.transactionDate);
        if (txDate >= startDate && txDate <= endDate) {
          data.push(txData);
        }
      });

      setTransactions(data);
      calculateSummary(data);
      analyzeDrugSales(data);
      analyzePaymentMethods(data);
    } catch (error) {
      console.error('Error loading report:', error);
      addNotification({ type: 'error', message: 'Gagal memuat laporan' });
    } finally {
      setLoading(false);
    }
  };

  const calculateSummary = (data) => {
    const totalTransactions = data.length;
    const totalRevenue = data.reduce((sum, tx) => sum + tx.totalAmount, 0);
    const totalItems = data.reduce((sum, tx) => {
      return sum + (tx.items ? tx.items.reduce((itemSum, item) => itemSum + parseInt(item.quantity), 0) : 0);
    }, 0);
    const avgTransaction = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

    setSummary({
      totalTransactions,
      totalRevenue,
      totalItems,
      avgTransaction
    });
  };

  const analyzeDrugSales = (data) => {
    const drugMap = {};
    
    data.forEach(tx => {
      if (tx.items) {
        tx.items.forEach(item => {
          if (!drugMap[item.drugName]) {
            drugMap[item.drugName] = {
              name: item.drugName,
              quantity: 0,
              revenue: 0
            };
          }
          drugMap[item.drugName].quantity += parseInt(item.quantity);
          drugMap[item.drugName].revenue += parseInt(item.price) * parseInt(item.quantity);
        });
      }
    });

    const sorted = Object.values(drugMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
    
    setDrugSales(sorted);
  };

  const analyzePaymentMethods = (data) => {
    const methodMap = {};
    
    data.forEach(tx => {
      const method = tx.paymentMethod || 'tunai';
      if (!methodMap[method]) {
        methodMap[method] = { method, count: 0, value: 0 };
      }
      methodMap[method].count += 1;
      methodMap[method].value += tx.totalAmount;
    });

    setPaymentMethods(Object.values(methodMap));
  };

  const exportToExcel = () => {
    const data = transactions.map((tx, idx) => ({
      'No': idx + 1,
      'Waktu': new Date(tx.transactionDate).toLocaleString('id-ID'),
      'Pasien': tx.patientName,
      'No. RM': tx.patientId || '-',
      'Dokter': 'Dr. ' + tx.doctorName,
      'Obat': tx.items ? tx.items.map(i => i.drugName).join(', ') : '-',
      'Total': tx.totalAmount,
      'Dibayar': tx.amountPaid,
      'Kembalian': tx.change,
      'Metode': tx.paymentMethod,
      'Kasir': tx.cashierName
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Laporan Harian');
    
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, `Laporan_Farmasi_${selectedDate}.xlsx`);
    
    addNotification({ type: 'success', message: 'Laporan berhasil diexport' });
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Memuat laporan...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Date Filter */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="text-gray-600" size={20} />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={exportToExcel}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2 font-medium"
          >
            <Download size={18} />
            Export Excel
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Transaksi</p>
              <p className="text-2xl font-bold text-gray-800">{summary.totalTransactions}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <ShoppingBag className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Pendapatan</p>
              <p className="text-2xl font-bold text-green-600">
                Rp {summary.totalRevenue.toLocaleString('id-ID')}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Item Terjual</p>
              <p className="text-2xl font-bold text-purple-600">{summary.totalItems}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Package className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rata-rata Transaksi</p>
              <p className="text-2xl font-bold text-orange-600">
                Rp {Math.floor(summary.avgTransaction).toLocaleString('id-ID')}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <TrendingUp className="text-orange-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Drugs */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Top 10 Obat Terlaris</h3>
          {drugSales.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={drugSales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} fontSize={12} />
                <YAxis />
                <Tooltip 
                  formatter={(value) => `Rp ${value.toLocaleString('id-ID')}`}
                  labelStyle={{ color: '#000' }}
                />
                <Legend />
                <Bar dataKey="revenue" fill="#3B82F6" name="Pendapatan" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>Belum ada data penjualan</p>
            </div>
          )}
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Metode Pembayaran</h3>
          {paymentMethods.length > 0 ? (
            <div className="flex flex-col lg:flex-row items-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={paymentMethods}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ method, percent }) => `${method} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {paymentMethods.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 lg:mt-0 lg:ml-4 space-y-2">
                {paymentMethods.map((method, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded" 
                      style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                    />
                    <div className="text-sm">
                      <p className="font-medium capitalize">{method.method}</p>
                      <p className="text-gray-600">{method.count} transaksi</p>
                      <p className="text-xs text-gray-500">Rp {method.value.toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>Belum ada data pembayaran</p>
            </div>
          )}
        </div>
      </div>

      {/* Transaction Details Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-lg">Detail Transaksi</h3>
          <p className="text-sm text-gray-600">
            {new Date(selectedDate).toLocaleDateString('id-ID', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Waktu</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Pasien</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Obat</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 uppercase">Total</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Metode</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {transactions.map((tx, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(tx.transactionDate).toLocaleTimeString('id-ID', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-800">{tx.patientName}</p>
                    <p className="text-xs text-gray-500">{tx.patientId || '-'}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-600">
                      {tx.items && tx.items.slice(0, 2).map((item, itemIdx) => (
                        <div key={itemIdx}>• {item.drugName}</div>
                      ))}
                      {tx.items && tx.items.length > 2 && (
                        <div className="text-xs text-blue-600">+{tx.items.length - 2} lainnya</div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <p className="text-sm font-semibold text-gray-800">
                      Rp {tx.totalAmount.toLocaleString('id-ID')}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 capitalize">
                      {tx.paymentMethod}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {transactions.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p>Tidak ada transaksi pada tanggal ini</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailySalesReport;
