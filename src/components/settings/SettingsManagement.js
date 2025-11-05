import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { Settings, Bell, Shield, Database, Palette } from 'lucide-react';
import Card from '../common/Card';

const SettingsManagement = () => {
  const { selectedFaskes } = useAuth();
  const { addNotification } = useApp();
  
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    facilityName: selectedFaskes,
    address: 'Jakarta, Indonesia',
    phone: '021-1234567',
    email: 'info@puskesau.mil.id',
    workingHours: '08:00 - 16:00',
    timezone: 'Asia/Jakarta',
    language: 'id',
    dateFormat: 'DD/MM/YYYY',
    currency: 'IDR',
    notifications: {
      email: true,
      sms: false,
      push: true,
      lowStock: true,
      calibration: true
    },
    security: {
      twoFactor: false,
      sessionTimeout: '30',
      passwordExpiry: '90'
    }
  });

  const handleSave = () => {
    addNotification({ type: 'success', message: 'Pengaturan berhasil disimpan' });
  };

  return (
    <div className="space-y-6">
      <Card title="Pengaturan & Konfigurasi">
        <div className="mb-4 flex gap-2 border-b overflow-x-auto">
          <button onClick={() => setActiveTab('general')} className={`px-4 py-2 whitespace-nowrap ${activeTab === 'general' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}>
            <Settings size={16} className="inline mr-2" />
            Umum
          </button>
          <button onClick={() => setActiveTab('facility')} className={`px-4 py-2 whitespace-nowrap ${activeTab === 'facility' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}>
            <Database size={16} className="inline mr-2" />
            Faskes
          </button>
          <button onClick={() => setActiveTab('notifications')} className={`px-4 py-2 whitespace-nowrap ${activeTab === 'notifications' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}>
            <Bell size={16} className="inline mr-2" />
            Notifikasi
          </button>
          <button onClick={() => setActiveTab('security')} className={`px-4 py-2 whitespace-nowrap ${activeTab === 'security' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}>
            <Shield size={16} className="inline mr-2" />
            Keamanan
          </button>
          <button onClick={() => setActiveTab('appearance')} className={`px-4 py-2 whitespace-nowrap ${activeTab === 'appearance' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}>
            <Palette size={16} className="inline mr-2" />
            Tampilan
          </button>
        </div>

        {activeTab === 'general' && (
          <div className="space-y-4">
            <h4 className="font-medium mb-3">Pengaturan Umum</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Zona Waktu</label>
                <select value={settings.timezone} onChange={(e) => setSettings(prev => ({ ...prev, timezone: e.target.value }))} className="w-full p-2 border rounded">
                  <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
                  <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
                  <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bahasa</label>
                <select value={settings.language} onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))} className="w-full p-2 border rounded">
                  <option value="id">Indonesia</option>
                  <option value="en">English</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Format Tanggal</label>
                <select value={settings.dateFormat} onChange={(e) => setSettings(prev => ({ ...prev, dateFormat: e.target.value }))} className="w-full p-2 border rounded">
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mata Uang</label>
                <select value={settings.currency} onChange={(e) => setSettings(prev => ({ ...prev, currency: e.target.value }))} className="w-full p-2 border rounded">
                  <option value="IDR">IDR (Rupiah)</option>
                  <option value="USD">USD (Dollar)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'facility' && (
          <div className="space-y-4">
            <h4 className="font-medium mb-3">Informasi Faskes</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nama Faskes</label>
                <input type="text" value={settings.facilityName} onChange={(e) => setSettings(prev => ({ ...prev, facilityName: e.target.value }))} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Alamat</label>
                <textarea value={settings.address} onChange={(e) => setSettings(prev => ({ ...prev, address: e.target.value }))} className="w-full p-2 border rounded" rows="2" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Telepon</label>
                  <input type="tel" value={settings.phone} onChange={(e) => setSettings(prev => ({ ...prev, phone: e.target.value }))} className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input type="email" value={settings.email} onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))} className="w-full p-2 border rounded" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Jam Operasional</label>
                <input type="text" value={settings.workingHours} onChange={(e) => setSettings(prev => ({ ...prev, workingHours: e.target.value }))} className="w-full p-2 border rounded" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <h4 className="font-medium mb-3">Pengaturan Notifikasi</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-600">Terima notifikasi via email</p>
                </div>
                <input type="checkbox" checked={settings.notifications.email} onChange={(e) => setSettings(prev => ({ ...prev, notifications: { ...prev.notifications, email: e.target.checked }}))} className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">SMS Notifications</p>
                  <p className="text-sm text-gray-600">Terima notifikasi via SMS</p>
                </div>
                <input type="checkbox" checked={settings.notifications.sms} onChange={(e) => setSettings(prev => ({ ...prev, notifications: { ...prev.notifications, sms: e.target.checked }}))} className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-gray-600">Terima notifikasi push</p>
                </div>
                <input type="checkbox" checked={settings.notifications.push} onChange={(e) => setSettings(prev => ({ ...prev, notifications: { ...prev.notifications, push: e.target.checked }}))} className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">Low Stock Alert</p>
                  <p className="text-sm text-gray-600">Notifikasi stok rendah</p>
                </div>
                <input type="checkbox" checked={settings.notifications.lowStock} onChange={(e) => setSettings(prev => ({ ...prev, notifications: { ...prev.notifications, lowStock: e.target.checked }}))} className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">Calibration Reminder</p>
                  <p className="text-sm text-gray-600">Pengingat kalibrasi alat</p>
                </div>
                <input type="checkbox" checked={settings.notifications.calibration} onChange={(e) => setSettings(prev => ({ ...prev, notifications: { ...prev.notifications, calibration: e.target.checked }}))} className="w-5 h-5" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-4">
            <h4 className="font-medium mb-3">Pengaturan Keamanan</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-600">Tambahan keamanan login</p>
                </div>
                <input type="checkbox" checked={settings.security.twoFactor} onChange={(e) => setSettings(prev => ({ ...prev, security: { ...prev.security, twoFactor: e.target.checked }}))} className="w-5 h-5" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Session Timeout (menit)</label>
                <input type="number" value={settings.security.sessionTimeout} onChange={(e) => setSettings(prev => ({ ...prev, security: { ...prev.security, sessionTimeout: e.target.value }}))} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password Expiry (hari)</label>
                <input type="number" value={settings.security.passwordExpiry} onChange={(e) => setSettings(prev => ({ ...prev, security: { ...prev.security, passwordExpiry: e.target.value }}))} className="w-full p-2 border rounded" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'appearance' && (
          <div className="space-y-4">
            <h4 className="font-medium mb-3">Pengaturan Tampilan</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tema</label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 border-2 border-blue-500 rounded-lg cursor-pointer">
                    <div className="w-full h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded mb-2"></div>
                    <p className="text-sm font-medium text-center">Default</p>
                  </div>
                  <div className="p-4 border-2 border-gray-300 rounded-lg cursor-pointer">
                    <div className="w-full h-20 bg-gradient-to-br from-green-500 to-green-700 rounded mb-2"></div>
                    <p className="text-sm font-medium text-center">Green</p>
                  </div>
                  <div className="p-4 border-2 border-gray-300 rounded-lg cursor-pointer">
                    <div className="w-full h-20 bg-gradient-to-br from-gray-700 to-gray-900 rounded mb-2"></div>
                    <p className="text-sm font-medium text-center">Dark</p>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Logo Faskes</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <p className="text-gray-500">Klik atau drag & drop untuk upload logo</p>
                  <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Upload Logo
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
            Reset
          </button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Simpan Pengaturan
          </button>
        </div>
      </Card>

      <Card title="Info Sistem">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Versi Aplikasi</p>
            <p className="font-medium">v1.0.0</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Terakhir Update</p>
            <p className="font-medium">{new Date().toLocaleDateString('id-ID')}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Database</p>
            <p className="font-medium">localStorage (Mock)</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <p className="font-medium text-green-600">Online</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SettingsManagement;
