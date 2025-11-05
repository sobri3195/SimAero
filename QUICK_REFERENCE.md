# Quick Reference - Platform Puskesau

## 🚀 Quick Commands

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Test production build locally
npx serve -s build

# Deploy to Netlify (manual)
netlify deploy --prod
```

## 📂 Key Files

| File | Purpose |
|------|---------|
| `src/App.js` | Main app & routing |
| `src/firebase.js` | Firebase config |
| `src/contexts/AuthContext.js` | Authentication & role |
| `src/contexts/AppContext.js` | Theme & notifications |
| `src/services/aiService.js` | OpenAI integration |
| `src/components/common/Layout.js` | Main layout |
| `.env` | Environment variables |
| `netlify.toml` | Netlify config |

## 🔑 Environment Variables

```env
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=
REACT_APP_OPENAI_API_KEY=
```

## 🎯 Main Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | HomePage | Dashboard (role-based) |
| `/patients` | PatientsPage | Database pasien |
| `/registration` | RegistrationPage | Pendaftaran & antrean |
| `/ehr` | EHRPage | Rekam medis SOAP |
| `/igd` | IGDPage | IGD triase |
| `/[module]` | PlaceholderPage | Module lainnya |

## 🗂️ Firestore Collections

```
patients/
faskes/
registrations/
medical_records/
igd_patients/
inpatient_beds/
surgeries/
blood_inventory/
pharmacy_inventory/
prescriptions/
lab_orders/
radiology_orders/
staff/
schedules/
assets/
logistics/
incidents/
```

## 🤖 AI Functions

```javascript
// Auto-fill SOAP form
aiService.generateSOAPForm(chiefComplaint)

// Suggest triage category
aiService.suggestTriage(complaint, vitals)

// Recommend hospital beds
aiService.recommendBeds(patientCondition, availableBeds)

// Check drug interactions
aiService.checkDrugInteractions(medications)

// Analyze radiology image
aiService.analyzeRadiologyImage(imageDescription)

// Generate shift schedule
aiService.generateSchedule(requirements, availableStaff)

// Natural language data analysis
aiService.analyzeHealthData(question, context)
```

## 🎨 Context Usage

```javascript
// Auth Context
import { useAuth } from './contexts/AuthContext';
const { currentUser, userRole, setUserRole, selectedFaskes } = useAuth();

// App Context
import { useApp } from './contexts/AppContext';
const { theme, setTheme, addNotification } = useApp();
```

## 📢 Notifications

```javascript
const { addNotification } = useApp();

addNotification({ 
  type: 'success', // or 'error', 'warning', 'info'
  message: 'Your message here' 
});
```

## 🔥 Real-time Data Pattern

```javascript
useEffect(() => {
  const q = query(
    collection(db, 'collection_name'),
    where('field', '==', value)
  );
  
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const data = [];
    snapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    setState(data);
  });
  
  return () => unsubscribe();
}, [dependencies]);
```

## 💾 Save to Firestore

```javascript
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase';

await addDoc(collection(db, 'collection_name'), {
  field1: value1,
  field2: value2,
  createdAt: new Date()
});
```

## 🎭 Role-based Rendering

```javascript
import { useAuth } from './contexts/AuthContext';

const { userRole } = useAuth();

{userRole === 'PUSAT' ? (
  <DashboardPusat />
) : (
  <DashboardFaskes />
)}
```

## 🎨 Tailwind Common Classes

```
// Layout
flex, grid, gap-4, space-y-4

// Sizing
w-full, h-screen, max-w-md

// Colors
bg-blue-500, text-white, border-gray-300

// Typography
text-sm, font-bold, text-center

// Spacing
p-4, m-2, px-6, py-3

// Rounded
rounded, rounded-lg, rounded-full

// Shadow
shadow, shadow-md, shadow-lg

// Hover
hover:bg-blue-600, hover:underline

// Responsive
md:grid-cols-2, lg:grid-cols-4
```

## 🧩 Component Import Patterns

```javascript
// Pages
import HomePage from './pages/HomePage';

// Components
import Card from './components/common/Card';
import StatCard from './components/common/StatCard';

// Contexts
import { useAuth } from './contexts/AuthContext';
import { useApp } from './contexts/AppContext';

// Services
import { aiService } from './services/aiService';

// Firebase
import { db } from './firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

// Icons
import { Home, Users, Activity } from 'lucide-react';
```

## 🐛 Common Fixes

```bash
# Module not found
rm -rf node_modules package-lock.json && npm install

# Clear build cache
rm -rf build && npm run build

# Fix permission denied
sudo chown -R $USER:$USER .

# Reset git
git checkout -- .
```

## 📊 Build Info

- **Build Size**: 240 KB (gzipped)
- **Build Time**: ~30 seconds
- **Dependencies**: 1431 packages
- **React Version**: 18
- **Node Version**: 18+

## 🔗 Important URLs

- Firebase Console: https://console.firebase.google.com
- OpenAI Platform: https://platform.openai.com
- Netlify Dashboard: https://app.netlify.com
- React Docs: https://react.dev
- Tailwind Docs: https://tailwindcss.com

## 📞 Troubleshooting Quick

| Issue | Solution |
|-------|----------|
| Build error | `rm -rf node_modules && npm install` |
| Firebase error | Check .env and Firestore rules |
| AI not working | Verify OpenAI API key |
| Real-time broken | Check internet & Firebase quota |
| Styles not working | Rebuild: `npm run build` |
| 404 on Netlify | Check netlify.toml redirects |

## ✅ Pre-deploy Checklist

- [ ] `.env` configured dengan credentials real
- [ ] Firebase project created dan configured
- [ ] Firestore Database aktif
- [ ] Firebase Authentication aktif
- [ ] Firestore rules di-setup
- [ ] OpenAI API key valid (jika pakai AI)
- [ ] `npm run build` sukses
- [ ] No console errors
- [ ] Test di local
- [ ] netlify.toml exists
- [ ] .gitignore proper

## 🎯 Module Status

✅ = Fully implemented
🚧 = Placeholder (ready for implementation)

- ✅ Dashboard (Pusat & Faskes)
- ✅ Database Pasien
- ✅ Pendaftaran & Antrean
- ✅ Rekam Medis (EHR) with AI
- ✅ IGD with AI
- 🚧 Rawat Inap
- 🚧 Jadwal Operasi
- 🚧 CSSD
- 🚧 Bank Darah
- 🚧 Rikkes
- 🚧 Farmasi with AI
- 🚧 Laboratorium
- 🚧 Radiologi with AI
- 🚧 SDM & Jadwal with AI
- 🚧 Aset & Kalibrasi
- 🚧 Logistik
- 🚧 Laporan Insiden
- 🚧 Reports & Analytics with AI
- 🚧 Bridging
- 🚧 Broadcast
- 🚧 Settings

## 📚 Documentation Files

1. **README.md** - Overview & features
2. **GETTING_STARTED.md** - Setup guide
3. **DEPLOYMENT.md** - Deploy guide
4. **PROJECT_STRUCTURE.md** - Architecture
5. **SUMMARY.md** - Implementation summary
6. **QUICK_REFERENCE.md** - This file

---

**Keep this file handy for quick reference!** 📌
