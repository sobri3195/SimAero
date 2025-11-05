# Getting Started - Platform Puskesau

Panduan lengkap untuk memulai menggunakan Platform Komando dan Kontrol Kesehatan Puskesau.

⚠️ **PERHATIAN**: Aplikasi ini adalah **DEMO TANPA BACKEND**. Semua data disimpan di browser menggunakan localStorage.

## 🚀 Quick Start (3 Menit)

### 1. Clone dan Install
```bash
git clone <repository-url>
cd puskesau-dashboard
npm install
```

### 2. (Opsional) Setup AI Features
```bash
cp .env.example .env
```

Edit `.env` jika ingin menggunakan fitur AI (optional):
```env
REACT_APP_OPENAI_API_KEY=your-openai-api-key
```

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

## 🤖 Setup OpenAI (Optional - untuk fitur AI)

1. Kunjungi [OpenAI Platform](https://platform.openai.com)
2. Sign up atau login
3. Navigate ke **API keys**
4. Klik "Create new secret key"
5. Copy key (simpan baik-baik, tidak bisa dilihat lagi)
6. Add credit di Billing jika perlu

## 🔐 Configure Environment Variables

Edit file `.env` (optional, hanya untuk AI features):

```env
# OpenAI (Optional - untuk fitur AI)
REACT_APP_OPENAI_API_KEY=sk-...
```

**⚠️ PENTING**: 
- Jangan commit file `.env` ke Git (sudah ada di .gitignore)
- Fitur AI bersifat optional, aplikasi tetap berjalan tanpa OpenAI API key

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

### 1. No Login Required

Aplikasi langsung bisa digunakan tanpa login. Mock user sudah tersedia:
- Email: user@puskesau.mil.id
- Name: Demo User

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

## 💾 Data Storage

### Sample Data

Aplikasi sudah dilengkapi dengan sample data yang otomatis ter-load:
- 3 Faskes (RSAU Jakarta, Bandung, dan Klinik Halim)
- 3 Pasien sample

### Reset Data

Untuk reset semua data ke default:
1. Buka browser console (F12)
2. Run: `localStorage.clear()`
3. Refresh halaman

### Data Persistence

- Data disimpan di browser localStorage
- Bersifat lokal per browser/device
- Tidak hilang saat refresh
- Hilang jika browser cache dibersihkan

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

**Note**: Data di device berbeda akan terpisah karena menggunakan localStorage.

## 🐛 Troubleshooting

### Build Error: "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

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

### Data Tidak Muncul
- Check browser console for errors
- Try reset data dengan `localStorage.clear()`
- Refresh halaman

## 📚 Learn More

### Documentation
- [README.md](./README.md) - Overview dan fitur
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deploy to Netlify
- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - Arsitektur detail

### External Resources
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Router](https://reactrouter.com)
- [Recharts](https://recharts.org)

## 🤝 Getting Help

### Debugging Steps
1. Check browser console for errors
2. Check Network tab for failed requests
3. Try in incognito mode
4. Clear localStorage and reload
5. Check if sample data loaded

### Common Questions

**Q: Kenapa fitur AI tidak berfungsi?**
A: Pastikan REACT_APP_OPENAI_API_KEY sudah di-set dan API key valid dengan credit tersedia.

**Q: Data tidak muncul?**
A: Check browser console dan coba reset data dengan `localStorage.clear()`.

**Q: Role switch tidak bekerja?**
A: Ini hanya mengubah tampilan dashboard. Switch role di header untuk melihat dashboard yang berbeda.

**Q: Data hilang setelah refresh?**
A: Data seharusnya persist di localStorage. Jika hilang, kemungkinan browser membersihkan cache.

**Q: Bagaimana cara berbagi data antar device?**
A: Tidak bisa, karena data disimpan lokal di browser. Untuk production dengan data sharing, butuh backend real.

## ✅ Next Steps

Setelah setup selesai:

1. ✅ Test semua modul yang sudah ada
2. ✅ Input data pasien sample
3. ✅ Test pendaftaran dan antrean
4. ✅ Test rekam medis dengan AI
5. ✅ Test IGD triage
6. 🚀 Deploy ke Netlify (lihat DEPLOYMENT.md)
7. 🚧 Implement module yang masih placeholder

## 🎉 You're Ready!

Aplikasi siap digunakan! Mulai dengan mendaftar pasien pertama dan explore fitur-fitur yang tersedia.

Untuk pertanyaan atau bantuan lebih lanjut, refer to dokumentasi atau contact tim development.

**Happy Coding! 🚀**
