import React from 'react';
import { Construction } from 'lucide-react';
import Card from '../components/common/Card';

const PlaceholderPage = ({ title, description }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{title}</h1>
      <Card>
        <div className="text-center py-12">
          <Construction size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Modul Dalam Pengembangan</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            {description || `Modul ${title} sedang dalam tahap pengembangan. Fitur lengkap akan segera tersedia.`}
          </p>
        </div>
      </Card>
    </div>
  );
};

export default PlaceholderPage;
