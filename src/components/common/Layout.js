import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { 
  Menu, X, Home, Users, ClipboardList, FileText, Activity, 
  BedDouble, Calendar, Droplet, Heart, Pill, TestTube, 
  UserCheck, Package, AlertTriangle, BarChart3, Settings,
  Radio, MessageSquare, ChevronDown 
} from 'lucide-react';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { userRole, setUserRole, selectedFaskes } = useAuth();
  const { theme } = useApp();
  const navigate = useNavigate();

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Users, label: 'Database Pasien', path: '/patients' },
    { icon: ClipboardList, label: 'Pendaftaran & Antrean', path: '/registration' },
    { icon: FileText, label: 'Rekam Medis (EHR)', path: '/ehr' },
    { icon: Activity, label: 'IGD', path: '/igd' },
    { icon: BedDouble, label: 'Rawat Inap', path: '/inpatient' },
    { icon: Calendar, label: 'Jadwal Operasi', path: '/surgery' },
    { icon: Activity, label: 'CSSD', path: '/cssd' },
    { icon: Droplet, label: 'Bank Darah', path: '/bloodbank' },
    { icon: Heart, label: 'Rikkes', path: '/rikkes' },
    { icon: Pill, label: 'Farmasi', path: '/pharmacy' },
    { icon: TestTube, label: 'Laboratorium', path: '/lab' },
    { icon: Radio, label: 'Radiologi', path: '/radiology' },
    { icon: UserCheck, label: 'SDM & Jadwal', path: '/hr' },
    { icon: Package, label: 'Aset & Kalibrasi', path: '/assets' },
    { icon: Package, label: 'Logistik', path: '/logistics' },
    { icon: AlertTriangle, label: 'Laporan Insiden', path: '/incidents' },
    { icon: BarChart3, label: 'Laporan & Analitik', path: '/reports' },
    { icon: Radio, label: 'Bridging', path: '/bridging' },
    { icon: MessageSquare, label: 'Broadcast', path: '/broadcast' },
    { icon: Settings, label: 'Pengaturan', path: '/settings' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside 
        className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300 overflow-y-auto`}
        style={{ borderRight: `3px solid ${theme.primaryColor}` }}
      >
        <div className="p-4 flex items-center justify-between" style={{ backgroundColor: theme.primaryColor }}>
          <div className={`${sidebarOpen ? 'block' : 'hidden'}`}>
            <h1 className="text-white font-bold text-xl">Puskesau</h1>
            <p className="text-white text-xs opacity-90">Komando Kesehatan</p>
          </div>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Role Switcher */}
        <div className="p-4 border-b">
          <select 
            value={userRole}
            onChange={(e) => setUserRole(e.target.value)}
            className="w-full p-2 border rounded text-sm"
          >
            <option value="PUSAT">🏛️ Pusat (Puskesau)</option>
            <option value="FASKES">🏥 Faskes (RSAU/Klinik)</option>
          </select>
        </div>

        <nav className="p-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors text-left mb-1`}
              title={!sidebarOpen ? item.label : ''}
            >
              <item.icon size={20} style={{ color: theme.primaryColor }} />
              {sidebarOpen && <span className="text-sm">{item.label}</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between p-4">
            <div>
              <h2 className="text-xl font-bold" style={{ color: theme.primaryColor }}>
                {userRole === 'PUSAT' ? 'Dashboard Komando Pusat' : `Faskes: ${selectedFaskes || 'Pilih Faskes'}`}
              </h2>
              <p className="text-sm text-gray-600">TNI Angkatan Udara</p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                <Activity size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Menu */}
              <div className="relative">
                <button 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg"
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                    A
                  </div>
                  <ChevronDown size={16} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border">
                    <div className="p-2">
                      <button className="w-full text-left p-2 hover:bg-gray-100 rounded">
                        Profil
                      </button>
                      <button className="w-full text-left p-2 hover:bg-gray-100 rounded text-red-600">
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
