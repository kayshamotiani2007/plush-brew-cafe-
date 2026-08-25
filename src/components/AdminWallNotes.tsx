/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { WallNote } from '../types';
import { Trash2 } from 'lucide-react';

interface AdminWallNotesProps {
  wallNotes: WallNote[];
  deleteWallNote: (id: string) => void;
}

export default function AdminWallNotes({ wallNotes, deleteWallNote }: AdminWallNotesProps) {
  return (
    <div className="space-y-6 animate-fade-in" id="wall-tabpanel">
       <h4 className="font-serif text-lg font-bold text-[#3A2D27]">Virtual Wall Moderation</h4>
       <div className="grid md:grid-cols-2 gap-4">
         {wallNotes.map(n => (
           <div key={n.id} className="p-4 border rounded-xl bg-white shadow-sm flex items-start justify-between">
             <div>
               <p className="text-sm font-bold">{n.name} <span className="text-[10px] text-gray-400">({n.type})</span></p>
               <p className="text-xs text-gray-600 mt-1">"{n.message}"</p>
             </div>
             <button onClick={() => deleteWallNote(n.id)} className="text-red-500 hover:text-red-700 p-2 cursor-pointer">
               <Trash2 size={16} />
             </button>
           </div>
         ))}
       </div>
    </div>
  );
}
