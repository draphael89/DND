import React from 'react';
import { motion } from 'framer-motion';
import { Quest } from '../interfaces/gameInterfaces';

interface QuestLogProps {
  quests: Quest[];
  onClose: () => void;
}

const QuestLog: React.FC<QuestLogProps> = ({ quests, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-display text-accent-400">Quest Log</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            Close
          </button>
        </div>
        {quests.length === 0 ? (
          <p className="text-gray-400">No active quests.</p>
        ) : (
          <ul className="space-y-6">
            {quests.map((quest) => (
              <li key={quest.id} className="border-b border-gray-700 pb-4">
                <h3 className="text-xl font-display text-accent-300">{quest.title}</h3>
                <p className="text-gray-300 mb-2">{quest.description}</p>
                <div className="mb-2">
                  <h4 className="text-lg font-display text-accent-200">Objectives:</h4>
                  <ul className="list-disc list-inside">
                    {quest.objectives.map((objective, index) => (
                      <li key={index} className={objective.completed ? 'text-green-400' : 'text-yellow-400'}>
                        {objective.description}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mb-2">
                  <h4 className="text-lg font-display text-accent-200">Rewards:</h4>
                  <p className="text-gray-300">Experience: {quest.rewards.experience}</p>
                  <p className="text-gray-300">Gold: {quest.rewards.gold}</p>
                  {quest.rewards.items && (
                    <p className="text-gray-300">Items: {quest.rewards.items.join(', ')}</p>
                  )}
                </div>
                <span className={`text-sm ${quest.status === 'completed' ? 'text-green-400' : quest.status === 'failed' ? 'text-red-400' : 'text-yellow-400'}`}>
                  {quest.status.charAt(0).toUpperCase() + quest.status.slice(1)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
};

export default QuestLog;