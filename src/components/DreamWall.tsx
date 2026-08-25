import React, { useState } from 'react';
import { Cloud, Mail, Send } from 'lucide-react';
import { DreamCloud, FutureLetter } from '../types';
import { addCloudMessage } from '../services/scrapbookService';

interface DreamWallProps {
  onAddDream: (dream: DreamCloud) => void;
  onAddLetter: (letter: FutureLetter) => void;
  currentUser?: { email: string; name: string } | null;
}

export default function DreamWall({ onAddDream, onAddLetter, currentUser }: DreamWallProps) {
  const [dream, setDream] = useState('');
  const [letter, setLetter] = useState('');
  const [authorName, setAuthorName] = useState(currentUser?.name || '');
  const [authorEmail, setAuthorEmail] = useState(currentUser?.email || '');

  const submitDream = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dream) return;
    const optimisticId = Math.random().toString();
    onAddDream({ id: optimisticId, goal: dream });
    try {
      await addCloudMessage({
        authorName: authorName || 'Guest',
        authorEmail: authorEmail || '',
        message: dream,
        type: 'Dreams'
      });
    } catch (error) {
      console.error('Failed to save dream:', error);
    }
    setDream('');
  };

  const submitLetter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!letter) return;
    const optimisticId = Math.random().toString();
    onAddLetter({ id: optimisticId, message: letter });
    try {
      await addCloudMessage({
        authorName: authorName || 'Guest',
        authorEmail: authorEmail || '',
        message: letter,
        type: 'Wish'
      });
    } catch (error) {
      console.error('Failed to save letter:', error);
    }
    setLetter('');
  };

  return (
    <div className="plush-card mb-12">
      <h2 className="font-serif text-3xl font-black text-[#5B3E31] mb-8 flex items-center gap-3">
        <Cloud className="text-[#CE3A74]" /> Dream Clouds & Letters
      </h2>
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <form className="bg-white p-6 rounded-[28px] shadow-[0_5px_15px_rgba(186,151,144,0.1)]" onSubmit={submitDream}>
            <h3 className="font-bold text-[#5B3E31] mb-4">Add a Dream Cloud</h3>
            <textarea value={dream} onChange={(e) => setDream(e.target.value)} placeholder="Add your cloud..." className="plush-input mb-4 resize-none h-24" />
            <button type="submit" className={`plush-btn w-full hover-float-button ${dream ? '!bg-[#5B3E31] !text-white' : ''}`}><Send size={18}/> Save Dream</button>
        </form>
        <form className="bg-white p-6 rounded-[28px] shadow-[0_5px_15px_rgba(186,151,144,0.1)]" onSubmit={submitLetter}>
            <h3 className="font-bold text-[#5B3E31] mb-4">Add a Letter to Future Me</h3>
            <textarea value={letter} onChange={(e) => setLetter(e.target.value)} placeholder="Dear Future Me..." className="plush-input mb-4 resize-none h-24" />
            <button type="submit" className={`plush-btn w-full hover-float-button ${letter ? '!bg-[#5B3E31] !text-white' : ''}`}><Send size={18}/> Seal Letter</button>
        </form>
      </div>
    </div>
  );
}
