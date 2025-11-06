import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { 
  User, Activity, Smile, Beaker, Scan, 
  FileText, Lock, Check, AlertCircle, Edit3 
} from 'lucide-react';

const RikkesFormSidebar = ({ examination, activeSection, onSectionChange }) => {
  const { rikkesRole } = useAuth();
  const { theme } = useApp();

  const sections = [
    { 
      id: 'identity', 
      label: 'Identitas Pasien', 
      icon: User,
      allowedRoles: ['Admin', 'Reviewer']
    },
    { 
      id: 'clinical', 
      label: 'Pemeriksaan Klinis', 
      icon: Activity,
      allowedRoles: ['Admin', 'Dokter Umum', 'Reviewer']
    },
    { 
      id: 'dental', 
      label: 'Pemeriksaan Gigi', 
      icon: Smile,
      allowedRoles: ['Admin', 'Dokter Gigi', 'Reviewer']
    },
    { 
      id: 'lab', 
      label: 'Laboratorium', 
      icon: Beaker,
      allowedRoles: ['Admin', 'ATLM Lab', 'Reviewer']
    },
    { 
      id: 'radiology', 
      label: 'Radiologi', 
      icon: Scan,
      allowedRoles: ['Admin', 'Radiografer', 'Reviewer']
    },
    { 
      id: 'conclusion', 
      label: 'Kesimpulan Akhir', 
      icon: FileText,
      allowedRoles: ['Admin', 'Reviewer']
    }
  ];

  const getSectionStatus = (sectionId) => {
    const section = examination?.sections?.[sectionId];
    if (!section) return 'empty';
    return section.status || 'draft';
  };

  const canAccessSection = (section) => {
    return section.allowedRoles.includes(rikkesRole);
  };

  const getStatusIcon = (sectionId, section) => {
    const status = getSectionStatus(sectionId);
    const hasAccess = canAccessSection(section);

    if (!hasAccess) {
      return <Lock size={16} className="text-gray-400" />;
    }

    switch (status) {
      case 'completed':
        return <Check size={16} className="text-green-600" />;
      case 'needs_revision':
        return <AlertCircle size={16} className="text-red-600" />;
      case 'draft':
        return <Edit3 size={16} className="text-yellow-600" />;
      default:
        return <Edit3 size={16} className="text-gray-400" />;
    }
  };

  const getStatusColor = (sectionId, section) => {
    const status = getSectionStatus(sectionId);
    const hasAccess = canAccessSection(section);

    if (!hasAccess) {
      return 'bg-gray-100 text-gray-400 cursor-not-allowed';
    }

    switch (status) {
      case 'completed':
        return 'bg-green-50 text-green-800 hover:bg-green-100';
      case 'needs_revision':
        return 'bg-red-50 text-red-800 hover:bg-red-100';
      case 'draft':
        return 'bg-yellow-50 text-yellow-800 hover:bg-yellow-100';
      default:
        return 'bg-gray-50 text-gray-600 hover:bg-gray-100';
    }
  };

  const handleSectionClick = (section) => {
    if (!canAccessSection(section)) {
      return;
    }
    onSectionChange(section.id);
  };

  return (
    <div className="w-64 bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-4" style={{ backgroundColor: theme.primaryColor }}>
        <h2 className="text-white font-bold text-lg">Navigasi Form</h2>
        <p className="text-white text-xs opacity-90 mt-1">
          Status: {examination?.status || 'Draft'}
        </p>
      </div>

      <nav className="p-2">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          const status = getSectionStatus(section.id);
          const hasAccess = canAccessSection(section);

          return (
            <button
              key={section.id}
              onClick={() => handleSectionClick(section)}
              disabled={!hasAccess}
              className={`w-full flex items-center gap-3 p-3 rounded-lg mb-2 transition-all ${
                isActive 
                  ? 'ring-2 ring-offset-2' 
                  : ''
              } ${getStatusColor(section.id, section)}`}
              style={isActive ? { ringColor: theme.primaryColor } : {}}
            >
              <Icon size={20} />
              <div className="flex-1 text-left">
                <div className="text-sm font-semibold">{section.label}</div>
                {status === 'needs_revision' && (
                  <div className="text-xs mt-1">Perlu Revisi</div>
                )}
              </div>
              {getStatusIcon(section.id, section)}
            </button>
          );
        })}
      </nav>

      <div className="p-4 bg-gray-50 border-t">
        <h3 className="text-xs font-semibold text-gray-700 mb-2">Keterangan Status:</h3>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <Edit3 size={12} className="text-yellow-600" />
            <span className="text-gray-600">Dapat Diedit</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock size={12} className="text-gray-400" />
            <span className="text-gray-600">Terkunci</span>
          </div>
          <div className="flex items-center gap-2">
            <Check size={12} className="text-green-600" />
            <span className="text-gray-600">Selesai</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle size={12} className="text-red-600" />
            <span className="text-gray-600">Perlu Revisi</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RikkesFormSidebar;
