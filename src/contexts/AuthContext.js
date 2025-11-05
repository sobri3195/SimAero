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
  const [userRole, setUserRole] = useState('PUSAT');
  const [selectedFaskes, setSelectedFaskes] = useState('RSAU Dr. Esnawan Antariksa');
  const loading = false;

  const value = {
    currentUser,
    userRole,
    setUserRole,
    selectedFaskes,
    setSelectedFaskes,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
