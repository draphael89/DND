import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { motion } from 'framer-motion';

interface ProgressData {
  progress: number;
}

export default function StoryGenerator() {
  const [story, setStory] = useState('');
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const socket: Socket = io();
    
    socket.on('generate-progress', (data: ProgressData) => {
      setProgress(data.progress);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const generateStory = async () => {
    setIsLoading(true);
    setError('');
    const socket: Socket = io();
    socket.emit('generate-start', {});

    try {
      const response = await fetch('/api/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ /* character, currentState, action */ }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate story');
      }

      const data = await response.json();
      setStory(data.story);
    } catch (err) {
      setError('An error occurred while generating the story. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <button
        onClick={generateStory}
        disabled={isLoading}
        className="bg-accent text-primary px-6 py-2 rounded-full hover:bg-accent-600 transition-colors disabled:opacity-50"
      >
        Generate Story
      </button>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4"
        >
          <p>Generating: {progress}%</p>
          <div className="w-full bg-secondary rounded-full h-2 mt-2">
            <motion.div
              className="bg-accent h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            ></motion.div>
          </div>
        </motion.div>
      )}
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {story && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 bg-surface p-4 rounded-lg"
        >
          <p>{story}</p>
        </motion.div>
      )}
    </div>
  );
}