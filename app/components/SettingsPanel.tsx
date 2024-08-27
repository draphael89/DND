import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface SettingsPanelProps {
  onClose: () => void;
  onVolumeChange: (volume: number) => void;
  onThemeChange: (theme: 'light' | 'dark') => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ onClose, onVolumeChange, onThemeChange }) => {
  const [volume, setVolume] = useState(50);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    onVolumeChange(newVolume);
  };

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    onThemeChange(newTheme);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-display text-accent-400">Settings</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            Close
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Volume</label>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full"
            />
            <span className="text-gray-400">{volume}%</span>
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Theme</label>
            <div className="flex space-x-4">
              <button
                onClick={() => handleThemeChange('light')}
                className={`px-4 py-2 rounded ${theme === 'light' ? 'bg-accent-400 text-white' : 'bg-gray-600 text-gray-300'}`}
              >
                Light
              </button>
              <button
                onClick={() => handleThemeChange('dark')}
                className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-accent-400 text-white' : 'bg-gray-600 text-gray-300'}`}
              >
                Dark
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsPanel;