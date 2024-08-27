'use client';

import { motion } from 'framer-motion';
import { useCharacter } from '../context/CharacterContext';

export default function ClientComponent() {
  const { character } = useCharacter();

  if (!character.race || !character.class) {
    return <div>Loading character...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2>Character: {character.race} {character.class}</h2>
      {/* Add more client-side content here */}
    </motion.div>
  );
}