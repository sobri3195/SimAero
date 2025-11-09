import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Building2, Activity, Users, AlertCircle, TrendingUp, MapPin } from 'lucide-react';
import { collection, getDocs } from '../../mockDb';
import { db } from '../../mockDb';

const DashboardPuskesau = () => {
  const { 
    branch, 
    switchToRSAU, 
    switchToFKTP, 
    switchToRSAD, 
    switchToKlinikAD, 
    switchToRSAL, 
    switchToKlinikAL 
  } = useAuth();
  const [hospitalList, setHospitalList] = useState([]);
  const [clinicList, setClinicList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalHospitals: 0,
    totalClinics: 0,
    totalPatients: 0,
    totalCapacity: 0
  });

  const loadFaskesData = useCallback(async () => {
    try {
      const faskesSnapshot = await getDocs(collection(db, 'faskes'));
      const allFaskes = [];
      faskesSnapshot.forEach((doc) => {
        allFaskes.push(doc.data());
      });

      let hospitals, clinics;
      
      // Filter based on branch
      if (branch === 'AU') {
        hospitals = allFaskes.filter(f => f.tipe === 'rsau');
        clinics = allFaskes.filter(f => f.tipe === 'fktp');
      } else if (branch === 'AD') {
        hospitals = allFaskes.filter(f => f.tipe === 'rsad');
        clinics = allFaskes.filter(f => f.tipe === 'klinik_ad');
      } else if (branch === 'AL') {
        hospitals = allFaskes.filter(f => f.tipe === 'rsal');
        clinics = allFaskes.filter(f => f.tipe === 'klinik_al');
      }

      setHospitalList(hospitals);
      setClinicList(clinics);

      const patientsSnapshot = await getDocs(collection(db, 'patients'));
      const totalCapacity = [...hospitals, ...clinics].reduce((sum, f) => sum + (f.kapasitas || 0), 0);

      setStats({
        totalHospitals: hospitals.length,
        totalClinics: clinics.length,
        totalPatients: patientsSnapshot.size,
        totalCapacity: totalCapacity
      });

      setLoading(false);
    } catch (error) {
      console.error('Error loading faskes data:', error);
      setLoading(false);
    }
  }, [branch]);

  useEffect(() => {
    loadFaskesData();
  }, [loadFaskesData]);

  const handleAccessHospital = (hospital) => {
    if (branch === 'AU') {
      switchToRSAU(hospital.nama);
    } else if (branch === 'AD') {
      switchToRSAD(hospital.nama);
    } else if (branch === 'AL') {
      switchToRSAL(hospital.nama);
    }
  };

  const handleAccessClinic = (clinic) => {
    if (branch === 'AU') {
      switchToFKTP(clinic.nama);
    } else if (branch === 'AD') {
      switchToKlinikAD(clinic.nama);
    } else if (branch === 'AL') {
      switchToKlinikAL(clinic.nama);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const branchNames = {
    'AU': { full: 'Angkatan Udara', short: 'AU', hospital: 'RSAU', clinic: 'FKTP' },
    'AD': { full: 'Angkatan Darat', short: 'AD', hospital: 'RSAD', clinic: 'Klinik AD' },
    'AL': { full: 'Angkatan Laut', short: 'AL', hospital: 'RSAL', clinic: 'Klinik AL' }
  };

  const currentBranch = branchNames[branch];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Dashboard Puskes{branch}</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Pengawasan & Monitoring Fasilitas Kesehatan TNI {currentBranch.full}</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-md border-l-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Total {currentBranch.hospital}</p>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">{stats.totalHospitals}</p>
            </div>
            <Building2 className="text-blue-600" size={28} />
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-md border-l-4 border-green-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 truncate">Total {currentBranch.clinic}</p>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">{stats.totalClinics}</p>
            </div>
            <Activity className="text-green-600" size={28} />
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-md border-l-4 border-purple-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Total Pasien</p>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">{stats.totalPatients}</p>
            </div>
            <Users className="text-purple-600" size={28} />
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-md border-l-4 border-orange-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 truncate">Kapasitas</p>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">{stats.totalCapacity}</p>
            </div>
            <TrendingUp className="text-orange-600" size={28} />
          </div>
        </div>
      </div>

      {/* Hospitals Section */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-4 gap-2">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
            <Building2 className="text-blue-600 flex-shrink-0" size={20} />
            <span className="truncate">
              {branch === 'AU' ? 'Rumah Sakit Angkatan Udara (RSAU)' : 
               branch === 'AD' ? 'Rumah Sakit Angkatan Darat (RSAD)' : 
               'Rumah Sakit Angkatan Laut (RSAL)'}
            </span>
          </h2>
          <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">{hospitalList.length} Rumah Sakit</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {hospitalList.map((hospital) => (
            <div key={hospital.id} className="border rounded-lg p-3 sm:p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 mb-1 text-xs sm:text-sm truncate">{hospital.nama}</h3>
                  <p className="text-xs text-gray-600 flex items-center gap-1 truncate">
                    <MapPin size={12} className="flex-shrink-0" />
                    <span className="truncate">{hospital.lokasi}</span>
                  </p>
                </div>
                {hospital.tingkat && (
                  <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs font-semibold ml-2 flex-shrink-0 ${
                    hospital.tingkat === 'A' ? 'bg-blue-100 text-blue-800' : 
                    hospital.tingkat === 'B' ? 'bg-green-100 text-green-800' : 
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    Tkt {hospital.tingkat}
                  </span>
                )}
              </div>
              
              <div className="space-y-1 mb-2 sm:mb-3">
                <p className="text-xs text-gray-600 truncate">
                  <span className="font-semibold">{branch === 'AU' ? 'Lanud' : 'Kesatuan'}:</span> {hospital.lanud || hospital.kesatuan}
                </p>
                <p className="text-xs text-gray-600">
                  <span className="font-semibold">Kapasitas:</span> {hospital.kapasitas} TT
                </p>
                <div className="flex flex-wrap gap-1 mt-1 sm:mt-2">
                  {hospital.fasilitasUtama?.slice(0, 2).map((fasilitas, idx) => (
                    <span key={idx} className="text-xs bg-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded truncate">
                      {fasilitas}
                    </span>
                  ))}
                  {hospital.fasilitasUtama?.length > 2 && (
                    <span className="text-xs bg-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                      +{hospital.fasilitasUtama.length - 2}
                    </span>
                  )}
                </div>
              </div>
              
              <button
                onClick={() => handleAccessHospital(hospital)}
                className="w-full bg-blue-600 text-white py-1.5 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm"
              >
                Akses SIMRS
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Clinics Section */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-4 gap-2">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
            <Activity className="text-green-600 flex-shrink-0" size={20} />
            <span className="truncate">
              {branch === 'AU' ? 'Fasilitas Kesehatan Tingkat Pertama (FKTP)' : 
               branch === 'AD' ? 'Klinik Kesehatan TNI AD' : 
               'Klinik Kesehatan TNI AL'}
            </span>
          </h2>
          <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">{clinicList.length} Klinik</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {clinicList.map((clinic) => (
            <div key={clinic.id} className="border rounded-lg p-3 sm:p-4 hover:shadow-lg transition-shadow">
              <div className="mb-2 sm:mb-3">
                <h3 className="font-bold text-gray-800 text-xs sm:text-sm mb-1 truncate">{clinic.nama}</h3>
                <p className="text-xs text-gray-600 flex items-center gap-1 truncate">
                  <MapPin size={12} className="flex-shrink-0" />
                  <span className="truncate">{clinic.lokasi}</span>
                </p>
              </div>
              
              <div className="space-y-1 mb-2 sm:mb-3">
                <p className="text-xs text-gray-600 truncate">
                  <span className="font-semibold">{branch === 'AU' ? 'Lanud' : 'Kesatuan'}:</span> {clinic.lanud || clinic.kesatuan}
                </p>
                <p className="text-xs text-gray-600">
                  <span className="font-semibold">Kapasitas:</span> {clinic.kapasitas}
                </p>
                <div className="flex flex-wrap gap-1 mt-1 sm:mt-2">
                  {clinic.fasilitasUtama?.slice(0, 2).map((fasilitas, idx) => (
                    <span key={idx} className="text-xs bg-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded truncate">
                      {fasilitas}
                    </span>
                  ))}
                  {clinic.fasilitasUtama?.length > 2 && (
                    <span className="text-xs bg-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                      +{clinic.fasilitasUtama.length - 2}
                    </span>
                  )}
                </div>
              </div>
              
              <button
                onClick={() => handleAccessClinic(clinic)}
                className="w-full bg-green-600 text-white py-1.5 sm:py-2 rounded-lg hover:bg-green-700 transition-colors text-xs sm:text-sm"
              >
                Akses SIM Klinik
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Alert Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
        <div className="flex items-start gap-2 sm:gap-3">
          <AlertCircle className="text-blue-600 mt-0.5 sm:mt-1 flex-shrink-0" size={18} />
          <div>
            <h3 className="font-semibold text-blue-900 mb-1 text-sm sm:text-base">Informasi Pengawasan</h3>
            <p className="text-xs sm:text-sm text-blue-800">
              Sebagai Puskes{branch} (Pusat Kesehatan TNI {currentBranch.full}), Anda dapat mengakses dan mengawasi 
              seluruh sistem SIMRS di {currentBranch.hospital} dan SIM Klinik di {currentBranch.clinic}. 
              Klik tombol "Akses" pada fasilitas yang ingin Anda awasi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPuskesau;
