import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { 
  Menu, X, Home, Users, ClipboardList, FileText, Activity, 
  BedDouble, Calendar, Droplet, Heart, Pill, TestTube, 
  UserCheck, Package, AlertTriangle, BarChart3, Settings,
  Radio, MessageSquare, ChevronDown, Shield, Stethoscope, DollarSign 
} from 'lucide-react';
import { collection, getDocs, query, where } from '../../mockDb';
import { db } from '../../mockDb';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [facilityDropdownOpen, setFacilityDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);
  const [availableFacilities, setAvailableFacilities] = useState([]);
  const { 
    branch, 
    switchBranch,
    userRole, 
    selectedFaskes, 
    switchToRSAU, 
    switchToFKTP,
    switchToRSAD,
    switchToKlinikAD,
    switchToRSAL,
    switchToKlinikAL,
    switchToPuskes,
    facilityType, 
    rikkesRole, 
    setRikkesRole 
  } = useAuth();
  const { theme } = useApp();
  const navigate = useNavigate();

  const puskesauMenuItems = [
    { icon: Home, label: 'Dashboard Pengawasan', path: '/' },
    { icon: BarChart3, label: 'Laporan Konsolidasi', path: '/reports' },
    { icon: Settings, label: 'Pengaturan', path: '/settings' },
  ];

  const rsauMenuItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Users, label: 'Database Pasien', path: '/patients' },
    { icon: ClipboardList, label: 'Pendaftaran', path: '/registration' },
    { icon: Activity, label: 'Sistem Antrean', path: '/queue-system' },
    { icon: Stethoscope, label: 'Rawat Jalan', path: '/outpatient' },
    { icon: Activity, label: 'IGD', path: '/igd' },
    { icon: BedDouble, label: 'Rawat Inap', path: '/inpatient' },
    { icon: TestTube, label: 'Laboratorium', path: '/lab' },
    { icon: Radio, label: 'Radiologi', path: '/radiology' },
    { icon: Calendar, label: 'Bedah Sentral', path: '/surgery' },
    { icon: Pill, label: 'Apotek', path: '/pharmacy' },
    { icon: Package, label: 'Gudang Farmasi', path: '/pharmacy-warehouse' },
    { icon: Activity, label: 'CSSD', path: '/cssd' },
    { icon: Droplet, label: 'Bank Darah', path: '/bloodbank' },
    { icon: Heart, label: 'Rikkes', path: '/rikkes' },
    { icon: BarChart3, label: '└ Analitik Rikkes', path: '/rikkes/analytics', indent: true },
    { icon: FileText, label: 'Rekam Medis', path: '/medical-records' },
    { icon: DollarSign, label: 'Kasir', path: '/cashier' },
    { icon: Package, label: 'Inventory', path: '/inventory' },
    { icon: Settings, label: 'Sistem Administrasi', path: '/admin-system' },
    { icon: Shield, label: 'Asuransi Penjamin', path: '/insurance' },
    { icon: Package, label: 'Gudang Umum', path: '/general-warehouse' },
    { icon: Package, label: 'Pengadaan/Pembelian', path: '/procurement' },
    { icon: FileText, label: 'Akuntansi', path: '/accounting' },
    { icon: DollarSign, label: 'Keuangan', path: '/finance' },
    { icon: Activity, label: 'Ambulans', path: '/ambulance' },
    { icon: FileText, label: 'Pemulasaran Jenazah', path: '/mortuary' },
    { icon: Heart, label: 'Persalinan', path: '/maternity' },
    { icon: Package, label: 'Gizi', path: '/nutrition' },
    { icon: BarChart3, label: 'Sistem Informasi Eksekutif', path: '/executive-info' },
    { icon: Heart, label: 'Asuhan Keperawatan', path: '/nursing-care' },
    { icon: Activity, label: 'Sterilisasi', path: '/sterilization' },
    { icon: BedDouble, label: 'Perawatan Intensif', path: '/intensive-care' },
    { icon: Droplet, label: 'Rehabilitasi Medik', path: '/rehabilitation' },
    { icon: Activity, label: 'Anestesi', path: '/anesthesia' },
    { icon: FileText, label: 'Layanan Informasi', path: '/information-services' },
    { icon: MessageSquare, label: 'SMS Gateway', path: '/sms-gateway' },
    { icon: Users, label: 'Mobile Patients', path: '/mobile-patients' },
    { icon: Users, label: 'Mobile Doctor', path: '/mobile-doctor' },
    { icon: UserCheck, label: 'SDM & Jadwal', path: '/hr' },
    { icon: Package, label: 'Aset & Kalibrasi', path: '/assets' },
    { icon: Package, label: 'Logistik', path: '/logistics' },
    { icon: AlertTriangle, label: 'Laporan Insiden', path: '/incidents' },
    { icon: BarChart3, label: 'Laporan & Analitik', path: '/reports' },
    { icon: Radio, label: 'Bridging', path: '/bridging' },
    { icon: MessageSquare, label: 'Broadcast', path: '/broadcast' },
    { icon: Settings, label: 'Pengaturan', path: '/settings' },
  ];

  const fktpMenuItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Users, label: 'Database Pasien', path: '/patients' },
    { icon: ClipboardList, label: 'Pendaftaran', path: '/registration' },
    { icon: Activity, label: 'Sistem Antrean', path: '/queue-system' },
    { icon: Stethoscope, label: 'Pemeriksaan Harian', path: '/daily-examination' },
    { icon: Calendar, label: 'Manajemen Poli', path: '/poli' },
    { icon: TestTube, label: 'Laboratorium', path: '/lab' },
    { icon: Pill, label: 'Apotek', path: '/pharmacy' },
    { icon: Package, label: 'Gudang Farmasi', path: '/pharmacy-warehouse' },
    { icon: Heart, label: 'Rikkes', path: '/rikkes' },
    { icon: BarChart3, label: '└ Analitik Rikkes', path: '/rikkes/analytics', indent: true },
    { icon: Shield, label: 'Rikkes Personel', path: '/personnel-rikkes' },
    { icon: FileText, label: 'Rekam Medis', path: '/medical-records' },
    { icon: DollarSign, label: 'Kasir', path: '/cashier' },
    { icon: Package, label: 'Inventory', path: '/inventory' },
    { icon: Settings, label: 'Sistem Administrasi', path: '/admin-system' },
    { icon: Radio, label: 'Bridging', path: '/bridging' },
    { icon: UserCheck, label: 'SDM & Jadwal', path: '/hr' },
    { icon: Package, label: 'Logistik', path: '/logistics' },
    { icon: AlertTriangle, label: 'Laporan Insiden', path: '/incidents' },
    { icon: BarChart3, label: 'Laporan & Analitik', path: '/reports' },
    { icon: MessageSquare, label: 'Broadcast', path: '/broadcast' },
    { icon: Settings, label: 'Pengaturan', path: '/settings' },
  ];

  // TNI AD hospital menu items (with Field Medicine features)
  const rsadMenuItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Users, label: 'Database Pasien', path: '/patients' },
    { icon: ClipboardList, label: 'Pendaftaran', path: '/registration' },
    { icon: Activity, label: 'Sistem Antrean', path: '/queue-system' },
    { icon: Stethoscope, label: 'Rawat Jalan', path: '/outpatient' },
    { icon: Activity, label: 'IGD', path: '/igd' },
    { icon: BedDouble, label: 'Rawat Inap', path: '/inpatient' },
    { icon: TestTube, label: 'Laboratorium', path: '/lab' },
    { icon: Radio, label: 'Radiologi', path: '/radiology' },
    { icon: Calendar, label: 'Bedah Sentral', path: '/surgery' },
    { icon: Pill, label: 'Apotek', path: '/pharmacy' },
    { icon: Package, label: 'Gudang Farmasi', path: '/pharmacy-warehouse' },
    { icon: Activity, label: 'CSSD', path: '/cssd' },
    { icon: Droplet, label: 'Bank Darah', path: '/bloodbank' },
    { icon: Shield, label: 'Kedokteran Lapangan', path: '/field-medicine' },
    { icon: AlertTriangle, label: 'Combat Casualty Care', path: '/combat-care' },
    { icon: Heart, label: 'Rikkes', path: '/rikkes' },
    { icon: BarChart3, label: '└ Analitik Rikkes', path: '/rikkes/analytics', indent: true },
    { icon: FileText, label: 'Rekam Medis', path: '/medical-records' },
    { icon: DollarSign, label: 'Kasir', path: '/cashier' },
    { icon: Package, label: 'Inventory', path: '/inventory' },
    { icon: Settings, label: 'Sistem Administrasi', path: '/admin-system' },
    { icon: Shield, label: 'Asuransi Penjamin', path: '/insurance' },
    { icon: Package, label: 'Gudang Umum', path: '/general-warehouse' },
    { icon: Package, label: 'Pengadaan/Pembelian', path: '/procurement' },
    { icon: FileText, label: 'Akuntansi', path: '/accounting' },
    { icon: DollarSign, label: 'Keuangan', path: '/finance' },
    { icon: Activity, label: 'Ambulans', path: '/ambulance' },
    { icon: FileText, label: 'Pemulasaran Jenazah', path: '/mortuary' },
    { icon: Heart, label: 'Persalinan', path: '/maternity' },
    { icon: Package, label: 'Gizi', path: '/nutrition' },
    { icon: BarChart3, label: 'Sistem Informasi Eksekutif', path: '/executive-info' },
    { icon: Heart, label: 'Asuhan Keperawatan', path: '/nursing-care' },
    { icon: Activity, label: 'Sterilisasi', path: '/sterilization' },
    { icon: BedDouble, label: 'Perawatan Intensif', path: '/intensive-care' },
    { icon: Droplet, label: 'Rehabilitasi Medik', path: '/rehabilitation' },
    { icon: Activity, label: 'Anestesi', path: '/anesthesia' },
    { icon: FileText, label: 'Layanan Informasi', path: '/information-services' },
    { icon: MessageSquare, label: 'SMS Gateway', path: '/sms-gateway' },
    { icon: Users, label: 'Mobile Patients', path: '/mobile-patients' },
    { icon: Users, label: 'Mobile Doctor', path: '/mobile-doctor' },
    { icon: UserCheck, label: 'SDM & Jadwal', path: '/hr' },
    { icon: Package, label: 'Aset & Kalibrasi', path: '/assets' },
    { icon: Package, label: 'Logistik', path: '/logistics' },
    { icon: AlertTriangle, label: 'Laporan Insiden', path: '/incidents' },
    { icon: BarChart3, label: 'Laporan & Analitik', path: '/reports' },
    { icon: Radio, label: 'Bridging', path: '/bridging' },
    { icon: MessageSquare, label: 'Broadcast', path: '/broadcast' },
    { icon: Settings, label: 'Pengaturan', path: '/settings' },
  ];

  // TNI AD clinic menu items
  const klinikADMenuItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Users, label: 'Database Pasien', path: '/patients' },
    { icon: ClipboardList, label: 'Pendaftaran', path: '/registration' },
    { icon: Activity, label: 'Sistem Antrean', path: '/queue-system' },
    { icon: Stethoscope, label: 'Pemeriksaan Harian', path: '/daily-examination' },
    { icon: Calendar, label: 'Manajemen Poli', path: '/poli' },
    { icon: TestTube, label: 'Laboratorium', path: '/lab' },
    { icon: Pill, label: 'Apotek', path: '/pharmacy' },
    { icon: Package, label: 'Gudang Farmasi', path: '/pharmacy-warehouse' },
    { icon: Shield, label: 'Medical Fitness', path: '/medical-fitness' },
    { icon: Heart, label: 'Rikkes', path: '/rikkes' },
    { icon: BarChart3, label: '└ Analitik Rikkes', path: '/rikkes/analytics', indent: true },
    { icon: FileText, label: 'Rekam Medis', path: '/medical-records' },
    { icon: DollarSign, label: 'Kasir', path: '/cashier' },
    { icon: Package, label: 'Inventory', path: '/inventory' },
    { icon: Settings, label: 'Sistem Administrasi', path: '/admin-system' },
    { icon: Radio, label: 'Bridging', path: '/bridging' },
    { icon: UserCheck, label: 'SDM & Jadwal', path: '/hr' },
    { icon: Package, label: 'Logistik', path: '/logistics' },
    { icon: AlertTriangle, label: 'Laporan Insiden', path: '/incidents' },
    { icon: BarChart3, label: 'Laporan & Analitik', path: '/reports' },
    { icon: MessageSquare, label: 'Broadcast', path: '/broadcast' },
    { icon: Settings, label: 'Pengaturan', path: '/settings' },
  ];

  // TNI AL hospital menu items (with Maritime Medicine features)
  const rsalMenuItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Users, label: 'Database Pasien', path: '/patients' },
    { icon: ClipboardList, label: 'Pendaftaran', path: '/registration' },
    { icon: Activity, label: 'Sistem Antrean', path: '/queue-system' },
    { icon: Stethoscope, label: 'Rawat Jalan', path: '/outpatient' },
    { icon: Activity, label: 'IGD', path: '/igd' },
    { icon: BedDouble, label: 'Rawat Inap', path: '/inpatient' },
    { icon: TestTube, label: 'Laboratorium', path: '/lab' },
    { icon: Radio, label: 'Radiologi', path: '/radiology' },
    { icon: Calendar, label: 'Bedah Sentral', path: '/surgery' },
    { icon: Pill, label: 'Apotek', path: '/pharmacy' },
    { icon: Package, label: 'Gudang Farmasi', path: '/pharmacy-warehouse' },
    { icon: Activity, label: 'CSSD', path: '/cssd' },
    { icon: Droplet, label: 'Bank Darah', path: '/bloodbank' },
    { icon: Activity, label: 'Kedokteran Selam', path: '/diving-medicine' },
    { icon: Shield, label: 'Hyperbaric Medicine', path: '/hyperbaric' },
    { icon: Heart, label: 'Rikkes', path: '/rikkes' },
    { icon: BarChart3, label: '└ Analitik Rikkes', path: '/rikkes/analytics', indent: true },
    { icon: FileText, label: 'Rekam Medis', path: '/medical-records' },
    { icon: DollarSign, label: 'Kasir', path: '/cashier' },
    { icon: Package, label: 'Inventory', path: '/inventory' },
    { icon: Settings, label: 'Sistem Administrasi', path: '/admin-system' },
    { icon: Shield, label: 'Asuransi Penjamin', path: '/insurance' },
    { icon: Package, label: 'Gudang Umum', path: '/general-warehouse' },
    { icon: Package, label: 'Pengadaan/Pembelian', path: '/procurement' },
    { icon: FileText, label: 'Akuntansi', path: '/accounting' },
    { icon: DollarSign, label: 'Keuangan', path: '/finance' },
    { icon: Activity, label: 'Ambulans', path: '/ambulance' },
    { icon: FileText, label: 'Pemulasaran Jenazah', path: '/mortuary' },
    { icon: Heart, label: 'Persalinan', path: '/maternity' },
    { icon: Package, label: 'Gizi', path: '/nutrition' },
    { icon: BarChart3, label: 'Sistem Informasi Eksekutif', path: '/executive-info' },
    { icon: Heart, label: 'Asuhan Keperawatan', path: '/nursing-care' },
    { icon: Activity, label: 'Sterilisasi', path: '/sterilization' },
    { icon: BedDouble, label: 'Perawatan Intensif', path: '/intensive-care' },
    { icon: Droplet, label: 'Rehabilitasi Medik', path: '/rehabilitation' },
    { icon: Activity, label: 'Anestesi', path: '/anesthesia' },
    { icon: FileText, label: 'Layanan Informasi', path: '/information-services' },
    { icon: MessageSquare, label: 'SMS Gateway', path: '/sms-gateway' },
    { icon: Users, label: 'Mobile Patients', path: '/mobile-patients' },
    { icon: Users, label: 'Mobile Doctor', path: '/mobile-doctor' },
    { icon: UserCheck, label: 'SDM & Jadwal', path: '/hr' },
    { icon: Package, label: 'Aset & Kalibrasi', path: '/assets' },
    { icon: Package, label: 'Logistik', path: '/logistics' },
    { icon: AlertTriangle, label: 'Laporan Insiden', path: '/incidents' },
    { icon: BarChart3, label: 'Laporan & Analitik', path: '/reports' },
    { icon: Radio, label: 'Bridging', path: '/bridging' },
    { icon: MessageSquare, label: 'Broadcast', path: '/broadcast' },
    { icon: Settings, label: 'Pengaturan', path: '/settings' },
  ];

  // TNI AL clinic menu items
  const klinikALMenuItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Users, label: 'Database Pasien', path: '/patients' },
    { icon: ClipboardList, label: 'Pendaftaran', path: '/registration' },
    { icon: Activity, label: 'Sistem Antrean', path: '/queue-system' },
    { icon: Stethoscope, label: 'Pemeriksaan Harian', path: '/daily-examination' },
    { icon: Calendar, label: 'Manajemen Poli', path: '/poli' },
    { icon: TestTube, label: 'Laboratorium', path: '/lab' },
    { icon: Pill, label: 'Apotek', path: '/pharmacy' },
    { icon: Package, label: 'Gudang Farmasi', path: '/pharmacy-warehouse' },
    { icon: Activity, label: 'Diving Medical Check', path: '/diving-medical' },
    { icon: Heart, label: 'Rikkes', path: '/rikkes' },
    { icon: BarChart3, label: '└ Analitik Rikkes', path: '/rikkes/analytics', indent: true },
    { icon: FileText, label: 'Rekam Medis', path: '/medical-records' },
    { icon: DollarSign, label: 'Kasir', path: '/cashier' },
    { icon: Package, label: 'Inventory', path: '/inventory' },
    { icon: Settings, label: 'Sistem Administrasi', path: '/admin-system' },
    { icon: Radio, label: 'Bridging', path: '/bridging' },
    { icon: UserCheck, label: 'SDM & Jadwal', path: '/hr' },
    { icon: Package, label: 'Logistik', path: '/logistics' },
    { icon: AlertTriangle, label: 'Laporan Insiden', path: '/incidents' },
    { icon: BarChart3, label: 'Laporan & Analitik', path: '/reports' },
    { icon: MessageSquare, label: 'Broadcast', path: '/broadcast' },
    { icon: Settings, label: 'Pengaturan', path: '/settings' },
  ];

  const getMenuItems = () => {
    switch (userRole) {
      case 'PUSKESAU':
        return puskesauMenuItems;
      case 'RSAU':
        return rsauMenuItems;
      case 'FKTP':
        return fktpMenuItems;
      case 'RSAD':
        return rsadMenuItems;
      case 'KLINIK_AD':
        return klinikADMenuItems;
      case 'RSAL':
        return rsalMenuItems;
      case 'KLINIK_AL':
        return klinikALMenuItems;
      default:
        return puskesauMenuItems;
    }
  };

  const menuItems = getMenuItems();

  const loadFacilities = useCallback(async () => {
    try {
      if (!facilityType) return;
      
      const q = query(collection(db, 'faskes'), where('tipe', '==', facilityType));
      const snapshot = await getDocs(q);
      const facilities = [];
      snapshot.forEach((doc) => {
        facilities.push(doc.data());
      });
      setAvailableFacilities(facilities);
    } catch (error) {
      console.error('Error loading facilities:', error);
    }
  }, [facilityType]);

  useEffect(() => {
    if (userRole !== 'PUSKESAU') {
      loadFacilities();
    }
  }, [userRole, facilityType, loadFacilities]);

  const handleFacilitySwitch = (facilityName) => {
    if (facilityType === 'rsau') {
      switchToRSAU(facilityName);
    } else if (facilityType === 'fktp') {
      switchToFKTP(facilityName);
    } else if (facilityType === 'rsad') {
      switchToRSAD(facilityName);
    } else if (facilityType === 'klinik_ad') {
      switchToKlinikAD(facilityName);
    } else if (facilityType === 'rsal') {
      switchToRSAL(facilityName);
    } else if (facilityType === 'klinik_al') {
      switchToKlinikAL(facilityName);
    }
    setFacilityDropdownOpen(false);
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 ${
          sidebarOpen ? 'w-64' : 'lg:w-20'
        } w-64 sm:w-72 bg-white shadow-lg transition-all duration-300 overflow-y-auto fixed lg:relative h-full z-50`}
        style={{ borderRight: `3px solid ${theme.primaryColor}` }}
      >
        <div className="p-3 sm:p-4 flex items-center justify-between" style={{ backgroundColor: theme.primaryColor }}>
          <div className={`${sidebarOpen ? 'block' : 'hidden'}`}>
            <h1 className="text-white font-bold text-lg sm:text-xl">
              {userRole === 'PUSKESAU' 
                ? branch === 'AU' ? 'PUSKESAU' : branch === 'AD' ? 'PUSKESAD' : 'PUSKESAL'
                : (userRole === 'RSAU' || userRole === 'RSAD' || userRole === 'RSAL') ? 'SIMRS' : 'SIM Klinik'}
            </h1>
            <p className="text-white text-xs opacity-90">
              {userRole === 'PUSKESAU' 
                ? branch === 'AU' ? 'Komando Kesehatan TNI AU' : branch === 'AD' ? 'Komando Kesehatan TNI AD' : 'Komando Kesehatan TNI AL'
                : branch === 'AU' ? 'TNI Angkatan Udara' : branch === 'AD' ? 'TNI Angkatan Darat' : 'TNI Angkatan Laut'}
            </p>
          </div>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Back to Puskes Button (only shown when in facility mode) */}
        {userRole !== 'PUSKESAU' && (
          <div className="p-3 sm:p-4 border-b">
            <button
              onClick={() => {
                switchToPuskes();
                navigate('/');
              }}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-2 sm:px-3 rounded-lg flex items-center justify-center gap-1 sm:gap-2 transition-colors text-xs sm:text-sm"
            >
              <Shield size={14} className="sm:w-4 sm:h-4" />
              <span className="truncate">Ke {branch === 'AU' ? 'Puskesau' : branch === 'AD' ? 'Puskesad' : 'Puskesal'}</span>
            </button>
          </div>
        )}

        <nav className="p-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-gray-100 transition-colors text-left mb-1 ${
                item.indent ? 'pl-6 sm:pl-8' : ''
              }`}
              title={!sidebarOpen ? item.label : ''}
            >
              <item.icon size={item.indent ? 16 : 20} className="flex-shrink-0" style={{ color: theme.primaryColor }} />
              {sidebarOpen && <span className={`${item.indent ? 'text-xs' : 'text-xs sm:text-sm'} truncate`}>{item.label}</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between p-2 sm:p-3 md:p-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg mr-1 sm:mr-2"
            >
              <Menu size={20} className="sm:w-6 sm:h-6" />
            </button>

            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 overflow-x-auto flex-1">
              <div className="hidden md:block">
                <h2 className="text-xl font-bold" style={{ color: theme.primaryColor }}>
                  {userRole === 'PUSKESAU' 
                    ? `Dashboard Pengawasan Puskes${branch}` 
                    : (userRole === 'RSAU' || userRole === 'RSAD' || userRole === 'RSAL')
                    ? `SIMRS`
                    : `SIM Klinik`
                  }
                </h2>
                <p className="text-sm text-gray-600">
                  {userRole === 'PUSKESAU' 
                    ? branch === 'AU' ? 'Pusat Kesehatan Angkatan Udara' : branch === 'AD' ? 'Pusat Kesehatan Angkatan Darat' : 'Pusat Kesehatan Angkatan Laut'
                    : (userRole === 'RSAU' || userRole === 'RSAD' || userRole === 'RSAL')
                    ? 'Sistem Informasi Manajemen Rumah Sakit'
                    : 'Sistem Informasi Manajemen Klinik'
                  }
                </p>
              </div>
              <div className="md:hidden">
                <h2 className="text-sm sm:text-base font-bold truncate" style={{ color: theme.primaryColor }}>
                  {userRole === 'PUSKESAU' ? `Puskes${branch}` : userRole === 'RSAU' || userRole === 'RSAD' || userRole === 'RSAL' ? 'SIMRS' : 'Klinik'}
                </h2>
              </div>

              {/* Branch Selector - Shown when in Puskes mode */}
              {userRole === 'PUSKESAU' && (
                <div className="relative">
                  <button
                    onClick={() => setBranchDropdownOpen(!branchDropdownOpen)}
                    className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors"
                  >
                    <Shield size={14} className="sm:w-4 sm:h-4 text-purple-600 flex-shrink-0" />
                    <span className="font-semibold text-purple-800 text-xs sm:text-sm whitespace-nowrap">
                      TNI {branch}
                    </span>
                    <ChevronDown size={14} className="sm:w-4 sm:h-4 text-purple-600 flex-shrink-0" />
                  </button>

                  {branchDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border z-50">
                      <div className="p-2 border-b bg-gray-50">
                        <p className="text-xs font-semibold text-gray-600 uppercase px-2">
                          Pilih Matra
                        </p>
                      </div>
                      <div className="p-2">
                        {['AU', 'AD', 'AL'].map((matra) => (
                          <button
                            key={matra}
                            onClick={() => {
                              switchBranch(matra);
                              setBranchDropdownOpen(false);
                            }}
                            className={`w-full text-left p-3 rounded hover:bg-purple-50 transition-colors mb-1 ${
                              branch === matra ? 'bg-purple-100 border border-purple-300 font-semibold' : ''
                            }`}
                          >
                            <div className="font-semibold text-sm text-gray-800">TNI {matra}</div>
                            <div className="text-xs text-gray-600">
                              {matra === 'AU' ? 'Angkatan Udara' : matra === 'AD' ? 'Angkatan Darat' : 'Angkatan Laut'}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Facility Dropdown - Shown when in facility mode */}
              {userRole !== 'PUSKESAU' && selectedFaskes && (
                <div className="relative">
                  <button
                    onClick={() => setFacilityDropdownOpen(!facilityDropdownOpen)}
                    className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
                  >
                    <span className="font-semibold text-blue-800 text-xs sm:text-sm max-w-[80px] sm:max-w-[120px] md:max-w-xs truncate">
                      {selectedFaskes}
                    </span>
                    <ChevronDown size={14} className="sm:w-4 sm:h-4 text-blue-600 flex-shrink-0" />
                  </button>

                  {facilityDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 md:left-0 md:right-auto mt-2 w-screen md:w-96 max-w-sm md:max-w-none bg-white rounded-lg shadow-xl border z-50 max-h-96 overflow-y-auto">
                      <div className="p-2 border-b bg-gray-50">
                        <p className="text-xs font-semibold text-gray-600 uppercase px-2">
                          {userRole === 'RSAU' ? 'Pilih RSAU' : 
                           userRole === 'FKTP' ? 'Pilih FKTP' :
                           userRole === 'RSAD' ? 'Pilih RSAD' :
                           userRole === 'KLINIK_AD' ? 'Pilih Klinik AD' :
                           userRole === 'RSAL' ? 'Pilih RSAL' :
                           userRole === 'KLINIK_AL' ? 'Pilih Klinik AL' : 'Pilih Faskes'}
                        </p>
                      </div>
                      <div className="p-2">
                        {availableFacilities.map((facility) => (
                          <button
                            key={facility.id}
                            onClick={() => handleFacilitySwitch(facility.nama)}
                            className={`w-full text-left p-3 rounded hover:bg-blue-50 transition-colors mb-1 ${
                              selectedFaskes === facility.nama ? 'bg-blue-100 border border-blue-300' : ''
                            }`}
                          >
                            <div className="font-semibold text-sm text-gray-800">{facility.nama}</div>
                            <div className="text-xs text-gray-600">{facility.lokasi}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Rikkes Role Selector */}
              {userRole !== 'PUSKESAU' && selectedFaskes && (
                <div className="relative">
                  <button
                    onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                    className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors"
                  >
                    <Shield size={14} className="sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
                    <span className="font-semibold text-green-800 text-xs sm:text-sm hidden sm:inline truncate max-w-[100px]">
                      {rikkesRole}
                    </span>
                    <ChevronDown size={14} className="sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
                  </button>

                  {roleDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border z-50">
                      <div className="p-2 border-b bg-gray-50">
                        <p className="text-xs font-semibold text-gray-600 uppercase px-2">
                          Role Rikkes
                        </p>
                      </div>
                      <div className="p-2">
                        {['Admin', 'Dokter Umum', 'Dokter Gigi', 'ATLM Lab', 'Radiografer', 'Reviewer'].map((role) => (
                          <button
                            key={role}
                            onClick={() => {
                              setRikkesRole(role);
                              setRoleDropdownOpen(false);
                            }}
                            className={`w-full text-left p-2 rounded hover:bg-green-50 transition-colors mb-1 text-sm ${
                              rikkesRole === role ? 'bg-green-100 border border-green-300 font-semibold' : ''
                            }`}
                          >
                            {role}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
              {/* Notifications */}
              <button className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg relative">
                <Activity size={18} className="sm:w-5 sm:h-5" />
                <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Menu */}
              <div className="relative">
                <button 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm sm:text-base">
                    A
                  </div>
                  <ChevronDown size={14} className="sm:w-4 sm:h-4 hidden sm:block" />
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
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
