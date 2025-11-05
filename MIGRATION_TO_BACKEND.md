# Migration Guide: Adding Real Backend

Panduan untuk mengintegrasikan backend real jika diperlukan di masa depan.

## Current State

Aplikasi saat ini menggunakan **localStorage** (mock database) tanpa backend. Semua data bersifat lokal dan tidak persistent.

## Options untuk Backend

### Option 1: Firebase (Kembali ke Firebase)

#### Pros:
- Real-time updates built-in
- Easy authentication
- Managed hosting
- Free tier generous

#### Cons:
- Vendor lock-in
- Can be expensive at scale
- Less control over data

#### Steps:
1. Install Firebase:
```bash
npm install firebase
```

2. Restore `src/firebase.js`:
```javascript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
```

3. Replace all `mockDb` imports with Firebase imports
4. Update AuthContext to use Firebase Auth
5. Add environment variables

### Option 2: REST API Backend

#### Pros:
- Full control over data and logic
- Can use any database (PostgreSQL, MySQL, MongoDB)
- Better for complex business logic
- Easier to scale horizontally

#### Cons:
- Need to build and maintain backend
- Need to implement authentication
- Need to handle real-time updates manually

#### Steps:
1. Create API service layer:

**`src/services/api.js`:**
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const api = {
  async getCollection(collectionName) {
    const response = await fetch(`${API_URL}/${collectionName}`);
    return response.json();
  },

  async addDoc(collectionName, data) {
    const response = await fetch(`${API_URL}/${collectionName}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  async updateDoc(collectionName, id, data) {
    const response = await fetch(`${API_URL}/${collectionName}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  async deleteDoc(collectionName, id) {
    await fetch(`${API_URL}/${collectionName}/${id}`, {
      method: 'DELETE'
    });
  },

  async query(collectionName, filters) {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_URL}/${collectionName}?${params}`);
    return response.json();
  }
};
```

2. Replace `mockDb` with `api` calls in all components

3. Implement polling or WebSocket for real-time updates:
```javascript
useEffect(() => {
  const interval = setInterval(async () => {
    const data = await api.getCollection('patients');
    setPatients(data);
  }, 5000); // Poll every 5 seconds
  
  return () => clearInterval(interval);
}, []);
```

4. Implement authentication:
```javascript
export const auth = {
  async login(email, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const { token } = await response.json();
    localStorage.setItem('token', token);
    return token;
  },

  async getCurrentUser() {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  logout() {
    localStorage.removeItem('token');
  }
};
```

### Option 3: Supabase

#### Pros:
- Open source alternative to Firebase
- PostgreSQL database (more powerful than Firestore)
- Real-time subscriptions
- Built-in authentication
- Good free tier

#### Cons:
- Smaller ecosystem than Firebase
- Less mature

#### Steps:
1. Install Supabase:
```bash
npm install @supabase/supabase-js
```

2. Create Supabase client:
```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

3. Replace mockDb calls with Supabase calls

## Migration Checklist

### Phase 1: Preparation
- [ ] Choose backend option
- [ ] Setup backend service (if needed)
- [ ] Create database schema
- [ ] Setup authentication

### Phase 2: API Layer
- [ ] Create API service layer
- [ ] Test basic CRUD operations
- [ ] Implement error handling
- [ ] Add loading states

### Phase 3: Replace Mock DB
- [ ] Update imports in all components
- [ ] Replace localStorage calls
- [ ] Test each module
- [ ] Fix any breaking changes

### Phase 4: Real-time Updates
- [ ] Implement real-time subscriptions
- [ ] Test concurrent updates
- [ ] Handle conflicts

### Phase 5: Authentication
- [ ] Update AuthContext
- [ ] Implement login/logout
- [ ] Add protected routes
- [ ] Test authorization

### Phase 6: Testing & Deployment
- [ ] Test all features
- [ ] Performance testing
- [ ] Security audit
- [ ] Deploy backend
- [ ] Deploy frontend
- [ ] Monitor and fix issues

## Code Examples

### Converting a Component

**Before (with mockDb):**
```javascript
import { collection, getDocs } from '../mockDb';
import { db } from '../mockDb';

const loadPatients = async () => {
  const querySnapshot = await getDocs(collection(db, 'patients'));
  const patientList = [];
  querySnapshot.forEach((doc) => {
    patientList.push({ id: doc.id, ...doc.data() });
  });
  setPatients(patientList);
};
```

**After (with REST API):**
```javascript
import { api } from '../services/api';

const loadPatients = async () => {
  try {
    const patients = await api.getCollection('patients');
    setPatients(patients);
  } catch (error) {
    console.error('Error loading patients:', error);
    addNotification({ type: 'error', message: 'Gagal memuat data pasien' });
  }
};
```

### Real-time Updates

**Before (mockDb):**
```javascript
useEffect(() => {
  const unsubscribe = onSnapshot(
    query(collection(db, 'patients')),
    (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPatients(data);
    }
  );
  return unsubscribe;
}, []);
```

**After (WebSocket):**
```javascript
useEffect(() => {
  const ws = new WebSocket('ws://localhost:8000/patients');
  
  ws.onmessage = (event) => {
    const patients = JSON.parse(event.data);
    setPatients(patients);
  };
  
  return () => ws.close();
}, []);
```

## Environment Variables Needed

### Firebase:
```env
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=
```

### REST API:
```env
REACT_APP_API_URL=https://api.yourdomain.com
```

### Supabase:
```env
REACT_APP_SUPABASE_URL=https://xxx.supabase.co
REACT_APP_SUPABASE_ANON_KEY=
```

## Performance Considerations

1. **Caching**: Implement caching to reduce API calls
2. **Pagination**: Add pagination for large datasets
3. **Lazy Loading**: Load data on demand
4. **Optimistic Updates**: Update UI before API response
5. **Error Boundaries**: Catch and handle errors gracefully

## Security Considerations

1. **Authentication**: Always authenticate users
2. **Authorization**: Implement role-based access control
3. **Input Validation**: Validate all inputs on backend
4. **HTTPS**: Always use HTTPS in production
5. **CORS**: Configure CORS properly
6. **Rate Limiting**: Prevent abuse with rate limiting

## Recommendations

For **Puskesau** project specifically:

1. **Short term (Demo/Testing)**: Keep localStorage (current)
2. **Medium term (Pilot)**: Use Firebase for quick deployment
3. **Long term (Production)**: Build custom REST API with PostgreSQL

### Why?
- **Demo**: localStorage is perfect for testing UI/UX
- **Pilot**: Firebase allows quick iteration and testing
- **Production**: Custom backend gives full control, better performance, and meets specific requirements

## Support

For questions about migration, contact the development team.
