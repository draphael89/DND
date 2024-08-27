import React from 'react';
import { FaUser, FaSuitcase, FaScroll, FaCog } from 'react-icons/fa';

interface GameSidebarProps {
  onCharacterClick: () => void;
  onInventoryClick: () => void;
  onQuestLogClick: () => void;
  onSettingsClick: () => void;
}

const GameSidebar: React.FC<GameSidebarProps> = ({
  onCharacterClick,
  onInventoryClick,
  onQuestLogClick,
  onSettingsClick
}) => {
  return (
    <div className="fixed left-0 top-16 bottom-0 w-16 bg-gray-800 flex flex-col items-center py-4 space-y-6">
      <button onClick={onCharacterClick} className="text-gray-300 hover:text-accent-400 transition-colors">
        <FaUser size={24} />
      </button>
      <button onClick={onInventoryClick} className="text-gray-300 hover:text-accent-400 transition-colors">
        <FaSuitcase size={24} />
      </button>
      <button onClick={onQuestLogClick} className="text-gray-300 hover:text-accent-400 transition-colors">
        <FaScroll size={24} />
      </button>
      <button onClick={onSettingsClick} className="text-gray-300 hover:text-accent-400 transition-colors">
        <FaCog size={24} />
      </button>
    </div>
  );
};

export default GameSidebar;