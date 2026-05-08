"use client"; // Hii inaiambia Next.js kuwa hiki ni kijisehemu cha Browser (Client)

import React from 'react';
import { updateShipmentStatus } from '../../actions/status';

export default function StatusSelect({ id, currentStatus }: { id: string, currentStatus: string }) {
  return (
    <form action={updateShipmentStatus}>
      <input type="hidden" name="id" value={id} />
      <select 
        name="status" 
        defaultValue={currentStatus}
        onChange={(e) => e.target.form?.submit()}
        className="text-[10px] font-black uppercase tracking-tighter px-3 py-1.5 rounded-full border border-gray-200 cursor-pointer outline-none hover:border-red-300"
      >
        <option value="RECEIVED">📦 Imepokelewa</option>
        <option value="IN_TRANSIT">🚚 Njiani</option>
        <option value="ARRIVED">📍 Imefika</option>
        <option value="DELIVERED">✅ Imekabidhiwa</option>
      </select>
    </form>
  );
}