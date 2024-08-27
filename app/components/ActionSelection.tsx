import React from 'react';
import GameButton from './GameButton';
import { FaSearch, FaComments, FaHandPaper, FaRunning, FaMagic } from 'react-icons/fa';

interface ActionSelectionProps {
  scene: string;
  actions: string[];
  onActionSelected: (action: string) => void;
  isLoading: boolean;
}

const actionIcons: { [key: string]: React.ReactElement } = {
  'Investigate': <FaSearch />,
  'Talk': <FaComments />,
  'Use': <FaHandPaper />,
  'Move': <FaRunning />,
  'Cast': <FaMagic />,
};

export default function ActionSelection({ scene, actions, onActionSelected, isLoading }: ActionSelectionProps) {
  if (isLoading) {
    return <div className="text-center">Loading possible actions...</div>;
  }

  const getActionIcon = (action: string) => {
    const key = Object.keys(actionIcons).find(k => action.toLowerCase().includes(k.toLowerCase()));
    return key ? actionIcons[key] : null;
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-display text-accent-400 mb-4">Current Scene</h2>
      <p className="text-lg text-gray-300 mb-6">{scene}</p>
      
      <h3 className="text-xl font-display text-accent-400 mb-3">Choose Your Action</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {actions.map((action, index) => (
          <GameButton
            key={index}
            onClick={() => onActionSelected(action)}
            className="text-left py-3 px-4 flex items-center"
          >
            {getActionIcon(action) && <span className="mr-3">{getActionIcon(action)}</span>}
            <span>{action}</span>
          </GameButton>
        ))}
      </div>
    </div>
  );
}