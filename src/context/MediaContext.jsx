import React, { createContext, useState, useRef, useCallback, useEffect } from 'react';

export const MediaContext = createContext({
  playingMedia: null,
  registerMedia: () => {},
  unregisterMedia: () => {},
  playMedia: () => {},
  pauseMedia: () => {},
});

export function MediaProvider({ children }) {
  const [playingMedia, setPlayingMedia] = useState(null);
  const persistentIframeRef = useRef(null);

  const registerMedia = useCallback((id, type) => {
    // Store media state for persistence
  }, []);

  const unregisterMedia = useCallback((id) => {}, []);

  const playMedia = useCallback((id, url) => {
    setPlayingMedia({ id, playing: true, url });
  }, []);

  const pauseMedia = useCallback((id) => {
    setPlayingMedia(prev => prev?.id === id ? { ...prev, playing: false } : prev);
  }, []);

  return (
    <MediaContext.Provider value={{ playingMedia, registerMedia, unregisterMedia, playMedia, pauseMedia }}>
      {children}
      {playingMedia?.playing && playingMedia?.url && (
        <div style={{ position: 'fixed', bottom: 0, right: 0, width: 1, height: 1, overflow: 'hidden', zIndex: -1 }}>
          <iframe
            ref={persistentIframeRef}
            src={playingMedia.url}
            title="Persistent Audio Player"
            style={{ width: 1, height: 1, opacity: 0 }}
            allow="autoplay"
          />
        </div>
      )}
    </MediaContext.Provider>
  );
}