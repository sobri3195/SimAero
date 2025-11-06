import React, { useState } from 'react';
import { Bed, User, X, AlertCircle } from 'lucide-react';

const BedLayout = ({ beds, inpatients, onMoveBed, onDischarge, onSetBedStatus, selectedRoom }) => {
  const [draggedPatient, setDraggedPatient] = useState(null);
  const [selectedBed, setSelectedBed] = useState(null);

  const getBedStatusColor = (status) => {
    switch (status) {
      case 'kosong':
        return 'bg-green-100 border-green-400 text-green-800';
      case 'terisi':
        return 'bg-red-100 border-red-400 text-red-800';
      case 'dibersihkan':
        return 'bg-blue-100 border-blue-400 text-blue-800';
      case 'maintenance':
        return 'bg-yellow-100 border-yellow-400 text-yellow-800';
      default:
        return 'bg-gray-100 border-gray-400 text-gray-800';
    }
  };

  const getBedStatusLabel = (status) => {
    switch (status) {
      case 'kosong':
        return 'Tersedia';
      case 'terisi':
        return 'Terisi';
      case 'dibersihkan':
        return 'Dibersihkan';
      case 'maintenance':
        return 'Dalam Perawatan';
      default:
        return status;
    }
  };

  const getInpatientForBed = (bedId) => {
    return inpatients.find(i => i.bedId === bedId);
  };

  const handleDragStart = (e, inpatient) => {
    e.dataTransfer.effectAllowed = 'move';
    setDraggedPatient(inpatient);
  };

  const handleDragOver = (e, bed) => {
    e.preventDefault();
    if (bed.status === 'kosong' || bed.status === 'dibersihkan') {
      e.dataTransfer.dropEffect = 'move';
    } else {
      e.dataTransfer.dropEffect = 'none';
    }
  };

  const handleDrop = async (e, targetBed) => {
    e.preventDefault();
    
    if (!draggedPatient) return;
    
    if (targetBed.status === 'kosong' || targetBed.status === 'dibersihkan') {
      await onMoveBed(draggedPatient, targetBed);
    }
    
    setDraggedPatient(null);
  };

  const handleDragEnd = () => {
    setDraggedPatient(null);
  };

  const filteredBeds = selectedRoom 
    ? beds.filter(b => b.roomType === selectedRoom)
    : beds;

  const bedsByRoom = filteredBeds.reduce((acc, bed) => {
    if (!acc[bed.roomNumber]) acc[bed.roomNumber] = [];
    acc[bed.roomNumber].push(bed);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 border-2 border-green-400 rounded"></div>
          <span>Tersedia</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-100 border-2 border-red-400 rounded"></div>
          <span>Terisi</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-100 border-2 border-blue-400 rounded"></div>
          <span>Dibersihkan</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-400 rounded"></div>
          <span>Dalam Perawatan</span>
        </div>
      </div>

      {Object.entries(bedsByRoom).map(([roomNumber, roomBeds]) => (
        <div key={roomNumber} className="border rounded-lg p-4 bg-gray-50">
          <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Bed className="text-gray-600" />
            {roomNumber}
            <span className="text-sm text-gray-500 font-normal">
              ({roomBeds[0]?.roomType})
            </span>
          </h4>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {roomBeds.map(bed => {
              const inpatient = getInpatientForBed(bed.id);
              const isSelected = selectedBed === bed.id;
              
              return (
                <div
                  key={bed.id}
                  className={`
                    relative p-3 rounded-lg border-2 transition-all
                    ${getBedStatusColor(bed.status)}
                    ${isSelected ? 'ring-2 ring-blue-500 scale-105' : ''}
                    ${bed.status === 'kosong' || bed.status === 'dibersihkan' ? 'cursor-pointer hover:scale-105' : ''}
                    ${draggedPatient && (bed.status === 'kosong' || bed.status === 'dibersihkan') ? 'ring-2 ring-green-500 ring-offset-2' : ''}
                  `}
                  onClick={() => setSelectedBed(isSelected ? null : bed.id)}
                  onDragOver={(e) => handleDragOver(e, bed)}
                  onDrop={(e) => handleDrop(e, bed)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1">
                      <Bed size={16} />
                      <span className="font-bold text-sm">{bed.bedNumber}</span>
                    </div>
                    {bed.status === 'terisi' && inpatient && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDischarge(inpatient);
                        }}
                        className="text-red-600 hover:text-red-800"
                        title="Pulangkan Pasien"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  <div className="text-xs font-medium mb-1">
                    {getBedStatusLabel(bed.status)}
                  </div>

                  {inpatient && (
                    <div
                      className="mt-2 p-2 bg-white bg-opacity-50 rounded cursor-move"
                      draggable
                      onDragStart={(e) => handleDragStart(e, inpatient)}
                      onDragEnd={handleDragEnd}
                    >
                      <div className="flex items-center gap-1 mb-1">
                        <User size={12} />
                        <span className="text-xs font-semibold truncate">
                          {inpatient.patientName}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 truncate">
                        {inpatient.diagnosis}
                      </div>
                      {inpatient.admitDate && (
                        <div className="text-xs text-gray-500 mt-1">
                          {Math.floor((new Date() - new Date(inpatient.admitDate)) / (1000 * 60 * 60 * 24))} hari
                        </div>
                      )}
                    </div>
                  )}

                  {isSelected && bed.status !== 'terisi' && (
                    <div className="absolute -bottom-12 left-0 right-0 z-10 bg-white border rounded shadow-lg p-2 text-xs space-y-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSetBedStatus(bed.id, 'kosong');
                          setSelectedBed(null);
                        }}
                        className="w-full text-left px-2 py-1 hover:bg-green-100 rounded"
                      >
                        Set Tersedia
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSetBedStatus(bed.id, 'dibersihkan');
                          setSelectedBed(null);
                        }}
                        className="w-full text-left px-2 py-1 hover:bg-blue-100 rounded"
                      >
                        Set Dibersihkan
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSetBedStatus(bed.id, 'maintenance');
                          setSelectedBed(null);
                        }}
                        className="w-full text-left px-2 py-1 hover:bg-yellow-100 rounded"
                      >
                        Set Maintenance
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {Object.keys(bedsByRoom).length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <AlertCircle size={48} className="mx-auto mb-4 opacity-50" />
          <p>Tidak ada tempat tidur tersedia</p>
        </div>
      )}
    </div>
  );
};

export default BedLayout;
