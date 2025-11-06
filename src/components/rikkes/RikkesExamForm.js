import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { doc, getDoc, updateDoc } from '../../mockDb';
import { db } from '../../mockDb';
import RikkesFormSidebar from './RikkesFormSidebar';
import RikkesIdentitySection from './RikkesIdentitySection';
import RikkesClinicalSection from './RikkesClinicalSection';
import RikkesDentalSection from './RikkesDentalSection';
import RikkesLabSection from './RikkesLabSection';
import RikkesRadiologySection from './RikkesRadiologySection';
import RikkesConclusionSection from './RikkesConclusionSection';
import { ArrowLeft, FileText, CheckCircle } from 'lucide-react';

const RikkesExamForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { rikkesRole } = useAuth();
  const { theme, addNotification } = useApp();
  const [examination, setExamination] = useState(null);
  const [activeSection, setActiveSection] = useState('identity');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadExamination();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadExamination = async () => {
    try {
      const examDoc = await getDoc(doc(db, 'rikkes_examinations', id));
      if (examDoc.exists()) {
        setExamination({ id: examDoc.id, ...examDoc.data() });
      } else {
        addNotification({ type: 'error', message: 'Data pemeriksaan tidak ditemukan' });
        navigate('/rikkes');
      }
    } catch (error) {
      console.error('Error loading examination:', error);
      addNotification({ type: 'error', message: 'Gagal memuat data pemeriksaan' });
    } finally {
      setLoading(false);
    }
  };

  const handleSectionUpdate = async (sectionId, data, status = 'draft') => {
    try {
      setSaving(true);

      const updatedSections = {
        ...examination.sections,
        [sectionId]: {
          ...data,
          status,
          updatedAt: new Date().toISOString(),
          updatedBy: rikkesRole
        }
      };

      await updateDoc(doc(db, 'rikkes_examinations', id), {
        sections: updatedSections,
        updatedAt: new Date().toISOString()
      });

      setExamination(prev => ({
        ...prev,
        sections: updatedSections,
        updatedAt: new Date().toISOString()
      }));

      addNotification({ 
        type: 'success', 
        message: status === 'completed' ? 'Bagian berhasil di-submit' : 'Data berhasil disimpan'
      });
    } catch (error) {
      console.error('Error updating section:', error);
      addNotification({ type: 'error', message: 'Gagal menyimpan data' });
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitSection = async (sectionId, data) => {
    await handleSectionUpdate(sectionId, data, 'completed');
  };

  const handleFinalizeExam = async () => {
    if (!window.confirm('Finalisasi laporan? Data tidak dapat diubah setelah finalisasi.')) {
      return;
    }

    try {
      await updateDoc(doc(db, 'rikkes_examinations', id), {
        status: 'finalized',
        finalizedAt: new Date().toISOString(),
        finalizedBy: rikkesRole
      });

      setExamination(prev => ({
        ...prev,
        status: 'finalized',
        finalizedAt: new Date().toISOString()
      }));

      addNotification({ type: 'success', message: 'Laporan berhasil difinalisasi' });
      navigate(`/rikkes/preview/${id}`);
    } catch (error) {
      console.error('Error finalizing exam:', error);
      addNotification({ type: 'error', message: 'Gagal finalisasi laporan' });
    }
  };

  const renderSection = () => {
    const sectionData = examination?.sections?.[activeSection] || {};

    switch (activeSection) {
      case 'identity':
        return (
          <RikkesIdentitySection
            data={sectionData}
            examination={examination}
            onSave={(data) => handleSectionUpdate('identity', data)}
            onSubmit={(data) => handleSubmitSection('identity', data)}
            readOnly={sectionData.status === 'completed' && rikkesRole !== 'Admin'}
          />
        );
      case 'clinical':
        return (
          <RikkesClinicalSection
            data={sectionData}
            onSave={(data) => handleSectionUpdate('clinical', data)}
            onSubmit={(data) => handleSubmitSection('clinical', data)}
            readOnly={sectionData.status === 'completed' && !['Admin', 'Reviewer'].includes(rikkesRole)}
          />
        );
      case 'dental':
        return (
          <RikkesDentalSection
            data={sectionData}
            onSave={(data) => handleSectionUpdate('dental', data)}
            onSubmit={(data) => handleSubmitSection('dental', data)}
            readOnly={sectionData.status === 'completed' && !['Admin', 'Reviewer'].includes(rikkesRole)}
          />
        );
      case 'lab':
        return (
          <RikkesLabSection
            data={sectionData}
            onSave={(data) => handleSectionUpdate('lab', data)}
            onSubmit={(data) => handleSubmitSection('lab', data)}
            readOnly={sectionData.status === 'completed' && !['Admin', 'Reviewer'].includes(rikkesRole)}
          />
        );
      case 'radiology':
        return (
          <RikkesRadiologySection
            data={sectionData}
            onSave={(data) => handleSectionUpdate('radiology', data)}
            onSubmit={(data) => handleSubmitSection('radiology', data)}
            readOnly={sectionData.status === 'completed' && !['Admin', 'Reviewer'].includes(rikkesRole)}
          />
        );
      case 'conclusion':
        return (
          <RikkesConclusionSection
            data={sectionData}
            examination={examination}
            onSave={(data) => handleSectionUpdate('conclusion', data)}
            onSubmit={(data) => handleSubmitSection('conclusion', data)}
            readOnly={sectionData.status === 'completed' && !['Admin', 'Reviewer'].includes(rikkesRole)}
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: theme.primaryColor }}></div>
      </div>
    );
  }

  const allSectionsCompleted = ['identity', 'clinical', 'dental', 'lab', 'radiology', 'conclusion']
    .every(section => examination?.sections?.[section]?.status === 'completed');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/rikkes')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-2xl font-bold" style={{ color: theme.primaryColor }}>
                  {examination?.patientName}
                </h1>
                <p className="text-sm text-gray-600">
                  NRP: {examination?.nrp} | {examination?.rank} - {examination?.unit}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {saving && (
                <span className="text-sm text-gray-600 flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                  Menyimpan...
                </span>
              )}

              <button
                onClick={() => navigate(`/rikkes/preview/${id}`)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold transition-colors"
              >
                <FileText size={18} />
                Preview PDF
              </button>

              {(rikkesRole === 'Admin' || rikkesRole === 'Reviewer') && allSectionsCompleted && examination?.status !== 'finalized' && (
                <button
                  onClick={handleFinalizeExam}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
                >
                  <CheckCircle size={18} />
                  Finalisasi Laporan
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex gap-6">
          <RikkesFormSidebar
            examination={examination}
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />

          <div className="flex-1">
            {renderSection()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RikkesExamForm;
