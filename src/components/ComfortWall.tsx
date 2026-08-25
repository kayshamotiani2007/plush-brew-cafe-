import React, { useState, useRef } from 'react';
import { Camera, Music, Send, Search, Image as ImageIcon } from 'lucide-react';
import { Polaroid, ComfortSong } from '../types';
import { addPolaroidEntry, addSongEntry } from '../services/scrapbookService';

interface ComfortWallProps {
  onAddPolaroid: (polaroid: Polaroid) => void;
  onAddSong: (song: ComfortSong) => void;
  currentUser?: { email: string; name: string } | null;
}

export default function ComfortWall({ onAddPolaroid, onAddSong, currentUser }: ComfortWallProps) {
  const [caption, setCaption] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [authorName, setAuthorName] = useState(currentUser?.name || '');
  const [authorEmail, setAuthorEmail] = useState(currentUser?.email || '');

  const [song, setSong] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitPolaroid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption && !imagePreview) return;
    
    const optimisticId = Math.random().toString();
    onAddPolaroid({ id: optimisticId, caption: caption, image: imagePreview });
    
    if (imageFile) {
      const formData = new FormData();
      formData.append('uploaderName', authorName || 'Guest');
      formData.append('uploaderEmail', authorEmail || '');
      formData.append('caption', caption);
      formData.append('image', imageFile);
      try {
        await addPolaroidEntry(formData);
      } catch (error) {
        console.error('Failed to save polaroid:', error);
      }
    }
    
    setCaption('');
    setImagePreview('');
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const submitSong = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!song && !mediaUrl) return;

    let finalTitle = song;
    let finalUrl = mediaUrl;

    if (!finalUrl && (song.includes('youtube.com') || song.includes('youtu.be'))) {
      finalUrl = song;
      finalTitle = 'My Comfort Video';
    }

    const optimisticId = Math.random().toString();
    onAddSong({ id: optimisticId, title: finalTitle, artist: 'Unknown', note: '', mediaUrl: finalUrl });
    
    const formData = new FormData();
    formData.append('authorName', authorName || 'Guest');
    formData.append('authorEmail', authorEmail || '');
    formData.append('songName', finalTitle);
    formData.append('youtubeLink', finalUrl);
    formData.append('memory', `Shared: ${finalTitle}`);
    try {
      await addSongEntry(formData);
    } catch (error) {
      console.error('Failed to save song:', error);
    }
    
    setSong('');
    setMediaUrl('');
  };

  return (
    <div className="plush-card mb-12">
      <h2 className="font-serif text-3xl font-black text-[#5B3E31] mb-8 flex items-center gap-3">
        <Camera className="text-[#CE3A74]" /> Comfort Corner
      </h2>
      <div className="grid md:grid-cols-2 gap-6 mb-8">
<form className="bg-white p-6 rounded-[28px] shadow-[0_5px_15px_rgba(186,151,144,0.1)]" onSubmit={submitPolaroid}>
           <h3 className="font-bold text-[#5B3E31] mb-4">Add a Polaroid Memory</h3>
          
          <div className="mb-4">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-[#5B3E31] hover:text-[#CE3A74] transition-colors bg-[#FAF4F2] p-4 rounded-[50px] justify-center hover-float-button">
              <ImageIcon size={18} />
              <span className="font-bold">Upload a Photo</span>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageChange}
                ref={fileInputRef}
              />
            </label>
            {imagePreview && (
              <div className="mt-4 flex justify-center">
                <img src={imagePreview} alt="Preview" className="w-24 h-24 object-cover rounded-xl border-2 border-white shadow-md" />
              </div>
            )}
          </div>

          <input type="text" value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Polaroid Caption..." className="plush-input mb-4" />
          <button type="submit" className={`plush-btn w-full hover-float-button ${(caption || imagePreview) ? '!bg-[#5B3E31] !text-white' : ''}`}><Send size={18}/> Pin Photo</button>
        </form>
<form className="bg-white p-6 rounded-[28px] shadow-[0_5px_15px_rgba(186,151,144,0.1)]" onSubmit={submitSong}>
           <h3 className="font-bold text-[#5B3E31] mb-4">Add a Comfort Song</h3>
          
          <label className="block text-xs font-mono font-bold text-[#5B3E31]/70 mb-2 ml-4 uppercase tracking-wider">1. Search for a song</label>
          <div className="flex gap-2 mb-4">
            <input type="text" value={song} onChange={(e) => setSong(e.target.value)} placeholder="Song Title..." className="plush-input" />
            <a 
              href={song ? `https://www.youtube.com/results?search_query=${encodeURIComponent(song)}` : undefined}
              target="_blank" 
              rel="noopener noreferrer" 
              className={`plush-btn whitespace-nowrap hover-float-button px-4 ${!song ? '!bg-gray-200 !text-gray-400 cursor-not-allowed pointer-events-none' : '!bg-red-100 !text-red-700 hover:!bg-red-200'}`}
            >
              <Search size={16} /> 
            </a>
          </div>

          <label className="block text-xs font-mono font-bold text-[#5B3E31]/70 mb-2 ml-4 uppercase tracking-wider">2. Paste Link to Embed Video</label>
          <input type="url" value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)} placeholder="Paste YouTube Link here..." className="plush-input mb-6" required />

          <button type="submit" className={`plush-btn w-full hover-float-button ${(song || mediaUrl) ? '!bg-[#5B3E31] !text-white' : ''}`}><Send size={18}/> Pin Video</button>
        </form>
      </div>
    </div>
  );
}