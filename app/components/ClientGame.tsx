'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Character, Quest, InventoryItem } from '../interfaces/gameInterfaces';
import GameLayout from './GameLayout';
import GameButton from './GameButton';
import ActionSelection from './ActionSelection';
import { motion, AnimatePresence } from 'framer-motion';
import DiceRoller from './DiceRoller';
import Image from 'next/image';
import GameSidebar from './GameSidebar';
import AmbientBackground from './AmbientBackground';
import Inventory from './Inventory';
import CharacterSheet from './CharacterSheet';
import QuestLog from './QuestLog';
import SettingsPanel from './SettingsPanel';

interface ClientGameProps {
  character: Character;
}

export default function ClientGame({ character }: ClientGameProps) {
  const [scene, setScene] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [gameStage, setGameStage] = useState('initial');
  const apiCalledRef = useRef(false);
  const [rollResult, setRollResult] = useState<number | null>(null);
  const [currentAction, setCurrentAction] = useState<string>('');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [actions, setActions] = useState<string[]>([]);
  const [isLoadingActions, setIsLoadingActions] = useState(false);

  const [hp, setHp] = useState(100);
  const [maxHp, setMaxHp] = useState(100);
  const [mana, setMana] = useState(50);
  const [maxMana, setMaxMana] = useState(50);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);

  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [showInventory, setShowInventory] = useState(false);
  const [showCharacterSheet, setShowCharacterSheet] = useState(false);
  const [showQuestLog, setShowQuestLog] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [quests, setQuests] = useState<Quest[]>([]);

  const [processingAction, setProcessingAction] = useState(false);
  const [actionResult, setActionResult] = useState<string | null>(null);

  useEffect(() => {
    const generateInitialScene = async () => {
      if (apiCalledRef.current) return;
      apiCalledRef.current = true;

      setIsLoading(true);
      setError('');

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setLoadingProgress((prev) => Math.min(prev + 10, 90));
      }, 500);

      try {
        const response = await fetch('/api/generate-initial-scene', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ character }),
        });
        if (!response.ok) throw new Error('Failed to generate initial scene');
        const data = await response.json();
        setScene(data.scene);
        setLoadingProgress(100);
      } catch (err) {
        setError('Failed to generate the initial scene. Please try again.');
      } finally {
        clearInterval(progressInterval);
        setIsLoading(false);
      }
    };

    generateInitialScene();
  }, [character]);

  const processAction = useCallback(async (action: string, roll: number) => {
    try {
      const response = await fetch('/api/process-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ character, action, currentScene: scene, rollResult: roll }),
      });
      if (!response.ok) throw new Error('Failed to process action');
      const data = await response.json();
      return data.newScene;
    } catch (err) {
      console.error('Error processing action:', err);
      return 'An error occurred while processing your action.';
    }
  }, [character, scene]);

  const handleActionSelected = async (action: string) => {
    setCurrentAction(action);
    setProcessingAction(true);
    const actionResultPromise = processAction(action, 0); // We'll update this with the actual roll later
    setGameStage('dice_roll');
    
    // We'll resolve this promise in the DiceRoller component
    setActionResult(await actionResultPromise);
  };

  const handleRollComplete = (result: number) => {
    setRollResult(result);
    setGameStage('action_result');
    setProcessingAction(false);
  };

  const generateActions = async () => {
    setIsLoadingActions(true);
    try {
      const response = await fetch('/api/generate-actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ character, currentScene: scene, gameState: {} }), // Add relevant game state here
      });
      if (!response.ok) throw new Error('Failed to generate actions');
      const data = await response.json();
      setActions(data.actions);
    } catch (err) {
      console.error('Error generating actions:', err);
      // Fallback to default actions
      setActions([
        "Investigate the area",
        "Talk to a nearby character",
        "Use an item from your inventory",
        "Attempt to use a skill",
        "Rest and recover"
      ]);
      setError('Failed to generate custom actions. Using default options.');
    } finally {
      setIsLoadingActions(false);
    }
  };

  const handleContinue = () => {
    generateActions();
    setGameStage('action_selection');
  };

  // Assume we have a function to get the character's profile picture URL
  const profilePicUrl = `/images/classes/${character.race.toLowerCase()}/${character.class.toLowerCase()}.png`;

  const GameHeader = () => (
    <div className="fixed top-0 left-0 right-0 bg-gray-800 bg-opacity-90 p-2 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <Image
          src={profilePicUrl}
          alt="Character"
          width={40}
          height={40}
          className="rounded-full border-2 border-accent-500"
        />
        <div>
          <p className="text-sm text-gray-300">{`${character.race} ${character.class}`}</p>
          <p className="text-xs text-accent-400">Level {level}</p>
        </div>
      </div>
      <div className="flex space-x-4">
        <StatusBar label="HP" current={hp} max={maxHp} color="bg-red-500" />
        <StatusBar label="Mana" current={mana} max={maxMana} color="bg-blue-500" />
        <StatusBar label="XP" current={xp} max={100} color="bg-green-500" />
      </div>
    </div>
  );

  interface StatusBarProps {
    label: string;
    current: number;
    max: number;
    color: string;
  }

  const StatusBar: React.FC<StatusBarProps> = ({ label, current, max, color }) => (
    <div className="flex flex-col items-center">
      <p className="text-xs text-gray-300">{label}</p>
      <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${color}`}
          style={{ width: `${(current / max) * 100}%` }}
        />
      </div>
      <p className="text-xs text-gray-300">{`${current}/${max}`}</p>
    </div>
  );

  const handleUseItem = (item: InventoryItem) => {
    // Implement item usage logic here
    console.log(`Using item: ${item.name}`);
  };

  const handleVolumeChange = (volume: number) => {
    // Implement volume change logic
    console.log('Volume changed to:', volume);
  };

  const handleThemeChange = (theme: 'light' | 'dark') => {
    // Implement theme change logic
    console.log('Theme changed to:', theme);
  };

  if (isLoading) {
    return (
      <GameLayout>
        <GameHeader />
        <div className="text-center">
          <p className="text-2xl font-display text-accent-400 mb-4">Preparing your adventure...</p>
          <motion.div
            className="w-full h-2 bg-gray-300 rounded-full overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: `${loadingProgress}%` }}
            transition={{ duration: 0.5 }}
          >
            <div className="h-full bg-accent-500"></div>
          </motion.div>
          <p className="mt-2 text-text-secondary">{loadingProgress}% complete</p>
        </div>
      </GameLayout>
    );
  }

  if (error) {
    return (
      <GameLayout>
        <GameHeader />
        <div className="text-center">
          <p className="text-2xl font-display text-red-500">{error}</p>
          <GameButton onClick={() => window.location.reload()} className="mt-4">
            Try Again
          </GameButton>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout>
      <AmbientBackground />
      <GameHeader />
      <GameSidebar
        onCharacterClick={() => setShowCharacterSheet(true)}
        onInventoryClick={() => setShowInventory(!showInventory)}
        onQuestLogClick={() => setShowQuestLog(true)}
        onSettingsClick={() => setShowSettings(true)}
      />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white pt-16 pl-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-8">
            <div className="relative w-20 h-20 mr-4">
              <Image
                src={profilePicUrl}
                alt="Character"
                layout="fill"
                className="rounded-full border-4 border-accent-500 shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{`${character.race} ${character.class}`}</h2>
              <p className="text-accent-400">{character.background}</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={gameStage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-800 rounded-lg shadow-xl p-6 mb-8"
            >
              {gameStage === 'initial' && (
                <>
                  <h1 className="text-4xl font-display text-accent-400 mb-6">Your Adventure Begins</h1>
                  <p className="text-lg text-gray-300 mb-8 leading-relaxed">{scene}</p>
                  <GameButton onClick={handleContinue} className="text-xl py-3 px-8 w-full sm:w-auto">
                    Continue
                  </GameButton>
                </>
              )}
              {gameStage === 'action_selection' && (
                <ActionSelection 
                  scene={scene} 
                  actions={actions}
                  onActionSelected={handleActionSelected}
                  isLoading={isLoadingActions}
                />
              )}
              {gameStage === 'dice_roll' && (
                <div className="text-center">
                  <h2 className="text-3xl font-display text-accent-400 mb-4">Roll for your action</h2>
                  <p className="text-lg text-gray-300 mb-6">You attempt to: {currentAction}</p>
                  <DiceRoller onRollComplete={handleRollComplete} minDuration={3000} />
                  {processingAction && (
                    <p className="mt-4 text-gray-400">Processing your action...</p>
                  )}
                </div>
              )}
              {gameStage === 'action_result' && (
                <>
                  <h2 className="text-3xl font-display text-accent-400 mb-4">Result</h2>
                  <div className="bg-gray-700 rounded-lg p-4 mb-4">
                    <p className="text-lg text-gray-300 mb-2">Your roll: <span className="text-accent-400 font-bold text-2xl">{rollResult}</span></p>
                  </div>
                  <p className="text-lg text-gray-300 mb-6 leading-relaxed">{actionResult}</p>
                  <GameButton onClick={() => setGameStage('action_selection')} className="text-xl py-3 px-8 w-full sm:w-auto">
                    Choose Next Action
                  </GameButton>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {showInventory && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="fixed right-4 top-20 w-64"
            >
              <Inventory items={inventoryItems} onUseItem={handleUseItem} />
            </motion.div>
          )}

          {/* Character Stats */}
          <div className="bg-gray-800 rounded-lg shadow-xl p-6">
            <h3 className="text-2xl font-display text-accent-400 mb-4">Character Stats</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Object.entries(character.abilities).map(([ability, score]) => (
                <div key={ability} className="bg-gray-700 rounded-lg p-3 text-center">
                  <p className="text-gray-400 uppercase text-sm">{ability}</p>
                  <p className="text-2xl font-bold text-accent-400">{score}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showCharacterSheet && (
          <CharacterSheet character={character} onClose={() => setShowCharacterSheet(false)} />
        )}
        {showQuestLog && (
          <QuestLog quests={quests} onClose={() => setShowQuestLog(false)} />
        )}
        {showSettings && (
          <SettingsPanel
            onClose={() => setShowSettings(false)}
            onVolumeChange={handleVolumeChange}
            onThemeChange={handleThemeChange}
          />
        )}
      </AnimatePresence>
    </GameLayout>
  );
}