# Technical Implementation - Sistem 3 Komponen

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         PUSKESAU                            │
│                  (Supervision Dashboard)                    │
│                                                             │
│  ┌──────────────────────┐  ┌──────────────────────────┐   │
│  │   Monitor RSAU       │  │   Monitor FKTP           │   │
│  │   - 3 Hospitals      │  │   - 15 Clinics           │   │
│  │   - Access SIMRS     │  │   - Access SIM Klinik    │   │
│  └──────────────────────┘  └──────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
           │                              │
           ▼                              ▼
┌──────────────────────┐      ┌──────────────────────┐
│       RSAU           │      │       FKTP           │
│   (SIMRS Full)       │      │   (SIM Klinik)       │
│                      │      │                      │
│ • 21 Modules         │      │ • 13 Modules         │
│ • Complete Hospital  │      │ • Basic Clinic       │
│ • IGD, Surgery, ICU  │      │ • Poli, Pharmacy     │
│ • CSSD, Blood Bank   │      │ • Simple Lab         │
└──────────────────────┘      └──────────────────────┘
```

## 📁 File Structure

```
src/
├── contexts/
│   └── AuthContext.js              ✅ Updated - 3 roles support
├── components/
│   ├── common/
│   │   └── Layout.js               ✅ Updated - Dynamic menu per role
│   └── dashboard/
│       ├── DashboardPuskesau.js    ✅ New - Supervision dashboard
│       ├── DashboardFaskes.js      ✅ Updated - RSAU/FKTP support
│       └── DashboardPusat.js       ⚠️ Deprecated - Use DashboardPuskesau
├── pages/
│   └── HomePage.js                 ✅ Updated - 3 dashboard routing
└── mockDb.js                       ✅ Updated - Full RSAU & FKTP data
```

## 🔄 State Management

### AuthContext State

```javascript
// Initial State
{
  userRole: 'PUSKESAU',           // 'PUSKESAU' | 'RSAU' | 'FKTP'
  selectedFaskes: null,            // string | null
  facilityType: null,              // 'rsau' | 'fktp' | null
  currentUser: {...},
  loading: false
}

// Helper Functions
switchToRSAU(faskesName)    // Switch to RSAU mode
switchToFKTP(faskesName)    // Switch to FKTP mode
switchToPuskesau()          // Back to supervision mode
```

### Role Transitions

```javascript
// From Puskesau to RSAU
switchToRSAU('RSAU dr. Esnawan Antariksa')
// Result: userRole='RSAU', selectedFaskes='RSAU dr. Esnawan Antariksa', facilityType='rsau'

// From Puskesau to FKTP
switchToFKTP('Klinik Kesehatan Lanud Halim')
// Result: userRole='FKTP', selectedFaskes='Klinik Kesehatan Lanud Halim', facilityType='fktp'

// Back to Puskesau
switchToPuskesau()
// Result: userRole='PUSKESAU', selectedFaskes=null, facilityType=null
```

## 🎨 Component Implementation

### 1. DashboardPuskesau.js

**Purpose**: Supervision and monitoring dashboard for Puskesau

**Key Features**:
- Display all RSAU and FKTP facilities
- Statistics cards (total facilities, patients, capacity)
- Access buttons to switch to SIMRS or SIM Klinik
- Facility information cards with details

**State**:
```javascript
const [rsauList, setRsauList] = useState([])
const [fktpList, setFktpList] = useState([])
const [stats, setStats] = useState({
  totalRSAU: 0,
  totalFKTP: 0,
  totalPatients: 0,
  totalCapacity: 0
})
```

**Data Loading**:
```javascript
useEffect(() => {
  const loadData = async () => {
    const faskesSnapshot = await getDocs(collection(db, 'faskes'))
    const rsau = allFaskes.filter(f => f.tipe === 'rsau')
    const fktp = allFaskes.filter(f => f.tipe === 'fktp')
    setRsauList(rsau)
    setFktpList(fktp)
  }
  loadData()
}, [])
```

**User Actions**:
```javascript
const handleAccessRSAU = (rsau) => {
  switchToRSAU(rsau.nama)  // Switch role to RSAU
}

const handleAccessFKTP = (fktp) => {
  switchToFKTP(fktp.nama)  // Switch role to FKTP
}
```

### 2. Layout.js - Dynamic Menu System

**Menu Configuration**:
```javascript
// Puskesau Menu - Minimal (3 items)
const puskesauMenuItems = [
  { icon: Home, label: 'Dashboard Pengawasan', path: '/' },
  { icon: BarChart3, label: 'Laporan Konsolidasi', path: '/reports' },
  { icon: Settings, label: 'Pengaturan', path: '/settings' }
]

// RSAU Menu - Full SIMRS (21 items)
const rsauMenuItems = [
  { icon: Home, label: 'Dashboard', path: '/' },
  { icon: Users, label: 'Database Pasien', path: '/patients' },
  { icon: ClipboardList, label: 'Pendaftaran & Antrean', path: '/registration' },
  // ... 18 more items
]

// FKTP Menu - Clinic (13 items)
const fktpMenuItems = [
  { icon: Home, label: 'Dashboard', path: '/' },
  { icon: Users, label: 'Database Pasien', path: '/patients' },
  { icon: ClipboardList, label: 'Pendaftaran & Antrean', path: '/registration' },
  // ... 10 more items
]
```

**Dynamic Menu Rendering**:
```javascript
const getMenuItems = () => {
  switch (userRole) {
    case 'PUSKESAU': return puskesauMenuItems
    case 'RSAU': return rsauMenuItems
    case 'FKTP': return fktpMenuItems
    default: return puskesauMenuItems
  }
}

const menuItems = getMenuItems()
```

**Back to Puskesau Button**:
```javascript
{userRole !== 'PUSKESAU' && (
  <button onClick={() => {
    switchToPuskesau()
    navigate('/')
  }}>
    <Shield size={16} />
    Kembali ke Puskesau
  </button>
)}
```

### 3. DashboardFaskes.js - RSAU/FKTP Dashboard

**Role-based Quick Access**:
```javascript
const rsauQuickAccess = [
  { icon: FileText, label: 'Pendaftaran', path: '/registration' },
  { icon: Activity, label: 'IGD', path: '/igd' },
  { icon: BedDouble, label: 'Rawat Inap', path: '/inpatient' },
  { icon: Calendar, label: 'Jadwal Operasi', path: '/surgery' },
  { icon: Droplet, label: 'Bank Darah', path: '/bloodbank' },
  { icon: Pill, label: 'Farmasi', path: '/pharmacy' },
  { icon: TestTube, label: 'Laboratorium', path: '/lab' },
  { icon: Activity, label: 'CSSD', path: '/cssd' }
]

const fktpQuickAccess = [
  { icon: FileText, label: 'Pendaftaran', path: '/registration' },
  { icon: Users, label: 'Database Pasien', path: '/patients' },
  { icon: Pill, label: 'Farmasi', path: '/pharmacy' },
  { icon: TestTube, label: 'Laboratorium', path: '/lab' }
]

const quickAccess = userRole === 'RSAU' ? rsauQuickAccess : fktpQuickAccess
```

### 4. HomePage.js - Dashboard Router

```javascript
const HomePage = () => {
  const { userRole } = useAuth()

  const renderDashboard = () => {
    switch (userRole) {
      case 'PUSKESAU':
        return <DashboardPuskesau />
      case 'RSAU':
      case 'FKTP':
        return <DashboardFaskes />
      default:
        return <DashboardPuskesau />
    }
  }

  return <div>{renderDashboard()}</div>
}
```

## 💾 Database Schema (mockDb)

### Faskes Collection

```javascript
// RSAU Document
{
  id: 'rsau_1',
  nama: 'RSAU dr. Esnawan Antariksa',
  lokasi: 'Jakarta Timur',
  alamat: 'Jl. Halim Perdanakusuma, Jakarta Timur 13610',
  tipe: 'rsau',
  tingkat: 'A',                    // Only for RSAU
  kapasitas: 250,
  status: 'aktif',
  lanud: 'Lanud Halim Perdanakusuma',
  fasilitasUtama: [                // Array of main facilities
    'IGD 24 Jam',
    'Rawat Inap',
    'ICU',
    'Operasi',
    'Hemodialisa',
    'CSSD',
    'Laboratorium',
    'Radiologi'
  ],
  spesialisasi: [                  // Only for RSAU
    'Penyakit Dalam',
    'Bedah',
    'Anak',
    'Kebidanan',
    'THT',
    'Mata',
    'Kulit',
    'Jiwa',
    'Jantung',
    'Paru'
  ]
}

// FKTP Document
{
  id: 'fktp_1',
  nama: 'Klinik Kesehatan Lanud Halim Perdanakusuma',
  lokasi: 'Jakarta Timur',
  alamat: 'Lanud Halim Perdanakusuma, Jakarta Timur',
  tipe: 'fktp',
  kapasitas: 50,
  status: 'aktif',
  lanud: 'Lanud Halim Perdanakusuma',
  fasilitasUtama: [
    'Poli Umum',
    'Poli Gigi',
    'Apotek',
    'Laboratorium Sederhana'
  ]
}
```

### Data Initialization

```javascript
// mockDb.js - initializeData()
const rsauData = [
  { id: 'rsau_1', nama: 'RSAU dr. Esnawan Antariksa', ... },
  { id: 'rsau_2', nama: 'RSAU dr. M. Salamun', ... },
  { id: 'rsau_3', nama: 'RSAU dr. Siswondo Parman', ... }
]

const fktpData = [
  { id: 'fktp_1', nama: 'Klinik Kesehatan Lanud Halim...', ... },
  { id: 'fktp_2', nama: 'Klinik Kesehatan Lanud Sulaiman', ... },
  // ... 13 more
]

const allFaskes = [...rsauData, ...fktpData]
this.saveCollection('faskes', allFaskes)
```

## 🔍 Query Examples

### Load All RSAU
```javascript
const faskesSnapshot = await getDocs(collection(db, 'faskes'))
const rsauList = []
faskesSnapshot.forEach(doc => {
  const data = doc.data()
  if (data.tipe === 'rsau') {
    rsauList.push(data)
  }
})
```

### Load All FKTP
```javascript
const faskesSnapshot = await getDocs(collection(db, 'faskes'))
const fktpList = []
faskesSnapshot.forEach(doc => {
  const data = doc.data()
  if (data.tipe === 'fktp') {
    fktpList.push(data)
  }
})
```

### Load Specific Facility
```javascript
const faskesSnapshot = await getDocs(collection(db, 'faskes'))
let facility = null
faskesSnapshot.forEach(doc => {
  const data = doc.data()
  if (data.nama === selectedFaskes) {
    facility = data
  }
})
```

## 🎯 Routing & Navigation

### URL Structure
- `/` - Homepage (renders appropriate dashboard based on role)
- `/patients` - Patients database (available in RSAU & FKTP)
- `/registration` - Registration (available in RSAU & FKTP)
- `/igd` - Emergency (RSAU only)
- `/surgery` - Surgery (RSAU only)
- etc.

### Navigation Flow
```
User starts at Puskesau Dashboard
    ↓
Clicks "Akses SIMRS" on RSAU card
    ↓
switchToRSAU() called
    ↓
Role changes to 'RSAU'
    ↓
HomePage re-renders with DashboardFaskes
    ↓
Layout sidebar shows RSAU menu (21 items)
    ↓
User can navigate all RSAU modules
    ↓
Clicks "Kembali ke Puskesau"
    ↓
switchToPuskesau() called
    ↓
Role changes to 'PUSKESAU'
    ↓
HomePage re-renders with DashboardPuskesau
```

## 🧪 Testing Checklist

### Manual Testing
- [ ] Initial load shows Puskesau dashboard
- [ ] All 3 RSAU cards displayed with correct info
- [ ] All 15 FKTP cards displayed with correct info
- [ ] Statistics cards show correct totals
- [ ] "Akses SIMRS" button works for each RSAU
- [ ] "Akses SIM Klinik" button works for each FKTP
- [ ] RSAU mode shows 21 menu items
- [ ] FKTP mode shows 13 menu items
- [ ] "Kembali ke Puskesau" button visible in RSAU/FKTP
- [ ] "Kembali ke Puskesau" button returns to supervision
- [ ] Header title changes based on role
- [ ] Sidebar title changes based on role

### Data Validation
- [ ] 3 RSAU facilities in database
- [ ] 15 FKTP facilities in database
- [ ] Each RSAU has tingkat field
- [ ] Each RSAU has spesialisasi array
- [ ] Each facility has lanud field
- [ ] Each facility has fasilitasUtama array
- [ ] All facilities have status 'aktif'

## 🚀 Deployment Considerations

### Environment Variables
No additional environment variables needed for 3-component system.
Optional: `REACT_APP_OPENAI_API_KEY` for AI features.

### localStorage Keys
```javascript
'mockdb_faskes'        // All facilities (RSAU + FKTP)
'mockdb_patients'      // Patient records
'mockdb_registrations' // Registration queue
// ... other collections
```

### Data Persistence
- All data stored in browser localStorage
- Data cleared when browser cache cleared
- No backend synchronization
- Suitable for demo/testing only

## 📊 Performance Metrics

### Load Times (estimated)
- Dashboard Puskesau: < 500ms
- Dashboard RSAU: < 300ms
- Dashboard FKTP: < 200ms
- Facility list: < 100ms (18 items from localStorage)

### Bundle Size Impact
- DashboardPuskesau.js: ~7KB
- Updated Layout.js: ~5KB
- Updated AuthContext.js: ~1KB
- mockDb.js: ~15KB (with all facility data)
- **Total Addition**: ~28KB

## 🔒 Security Notes

### Role-Based Access
Currently implemented on frontend only. For production:
- Implement backend role validation
- Add JWT token with role claims
- Validate access on every API call
- Implement audit logging

### Data Isolation
For production, implement:
- Facility-specific data queries
- Multi-tenancy support
- Data encryption at rest
- Secure data transmission (HTTPS)

## 🐛 Known Issues & Limitations

1. **No Backend Validation**: Roles are frontend-only
2. **No Real-time Sync**: Data not synced across devices
3. **localStorage Limit**: ~5-10MB browser limit
4. **No Offline Support**: Requires browser environment
5. **Mock Data Only**: Not connected to real TNI AU systems

## 🔮 Future Improvements

### Short Term
1. Add real-time monitoring dashboard for Puskesau
2. Implement facility performance metrics
3. Add comparative analytics between facilities
4. Create mobile-responsive layouts

### Medium Term
1. Backend API integration
2. Real database (Firebase/PostgreSQL)
3. User authentication system
4. Role-based permissions

### Long Term
1. Integration with BPJS
2. SATUSEHAT interoperability
3. AI-powered analytics
4. Mobile apps (iOS/Android)

## 📚 References

### Code Files
- `src/contexts/AuthContext.js`
- `src/components/common/Layout.js`
- `src/components/dashboard/DashboardPuskesau.js`
- `src/components/dashboard/DashboardFaskes.js`
- `src/pages/HomePage.js`
- `src/mockDb.js`

### Documentation
- `SISTEM_3_KOMPONEN.md` - User documentation
- `TECHNICAL_IMPLEMENTATION.md` - This file
- `PROJECT_STRUCTURE.md` - Overall project structure
- `README.md` - Project overview

---

**Last Updated**: 2024
**Version**: 1.0.0
**Maintainer**: Development Team
