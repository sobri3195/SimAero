import React, { useState, useMemo } from 'react';
import { Search, Download, FileText, Copy, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';

const DataTable = ({ 
  columns, 
  data, 
  title = 'Data',
  searchable = true,
  exportable = true,
  pagination = true,
  itemsPerPage = 10,
  onEdit,
  onDelete,
  onView
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    
    return data.filter(row => {
      return columns.some(column => {
        const value = row[column.key];
        if (value === null || value === undefined) return false;
        return value.toString().toLowerCase().includes(searchQuery.toLowerCase());
      });
    });
  }, [data, searchQuery, columns]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    const sorted = [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === 'string') {
        return sortConfig.direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortConfig.direction === 'asc' 
        ? aValue > bValue ? 1 : -1
        : bValue > aValue ? 1 : -1;
    });

    return sorted;
  }, [filteredData, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage, pagination]);

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  // Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredData.map(row => {
        const obj = {};
        columns.forEach(col => {
          if (!col.actions) {
            obj[col.label] = row[col.key];
          }
        });
        return obj;
      })
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, title);
    XLSX.writeFile(workbook, `${title}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text(title, 14, 15);
    
    const tableColumns = columns
      .filter(col => !col.actions)
      .map(col => col.label);
    
    const tableData = filteredData.map(row => 
      columns
        .filter(col => !col.actions)
        .map(col => row[col.key] || '')
    );

    doc.autoTable({
      head: [tableColumns],
      body: tableData,
      startY: 25,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [59, 130, 246] }
    });

    doc.save(`${title}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // Export to CSV (as DOC alternative)
  const exportToCSV = () => {
    const headers = columns.filter(col => !col.actions).map(col => col.label).join(',');
    const rows = filteredData.map(row => 
      columns
        .filter(col => !col.actions)
        .map(col => {
          const value = row[col.key] || '';
          // Escape commas and quotes
          return `"${value.toString().replace(/"/g, '""')}"`;
        })
        .join(',')
    );
    
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${title}_${new Date().toISOString().split('T')[0]}.csv`);
  };

  // Copy to Clipboard
  const copyToClipboard = () => {
    const headers = columns.filter(col => !col.actions).map(col => col.label).join('\t');
    const rows = filteredData.map(row => 
      columns
        .filter(col => !col.actions)
        .map(col => row[col.key] || '')
        .join('\t')
    );
    
    const text = [headers, ...rows].join('\n');
    navigator.clipboard.writeText(text).then(() => {
      alert('Data berhasil disalin ke clipboard!');
    });
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header with Search and Export */}
      <div className="p-3 sm:p-4 border-b">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
          {/* Search */}
          {searchable && (
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Cari data..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Export Buttons */}
          {exportable && (
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              <button
                onClick={copyToClipboard}
                className="px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-1 sm:gap-2 text-xs sm:text-sm transition-colors"
                title="Copy to Clipboard"
              >
                <Copy size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Copy</span>
              </button>
              <button
                onClick={exportToCSV}
                className="px-2 sm:px-3 py-1.5 sm:py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg flex items-center gap-1 sm:gap-2 text-xs sm:text-sm transition-colors"
                title="Export to CSV"
              >
                <FileText size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">CSV</span>
              </button>
              <button
                onClick={exportToExcel}
                className="px-2 sm:px-3 py-1.5 sm:py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg flex items-center gap-1 sm:gap-2 text-xs sm:text-sm transition-colors"
                title="Export to Excel"
              >
                <Download size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Excel</span>
              </button>
              <button
                onClick={exportToPDF}
                className="px-2 sm:px-3 py-1.5 sm:py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg flex items-center gap-1 sm:gap-2 text-xs sm:text-sm transition-colors"
                title="Export to PDF"
              >
                <FileText size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">PDF</span>
              </button>
            </div>
          )}
        </div>

        {/* Results Info */}
        <div className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-600">
          Menampilkan {paginatedData.length} dari {filteredData.length} data
          {searchQuery && ` (difilter dari ${data.length} total)`}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden">
        <table className="w-full min-w-[640px]">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  onClick={() => !column.actions && handleSort(column.key)}
                  className={`text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-700 text-xs sm:text-sm ${
                    !column.actions ? 'cursor-pointer hover:bg-gray-100' : ''
                  } ${column.className || ''}`}
                >
                  <div className="flex items-center gap-1 sm:gap-2 whitespace-nowrap">
                    {column.label}
                    {!column.actions && sortConfig.key === column.key && (
                      <span className="text-blue-600">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-6 sm:py-8 text-gray-600 text-xs sm:text-sm">
                  {searchQuery ? 'Tidak ada data yang ditemukan' : 'Belum ada data'}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b hover:bg-gray-50 transition-colors">
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className={`py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm ${column.className || ''}`}>
                      {column.render ? (
                        column.render(row, rowIndex)
                      ) : column.actions ? (
                        <div className="flex gap-1 sm:gap-2 justify-center flex-wrap">
                          {onView && (
                            <button
                              onClick={() => onView(row)}
                              className="px-2 sm:px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-xs sm:text-sm transition-colors whitespace-nowrap"
                            >
                              Lihat
                            </button>
                          )}
                          {onEdit && (
                            <button
                              onClick={() => onEdit(row)}
                              className="px-2 sm:px-3 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded text-xs sm:text-sm transition-colors whitespace-nowrap"
                            >
                              Edit
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => onDelete(row)}
                              className="px-2 sm:px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-xs sm:text-sm transition-colors whitespace-nowrap"
                            >
                              Hapus
                            </button>
                          )}
                        </div>
                      ) : (
                        row[column.key]
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="p-3 sm:p-4 border-t">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <div className="text-xs sm:text-sm text-gray-600">
              Halaman {currentPage} dari {totalPages}
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Halaman Pertama"
              >
                <ChevronsLeft size={16} className="sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Halaman Sebelumnya"
              >
                <ChevronLeft size={16} className="sm:w-5 sm:h-5" />
              </button>
              
              {/* Page Numbers */}
              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, index) => {
                  const pageNum = index + 1;
                  // Show first, last, current, and adjacent pages
                  if (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-2 sm:px-3 py-1 rounded-lg transition-colors text-xs sm:text-sm ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  } else if (
                    pageNum === currentPage - 2 ||
                    pageNum === currentPage + 2
                  ) {
                    return <span key={pageNum} className="px-1 sm:px-2 text-xs sm:text-sm">...</span>;
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Halaman Selanjutnya"
              >
                <ChevronRight size={16} className="sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Halaman Terakhir"
              >
                <ChevronsRight size={16} className="sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
