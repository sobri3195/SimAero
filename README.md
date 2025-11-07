# Healthcare Platform for TNI (Indonesian Armed Forces)

A comprehensive healthcare management system designed for the Indonesian Armed Forces (TNI), supporting all three branches: TNI AU (Air Force), TNI AD (Army), and TNI AL (Navy).

## 🏥 Overview

This platform provides a complete healthcare management solution with specialized features for each military branch:

- **TNI AU (Angkatan Udara)** - Air Force: 23 RSAU hospitals + 59 FKTP clinics
- **TNI AD (Angkatan Darat)** - Army: 10 RSAD hospitals + 8 clinics
- **TNI AL (Angkatan Laut)** - Navy: 8 RSAL hospitals + 10 clinics

## ✨ Key Features

### Core Modules
- 📋 Patient Registration & Management
- 🏥 Electronic Health Records (EHR)
- 🚑 Emergency Department (IGD)
- 🛏️ Inpatient Management
- 💊 Pharmacy & Medication Management
- 🧪 Laboratory Information System
- 📸 Radiology & Imaging
- 💰 Billing & Financial Management
- 📊 Analytics & Reporting Dashboard

### Branch-Specific Features

#### TNI AU (Air Force)
- ✈️ Aerospace Medicine
- 🛫 Flight Fitness Assessment (Rikkes Terbang)
- 🚁 Aviation Health Management

#### TNI AD (Army)
- ⚔️ Field Medicine
- 🎖️ Combat Casualty Care
- 💪 Tactical Medicine
- 🏃 Medical Fitness Assessment
- 🎯 Combat Medical Training

#### TNI AL (Navy)
- 🤿 Diving Medicine
- 🌊 Submarine Medical Fitness
- 🏥 Hyperbaric Medicine
- ⚓ Maritime Health Management
- 🌡️ Diving Medical Check-ups

### Advanced Features
- 🔒 Role-based Access Control (RBAC)
- 🏢 Multi-facility Support
- 📱 Responsive Mobile Design
- 📤 Export to Excel, CSV, PDF
- 🔄 Real-time Data Updates
- 🤖 AI-powered Health Assistant (OpenAI Integration)
- 🔔 Notification System
- 📡 SATUSEHAT Integration Ready

## 🚀 Technology Stack

- **Frontend**: React 19
- **Routing**: React Router v7
- **Styling**: Tailwind CSS 3.4.1
- **Charts**: Recharts
- **Icons**: Lucide React
- **Data Storage**: localStorage (Demo/Testing)
- **Export**: xlsx, jspdf, jspdf-autotable, file-saver
- **Date Handling**: date-fns 2.30.0
- **AI**: OpenAI GPT-4 API (Optional)

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone https://github.com/sobri3195/healthcare-tni.git
cd healthcare-tni
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Configure OpenAI API for AI features:
Create a `.env` file in the root directory:
```env
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
```

4. Start the development server:
```bash
npm start
```

5. Build for production:
```bash
npm run build
```

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── common/         # Reusable components (DataTable, Modal, etc.)
│   ├── dashboard/      # Dashboard components
│   ├── registration/   # Patient registration
│   ├── ehr/           # Electronic Health Records
│   ├── igd/           # Emergency Department
│   ├── pharmacy/      # Pharmacy management
│   └── ...
├── pages/             # Page components
├── contexts/          # React contexts (Auth, App)
├── services/          # API services (AI)
├── utils/            # Utility functions
├── mockDb.js         # Mock database (localStorage)
└── App.js            # Main app component
```

## 🎯 Usage

### Default Login Credentials

**Supervision Centers:**
- PUSKESAU (TNI AU): Username: `puskesau`, Password: `password`
- PUSKESAD (TNI AD): Username: `puskesad`, Password: `password`
- PUSKESAL (TNI AL): Username: `puskesal`, Password: `password`

**Hospitals (RSAU/RSAD/RSAL):**
- Username: `admin`, Password: `password`

**Clinics (FKTP/Klinik AD/Klinik AL):**
- Username: `admin`, Password: `password`

### Switching Between Branches

1. Login to any Puskes (supervision center)
2. Use the branch selector dropdown in the header
3. Select TNI AU, TNI AD, or TNI AL
4. View facilities specific to that branch

### Switching Between Facilities

1. Login to any facility or Puskes
2. Use the facility dropdown in the header
3. Select the hospital or clinic you want to manage

### Viewing Hospital Directory

As PUSKESAU, you can view the complete list of 23 RSAU:
1. Login as PUSKESAU
2. Navigate to "Direktori RSAU" from the menu
3. View detailed information about all Air Force hospitals
4. Filter by hospital level (A, B, C)
5. Export or print the directory

Documentation available at: `/docs/DAFTAR_RSAU_TNI_AU.md`

## 🔐 Security Features

- Role-based access control
- Separate databases per facility
- Secure authentication
- Data isolation between facilities

## 📊 Data Management

**Note:** This is a demo/testing application using localStorage for data persistence. Data is stored locally in the browser and is NOT suitable for production use.

For production deployment, integrate with a proper backend database (Firebase, PostgreSQL, MongoDB, etc.).

## 🌐 Deployment

The application is configured for deployment on Netlify:

1. Connect your GitHub repository to Netlify
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `build`
3. Add environment variables (if using AI features)
4. Deploy!

## 👨‍⚕️ Author

**Lettu Kes dr. Muhammad Sobri Maulana, S.Kom, CEH, OSCP, OSCE**

A military healthcare professional and software engineer dedicated to improving healthcare technology for the Indonesian Armed Forces.

### 📧 Contact
- Email: [muhammadsobrimaulana31@gmail.com](mailto:muhammadsobrimaulana31@gmail.com)
- GitHub: [github.com/sobri3195](https://github.com/sobri3195)

### 🌐 Connect with Me
- 🎥 YouTube: [@muhammadsobrimaulana6013](https://www.youtube.com/@muhammadsobrimaulana6013)
- 📱 Telegram: [@winlin_exploit](https://t.me/winlin_exploit)
- 🎵 TikTok: [@dr.sobri](https://www.tiktok.com/@dr.sobri)
- 💬 WhatsApp Group: [Join Community](https://chat.whatsapp.com/B8nwRZOBMo64GjTwdXV8Bl)
- 🌐 Website: [muhammadsobrimaulana.netlify.app](https://muhammadsobrimaulana.netlify.app)
- 🌐 Portfolio: [muhammad-sobri-maulana.sevalla.page](https://muhammad-sobri-maulana-kvr6a.sevalla.page/)

## 💝 Support This Project

If you find this project helpful, consider supporting the development:

### Donation Links
- 💳 Lynk.id: [lynk.id/muhsobrimaulana](https://lynk.id/muhsobrimaulana)
- ☕ Trakteer: [trakteer.id/g9mkave5gauns962u07t](https://trakteer.id/g9mkave5gauns962u07t)
- 🎨 Karya Karsa: [karyakarsa.com/muhammadsobrimaulana](https://karyakarsa.com/muhammadsobrimaulana)
- 💰 Nyawer: [nyawer.co/MuhammadSobriMaulana](https://nyawer.co/MuhammadSobriMaulana)
- 🛍️ Gumroad: [maulanasobri.gumroad.com](https://maulanasobri.gumroad.com/)

Your support helps maintain and improve this project! 🙏

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/sobri3195/healthcare-tni/issues).

### How to Contribute

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is developed for the Indonesian Armed Forces (TNI) healthcare system.

## 🙏 Acknowledgments

- TNI AU, TNI AD, and TNI AL for their service to Indonesia
- All healthcare professionals serving in military hospitals and clinics
- Open source community for amazing tools and libraries

## 📚 Documentation

For detailed documentation on specific modules:
- [Patient Management](docs/patient-management.md)
- [EHR System](docs/ehr-system.md)
- [Emergency Department](docs/igd.md)
- [Pharmacy](docs/pharmacy.md)
- [Laboratory](docs/laboratory.md)
- [API Integration](docs/api-integration.md)

## 🐛 Known Issues

- Data is stored in localStorage (browser-local only)
- No real-time synchronization between devices
- Not suitable for production use without backend integration

## 🗺️ Roadmap

- [ ] Backend API integration
- [ ] Real-time synchronization
- [ ] Mobile app (React Native)
- [ ] SATUSEHAT full integration
- [ ] Telemedicine features
- [ ] Advanced analytics and ML predictions
- [ ] Multi-language support
- [ ] Offline mode support

## 📞 Support

Need help? Have questions?

- 📧 Email: muhammadsobrimaulana31@gmail.com
- 💬 Join WhatsApp Group: [Community Support](https://chat.whatsapp.com/B8nwRZOBMo64GjTwdXV8Bl)
- 📱 Telegram: [@winlin_exploit](https://t.me/winlin_exploit)

---

**Made with ❤️ for TNI Healthcare by dr. Muhammad Sobri Maulana**

*Serving those who serve the nation* 🇮🇩
