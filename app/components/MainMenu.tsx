'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import GameButton from './GameButton';

export default function MainMenu() {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-primary-900 to-primary-800"
    >
      <h1 className="text-6xl font-display text-accent-400 mb-8">D&D Web Adventure</h1>
      <GameButton onClick={() => router.push('/character-creation/race')}>
        Start New Game
      </GameButton>
    </motion.div>
  );
}