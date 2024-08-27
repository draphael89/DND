'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCharacter } from '../context/CharacterContext';

export default function CharacterGuard({ children }: { children: React.ReactNode }) {
  const { character } = useCharacter();
  const router = useRouter();

  useEffect(() => {
    if (!character.race || !character.class || !character.background) {
      router.push('/character-creation/race');
    }
  }, [character, router]);

  if (!character.race || !character.class || !character.background) {
    return null;
  }

  return <>{children}</>;
}