'use client';

import { useCharacter } from '../context/CharacterContext';
import CharacterGuard from '../components/CharacterGuard';
import ClientGame from '../components/ClientGame';
import { Character } from '../interfaces/gameInterfaces';

export default function GamePage() {
  const { character } = useCharacter();

  return (
    <CharacterGuard>
      <ClientGame character={character as Character} />
    </CharacterGuard>
  );
}