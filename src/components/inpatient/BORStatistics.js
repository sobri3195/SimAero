import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Bed, Users, Clock } from 'lucide-react';

const BORStatistics = ({ beds, inpatients, dischargedPatients }) => {
  const totalBeds = beds.length;
  const occupiedBeds = beds.filter(b => b.status === 'terisi').length;
  const availableBeds = beds.filter(b => b.status === 'kosong').length;
  const cleaningBeds = beds.filter(b => b.status === 'dibersihkan').length;
  const maintenanceBeds = beds.filter(b => b.status === 'maintenance').length;

  const bor = totalBeds > 0 ? ((occupiedBeds / totalBeds) * 100).toFixed(1) : 0;

  const calculateAverageLOS = () => {
    if (dischargedPatients.length === 0) return 0;
    
    const totalDays = dischargedPatients.reduce((sum, patient) => {
      if (patient.admitDate && patient.dischargeDate) {
        const admit = new Date(patient.admitDate);
        const discharge = new Date(patient.dischargeDate);
        const days = (discharge - admit) / (1000 * 60 * 60 * 24);
        return sum + days;
      }
      return sum;
    }, 0);

    return (totalDays / dischargedPatients.length).toFixed(1);
  };

  const bedsByRoomType = beds.reduce((acc, bed) => {
    const type = bed.roomType || 'Unknown';
    if (!acc[type]) {
      acc[type] = { total: 0, occupied: 0, available: 0 };
    }
    acc[type].total++;
    if (bed.status === 'terisi') acc[type].occupied++;
    if (bed.status === 'kosong') acc[type].available++;
    return acc;
  }, {});

  const roomTypeData = Object.entries(bedsByRoomType).map(([type, data]) => ({
    name: type,
    Terisi: data.occupied,
    Tersedia: data.available,
    BOR: ((data.occupied / data.total) * 100).toFixed(1)
  }));

  const statusData = [
    { name: 'Terisi', value: occupiedBeds, color: '#ef4444' },
    { name: 'Tersedia', value: availableBeds, color: '#22c55e' },
    { name: 'Dibersihkan', value: cleaningBeds, color: '#3b82f6' },
    { name: 'Maintenance', value: maintenanceBeds, color: '#eab308' }
  ].filter(item => item.value > 0);

  const averageLOS = calculateAverageLOS();

  const getBORStatus = (bor) => {
    if (bor >= 85) return { text: 'Optimal', color: 'text-green-600' };
    if (bor >= 70) return { text: 'Baik', color: 'text-blue-600' };
    if (bor >= 50) return { text: 'Rendah', color: 'text-yellow-600' };
    return { text: 'Sangat Rendah', color: 'text-red-600' };
  };

  const borStatus = getBORStatus(bor);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-4 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm opacity-90">BOR (Bed Occupancy Rate)</div>
            <TrendingUp size={20} />
          </div>
          <div className="text-3xl font-bold mb-1">{bor}%</div>
          <div className={`text-sm ${borStatus.color.replace('text-', 'text-white opacity-')}`}>
            Status: {borStatus.text}
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-4 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm opacity-90">Total Tempat Tidur</div>
            <Bed size={20} />
          </div>
          <div className="text-3xl font-bold mb-1">{totalBeds}</div>
          <div className="text-sm opacity-90">
            Terisi: {occupiedBeds} | Tersedia: {availableBeds}
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-4 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm opacity-90">Pasien Aktif</div>
            <Users size={20} />
          </div>
          <div className="text-3xl font-bold mb-1">{inpatients.length}</div>
          <div className="text-sm opacity-90">
            Rawat Inap Saat Ini
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg p-4 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm opacity-90">Rata-rata LOS</div>
            <Clock size={20} />
          </div>
          <div className="text-3xl font-bold mb-1">{averageLOS}</div>
          <div className="text-sm opacity-90">
            Hari (Length of Stay)
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-4 shadow border">
          <h3 className="font-semibold text-lg mb-4">BOR per Jenis Ruangan</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={roomTypeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Terisi" fill="#ef4444" />
              <Bar dataKey="Tersedia" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg p-4 shadow border">
          <h3 className="font-semibold text-lg mb-4">Distribusi Status Tempat Tidur</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 shadow border">
        <h3 className="font-semibold text-lg mb-4">Detail BOR per Ruangan</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Jenis Ruangan</th>
                <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Total TT</th>
                <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Terisi</th>
                <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Tersedia</th>
                <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">BOR (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {roomTypeData.map((room, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm">{room.name}</td>
                  <td className="px-4 py-2 text-sm text-center">{room.Terisi + room.Tersedia}</td>
                  <td className="px-4 py-2 text-sm text-center">
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                      {room.Terisi}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm text-center">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      {room.Tersedia}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${Math.min(room.BOR, 100)}%` }}
                        ></div>
                      </div>
                      <span className="font-semibold">{room.BOR}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BORStatistics;
