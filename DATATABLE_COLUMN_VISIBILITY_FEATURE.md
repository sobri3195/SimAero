# DataTable Feature: Column Visibility Toggle

## 🎯 Fitur Baru

**Fitur:** Column Visibility Toggle  
**Tanggal:** 2024  
**Status:** ✅ Implemented

---

## 📝 Deskripsi

Fitur **Column Visibility Toggle** memungkinkan pengguna untuk menampilkan atau menyembunyikan kolom-kolom tertentu pada DataTable sesuai kebutuhan. Sangat berguna untuk tabel dengan banyak kolom, memungkinkan user untuk fokus pada data yang penting saja.

---

## ✨ Fitur Utama

### 1. Toggle Per Kolom
- ✅ Show/hide kolom secara individual
- ✅ Checkbox untuk setiap kolom
- ✅ Icon visual (Eye/EyeOff) untuk status kolom

### 2. Bulk Actions
- ✅ **Tampilkan Semua** - Show semua kolom sekaligus
- ✅ **Sembunyikan Semua** - Hide semua kolom sekaligus

### 3. UI/UX Features
- ✅ Dropdown menu dengan backdrop
- ✅ Counter kolom yang terlihat di button
- ✅ Smooth transitions dan hover effects
- ✅ Mobile responsive
- ✅ Scrollable menu untuk banyak kolom

---

## 🎨 Visual Design

### Button
```
┌─────────────────┐
│ [≡] Kolom (8)   │  ← Purple button dengan icon Columns
└─────────────────┘
```

### Dropdown Menu
```
┌───────────────────────────────┐
│  [≡] Pilih Kolom              │
│  ┌────────┐  ┌─────────────┐  │
│  │Tampilkan│  │Sembunyikan  │  │
│  │  Semua │  │   Semua     │  │
│  └────────┘  └─────────────┘  │
├───────────────────────────────┤
│  ☑ [👁] No. RM                │
│  ☑ [👁] Nama Pasien           │
│  ☐ [👁️] Tanggal Lahir         │
│  ☑ [👁] Jenis Kelamin         │
│  ☑ [👁] Alamat                │
│  ☑ [👁] No. Telepon           │
│  ☐ [👁️] Status                 │
│  ☑ [👁] Aksi                  │
└───────────────────────────────┘
```

---

## 💻 Penggunaan

### Basic Usage
```jsx
import DataTable from './components/common/DataTable';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Nama' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Telepon' },
  { key: 'address', label: 'Alamat' },
  { key: 'actions', label: 'Aksi', actions: true }
];

const data = [
  { id: 1, name: 'John Doe', email: 'john@example.com', ... },
  // ... more data
];

// Column visibility enabled by default
<DataTable
  columns={columns}
  data={data}
  title="Data Pasien"
  columnVisibility={true}  // Enable column visibility feature
/>
```

### Disable Column Visibility
```jsx
<DataTable
  columns={columns}
  data={data}
  columnVisibility={false}  // Disable column visibility feature
/>
```

---

## 🔧 Technical Details

### New Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columnVisibility` | boolean | `true` | Enable/disable column visibility feature |

### New State Variables
```javascript
const [showColumnMenu, setShowColumnMenu] = useState(false);
const [visibleColumns, setVisibleColumns] = useState({
  0: true,  // Column index 0 visible
  1: true,  // Column index 1 visible
  2: false, // Column index 2 hidden
  // ...
});
```

### New Functions
```javascript
// Toggle single column
toggleColumnVisibility(index)

// Show/hide all columns
toggleAllColumns(show: boolean)

// Get filtered columns
displayColumns = columns.filter((col, index) => visibleColumns[index])
```

### New Icons
- `Columns` - Main button icon
- `Eye` - Visible column indicator
- `EyeOff` - Hidden column indicator

---

## 📦 Dependencies

No new dependencies required. Uses existing Lucide React icons:
```javascript
import { Columns, Eye, EyeOff } from 'lucide-react';
```

---

## 🎯 Use Cases

### 1. Medical Records Table
```javascript
// Banyak kolom data pasien
const columns = [
  { key: 'rm', label: 'No. RM' },
  { key: 'name', label: 'Nama Lengkap' },
  { key: 'dob', label: 'Tanggal Lahir' },
  { key: 'gender', label: 'Jenis Kelamin' },
  { key: 'blood', label: 'Golongan Darah' },
  { key: 'address', label: 'Alamat Lengkap' },
  { key: 'phone', label: 'No. Telepon' },
  { key: 'emergency', label: 'Kontak Darurat' },
  { key: 'insurance', label: 'Asuransi' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Aksi', actions: true }
];

// User bisa hide kolom yang tidak perlu
// Contoh: Hide "Tanggal Lahir", "Alamat Lengkap", "Kontak Darurat"
// untuk fokus pada info penting saja
```

### 2. Hospital Financial Reports
```javascript
const columns = [
  { key: 'date', label: 'Tanggal' },
  { key: 'invoice', label: 'No. Invoice' },
  { key: 'patient', label: 'Pasien' },
  { key: 'service', label: 'Layanan' },
  { key: 'subtotal', label: 'Subtotal' },
  { key: 'discount', label: 'Diskon' },
  { key: 'tax', label: 'Pajak' },
  { key: 'insurance', label: 'Asuransi' },
  { key: 'total', label: 'Total' },
  { key: 'paid', label: 'Dibayar' },
  { key: 'outstanding', label: 'Sisa' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Aksi', actions: true }
];

// Untuk review cepat, hide detail columns
// Focus on: Date, Patient, Total, Status
```

### 3. Inventory Management
```javascript
const columns = [
  { key: 'code', label: 'Kode' },
  { key: 'name', label: 'Nama Item' },
  { key: 'category', label: 'Kategori' },
  { key: 'supplier', label: 'Supplier' },
  { key: 'stock', label: 'Stok' },
  { key: 'minStock', label: 'Min. Stok' },
  { key: 'maxStock', label: 'Max. Stok' },
  { key: 'unit', label: 'Satuan' },
  { key: 'price', label: 'Harga' },
  { key: 'location', label: 'Lokasi' },
  { key: 'expiry', label: 'Kadaluarsa' },
  { key: 'actions', label: 'Aksi', actions: true }
];

// Hide columns based on task:
// - Stock checking: Show code, name, stock, minStock
// - Price update: Show code, name, price, supplier
// - Expiry check: Show name, stock, expiry, location
```

---

## 🎨 Styling

### Colors
- **Button**: Purple (`bg-purple-100`, `hover:bg-purple-200`, `text-purple-700`)
- **Menu Header**: Gray (`bg-gray-50`)
- **Show All Button**: Green (`bg-green-100`, `hover:bg-green-200`)
- **Hide All Button**: Red (`bg-red-100`, `hover:bg-red-200`)
- **Checkboxes**: Blue (`text-blue-600`, `focus:ring-blue-500`)

### Responsive Design
```css
/* Desktop */
.hidden sm:inline  /* Show "Kolom" text on desktop */

/* Mobile */
/* Show only icon and counter on mobile */
```

---

## 📱 Mobile Behavior

1. **Button**: Shows icon + counter only on mobile
2. **Menu**: Full-width dropdown on mobile
3. **Backdrop**: Click outside to close
4. **Scrolling**: Menu scrollable if many columns

---

## ♿ Accessibility

- ✅ Keyboard navigation support (checkboxes)
- ✅ Focus indicators on checkboxes
- ✅ Clear labels for screen readers
- ✅ Clickable labels (entire row)
- ✅ Visual feedback (hover states)

---

## 🔄 State Persistence

**Current:** State resets on page reload  
**Future Enhancement:** Save to localStorage for persistence

```javascript
// Future: Persist column visibility
useEffect(() => {
  const saved = localStorage.getItem('datatable-columns-visibility');
  if (saved) {
    setVisibleColumns(JSON.parse(saved));
  }
}, []);

useEffect(() => {
  localStorage.setItem('datatable-columns-visibility', 
    JSON.stringify(visibleColumns));
}, [visibleColumns]);
```

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] Click "Kolom" button opens menu
- [ ] Click outside menu closes it
- [ ] Toggle individual columns works
- [ ] "Tampilkan Semua" shows all columns
- [ ] "Sembunyikan Semua" hides all columns
- [ ] Counter updates correctly
- [ ] Table updates when columns toggled
- [ ] Export respects visible columns only
- [ ] Search works with hidden columns
- [ ] Sort works with visible columns
- [ ] Pagination works correctly
- [ ] Mobile responsive menu
- [ ] No console errors

---

## 📊 Example Implementation

See these pages for implementation:
- `/patients` - Database Pasien (11 columns)
- `/medical-records` - Rekam Medis (10+ columns)
- `/pharmacy-warehouse` - Gudang Farmasi (12+ columns)
- `/accounting` - Akuntansi (13+ columns)
- `/general-warehouse` - Gudang Umum (11+ columns)

---

## 🚀 Benefits

### For Users
1. **Cleaner View** - Focus on relevant data only
2. **Better Performance** - Less DOM elements to render
3. **Customizable** - Adapt table to current task
4. **Mobile Friendly** - Show fewer columns on small screens
5. **Print Optimization** - Hide unnecessary columns before printing

### For Developers
1. **Easy Integration** - Just add prop `columnVisibility={true}`
2. **No Breaking Changes** - Backward compatible
3. **Consistent API** - Same DataTable component
4. **Maintainable** - Self-contained feature

---

## 🔮 Future Enhancements

### Planned
1. ⏳ **Column Presets** - Save/load column visibility configurations
2. ⏳ **Column Reordering** - Drag & drop to reorder columns
3. ⏳ **Column Freezing** - Pin important columns to left/right
4. ⏳ **Column Resizing** - Drag to adjust column width
5. ⏳ **State Persistence** - Remember user preferences in localStorage
6. ⏳ **Export with Visibility** - Export only visible columns

### Ideas
- Column grouping (collapse/expand groups)
- Column filtering (search within columns)
- Column summaries (show totals/averages at bottom)
- Custom column templates

---

## 📝 Code Changes Summary

### Modified File
**File:** `src/components/common/DataTable.js`

**Changes:**
1. Added new icons: `Columns`, `Eye`, `EyeOff`
2. Added new prop: `columnVisibility`
3. Added new state: `showColumnMenu`, `visibleColumns`
4. Added new functions: `toggleColumnVisibility`, `toggleAllColumns`
5. Added new computed value: `displayColumns`, `visibleCount`
6. Added new UI: Column visibility dropdown menu
7. Updated table rendering to use `displayColumns`

**Lines Added:** ~150 lines  
**Lines Modified:** ~10 lines  
**Breaking Changes:** None

---

## ✅ Status

**Status:** ✅ Implemented and Ready  
**Version:** 1.0.0  
**Date:** January 2024  
**Build:** ✅ Success  
**Tests:** ⏳ Manual testing required

---

## 🙋 Support

Untuk pertanyaan atau issues terkait fitur ini:
1. Check dokumentasi ini terlebih dahulu
2. Test di development environment
3. Report bugs dengan detail lengkap
4. Suggest enhancements dengan use case yang jelas

---

**Feature by:** AI Development Team  
**Integrated with:** Healthcare TNI AU System  
**Compatible with:** All existing DataTable implementations
