import React, { useState, useEffect, useRef, Suspense, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, useGLTF, OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { GLTF } from 'three-stdlib';

interface DiceRollerProps {
  onRollComplete: (result: number) => void;
  minDuration?: number;
}

type GLTFResult = GLTF & {
  nodes: {
    [key: string]: THREE.Mesh;
  };
  materials: {
    [key: string]: THREE.Material;
  };
};

const faceRotations = [
  new THREE.Euler(0, 0, 0),
  new THREE.Euler(0, 0, Math.PI),
  new THREE.Euler(-Math.PI / 2, 0, 0),
  new THREE.Euler(Math.PI / 2, 0, 0),
  new THREE.Euler(0, -Math.PI / 2, 0),
  new THREE.Euler(0, Math.PI / 2, 0),
  // Add more rotations for each face of your D20
];

function D20Model({ rolling, result }: { rolling: boolean; result: number | null }) {
  const groupRef = useRef<THREE.Group>(null);
  const { nodes } = useGLTF('/models/d20.glb') as GLTFResult;
  const { camera } = useThree();

  const material = useMemo(() => {
    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#FFD700'),
      metalness: 0.8,
      roughness: 0.1,
      envMapIntensity: 1,
      clearcoat: 0.5,
      clearcoatRoughness: 0.1,
    });

    const textureSize = 2048; // Increased for even higher quality
    const canvas = document.createElement('canvas');
    canvas.width = textureSize;
    canvas.height = textureSize;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#FFD700';
      ctx.fillRect(0, 0, textureSize, textureSize);
      
      // Add some noise for a more interesting surface
      for (let i = 0; i < 20000; i++) { // Increased number of noise points
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.15})`; // Increased opacity
        ctx.fillRect(
          Math.random() * textureSize,
          Math.random() * textureSize,
          2,
          2
        );
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(4, 4); // Repeat the texture for even more detail
      mat.map = texture;
    }

    return mat;
  }, []);

  useEffect(() => {
    if (groupRef.current) {
      const box = new THREE.Box3().setFromObject(groupRef.current);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      
      if (camera instanceof THREE.PerspectiveCamera) {
        const fov = camera.fov * (Math.PI / 180);
        let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
        cameraZ *= 1.2; // Bring the camera even closer
        camera.position.set(cameraZ, cameraZ, cameraZ);
      } else {
        camera.position.set(maxDim * 1.2, maxDim * 1.2, maxDim * 1.2);
      }
      
      camera.lookAt(center);
      camera.updateProjectionMatrix();
    }
  }, [camera]);

  useFrame((state) => {
    if (groupRef.current) {
      if (rolling) {
        const time = state.clock.getElapsedTime();
        groupRef.current.rotation.x += Math.sin(time * 2) * 0.05; // Slower rotation
        groupRef.current.rotation.y += Math.cos(time * 1.5) * 0.05;
        groupRef.current.rotation.z += Math.sin(time * 1.8) * 0.05;
      } else if (result !== null) {
        const targetRotation = faceRotations[result - 1] || new THREE.Euler();
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotation.x, 0.05);
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotation.y, 0.05);
        groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotation.z, 0.05);
      }
    }
  });

  return (
    <group ref={groupRef} scale={[2, 2, 2]}> {/* Increased scale for an even bigger die */}
      {Object.keys(nodes).map((nodeName) => (
        <mesh 
          key={nodeName}
          geometry={nodes[nodeName].geometry}
          material={material}
        />
      ))}
    </group>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={0.4} color="#ffffff" />
      <spotLight position={[0, 5, 0]} angle={0.3} penumbra={1} intensity={0.6} color="#ffffff" />
    </>
  );
}

const DiceRoller: React.FC<DiceRollerProps> = ({ onRollComplete, minDuration = 5000 }) => {
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const rollStartTime = useRef<number | null>(null);
  const finalResult = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('/sounds/dice-roll.wav');
  }, []);

  useEffect(() => {
    if (rolling) {
      rollStartTime.current = Date.now();
      finalResult.current = Math.floor(Math.random() * 20) + 1;
      
      // Play the dice roll sound
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }

      const rollInterval = setInterval(() => {
        setResult(Math.floor(Math.random() * 20) + 1);
      }, 100); // Slower result changes

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
      <div className="w-full h-96 mb-4 relative"> {/* Full width for better integration */}
        <Canvas>
          <color attach="background" args={['#1C2533']} /> {/* Match ClientGame background */}
          <Suspense fallback={null}>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} />
            <Lights />
            <D20Model rolling={rolling} result={result} />
            <OrbitControls enableZoom={false} enablePan={false} />
            <EffectComposer>
              <Bloom luminanceThreshold={0.6} luminanceSmoothing={0.9} height={300} />
            </EffectComposer>
          </Suspense>
        </Canvas>
      </div>
      {result !== null && !rolling && (
        <div className="text-4xl font-bold text-accent-500 mb-4">
          You rolled: {result}
        </div>
      )}
      <button
        onClick={() => {
          setRolling(true);
          setResult(null);
        }}
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