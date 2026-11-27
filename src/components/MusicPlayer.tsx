import { Volume2, VolumeX } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { resolveMediaUrl } from '../config/loadConfig';
import type { WeddingConfig } from '../config/schema';
import { useLanguage } from '../i18n/useLanguage';

interface MusicPlayerProps {
  config: WeddingConfig;
  autoStartTrigger?: number;
}

export function MusicPlayer({ config, autoStartTrigger = 0 }: MusicPlayerProps) {
  const { t, pickText } = useLanguage();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const src = config.music?.src ? resolveMediaUrl(config.music.src) : '';
  const title = config.music?.title ? pickText(config.music.title) : '';

  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      audio?.pause();
    };
  }, []);

  useEffect(() => {
    if (autoStartTrigger <= 0) return;
    const audio = audioRef.current;
    if (!audio) return;

    const result = audio.play();
    if (result && typeof result.then === 'function') {
      result.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    } else {
      setIsPlaying(true);
    }
  }, [autoStartTrigger]);

  if (!src) return null;

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    }
  };

  return (
    <div className="music-player">
      <audio ref={audioRef} src={src} loop preload="none" />
      <button
        type="button"
        className={`music-player__btn${isPlaying ? ' music-player__btn--playing' : ''}`}
        onClick={togglePlay}
        aria-label={isPlaying ? t.music.pause : t.music.play}
        aria-pressed={isPlaying}
        title={title || (isPlaying ? t.music.pause : t.music.play)}
      >
        {isPlaying ? (
          <Volume2 size={20} aria-hidden="true" />
        ) : (
          <VolumeX size={20} aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
