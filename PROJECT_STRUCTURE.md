# Struktur Proyek Platform Puskesau

## Arsitektur

```
puskesau-dashboard/
├── public/                      # Static files
│   ├── index.html              # HTML template
│   └── favicon.ico
├── src/
│   ├── components/             # React components
│   │   ├── common/            # Reusable components
│   │   │   ├── Layout.js      # Main layout with sidebar & header
│   │   │   ├── Card.js        # Card wrapper component
│   │   │   ├── StatCard.js    # Statistics card
│   │   │   ├── Button.js      # Styled button
│   │   │   └── Modal.js       # Modal dialog
│   │   ├── dashboard/         # Dashboard components
│   │   │   ├── DashboardPusat.js    # Central command dashboard
│   │   │   └── DashboardFaskes.js   # Facility dashboard
│   │   ├── registration/      # Patient registration
│   │   │   ├── RegistrationForm.js  # Registration form
│   │   │   └── QueueBoard.js        # Real-time queue
│   │   ├── ehr/              # Electronic Health Records
│   │   │   └── SOAPForm.js    # SOAP form with AI
│   │   ├── igd/              # Emergency Room
│   │   │   └── TriageBoard.js # Digital triage board
│   │   └── [other modules]/  # Placeholder for future modules
│   ├── contexts/              # React contexts
│   │   ├── AuthContext.js    # Authentication & user role
│   │   └── AppContext.js     # App state & theme
│   ├── pages/                # Page components
│   │   ├── HomePage.js       # Main dashboard
│   │   ├── PatientsPage.js   # Patient database
│   │   ├── RegistrationPage.js # Registration & queue
│   │   ├── EHRPage.js        # Medical records
│   │   ├── IGDPage.js        # Emergency room
│   │   └── PlaceholderPage.js # Template for future pages
│   ├── services/             # Service layer
│   │   └── aiService.js      # OpenAI API integration
│   ├── utils/                # Utility functions
│   │   └── sampleData.js     # Sample data initializer
│   ├── firebase.js           # Firebase configuration
│   ├── App.js               # Main app component
│   ├── App.css              # Global styles
│   ├── index.js             # Entry point
│   └── index.css            # Tailwind imports
├── .env.example             # Environment variables template
├── .gitignore              # Git ignore rules
├── netlify.toml            # Netlify configuration
├── package.json            # Dependencies
├── tailwind.config.js      # Tailwind CSS config
├── postcss.config.js       # PostCSS config
├── README.md               # Project documentation
├── DEPLOYMENT.md           # Deployment guide
└── PROJECT_STRUCTURE.md    # This file
```

## Komponen Utama

### 1. Layout & Navigation
- **Layout.js**: Main layout dengan sidebar yang collapsible, header dengan role switcher
- Sidebar menampilkan semua modul dengan icon
- Header menampilkan info user dan notifikasi

### 2. Dashboard
- **DashboardPusat**: Untuk role Pusat
  - Statistik agregat dari seluruh Faskes
  - Tabel status kesiapan RS
  - Chart analitik SDM dan logistik
  - Panel notifikasi dan peringatan
  
- **DashboardFaskes**: Untuk role Faskes
  - Statistik operasional lokal
  - Quick access buttons ke modul penting
  - Daftar tugas pending

### 3. Pendaftaran & Antrean
- Form pendaftaran dengan pencarian NIK
- Integrasi scan KTP (placeholder)
- Real-time queue board dengan status update
- Fitur panggil, layani, selesai

### 4. Rekam Medis (EHR)
- Form SOAP (Subjective, Objective, Assessment, Plan)
- AI Assistant untuk auto-fill berdasarkan keluhan
- Bisa fill per section atau full form
- Save ke Firestore

### 5. IGD
- Digital triage board dengan 4 kategori (Resusitasi, Darurat, Mendesak, Tidak Mendesak)
- Form tambah pasien dengan vital signs
- AI suggestion untuk triase
- Real-time updates
- Drag-and-drop ready (struktur sudah siap)

## Fitur AI Integration

Semua fitur AI menggunakan OpenAI GPT-4 API:

1. **EHR Auto-fill**: Generate SOAP form dari keluhan
2. **Triage Suggestion**: Rekomendasi kategori triase
3. **Bed Recommendation**: Saran tempat tidur rawat inap (ready)
4. **Drug Interaction**: Cek interaksi obat (ready)
5. **Radiology Analysis**: Analisis gambar radiologi (ready)
6. **Schedule Generation**: Generate jadwal shift (ready)
7. **Health Data Analyst**: Natural language query (ready)

## Firebase Collections

### Implemented
- `patients`: Data pasien
- `faskes`: Data fasilitas kesehatan
- `registrations`: Pendaftaran & antrean
- `medical_records`: Rekam medis SOAP
- `igd_patients`: Pasien IGD dengan triase

### Ready for Implementation
- `inpatient_beds`: Tempat tidur rawat inap
- `surgeries`: Jadwal operasi
- `blood_inventory`: Stok darah
- `pharmacy_inventory`: Inventaris farmasi
- `prescriptions`: Resep obat
- `lab_orders`: Order laboratorium
- `radiology_orders`: Order radiologi
- `staff`: Data pegawai
- `schedules`: Jadwal shift
- `assets`: Aset medis
- `logistics`: Order logistik
- `incidents`: Laporan insiden

## Real-time Features

Menggunakan Firestore `onSnapshot` untuk real-time updates:
- Queue board updates instantly
- IGD triage board updates instantly
- Dashboard statistics refresh automatically

## State Management

### AuthContext
- `currentUser`: User yang sedang login
- `userRole`: 'PUSAT' atau 'FASKES'
- `selectedFaskes`: Faskes yang dipilih
- `setUserRole`: Switch role

### AppContext
- `theme`: Primary & secondary colors, logo
- `setTheme`: Update theme (whitelabel)
- `notifications`: Array notifikasi
- `addNotification`: Tambah notifikasi toast

## Routing

Menggunakan React Router v6:
- `/` - Dashboard (role-based)
- `/patients` - Database pasien
- `/registration` - Pendaftaran & antrean
- `/ehr` - Rekam medis
- `/igd` - IGD
- `/[module]` - Placeholder pages untuk modul lainnya

## Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Responsive**: Mobile-first design
- **Theme**: Customizable colors via AppContext
- **Icons**: Lucide React
- **Charts**: Recharts

## Environment Variables

Required:
```
REACT_APP_FIREBASE_API_KEY
REACT_APP_FIREBASE_AUTH_DOMAIN
REACT_APP_FIREBASE_PROJECT_ID
REACT_APP_FIREBASE_STORAGE_BUCKET
REACT_APP_FIREBASE_MESSAGING_SENDER_ID
REACT_APP_FIREBASE_APP_ID
REACT_APP_OPENAI_API_KEY
```

## Development Workflow

1. **Local Development**:
   ```bash
   npm install
   npm start
   ```

2. **Build**:
   ```bash
   npm run build
   ```

3. **Deploy to Netlify**:
   - Push to GitHub
   - Auto-deploy via Netlify integration
   - Or manual: `netlify deploy --prod`

## Expansion Checklist

Untuk menambah modul baru:
1. [ ] Buat component di `src/components/{module}/`
2. [ ] Buat page di `src/pages/`
3. [ ] Tambah route di `src/App.js`
4. [ ] Tambah menu item di `src/components/common/Layout.js`
5. [ ] Buat Firestore collection jika perlu
6. [ ] Tambah AI service function jika perlu
7. [ ] Update documentation

## Status Modul

✅ **Completed**:
- Dashboard (Pusat & Faskes)
- Database Pasien
- Pendaftaran & Antrean
- Rekam Medis (EHR) dengan AI
- IGD dengan Triase AI

🚧 **Ready for Implementation** (struktur & API sudah siap):
- Rawat Inap
- Jadwal Operasi
- CSSD
- Bank Darah
- Rikkes
- Farmasi dengan AI
- Laboratorium
- Radiologi dengan AI
- SDM & Penjadwalan dengan AI
- Aset & Kalibrasi
- Logistik
- Laporan Insiden
- Laporan & Analitik dengan AI
- Bridging (BPJS, SATUSEHAT)
- Broadcast
- Settings & Whitelabel

## Best Practices

1. **Component Structure**: Setiap modul punya folder sendiri
2. **Reusable Components**: Gunakan components dari `common/`
3. **Context for State**: Gunakan Context untuk state global
4. **Real-time**: Gunakan `onSnapshot` untuk data yang perlu real-time
5. **Error Handling**: Selalu handle error dengan try-catch
6. **Notifications**: Gunakan `addNotification` untuk feedback user
7. **Loading States**: Tampilkan loading indicator saat fetch data
8. **Responsive**: Test di mobile, tablet, dan desktop

## Performance Tips

1. Use `React.memo` untuk component yang sering re-render
2. Use `useMemo` dan `useCallback` untuk optimasi
3. Lazy load pages dengan `React.lazy`
4. Optimize images
5. Enable Firestore persistence untuk offline support
6. Use pagination untuk list panjang
7. Debounce search inputs

## Security Considerations

1. Firestore rules harus di-setup dengan benar
2. Jangan expose API keys di code
3. Validate input di frontend dan backend
4. Use Firebase Authentication
5. Implement role-based access control
6. Audit logs untuk perubahan penting
7. Regular security updates
