import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import PersonnelRikkes from '../components/fktp/PersonnelRikkes';

const PersonnelRikkesPage = () => {
  const { userRole } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (userRole !== 'FKTP' && userRole !== 'RSAU') {
      navigate('/');
    }
  }, [userRole, navigate]);

  return (
    <div className="p-4 md:p-6">
      <PersonnelRikkes />
    </div>
  );
};

export default PersonnelRikkesPage;
