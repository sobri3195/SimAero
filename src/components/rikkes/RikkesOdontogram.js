import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';

const RikkesOdontogram = ({ dentalData, onChange, readOnly = false }) => {
  const { theme } = useApp();
  const [selectedTooth, setSelectedTooth] = useState(null);

  const teethNumbers = {
    upper: [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28],
    lower: [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38]
  };

  const conditions = [
    { id: 'sehat', label: 'Sehat', color: '#10b981', symbol: '' },
    { id: 'karies', label: 'Karies (D)', color: '#ef4444', symbol: 'K' },
    { id: 'tambalan', label: 'Tambalan (F)', color: '#3b82f6', symbol: 'T' },
    { id: 'hilang', label: 'Hilang (M)', color: '#6b7280', symbol: 'X' },
    { id: 'sisa_akar', label: 'Sisa Akar', color: '#f97316', symbol: 'R' },
    { id: 'mahkota', label: 'Mahkota', color: '#8b5cf6', symbol: 'C' }
  ];

  const getToothCondition = (toothNumber) => {
    return dentalData?.teeth?.[toothNumber] || 'sehat';
  };

  const handleToothClick = (toothNumber) => {
    if (readOnly) return;
    setSelectedTooth(toothNumber);
  };

  const handleConditionSelect = (condition) => {
    if (!selectedTooth || readOnly) return;

    const updatedTeeth = {
      ...dentalData?.teeth,
      [selectedTooth]: condition
    };

    const scores = calculateDMFT(updatedTeeth);

    onChange({
      ...dentalData,
      teeth: updatedTeeth,
      dmft: scores
    });

    setSelectedTooth(null);
  };

  const calculateDMFT = (teeth) => {
    let decayed = 0;
    let missing = 0;
    let filled = 0;

    Object.values(teeth).forEach(condition => {
      if (condition === 'karies') decayed++;
      if (condition === 'hilang') missing++;
      if (condition === 'tambalan') filled++;
    });

    return {
      decayed,
      missing,
      filled,
      total: decayed + missing + filled
    };
  };

  const getConditionColor = (condition) => {
    const conditionObj = conditions.find(c => c.id === condition);
    return conditionObj?.color || '#10b981';
  };

  const getConditionSymbol = (condition) => {
    const conditionObj = conditions.find(c => c.id === condition);
    return conditionObj?.symbol || '';
  };

  const renderTooth = (toothNumber) => {
    const condition = getToothCondition(toothNumber);
    const isSelected = selectedTooth === toothNumber;
    const color = getConditionColor(condition);
    const symbol = getConditionSymbol(condition);

    return (
      <button
        key={toothNumber}
        onClick={() => handleToothClick(toothNumber)}
        disabled={readOnly}
        className={`relative w-12 h-16 rounded-lg border-2 flex flex-col items-center justify-center transition-all ${
          isSelected ? 'ring-4 ring-blue-400 scale-110' : ''
        } ${!readOnly ? 'hover:scale-105 cursor-pointer' : 'cursor-default'}`}
        style={{ 
          backgroundColor: color,
          borderColor: color,
          opacity: condition === 'sehat' ? 0.3 : 1
        }}
      >
        <span className="text-xs font-bold text-white">{toothNumber}</span>
        {symbol && (
          <span className="text-lg font-bold text-white">{symbol}</span>
        )}
      </button>
    );
  };

  const dmft = dentalData?.dmft || calculateDMFT(dentalData?.teeth || {});

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-bold text-blue-900 mb-4">Odontogram Interaktif</h3>
        
        <div className="space-y-6">
          <div>
            <div className="text-xs text-gray-600 mb-2 text-center">Gigi Atas</div>
            <div className="flex justify-center gap-1">
              {teethNumbers.upper.map(toothNumber => renderTooth(toothNumber))}
            </div>
          </div>

          <div className="border-t-2 border-gray-300 my-4"></div>

          <div>
            <div className="text-xs text-gray-600 mb-2 text-center">Gigi Bawah</div>
            <div className="flex justify-center gap-1">
              {teethNumbers.lower.map(toothNumber => renderTooth(toothNumber))}
            </div>
          </div>
        </div>
      </div>

      {!readOnly && selectedTooth && (
        <div className="bg-white border-2 border-blue-500 rounded-lg p-4">
          <h4 className="font-bold text-gray-900 mb-3">
            Pilih Kondisi untuk Gigi {selectedTooth}
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {conditions.map((condition) => (
              <button
                key={condition.id}
                onClick={() => handleConditionSelect(condition.id)}
                className="flex items-center gap-2 p-3 rounded-lg border-2 hover:scale-105 transition-all"
                style={{ 
                  borderColor: condition.color,
                  backgroundColor: `${condition.color}20`
                }}
              >
                <div 
                  className="w-6 h-6 rounded flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: condition.color }}
                >
                  {condition.symbol}
                </div>
                <span className="text-sm font-semibold text-gray-700">{condition.label}</span>
              </button>
            ))}
          </div>
          <button
            onClick={() => setSelectedTooth(null)}
            className="w-full mt-3 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-semibold"
          >
            Batal
          </button>
        </div>
      )}

      <div className="bg-white border rounded-lg p-4">
        <h4 className="font-bold text-gray-900 mb-4">Skor DMF-T (Decayed, Missing, Filled Teeth)</h4>
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-red-600">{dmft.decayed}</div>
            <div className="text-xs text-gray-600 mt-1">Decayed (D)</div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-gray-600">{dmft.missing}</div>
            <div className="text-xs text-gray-600 mt-1">Missing (M)</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">{dmft.filled}</div>
            <div className="text-xs text-gray-600 mt-1">Filled (F)</div>
          </div>
          <div className="rounded-lg p-4 text-center" style={{ backgroundColor: `${theme.primaryColor}20` }}>
            <div className="text-3xl font-bold" style={{ color: theme.primaryColor }}>{dmft.total}</div>
            <div className="text-xs text-gray-600 mt-1">Total DMF-T</div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-2 text-sm">Keterangan:</h4>
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
          {conditions.map((condition) => (
            <div key={condition.id} className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: condition.color, fontSize: '8px' }}
              >
                {condition.symbol}
              </div>
              <span>{condition.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RikkesOdontogram;
