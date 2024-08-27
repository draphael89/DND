import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Text } from '@react-three/drei';
import * as THREE from 'three';

interface DiceRollerProps {
  onRollComplete: (result: number) => void;
  minDuration?: number;
}

const Dice: React.FC<{ rolling: boolean; result: number | null }> = ({ rolling, result }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [rotation, setRotation] = useState(() => new THREE.Euler(
    Math.random() * Math.PI,
    Math.random() * Math.PI,
    Math.random() * Math.PI
  ));

  useFrame(() => {
    if (rolling && meshRef.current) {
      setRotation(new THREE.Euler(
        rotation.x + 0.05,
        rotation.y + 0.05,
        rotation.z + 0.05
      ));
      meshRef.current.rotation.copy(rotation);
    }
  });

  return (
    <Box ref={meshRef} args={[2, 2, 2]} rotation={rotation}>
      <meshStandardMaterial color="#FFA500" />
      {result !== null && (
        <Text
          position={[0, 0, 1.1]}
          fontSize={1}
          color="#000000"
          anchorX="center"
          anchorY="middle"
        >
          {result}
        </Text>
      )}
    </Box>
  );
};

const DiceRoller: React.FC<DiceRollerProps> = ({ onRollComplete, minDuration = 3000 }) => {
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const rollStartTime = useRef<number | null>(null);
  const finalResult = useRef<number | null>(null);

  useEffect(() => {
    if (rolling) {
      rollStartTime.current = Date.now();
      finalResult.current = Math.floor(Math.random() * 20) + 1;
      
      const rollInterval = setInterval(() => {
        setResult(Math.floor(Math.random() * 20) + 1);
      }, 50);

      const checkRollComplete = () => {
        const elapsedTime = Date.now() - (rollStartTime.current || 0);
        if (elapsedTime >= minDuration) {
          clearInterval(rollInterval);
          setRolling(false);
          setResult(finalResult.current);
          onRollComplete(finalResult.current!);
        } else {
          requestAnimationFrame(checkRollComplete);
        }
      };

      requestAnimationFrame(checkRollComplete);

      return () => clearInterval(rollInterval);
    }
  }, [rolling, minDuration, onRollComplete]);

  return (
    <div className="flex flex-col items-center">
      <div className="w-64 h-64 mb-4">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Dice rolling={rolling} result={result} />
        </Canvas>
      </div>
      <button
        onClick={() => setRolling(true)}
        disabled={rolling}
        className={`px-6 py-3 rounded-lg text-xl ${
          rolling ? 'bg-gray-400 cursor-not-allowed' : 'bg-accent-500 hover:bg-accent-600'
        } text-white font-bold transition-colors shadow-lg`}
      >
        {rolling ? 'Rolling...' : 'Roll D20'}
      </button>
    </div>
  );
};

export default DiceRoller;