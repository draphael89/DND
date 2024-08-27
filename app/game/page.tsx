'use client';

import { useCharacter } from '../context/CharacterContext';
import CharacterGuard from '../components/CharacterGuard';
import ClientGame from '../components/ClientGame';

export default function GamePage() {
  return (
    <CharacterGuard>
      <ClientGame />
    </CharacterGuard>
  );
}