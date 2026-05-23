"use client";

import React, { useState } from 'react';
import { Package, CheckSquare, Square, ChevronDown, ChevronUp, Clock } from 'lucide-react';

interface ShipmentPickerProps {
  availableShipments: any[];
}

export default function ShipmentPicker({ availableShipments }: ShipmentPickerProps) {
  // Kundi la mizigo kwa kila kituo inapoenda
  const groupedShipments: { [key: string]: any[] } = {};
  
  availableShipments.forEach((shipment) => {
    const destName = shipment.destBranch?.name || "Kituo Visivyojulikana";
    if (!groupedShipments[destName]) {
      groupedShipments[destName] = [];
    }
    groupedShipments[destName].push(shipment);
  });

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});

  const handleToggleSingle = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleToggleSelectAll = (branchName: string, shipments: any[]) => {
    const branchIds = shipments.map(s => s.id);
    const allAreSelected = branchIds.every(id => selectedIds.includes(id));

    if (allAreSelected) {
      setSelectedIds(selectedIds.filter(id => !branchIds.includes(id)));
    } else {
      const newSelections = [...selectedIds];
      branchIds.forEach(id => {
        if (!newSelections.includes(id)) {
          newSelections.push(id);
        }
      });
      setSelectedIds(newSelections);
    }
  };

  const toggleSection = (branchName: string) => {
    setOpenSections(prev => ({ ...prev, [branchName]: !prev[branchName] }));
  };

  const destinations = Object.keys(groupedShipments).sort();

  return (
    <div className="space-y-6">
      
      {/* Siri ya Mafanikio: Input za siri zitakazosafiri kwenda kwenye Server Action */}
      {selectedIds.map(id => (
        <input type="hidden" key={id} name="shipmentIds" value={id} />
      ))}

      <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center justify-between border-b border-gray-100 pb-4">
        <span className="flex items-center gap-2">
          <Package className="text-red-600" size={20} /> Pakia Mizigo (Imejipanga kwa Vituo)
        </span>
        <span className="text-sm font-bold bg-red-100 text-red-700 px-4 py-1.5 rounded-full">
          Mizigo {selectedIds.length} Imepakiwa Garini
        </span>
      </h2>

      {destinations.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <Package size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">Hakuna mizigo mipya inayopaswa kusafirishwa kwa sasa.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {destinations.map((branchName) => {
            const shipments = groupedShipments[branchName];
            const branchIds = shipments.map(s => s.id);
            const allSelected = branchIds.every(id => selectedIds.includes(id));
            const isOpen = openSections[branchName] !== false; // Default ipo wazi

            return (
              <div key={branchName} className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                
                {/* KICHWA CHA KITUO (BARAZA LA KITUO) */}
                <div className="bg-white px-5 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <button 
                    type="button"
                    onClick={() => toggleSection(branchName)}
                    className="flex items-center gap-2 font-black text-gray-900 uppercase text-sm hover:text-red-600 transition-colors cursor-pointer"
                  >
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    <span>Kwenda: {branchName}</span>
                    <span className="ml-2 bg-gray-100 text-gray-700 text-xs px-2.5 py-0.5 rounded-full font-black">
                      {shipments.length} {shipments.length === 1 ? 'Mzigo' : 'Mizigo'}
                    </span>
                  </button>

                  {/* KITUFE CHA SELECT ALL CHA KITUO HUSIKA */}
                  <button
                    type="button"
                    onClick={() => handleToggleSelectAll(branchName, shipments)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border cursor-pointer ${
                      allSelected 
                        ? 'bg-red-600 border-red-600 text-white shadow-sm shadow-red-200' 
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {allSelected ? <CheckSquare size={14} /> : <Square size={14} />}
                    {allSelected ? 'Ondoa Zote' : 'Chagua Zote za Hapa'}
                  </button>
                </div>

                {/* LIST YA MIZIGO YA HICHO KITUO */}
                {isOpen && (
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3 bg-gray-50/50">
                    {shipments.map((shipment) => {
                      const isChecked = selectedIds.includes(shipment.id);
                      
                      // HAPA TUNATENGENEZA TAREHE NA SAA YA MZIGO ULIPOPOKELEWA 🔥
                      const dateReceived = new Date(shipment.createdAt).toLocaleDateString('sw-TZ', {
                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                      });

                      return (
                        <div 
                          key={shipment.id}
                          onClick={() => handleToggleSingle(shipment.id)}
                          className={`flex items-start gap-4 p-4 bg-white border rounded-xl cursor-pointer transition-all ${
                            isChecked 
                              ? 'border-red-600 bg-red-50/50 shadow-sm ring-1 ring-red-600' 
                              : 'border-gray-200 hover:border-red-400 hover:bg-red-50/20'
                          }`}
                        >
                          <div className="mt-0.5">
                            <input 
                              type="checkbox" 
                              checked={isChecked}
                              onChange={() => {}} 
                              className="w-5 h-5 accent-red-600 cursor-pointer rounded"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-black text-gray-900 text-sm">{shipment.trackingNumber}</span>
                              
                              <div className="flex flex-col items-end gap-1">
                                <span className="text-[10px] font-bold uppercase bg-gray-100 px-2 py-0.5 rounded text-gray-500">
                                  {shipment.originBranch?.name}
                                </span>
                                {/* TAREHE INATOKEA HAPA 🔥 */}
                                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded flex items-center gap-1" title="Tarehe na muda mzigo ulipopokelewa ofisini">
                                  <Clock size={10} /> {dateReceived}
                                </span>
                              </div>
                            </div>
                            
                            <p className="text-xs text-gray-600 mt-1"><span className="font-bold text-gray-400">Mtumaji:</span> {shipment.senderName}</p>
                            <p className="text-xs text-gray-600"><span className="font-bold text-gray-400">Mpokeaji:</span> {shipment.receiverName}</p>
                            <p className="text-xs text-gray-800 font-bold mt-1 truncate max-w-[250px]" title={shipment.description}>
                              <span className="font-bold text-gray-400 font-normal">Mzigo:</span> {shipment.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}