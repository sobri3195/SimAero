import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from '../../mockDb';
import { db } from '../../mockDb';
import { useAuth } from '../../contexts/AuthContext';
import { AlertTriangle, Package, Calendar, TrendingDown } from 'lucide-react';
import DataTable from '../common/DataTable';

const ExpiryAlert = () => {
  const { selectedFaskes } = useAuth();
  const [drugs, setDrugs] = useState([]);
  const [expiredDrugs, setExpiredDrugs] = useState([]);
  const [expiringDrugs, setExpiringDrugs] = useState([]);
  const [filterType, setFilterType] = useState('all');

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
      categorizeDrugs(drugList);
    } catch (error) {
      console.error('Error loading drugs:', error);
    }
  };

  const categorizeDrugs = (drugList) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const threeMonthsFromNow = new Date(today);
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
    
    const sixMonthsFromNow = new Date(today);
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);

    const expired = [];
    const expiring = [];

    drugList.forEach(drug => {
      if (drug.expiryDate) {
        const expiryDate = new Date(drug.expiryDate);
        expiryDate.setHours(0, 0, 0, 0);

        const daysUntilExpiry = Math.floor((expiryDate - today) / (1000 * 60 * 60 * 24));
        const monthsUntilExpiry = daysUntilExpiry / 30;

        const drugWithExpiry = {
          ...drug,
          expiryDate: drug.expiryDate,
          daysUntilExpiry,
          monthsUntilExpiry
        };

        if (expiryDate < today) {
          expired.push({ ...drugWithExpiry, status: 'expired' });
        } else if (expiryDate <= threeMonthsFromNow) {
          expiring.push({ ...drugWithExpiry, status: 'critical', urgency: 'Kritis (< 3 bulan)' });
        } else if (expiryDate <= sixMonthsFromNow) {
          expiring.push({ ...drugWithExpiry, status: 'warning', urgency: 'Perhatian (3-6 bulan)' });
        }
      }
    });

    setExpiredDrugs(expired);
    setExpiringDrugs(expiring);
  };

  const getExpiryBadge = (status) => {
    const badges = {
      expired: { color: 'bg-red-100 text-red-800 border-red-300', label: 'Kadaluwarsa' },
      critical: { color: 'bg-orange-100 text-orange-800 border-orange-300', label: 'Kritis' },
      warning: { color: 'bg-yellow-100 text-yellow-800 border-yellow-300', label: 'Perhatian' }
    };
    const badge = badges[status] || badges.warning;
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${badge.color}`}>
        <AlertTriangle size={12} />
        {badge.label}
      </span>
    );
  };

  const columns = [
    { 
      key: 'name', 
      label: 'Nama Obat',
      render: (row) => (
        <div>
          <p className="font-medium">{row.name}</p>
          {row.genericName && <p className="text-xs text-gray-500">{row.genericName}</p>}
        </div>
      )
    },
    { 
      key: 'category', 
      label: 'Kategori',
      render: (row) => (
        <span className="text-sm text-gray-600">{row.category}</span>
      )
    },
    { 
      key: 'batchNumber', 
      label: 'Nomor Batch',
      render: (row) => row.batchNumber || '-'
    },
    { 
      key: 'stock', 
      label: 'Stok',
      render: (row) => (
        <span className="font-medium">
          {row.stock} {row.unit}
        </span>
      )
    },
    { 
      key: 'expiryDate', 
      label: 'Tanggal Kadaluwarsa',
      render: (row) => {
        if (!row.expiryDate) return '-';
        return (
          <div>
            <p className="font-medium">
              {new Date(row.expiryDate).toLocaleDateString('id-ID')}
            </p>
            <p className="text-xs text-gray-500">
              {row.daysUntilExpiry > 0 
                ? `${row.daysUntilExpiry} hari lagi`
                : `${Math.abs(row.daysUntilExpiry)} hari yang lalu`
              }
            </p>
          </div>
        );
      }
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (row) => getExpiryBadge(row.status)
    },
    {
      key: 'supplier',
      label: 'Supplier',
      render: (row) => row.supplier || '-'
    }
  ];

  const getFilteredData = () => {
    if (filterType === 'expired') {
      return expiredDrugs;
    } else if (filterType === 'expiring') {
      return expiringDrugs;
    } else {
      return [...expiredDrugs, ...expiringDrugs];
    }
  };

  const filteredData = getFilteredData();

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Peringatan</p>
              <p className="text-2xl font-bold text-gray-800">
                {expiredDrugs.length + expiringDrugs.length}
              </p>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg">
              <AlertTriangle className="text-gray-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Sudah Kadaluwarsa</p>
              <p className="text-2xl font-bold text-red-600">{expiredDrugs.length}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <Package className="text-red-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Kritis (&lt; 3 bulan)</p>
              <p className="text-2xl font-bold text-orange-600">
                {expiringDrugs.filter(d => d.status === 'critical').length}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Calendar className="text-orange-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Perhatian (3-6 bulan)</p>
              <p className="text-2xl font-bold text-yellow-600">
                {expiringDrugs.filter(d => d.status === 'warning').length}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <TrendingDown className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Alert Banner */}
      {expiredDrugs.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-red-600" size={24} />
            <div>
              <p className="font-semibold text-red-800">Peringatan Kadaluwarsa!</p>
              <p className="text-sm text-red-700">
                Terdapat {expiredDrugs.length} obat yang sudah kadaluwarsa. 
                Segera lakukan pengecekan dan penarikan dari peredaran.
              </p>
            </div>
          </div>
        </div>
      )}

      {expiringDrugs.filter(d => d.status === 'critical').length > 0 && (
        <div className="bg-orange-50 border-l-4 border-orange-500 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-orange-600" size={24} />
            <div>
              <p className="font-semibold text-orange-800">Peringatan Kritis!</p>
              <p className="text-sm text-orange-700">
                Terdapat {expiringDrugs.filter(d => d.status === 'critical').length} obat yang akan kadaluwarsa dalam 3 bulan. 
                Pertimbangkan untuk mengurangi pembelian atau promosi khusus.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterType === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Semua ({expiredDrugs.length + expiringDrugs.length})
          </button>
          <button
            onClick={() => setFilterType('expired')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterType === 'expired'
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Kadaluwarsa ({expiredDrugs.length})
          </button>
          <button
            onClick={() => setFilterType('expiring')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterType === 'expiring'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Akan Kadaluwarsa ({expiringDrugs.length})
          </button>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredData}
        title="Daftar Obat dengan Peringatan Kedaluwarsa"
        searchable={true}
        exportable={true}
        pagination={true}
        itemsPerPage={10}
      />

      {filteredData.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <Package size={48} className="mx-auto mb-3 text-gray-400" />
          <p className="text-lg font-medium text-gray-700">Tidak ada peringatan kedaluwarsa</p>
          <p className="text-sm text-gray-500 mt-1">
            Semua obat dalam kondisi baik dan tidak ada yang mendekati tanggal kadaluwarsa
          </p>
        </div>
      )}
    </div>
  );
};

export default ExpiryAlert;
