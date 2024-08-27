import { useState, useEffect } from 'react';

export function useAudio(initialSrc: string) {
  const [audio] = useState(new Audio(initialSrc));
  const [playing, setPlaying] = useState(false);

  const toggle = () => setPlaying(!playing);

  useEffect(() => {
    playing ? audio.play() : audio.pause();
  }, [playing, audio]);

  useEffect(() => {
    audio.addEventListener('ended', () => setPlaying(false));
    return () => {
      audio.removeEventListener('ended', () => setPlaying(false));
    };
  }, [audio]);

  const changeSrc = (newSrc: string) => {
    audio.src = newSrc;
    if (playing) {
      audio.play();
    }
  };

  return { playing, toggle, changeSrc };
}