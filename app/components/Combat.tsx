import { useState } from 'react';
import { useCharacter } from '../context/CharacterContext';

interface Enemy {
  name: string;
  health: number;
  armorClass: number;
  attackBonus: number;
  damage: [number, number]; // [min, max]
}

interface CombatProps {
  enemy: Enemy;
  onCombatEnd: (playerWon: boolean) => void;
}

export default function Combat({ enemy, onCombatEnd }: CombatProps) {
  const { character } = useCharacter();
  const [playerHealth, setPlayerHealth] = useState(100);
  const [enemyHealth, setEnemyHealth] = useState(enemy.health);
  const [combatLog, setCombatLog] = useState<string[]>([]);

  const rollD20 = () => Math.floor(Math.random() * 20) + 1;

  const playerAttack = () => {
    const roll = rollD20();
    const attackRoll = roll + Math.floor((character.abilities.strength - 10) / 2);
    if (attackRoll >= enemy.armorClass) {
      const damage = Math.floor(Math.random() * 6) + 1 + Math.floor((character.abilities.strength - 10) / 2);
      setEnemyHealth(prev => Math.max(prev - damage, 0));
      setCombatLog(prev => [...prev, `You hit ${enemy.name} for ${damage} damage!`]);
      if (enemyHealth - damage <= 0) {
        onCombatEnd(true);
      }
    } else {
      setCombatLog(prev => [...prev, `You missed ${enemy.name}!`]);
    }
    enemyAttack();
  };

  const enemyAttack = () => {
    const roll = rollD20();
    const attackRoll = roll + enemy.attackBonus;
    if (attackRoll >= 10 + Math.floor((character.abilities.dexterity - 10) / 2)) {
      const damage = Math.floor(Math.random() * (enemy.damage[1] - enemy.damage[0] + 1)) + enemy.damage[0];
      setPlayerHealth(prev => Math.max(prev - damage, 0));
      setCombatLog(prev => [...prev, `${enemy.name} hits you for ${damage} damage!`]);
      if (playerHealth - damage <= 0) {
        onCombatEnd(false);
      }
    } else {
      setCombatLog(prev => [...prev, `${enemy.name} missed you!`]);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-2xl font-bold mb-4">Combat with {enemy.name}</h2>
      <div className="flex justify-between mb-4">
        <div>
          <p>Your Health: {playerHealth}</p>
          <button onClick={playerAttack} className="bg-red-500 text-white px-4 py-2 rounded mt-2">
            Attack
          </button>
        </div>
        <div>
          <p>{enemy.name}&apos;s Health: {enemyHealth}</p>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="font-bold">Combat Log:</h3>
        <ul className="list-disc list-inside">
          {combatLog.slice(-5).map((log, index) => (
            <li key={index}>{log}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
