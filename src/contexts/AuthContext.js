import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [branch, setBranch] = useState('AU'); // 'AU' | 'AD' | 'AL'
  const [currentUser, setCurrentUser] = useState({ 
    uid: 'mock-user-123',
    email: 'user@puskesau.mil.id',
    displayName: 'Demo User'
  });
  const [userRole, setUserRole] = useState('PUSKESAU');
  const [selectedFaskes, setSelectedFaskes] = useState(null);
  const [facilityType, setFacilityType] = useState(null);
  const [rikkesRole, setRikkesRole] = useState('Admin'); // Admin, Dokter Umum, Dokter Gigi, ATLM Lab, Radiografer, Reviewer
  const loading = false;

  const switchBranch = (newBranch) => {
    setBranch(newBranch);
    setUserRole('PUSKESAU');
    setSelectedFaskes(null);
    setFacilityType(null);
    // Update email based on branch
    const emailMap = {
      'AU': 'user@puskesau.mil.id',
      'AD': 'user@puskesad.mil.id',
      'AL': 'user@puskesal.mil.id'
    };
    setCurrentUser({
      ...currentUser,
      email: emailMap[newBranch]
    });
  };

  // TNI AU functions
  const switchToRSAU = (faskesName) => {
    setUserRole('RSAU');
    setSelectedFaskes(faskesName);
    setFacilityType('rsau');
  };

  const switchToFKTP = (faskesName) => {
    setUserRole('FKTP');
    setSelectedFaskes(faskesName);
    setFacilityType('fktp');
  };

  // TNI AD functions
  const switchToRSAD = (faskesName) => {
    setUserRole('RSAD');
    setSelectedFaskes(faskesName);
    setFacilityType('rsad');
  };

  const switchToKlinikAD = (faskesName) => {
    setUserRole('KLINIK_AD');
    setSelectedFaskes(faskesName);
    setFacilityType('klinik_ad');
  };

  // TNI AL functions
  const switchToRSAL = (faskesName) => {
    setUserRole('RSAL');
    setSelectedFaskes(faskesName);
    setFacilityType('rsal');
  };

  const switchToKlinikAL = (faskesName) => {
    setUserRole('KLINIK_AL');
    setSelectedFaskes(faskesName);
    setFacilityType('klinik_al');
  };

  const switchToPuskes = () => {
    setUserRole('PUSKESAU');
    setSelectedFaskes(null);
    setFacilityType(null);
  };

  const value = {
    branch,
    setBranch,
    switchBranch,
    currentUser,
    userRole,
    setUserRole,
    selectedFaskes,
    setSelectedFaskes,
    facilityType,
    setFacilityType,
    switchToRSAU,
    switchToFKTP,
    switchToRSAD,
    switchToKlinikAD,
    switchToRSAL,
    switchToKlinikAL,
    switchToPuskes,
    rikkesRole,
    setRikkesRole,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
