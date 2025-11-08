import React, { useState, useMemo } from 'react';
import { Search, Download, FileText, Copy, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Eye, EyeOff, Columns } from 'lucide-react';
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
  onView,
  columnVisibility = true
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(() => {
    const initial = {};
    columns.forEach((col, index) => {
      initial[index] = true;
    });
    return initial;
  });

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

  // Toggle column visibility
  const toggleColumnVisibility = (index) => {
    setVisibleColumns(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Show/hide all columns
  const toggleAllColumns = (show) => {
    const newVisibility = {};
    columns.forEach((col, index) => {
      newVisibility[index] = show;
    });
    setVisibleColumns(newVisibility);
  };

  // Get visible columns
  const displayColumns = useMemo(() => {
    return columns.filter((col, index) => visibleColumns[index]);
  }, [columns, visibleColumns]);

  // Count visible columns
  const visibleCount = Object.values(visibleColumns).filter(v => v).length;

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header with Search and Export */}
      <div className="p-4 border-b">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Search */}
          {searchable && (
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Cari data..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Export Buttons & Column Visibility */}
          <div className="flex flex-wrap gap-2">
            {/* Column Visibility Toggle */}
            {columnVisibility && (
              <div className="relative">
                <button
                  onClick={() => setShowColumnMenu(!showColumnMenu)}
                  className="px-3 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg flex items-center gap-2 text-sm transition-colors"
                  title="Tampilkan/Sembunyikan Kolom"
                >
                  <Columns size={16} />
                  <span className="hidden sm:inline">Kolom ({visibleCount})</span>
                </button>

                {/* Column Menu Dropdown */}
                {showColumnMenu && (
                  <>
                    {/* Backdrop */}
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowColumnMenu(false)}
                    />
                    
                    {/* Menu */}
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border z-20 max-h-96 overflow-y-auto">
                      <div className="p-3 border-b bg-gray-50">
                        <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <Columns size={16} />
                          Pilih Kolom
                        </h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() => toggleAllColumns(true)}
                            className="flex-1 px-2 py-1 text-xs bg-green-100 hover:bg-green-200 text-green-700 rounded transition-colors"
                          >
                            Tampilkan Semua
                          </button>
                          <button
                            onClick={() => toggleAllColumns(false)}
                            className="flex-1 px-2 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded transition-colors"
                          >
                            Sembunyikan Semua
                          </button>
                        </div>
                      </div>
                      <div className="p-2">
                        {columns.map((column, index) => (
                          <label
                            key={index}
                            className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={visibleColumns[index]}
                              onChange={() => toggleColumnVisibility(index)}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                            />
                            <div className="flex items-center gap-2 flex-1">
                              {visibleColumns[index] ? (
                                <Eye size={14} className="text-green-600" />
                              ) : (
                                <EyeOff size={14} className="text-gray-400" />
                              )}
                              <span className="text-sm text-gray-700">
                                {column.label}
                              </span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Export Buttons */}
            {exportable && (
              <>
                <button
                  onClick={copyToClipboard}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-2 text-sm transition-colors"
                  title="Copy to Clipboard"
                >
                  <Copy size={16} />
                  <span className="hidden sm:inline">Copy</span>
                </button>
                <button
                  onClick={exportToCSV}
                  className="px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg flex items-center gap-2 text-sm transition-colors"
                  title="Export to CSV"
                >
                  <FileText size={16} />
                  <span className="hidden sm:inline">CSV</span>
                </button>
                <button
                  onClick={exportToExcel}
                  className="px-3 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg flex items-center gap-2 text-sm transition-colors"
                  title="Export to Excel"
                >
                  <Download size={16} />
                  <span className="hidden sm:inline">Excel</span>
                </button>
                <button
                  onClick={exportToPDF}
                  className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg flex items-center gap-2 text-sm transition-colors"
                  title="Export to PDF"
                >
                  <FileText size={16} />
                  <span className="hidden sm:inline">PDF</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Results Info */}
        <div className="mt-3 text-sm text-gray-600">
          Menampilkan {paginatedData.length} dari {filteredData.length} data
          {searchQuery && ` (difilter dari ${data.length} total)`}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {displayColumns.map((column, index) => (
                <th
                  key={index}
                  onClick={() => !column.actions && handleSort(column.key)}
                  className={`text-left py-3 px-4 font-semibold text-gray-700 ${
                    !column.actions ? 'cursor-pointer hover:bg-gray-100' : ''
                  } ${column.className || ''}`}
                >
                  <div className="flex items-center gap-2">
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
                <td colSpan={displayColumns.length} className="text-center py-8 text-gray-600">
                  {searchQuery ? 'Tidak ada data yang ditemukan' : 'Belum ada data'}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b hover:bg-gray-50 transition-colors">
                  {displayColumns.map((column, colIndex) => (
                    <td key={colIndex} className={`py-3 px-4 ${column.className || ''}`}>
                      {column.render ? (
                        column.render(row, rowIndex)
                      ) : column.actions ? (
                        <div className="flex gap-2 justify-center">
                          {onView && (
                            <button
                              onClick={() => onView(row)}
                              className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-sm transition-colors"
                            >
                              Lihat
                            </button>
                          )}
                          {onEdit && (
                            <button
                              onClick={() => onEdit(row)}
                              className="px-3 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded text-sm transition-colors"
                            >
                              Edit
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => onDelete(row)}
                              className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-sm transition-colors"
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

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="p-4 border-t">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
              Halaman {currentPage} dari {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Halaman Pertama"
              >
                <ChevronsLeft size={20} />
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Halaman Sebelumnya"
              >
                <ChevronLeft size={20} />
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
                        className={`px-3 py-1 rounded-lg transition-colors ${
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
                    return <span key={pageNum} className="px-2">...</span>;
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Halaman Selanjutnya"
              >
                <ChevronRight size={20} />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Halaman Terakhir"
              >
                <ChevronsRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
