import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumb = ({ items }) => {
  const location = useLocation();

  const getBreadcrumbItems = () => {
    if (items) return items;

    const pathnames = location.pathname.split('/').filter(x => x);
    const breadcrumbItems = [{ label: 'Home', path: '/' }];

    pathnames.forEach((path, index) => {
      const pathTo = `/${pathnames.slice(0, index + 1).join('/')}`;
      const label = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
      breadcrumbItems.push({ label, path: pathTo });
    });

    return breadcrumbItems;
  };

  const breadcrumbItems = getBreadcrumbItems();

  return (
    <nav className="flex items-center space-x-2 text-sm mb-4 flex-wrap">
      {breadcrumbItems.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && (
            <ChevronRight className="mx-2 text-gray-400" size={16} />
          )}
          {index === breadcrumbItems.length - 1 ? (
            <span className="text-gray-600 font-medium flex items-center gap-1">
              {index === 0 && <Home size={16} />}
              {item.label}
            </span>
          ) : (
            <Link
              to={item.path}
              className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 transition-colors"
            >
              {index === 0 && <Home size={16} />}
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumb;
