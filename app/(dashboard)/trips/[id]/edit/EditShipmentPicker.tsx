"use client";

import React, { useState } from 'react';
import { Package, CheckSquare, Square, ChevronDown, ChevronUp, Clock } from 'lucide-react';

interface EditShipmentPickerProps {
  availableShipments: any[];
  initialSelectedIds: string[];
}

export default function EditShipmentPicker({ availableShipments, initialSelectedIds }: EditShipmentPickerProps) {
  const groupedShipments: { [key: string]: any[] } = {};
  
  availableShipments.forEach((shipment) => {
    const destName = shipment.destBranch?.name || "Kituo Visivyojulikana";
    if (!groupedShipments[destName]) {
      groupedShipments[destName] = [];
    }
    groupedShipments[destName].push(shipment);
  });

  // Hapa tunaweka mzigo iliyokuwepo kwenye gari kuwa "Ticked" tayari!
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedIds);
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
    <div className="space-y-6 mt-6 border-t border-gray-100 pt-6">
      
      {/* INPUT ZA SIRI ZA MIZIGO YOTE (YA ZAMANI NA MIPYA) */}
      {selectedIds.map(id => (
        <input type="hidden" key={id} name="shipmentIds" value={id} />
      ))}

      <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <Package className="text-red-600" size={20} /> Orodha ya Mizigo Kwenye Gari Hili
        </span>
        <span className="text-sm font-bold bg-red-100 text-red-700 px-4 py-1.5 rounded-full">
          Mizigo {selectedIds.length} Imechaguliwa
        </span>
      </h2>

      {destinations.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <Package size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">Hakuna mizigo inayopatikana.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {destinations.map((branchName) => {
            const shipments = groupedShipments[branchName];
            const branchIds = shipments.map(s => s.id);
            const allSelected = branchIds.every(id => selectedIds.includes(id));
            const isOpen = openSections[branchName] !== false;

            return (
              <div key={branchName} className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="bg-white px-5 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <button 
                    type="button"
                    onClick={() => toggleSection(branchName)}
                    className="flex items-center gap-2 font-black text-gray-900 uppercase text-sm hover:text-red-600 transition-colors cursor-pointer"
                  >
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    <span>Kwenda: {branchName}</span>
                    <span className="ml-2 bg-gray-100 text-gray-700 text-xs px-2.5 py-0.5 rounded-full font-black">
                      {shipments.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleSelectAll(branchName, shipments)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border cursor-pointer ${
                      allSelected ? 'bg-red-600 border-red-600 text-white' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {allSelected ? <CheckSquare size={14} /> : <Square size={14} />}
                    {allSelected ? 'Ondoa Zote' : 'Chagua Zote'}
                  </button>
                </div>

                {isOpen && (
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3 bg-gray-50/50">
                    {shipments.map((shipment) => {
                      const isChecked = selectedIds.includes(shipment.id);
                      const isNew = !initialSelectedIds.includes(shipment.id); // Kutofautisha mpya na ya zamani
                      const dateReceived = new Date(shipment.createdAt).toLocaleDateString('sw-TZ', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

                      return (
                        <div 
                          key={shipment.id}
                          onClick={() => handleToggleSingle(shipment.id)}
                          className={`flex items-start gap-4 p-4 bg-white border rounded-xl cursor-pointer transition-all ${
                            isChecked ? 'border-red-600 bg-red-50/50 ring-1 ring-red-600' : 'border-gray-200 hover:border-red-400'
                          }`}
                        >
                          <div className="mt-0.5">
                            <input type="checkbox" checked={isChecked} onChange={() => {}} className="w-5 h-5 accent-red-600 cursor-pointer" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-black text-gray-900 text-sm flex items-center gap-2">
                                {shipment.trackingNumber}
                                {isNew && <span className="text-[9px] bg-green-500 text-white px-1.5 py-0.5 rounded-full animate-pulse">MPYA</span>}
                              </span>
                              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded flex items-center gap-1">
                                <Clock size={10} /> {dateReceived}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600"><span className="font-bold">Kutoka:</span> {shipment.senderName}</p>
                            <p className="text-xs text-gray-600"><span className="font-bold">Kwenda:</span> {shipment.receiverName}</p>
                            <p className="text-xs text-gray-800 font-bold mt-1 truncate">{shipment.description}</p>
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