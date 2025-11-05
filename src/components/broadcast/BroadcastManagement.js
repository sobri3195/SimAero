import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc } from '../../mockDb';
import { db } from '../../mockDb';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { Send, Bell, MessageSquare, Users } from 'lucide-react';
import Card from '../common/Card';

const BroadcastManagement = () => {
  const { selectedFaskes, userRole } = useAuth();
  const { addNotification } = useApp();
  
  const [messages, setMessages] = useState([]);
  const [showComposeForm, setShowComposeForm] = useState(false);

  const [messageForm, setMessageForm] = useState({
    title: '',
    content: '',
    priority: 'normal',
    target: 'all',
    channel: 'app'
  });

  useEffect(() => {
    if (!selectedFaskes) return;

    const messagesQuery = query(
      collection(db, 'broadcasts'),
      where('faskesId', '==', selectedFaskes)
    );

    const unsubMessages = onSnapshot(messagesQuery, (snapshot) => {
      const data = [];
      snapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));
      data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setMessages(data);
    });

    return () => unsubMessages();
  }, [selectedFaskes]);

  const sendBroadcast = async () => {
    if (!messageForm.title || !messageForm.content) {
      addNotification({ type: 'warning', message: 'Judul dan konten harus diisi' });
      return;
    }

    try {
      await addDoc(collection(db, 'broadcasts'), {
        ...messageForm,
        faskesId: selectedFaskes,
        sender: userRole,
        timestamp: new Date().toISOString(),
        status: 'sent',
        readBy: []
      });

      setMessageForm({ title: '', content: '', priority: 'normal', target: 'all', channel: 'app' });
      setShowComposeForm(false);
      addNotification({ type: 'success', message: 'Broadcast terkirim' });
    } catch (error) {
      console.error('Error sending broadcast:', error);
      addNotification({ type: 'error', message: 'Gagal mengirim broadcast' });
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card 
        title="Broadcast & Pengumuman"
        actions={
          <button onClick={() => setShowComposeForm(!showComposeForm)} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2">
            <Send size={16} />
            Buat Broadcast
          </button>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Broadcast</p>
                <p className="text-2xl font-bold text-blue-600">{messages.length}</p>
              </div>
              <MessageSquare size={32} className="text-blue-500" />
            </div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Terkirim</p>
                <p className="text-2xl font-bold text-green-600">{messages.filter(m => m.status === 'sent').length}</p>
              </div>
              <Send size={32} className="text-green-500" />
            </div>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Prioritas Tinggi</p>
                <p className="text-2xl font-bold text-yellow-600">{messages.filter(m => m.priority === 'urgent' || m.priority === 'high').length}</p>
              </div>
              <Bell size={32} className="text-yellow-500" />
            </div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Penerima</p>
                <p className="text-2xl font-bold text-purple-600">All</p>
              </div>
              <Users size={32} className="text-purple-500" />
            </div>
          </div>
        </div>

        {showComposeForm && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-3">Buat Broadcast Baru</h4>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Judul Broadcast"
                value={messageForm.title}
                onChange={(e) => setMessageForm(prev => ({ ...prev, title: e.target.value }))}
                className="w-full p-2 border rounded"
              />
              <textarea
                placeholder="Konten pesan..."
                value={messageForm.content}
                onChange={(e) => setMessageForm(prev => ({ ...prev, content: e.target.value }))}
                className="w-full p-2 border rounded"
                rows="5"
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select
                  value={messageForm.priority}
                  onChange={(e) => setMessageForm(prev => ({ ...prev, priority: e.target.value }))}
                  className="p-2 border rounded"
                >
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
                <select
                  value={messageForm.target}
                  onChange={(e) => setMessageForm(prev => ({ ...prev, target: e.target.value }))}
                  className="p-2 border rounded"
                >
                  <option value="all">Semua</option>
                  <option value="doctors">Dokter</option>
                  <option value="nurses">Perawat</option>
                  <option value="pharmacists">Apoteker</option>
                  <option value="admin">Admin</option>
                </select>
                <select
                  value={messageForm.channel}
                  onChange={(e) => setMessageForm(prev => ({ ...prev, channel: e.target.value }))}
                  className="p-2 border rounded"
                >
                  <option value="app">Aplikasi</option>
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                  <option value="all">Semua Channel</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button onClick={sendBroadcast} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2">
                  <Send size={16} />
                  Kirim Broadcast
                </button>
                <button onClick={() => setShowComposeForm(false)} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}

        <div>
          <h4 className="font-medium mb-3">Riwayat Broadcast</h4>
          <div className="space-y-3">
            {messages.map(message => (
              <div key={message.id} className="p-4 bg-white border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="font-medium">{message.title}</h5>
                      <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(message.priority)}`}>
                        {message.priority}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                        {message.channel}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{message.content}</p>
                    <div className="flex gap-4 text-xs text-gray-500">
                      <span>Target: {message.target}</span>
                      <span>Dari: {message.sender}</span>
                      <span>{new Date(message.timestamp).toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {messages.length === 0 && (
              <div className="text-center py-8 text-gray-500">Belum ada broadcast</div>
            )}
          </div>
        </div>
      </Card>

      <Card title="Template Broadcast">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'Jadwal Operasi', desc: 'Template untuk pengumuman jadwal operasi' },
            { title: 'Update Protokol', desc: 'Template untuk update protokol medis' },
            { title: 'Maintenance Sistem', desc: 'Template untuk maintenance sistem' },
            { title: 'Pelatihan Staff', desc: 'Template untuk jadwal pelatihan' }
          ].map((template, idx) => (
            <div key={idx} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <h5 className="font-medium">{template.title}</h5>
              <p className="text-sm text-gray-600 mt-1">{template.desc}</p>
              <button className="mt-2 text-sm text-blue-600 hover:underline">
                Gunakan Template
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default BroadcastManagement;
