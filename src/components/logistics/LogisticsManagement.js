import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc } from '../../mockDb';
import { db } from '../../mockDb';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { Package, TrendingDown, ShoppingCart, AlertTriangle } from 'lucide-react';
import Card from '../common/Card';

const LogisticsManagement = () => {
  const { selectedFaskes } = useAuth();
  const { addNotification } = useApp();
  
  const [supplies, setSupplies] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('inventory');
  const [showAddSupply, setShowAddSupply] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);

  const [supplyForm, setSupplyForm] = useState({
    name: '',
    category: 'Medical Supplies',
    stock: '0',
    unit: 'pcs',
    minStock: '10',
    supplier: ''
  });

  const [orderForm, setOrderForm] = useState({
    items: '',
    supplier: '',
    urgency: 'normal',
    notes: ''
  });

  useEffect(() => {
    if (!selectedFaskes) return;

    const suppliesQuery = query(collection(db, 'supplies'), where('faskesId', '==', selectedFaskes));
    const ordersQuery = query(collection(db, 'supply_orders'), where('faskesId', '==', selectedFaskes));

    const unsubSupplies = onSnapshot(suppliesQuery, (snapshot) => {
      const data = [];
      snapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));
      setSupplies(data);
    });

    const unsubOrders = onSnapshot(ordersQuery, (snapshot) => {
      const data = [];
      snapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(data.slice(0, 20));
    });

    return () => {
      unsubSupplies();
      unsubOrders();
    };
  }, [selectedFaskes]);

  const addSupply = async () => {
    if (!supplyForm.name) {
      addNotification({ type: 'warning', message: 'Nama barang harus diisi' });
      return;
    }

    try {
      await addDoc(collection(db, 'supplies'), {
        ...supplyForm,
        faskesId: selectedFaskes,
        createdAt: new Date().toISOString()
      });
      setSupplyForm({ name: '', category: 'Medical Supplies', stock: '0', unit: 'pcs', minStock: '10', supplier: '' });
      setShowAddSupply(false);
      addNotification({ type: 'success', message: 'Barang berhasil ditambahkan' });
    } catch (error) {
      console.error('Error adding supply:', error);
    }
  };

  const createOrder = async () => {
    if (!orderForm.items) {
      addNotification({ type: 'warning', message: 'Items harus diisi' });
      return;
    }

    try {
      await addDoc(collection(db, 'supply_orders'), {
        ...orderForm,
        faskesId: selectedFaskes,
        status: 'pending',
        orderDate: new Date().toISOString(),
        createdAt: new Date().toISOString()
      });
      setOrderForm({ items: '', supplier: '', urgency: 'normal', notes: '' });
      setShowOrderForm(false);
      addNotification({ type: 'success', message: 'Order dibuat' });
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const lowStockSupplies = supplies.filter(s => parseInt(s.stock) <= parseInt(s.minStock));

  return (
    <div className="space-y-6">
      <Card 
        title="Manajemen Logistik"
        actions={
          <div className="flex gap-2">
            <button onClick={() => setShowAddSupply(!showAddSupply)} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2">
              <Package size={16} />
              Tambah Barang
            </button>
            <button onClick={() => setShowOrderForm(!showOrderForm)} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2">
              <ShoppingCart size={16} />
              Buat Order
            </button>
          </div>
        }
      >
        {lowStockSupplies.length > 0 && (
          <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800">
            <div className="flex items-center gap-2">
              <AlertTriangle size={20} />
              <span className="font-medium">{lowStockSupplies.length} barang dengan stok rendah</span>
            </div>
          </div>
        )}

        {showAddSupply && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-3">Tambah Barang</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input type="text" placeholder="Nama Barang" value={supplyForm.name} onChange={(e) => setSupplyForm(prev => ({ ...prev, name: e.target.value }))} className="p-2 border rounded" />
              <select value={supplyForm.category} onChange={(e) => setSupplyForm(prev => ({ ...prev, category: e.target.value }))} className="p-2 border rounded">
                <option value="Medical Supplies">Medical Supplies</option>
                <option value="Office Supplies">Office Supplies</option>
                <option value="Cleaning Supplies">Cleaning Supplies</option>
                <option value="Food & Beverage">Food & Beverage</option>
              </select>
              <input type="number" placeholder="Stok" value={supplyForm.stock} onChange={(e) => setSupplyForm(prev => ({ ...prev, stock: e.target.value }))} className="p-2 border rounded" />
              <input type="text" placeholder="Unit (pcs, box, dll)" value={supplyForm.unit} onChange={(e) => setSupplyForm(prev => ({ ...prev, unit: e.target.value }))} className="p-2 border rounded" />
              <input type="number" placeholder="Min. Stok" value={supplyForm.minStock} onChange={(e) => setSupplyForm(prev => ({ ...prev, minStock: e.target.value }))} className="p-2 border rounded" />
              <input type="text" placeholder="Supplier" value={supplyForm.supplier} onChange={(e) => setSupplyForm(prev => ({ ...prev, supplier: e.target.value }))} className="p-2 border rounded" />
            </div>
            <div className="flex gap-2">
              <button onClick={addSupply} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Simpan</button>
              <button onClick={() => setShowAddSupply(false)} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">Batal</button>
            </div>
          </div>
        )}

        {showOrderForm && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium mb-3">Buat Order Baru</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <textarea placeholder="Daftar barang yang dipesan..." value={orderForm.items} onChange={(e) => setOrderForm(prev => ({ ...prev, items: e.target.value }))} className="p-2 border rounded col-span-2" rows="3" />
              <input type="text" placeholder="Supplier" value={orderForm.supplier} onChange={(e) => setOrderForm(prev => ({ ...prev, supplier: e.target.value }))} className="p-2 border rounded" />
              <select value={orderForm.urgency} onChange={(e) => setOrderForm(prev => ({ ...prev, urgency: e.target.value }))} className="p-2 border rounded">
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
              </select>
              <textarea placeholder="Catatan..." value={orderForm.notes} onChange={(e) => setOrderForm(prev => ({ ...prev, notes: e.target.value }))} className="p-2 border rounded col-span-2" rows="2" />
            </div>
            <div className="flex gap-2">
              <button onClick={createOrder} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Buat Order</button>
              <button onClick={() => setShowOrderForm(false)} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">Batal</button>
            </div>
          </div>
        )}

        <div className="mb-4 flex gap-2 border-b">
          <button onClick={() => setActiveTab('inventory')} className={`px-4 py-2 ${activeTab === 'inventory' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}>
            Inventori
          </button>
          <button onClick={() => setActiveTab('orders')} className={`px-4 py-2 ${activeTab === 'orders' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}>
            Order
          </button>
        </div>

        {activeTab === 'inventory' && (
          <div className="space-y-2">
            {supplies.map(supply => {
              const isLowStock = parseInt(supply.stock) <= parseInt(supply.minStock);
              return (
                <div key={supply.id} className={`p-3 bg-white border rounded-lg ${isLowStock ? 'border-l-4 border-l-yellow-500' : ''}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-medium">{supply.name}</h5>
                      <p className="text-sm text-gray-600">{supply.category}</p>
                      <div className="text-xs text-gray-500 mt-1">
                        <div>Stok: {supply.stock} {supply.unit}</div>
                        <div>Min. Stok: {supply.minStock} {supply.unit}</div>
                        {supply.supplier && <div>Supplier: {supply.supplier}</div>}
                      </div>
                    </div>
                    {isLowStock && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs flex items-center gap-1">
                        <TrendingDown size={12} />
                        Stok Rendah
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
            {supplies.length === 0 && (
              <div className="text-center py-8 text-gray-500">Belum ada data barang</div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-2">
            {orders.map(order => (
              <div key={order.id} className="p-3 bg-white border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm whitespace-pre-wrap">{order.items}</p>
                    <div className="text-xs text-gray-500 mt-2">
                      <div>Supplier: {order.supplier}</div>
                      <div>Tanggal: {new Date(order.orderDate).toLocaleDateString('id-ID')}</div>
                      {order.notes && <div>Catatan: {order.notes}</div>}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className={`px-2 py-1 rounded text-xs ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {order.status}
                    </span>
                    {order.urgency === 'urgent' && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">Urgent</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <div className="text-center py-8 text-gray-500">Belum ada order</div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default LogisticsManagement;
