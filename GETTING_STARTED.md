# Getting Started - Platform Puskesau

Panduan lengkap untuk memulai menggunakan Platform Komando dan Kontrol Kesehatan Puskesau.

## 🚀 Quick Start (5 Menit)

### 1. Clone dan Install
```bash
git clone <repository-url>
cd puskesau-dashboard
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env
```

Edit `.env` dan isi dengan kredensial Anda (lihat setup detail di bawah).

### 3. Jalankan Development Server
```bash
npm start
```

Buka http://localhost:3000

## 📋 Prerequisites

Sebelum memulai, pastikan sudah terinstall:
- Node.js v18 atau lebih tinggi
- npm atau yarn
- Git
- Text editor (VSCode recommended)

## 🔧 Setup Firebase

### 1. Buat Firebase Project

1. Kunjungi [Firebase Console](https://console.firebase.google.com)
2. Klik "Add project" atau "Create a project"
3. Beri nama project: `puskesau-dashboard` (atau nama lain)
4. Google Analytics optional (bisa diaktifkan atau tidak)
5. Tunggu project dibuat

### 2. Aktifkan Firestore Database

1. Di sidebar, pilih **Firestore Database**
2. Klik "Create database"
3. Pilih location: `asia-southeast1 (Singapore)` untuk Indonesia
4. Start in **production mode** (aturan akan kita set nanti)
5. Tunggu database dibuat

### 3. Setup Authentication

1. Di sidebar, pilih **Authentication**
2. Klik "Get started"
3. Di tab "Sign-in method":
   - Klik "Email/Password"
   - Enable toggle "Email/Password"
   - Save
4. Di tab "Users", klik "Add user" untuk membuat user pertama

### 4. Aktifkan Storage

1. Di sidebar, pilih **Storage**
2. Klik "Get started"
3. Start in **production mode**
4. Pilih location yang sama dengan Firestore
5. Done

### 5. Dapatkan Firebase Config

1. Di Project Settings (⚙️ icon di sidebar)
2. Scroll ke bawah ke "Your apps"
3. Klik icon Web (`</>`)
4. Register app dengan nickname: "Puskesau Web"
5. Copy semua config values:
   ```javascript
   const firebaseConfig = {
     apiKey: "...",
     authDomain: "...",
     projectId: "...",
     storageBucket: "...",
     messagingSenderId: "...",
     appId: "..."
   };
   ```

### 6. Setup Firestore Rules

Di Firestore → Rules, paste ini:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Publish rules.

## 🤖 Setup OpenAI (Optional - untuk fitur AI)

1. Kunjungi [OpenAI Platform](https://platform.openai.com)
2. Sign up atau login
3. Navigate ke **API keys**
4. Klik "Create new secret key"
5. Copy key (simpan baik-baik, tidak bisa dilihat lagi)
6. Add credit di Billing jika perlu

## 🔐 Configure Environment Variables

Edit file `.env`:

```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=AIzaSyC...
REACT_APP_FIREBASE_AUTH_DOMAIN=puskesau-dashboard.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=puskesau-dashboard
REACT_APP_FIREBASE_STORAGE_BUCKET=puskesau-dashboard.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc123

# OpenAI (Optional - untuk fitur AI)
REACT_APP_OPENAI_API_KEY=sk-...
```

**⚠️ PENTING**: 
- Jangan commit file `.env` ke Git (sudah ada di .gitignore)
- Semua variable harus diawali `REACT_APP_`

## 🏃 Running the App

### Development Mode
```bash
npm start
```
- Runs on http://localhost:3000
- Hot reload enabled
- Console shows errors/warnings

### Production Build
```bash
npm run build
```
- Creates optimized build in `build/` folder
- Ready for deployment

### Test Production Build Locally
```bash
npm run build
npx serve -s build
```

## 🎯 First Use

### 1. Login / Create Account

Saat pertama kali, gunakan user yang dibuat di Firebase Authentication atau buat akun baru melalui form register (jika fitur register sudah diaktifkan).

### 2. Switch Role

Di header, ada dropdown untuk switch antara:
- **Pusat (Puskesau)**: Dashboard monitoring seluruh Faskes
- **Faskes (RSAU/Klinik)**: Dashboard operasional harian

### 3. Explore Modules

Gunakan sidebar untuk navigasi:
- ✅ Dashboard - Statistik dan overview
- ✅ Database Pasien - Cari dan lihat data pasien
- ✅ Pendaftaran & Antrean - Daftar pasien baru, monitor antrean
- ✅ Rekam Medis - Input SOAP dengan AI assistant
- ✅ IGD - Triage digital dengan kategori warna
- 🚧 Module lainnya - Coming soon

## 💾 Initialize Sample Data (Optional)

Untuk testing, bisa load sample data:

1. Buka browser console di aplikasi
2. Paste dan run:
```javascript
import('./utils/sampleData').then(m => m.initializeSampleData());
```

Atau tambahkan button di UI untuk trigger ini.

## 🎨 Customize Branding

Aplikasi mendukung whitelabel. Untuk customize:

1. Buka halaman **Settings** di sidebar
2. Upload logo baru
3. Ubah primary & secondary color
4. Changes akan apply real-time

(Fitur ini masih placeholder, implementasi akan ditambahkan)

## 📱 Test di Device Lain

### Akses dari HP/Tablet di jaringan yang sama:

1. Cari IP lokal komputer Anda:
   ```bash
   # Windows
   ipconfig
   
   # Mac/Linux
   ifconfig
   ```

2. Akses dari device lain: `http://<your-ip>:3000`

3. Responsive design akan menyesuaikan

## 🐛 Troubleshooting

### Build Error: "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Firebase "Permission denied"
- Check Firestore rules
- Make sure user is authenticated
- Check if collection name correct

### OpenAI "Invalid API key"
- Verify key di .env
- Make sure key starts with `sk-`
- Check if key sudah expired
- Restart dev server setelah ubah .env

### Tailwind Classes Not Working
- Check `tailwind.config.js` exists
- Check `postcss.config.js` correct
- Rebuild: `npm run build`

### Page Not Found on Netlify
- Make sure `netlify.toml` exists
- Check redirects configuration

### Real-time Updates Not Working
- Check internet connection
- Check Firebase quota not exceeded
- Check browser console for errors
- Verify Firestore rules allow read

## 📚 Learn More

### Documentation
- [README.md](./README.md) - Overview dan fitur
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deploy to Netlify
- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - Arsitektur detail

### External Resources
- [React Documentation](https://react.dev)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Router](https://reactrouter.com)

## 🤝 Getting Help

### Debugging Steps
1. Check browser console for errors
2. Check Firebase Console for quota/errors
3. Check Network tab for failed requests
4. Try in incognito mode
5. Clear cache and reload

### Common Questions

**Q: Kenapa fitur AI tidak berfungsi?**
A: Pastikan REACT_APP_OPENAI_API_KEY sudah di-set dan API key valid dengan credit tersedia.

**Q: Data tidak muncul?**
A: Check Firestore rules dan pastikan sudah authenticated.

**Q: Role switch tidak bekerja?**
A: Ini hanya mengubah tampilan dashboard, bukan permission. Implementasi permission di Firestore rules.

**Q: Bagaimana cara add user baru?**
A: Buat di Firebase Console → Authentication → Users, atau implement register page.

## ✅ Next Steps

Setelah setup selesai:

1. ✅ Test semua modul yang sudah ada
2. ✅ Input data pasien sample
3. ✅ Test pendaftaran dan antrean
4. ✅ Test rekam medis dengan AI
5. ✅ Test IGD triage
6. 🚀 Deploy ke Netlify (lihat DEPLOYMENT.md)
7. 🔒 Setup proper Firestore security rules
8. 👥 Add team members
9. 📊 Monitor usage di Firebase Console
10. 🚧 Implement module yang masih placeholder

## 🎉 You're Ready!

Aplikasi siap digunakan! Mulai dengan mendaftar pasien pertama dan explore fitur-fitur yang tersedia.

Untuk pertanyaan atau bantuan lebih lanjut, refer to dokumentasi atau contact tim development.

**Happy Coding! 🚀**
