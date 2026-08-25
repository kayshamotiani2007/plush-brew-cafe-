import React, { useState, useEffect } from 'react';
import { DreamCloud, FutureLetter, Polaroid, ComfortSong } from '../types';
import DreamWall from './DreamWall';
import ComfortWall from './ComfortWall';
import HangingString from './HangingString';
import { Mail, Music } from 'lucide-react';
import { fetchScrapbookEntries, fetchComfortSongs, fetchCloudMessages } from '../services/scrapbookService';
import { useAuth } from '../context/AuthContext.jsx';

function getYouTubeId(url: string | undefined): string | null {
  if (!url) return null;
  try {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2] && match[2].length === 11) ? match[2] : null;
  } catch (error) {
    console.warn('⚠️ Failed to parse YouTube URL:', url, error);
    return null;
  }
}

function YouTubeEmbed({ videoId, title }: { videoId: string; title: string }) {
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;

  return (
    <div className="relative">
      <iframe 
        width="100%" 
        height="140" 
        src={`https://www.youtube.com/embed/${videoId}?autoplay=0&modestbranding=1&rel=0`} 
        title={`${title} - YouTube video player`} 
        frameBorder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        loading="lazy"
      />
      <a href={watchUrl} target="_blank" rel="noopener noreferrer"
         className="absolute bottom-1 right-1 bg-purple-600/90 text-white text-[10px] px-2 py-0.5 rounded hover:bg-purple-700 transition-colors opacity-0 hover:opacity-100 focus:opacity-100">
        Watch on YouTube →
      </a>
    </div>
  );
}

export default function VirtualWall() {
  const [dreams, setDreams] = useState([]);
  const [letters, setLetters] = useState([]);
  const [polaroids, setPolaroids] = useState([]);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();

  const loadScrapbookData = async () => {
    setLoading(true);
    try {
      const [entries, songData, cloudMessages] = await Promise.all([
        fetchScrapbookEntries(),
        fetchComfortSongs(),
        fetchCloudMessages()
      ]);
      
      const loadedPolaroids = entries
        .filter(e => e.image_url)
        .map(e => ({
          id: String(e.id),
          caption: e.caption || e.memory,
          image: e.image_url,
        }));
      
      const loadedSongs = songData.map(s => ({
        id: String(s.id),
        title: s.song_name || 'Comfort Song',
        artist: s.artist || 'Unknown',
        note: '',
        mediaUrl: s.youtube_link || s.spotify_link,
      }));

      const loadedDreams = cloudMessages
        .filter(c => c.message_type === 'Dreams' || c.message_type === 'Gratitude')
        .map(c => ({ id: String(c.id), goal: c.message }));
      
      const loadedLetters = cloudMessages
        .filter(c => c.message_type === 'Wish' || c.message_type === 'Message')
        .map(c => ({ id: String(c.id), message: c.message }));

      setDreams(loadedDreams);
      setLetters(loadedLetters);
      setPolaroids(loadedPolaroids);
      setSongs(loadedSongs);
    } catch (error) {
      console.error('Failed to load scrapbook data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadScrapbookData();
  }, []);

  const addDream = (dream) => {
    setDreams([...dreams, dream]);
  };

  const addLetter = (letter) => {
    setLetters([...letters, letter]);
  };

  const addPolaroid = (polaroid) => {
    setPolaroids([...polaroids, polaroid]);
  };

  const addSong = (song) => {
    setSongs([...songs, song]);
  };

  useEffect(() => {
    const interval = setInterval(loadScrapbookData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-[#7A6054] font-serif">Loading your scrapbook memories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
        <h1 className="font-serif text-5xl font-black text-[#5B3E31] text-center mb-8">Plush Brew Scrapbook</h1>
        
        <div className="flex flex-wrap justify-center items-start gap-8 mb-12 min-h-[200px]">
            {dreams.map((d, i) => (
                <div key={`dream-${d.id || i}`} className="transform transition-all hover:scale-105 duration-300">
                    <HangingString>
                        <div className="bg-[#FFF8F0] p-4 rounded-full shadow-sm text-sm font-serif max-w-xs text-center border border-pink-100/50 hover:shadow-md">
                            {d.goal} ☁️
                        </div>
                    </HangingString>
                </div>
            ))}
            {letters.map((l, i) => (
                <div key={`letter-${l.id || i}`} className="transform transition-all hover:rotate-2 duration-300">
                    <HangingString>
                        <div className="bg-white p-4 rounded-lg shadow-sm text-sm font-serif border border-pink-100 max-w-xs text-center hover:shadow-md">
                            <Mail className="inline mr-2 text-pink-400" size={16}/> {l.message} 💌
                        </div>
                    </HangingString>
                </div>
            ))}
            {polaroids.map((p, i) => (
                <div key={`polaroid-${p.id || i}`} className="transform transition-all hover:-rotate-2 duration-300">
                    <HangingString>
                        <div className="bg-white p-3 pb-8 shadow-md text-sm font-serif rotate-[2deg] border border-gray-100 w-48 text-center hover:shadow-xl">
                            {p.image && <img src={p.image} className="w-full h-40 object-cover mx-auto mb-3 rounded-sm border border-gray-100" alt={p.caption || 'Polaroid'} />}
                            <div className="text-gray-700 italic">{p.caption} 📸</div>
                        </div>
                    </HangingString>
                </div>
            ))}
            {songs.map((s, i) => {
                const ytId = s.mediaUrl ? getYouTubeId(s.mediaUrl) : null;
                const isDirectVideo = s.mediaUrl && (s.mediaUrl.includes('.mp4') || s.mediaUrl.includes('.webm') || s.mediaUrl.includes('video/'));

                return (
                <div key={`song-${s.id || i}`} className="transform transition-all hover:scale-105 duration-300 z-10 hover:z-50 relative">
                    <HangingString>
                        <div className="bg-[#E6D6FF] p-4 rounded-xl shadow-sm text-sm font-serif border border-purple-200 w-64 text-center hover:shadow-xl transition-shadow bg-opacity-95 backdrop-blur-sm">
                            <div className="font-bold text-purple-900 flex items-center justify-center gap-2">
                                <Music className="text-purple-500" size={16}/> 
                                <span className="truncate">{s.title || 'Comfort Song'}</span>
                            </div>
                            {ytId && (
                                <div className="mt-3 rounded-lg overflow-hidden border border-purple-300 shadow-inner bg-black">
                                    <YouTubeEmbed videoId={ytId} title={s.title || 'Comfort Song'} />
                                </div>
                            )}
                            {isDirectVideo && (
                                <div className="mt-3 rounded-lg overflow-hidden border border-purple-300 shadow-inner bg-black">
                                    <video 
                                        width="100%" 
                                        height="140" 
                                        controls 
                                        preload="metadata"
                                    >
                                        <source src={s.mediaUrl} type="video/mp4" />
                                        <source src={s.mediaUrl} type="video/webm" />
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            )}
                            {!ytId && !isDirectVideo && s.mediaUrl && (
                                <div className="mt-2">
                                    <a href={s.mediaUrl} target="_blank" rel="noopener noreferrer" 
                                       className="text-xs text-purple-600 hover:text-purple-800 underline break-all">
                                        {s.mediaUrl}
                                    </a>
                                </div>
                            )}
                        </div>
                    </HangingString>
                </div>
                );
            })}
        </div>

<DreamWall onAddDream={addDream} onAddLetter={addLetter} currentUser={currentUser} />
         <ComfortWall onAddPolaroid={addPolaroid} onAddSong={addSong} currentUser={currentUser} />
     </div>
  );
}