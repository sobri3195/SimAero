# Panduan Deployment ke Netlify

## Setup Firebase

1. Buat Firebase Project:
   - Kunjungi https://console.firebase.google.com
   - Klik "Add project"
   - Beri nama project (contoh: puskesau-dashboard)
   - Ikuti wizard setup

2. Aktifkan Firestore:
   - Di Firebase Console, pilih "Firestore Database"
   - Klik "Create database"
   - Pilih mode "Start in production mode"
   - Pilih location terdekat (asia-southeast1 untuk Indonesia)

3. Aktifkan Authentication:
   - Di Firebase Console, pilih "Authentication"
   - Klik "Get started"
   - Aktifkan "Email/Password" provider

4. Aktifkan Storage:
   - Di Firebase Console, pilih "Storage"
   - Klik "Get started"
   - Gunakan default rules

5. Dapatkan Config Firebase:
   - Di Project Settings → General
   - Scroll ke bawah ke "Your apps"
   - Klik ikon Web (</>)
   - Copy config values

## Setup OpenAI API

1. Kunjungi https://platform.openai.com
2. Buat akun atau login
3. Navigate ke API Keys
4. Buat API key baru
5. Copy dan simpan dengan aman

## Deploy ke Netlify

### Option 1: Deploy dari GitHub (Recommended)

1. Push code ke GitHub:
```bash
git init
git add .
git commit -m "Initial commit: Puskesau Dashboard"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. Login ke Netlify:
   - Kunjungi https://app.netlify.com
   - Login dengan GitHub

3. Import Project:
   - Klik "New site from Git"
   - Pilih GitHub
   - Authorize Netlify
   - Pilih repository

4. Configure Build Settings:
   - Build command: `npm run build`
   - Publish directory: `build`
   - Klik "Show advanced" untuk environment variables

5. Tambahkan Environment Variables:
   Klik "New variable" dan tambahkan satu per satu:
   ```
   REACT_APP_FIREBASE_API_KEY = <your-firebase-api-key>
   REACT_APP_FIREBASE_AUTH_DOMAIN = <your-project-id>.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID = <your-project-id>
   REACT_APP_FIREBASE_STORAGE_BUCKET = <your-project-id>.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID = <your-sender-id>
   REACT_APP_FIREBASE_APP_ID = <your-app-id>
   REACT_APP_OPENAI_API_KEY = <your-openai-api-key>
   ```

6. Deploy:
   - Klik "Deploy site"
   - Tunggu build selesai
   - Site akan live di subdomain .netlify.app

### Option 2: Deploy Manual

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Login:
```bash
netlify login
```

3. Build project:
```bash
npm run build
```

4. Deploy:
```bash
netlify deploy --prod
```

5. Ikuti prompts untuk setup site baru

6. Setelah deploy, tambahkan environment variables di Netlify dashboard:
   - Site settings → Build & deploy → Environment
   - Tambahkan semua REACT_APP_* variables
   - Trigger new deploy untuk apply changes

## Custom Domain (Optional)

1. Di Netlify dashboard:
   - Site settings → Domain management
   - Klik "Add custom domain"
   - Masukkan domain (contoh: dashboard.puskesau.mil.id)
   - Ikuti instruksi DNS

2. Setup SSL:
   - Netlify otomatis provision SSL certificate
   - Tunggu beberapa menit hingga active

## Firestore Security Rules

Setelah deploy, setup security rules di Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their data
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // Specific rules for sensitive collections
    match /patients/{patientId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                     request.auth.token.role in ['admin', 'doctor', 'nurse'];
    }
  }
}
```

## Post-Deployment Checklist

- [ ] Semua environment variables sudah di-set
- [ ] Firebase Firestore sudah aktif dan accessible
- [ ] Firebase Authentication sudah aktif
- [ ] OpenAI API key valid dan memiliki credit
- [ ] Site bisa diakses dan loading dengan baik
- [ ] Login/Register berfungsi
- [ ] Data bisa disimpan ke Firestore
- [ ] Real-time updates berfungsi
- [ ] Fitur AI bisa diakses (kalau ada credit OpenAI)

## Monitoring & Maintenance

1. Netlify Analytics:
   - Monitor traffic dan performance
   - Settings → Analytics

2. Firebase Console:
   - Monitor database usage
   - Monitor authentication users
   - Check error logs

3. OpenAI Usage:
   - Monitor API usage di OpenAI dashboard
   - Set usage limits untuk kontrol biaya

## Troubleshooting

### Build Gagal
- Check build logs di Netlify
- Pastikan semua dependencies terinstall
- Pastikan tidak ada syntax error

### Environment Variables Tidak Terbaca
- Pastikan variable dimulai dengan `REACT_APP_`
- Trigger new deployment setelah add variables
- Hard reload browser (Ctrl+Shift+R)

### Firebase Connection Error
- Verify Firebase config di environment variables
- Check Firebase project status
- Verify Firestore rules allow access

### AI Features Tidak Bekerja
- Verify OpenAI API key valid
- Check API credit balance
- Monitor API rate limits

## Update Aplikasi

Untuk update aplikasi setelah perubahan code:

### Jika menggunakan GitHub integration:
```bash
git add .
git commit -m "Update: description"
git push
```
Netlify akan auto-deploy

### Jika deploy manual:
```bash
npm run build
netlify deploy --prod
```

## Support

Untuk masalah teknis:
- Check dokumentasi Firebase: https://firebase.google.com/docs
- Check dokumentasi Netlify: https://docs.netlify.com
- Check dokumentasi React: https://react.dev
