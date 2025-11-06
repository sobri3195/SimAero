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
  const [currentUser] = useState({ 
    uid: 'mock-user-123',
    email: 'user@puskesau.mil.id',
    displayName: 'Demo User'
  });
  const [userRole, setUserRole] = useState('PUSKESAU');
  const [selectedFaskes, setSelectedFaskes] = useState(null);
  const [facilityType, setFacilityType] = useState(null);
  const [rikkesRole, setRikkesRole] = useState('Admin'); // Admin, Dokter Umum, Dokter Gigi, ATLM Lab, Radiografer, Reviewer
  const loading = false;

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

  const switchToPuskesau = () => {
    setUserRole('PUSKESAU');
    setSelectedFaskes(null);
    setFacilityType(null);
  };

  const value = {
    currentUser,
    userRole,
    setUserRole,
    selectedFaskes,
    setSelectedFaskes,
    facilityType,
    setFacilityType,
    switchToRSAU,
    switchToFKTP,
    switchToPuskesau,
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
