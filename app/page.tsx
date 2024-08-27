import Link from 'next/link';
import Image from 'next/image';
import { FaDiceD20 } from 'react-icons/fa';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-900 to-primary-800 text-text-primary flex flex-col justify-center items-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/images/fantasy-background.jpg"
          alt="Fantasy landscape"
          layout="fill"
          objectFit="cover"
          quality={100}
          className="opacity-20"
        />
      </div>
      
      <main className="relative z-10 max-w-4xl w-full bg-surface bg-opacity-80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 text-center">
        <h1 className="text-6xl sm:text-7xl font-display text-transparent bg-clip-text bg-gradient-to-r from-secondary-300 via-secondary-500 to-accent-400 mb-6 animate-pulse-slow">
          D&D Web Adventure
        </h1>
        
        <h2 className="text-2xl sm:text-3xl font-sans text-text-secondary mb-12 italic">
          Embark on an epic journey in your browser
        </h2>
        
        <div className="flex justify-center mb-12">
          <FaDiceD20 className="text-8xl text-accent-500 animate-float" />
        </div>
        
        <Link href="/character-creation/race" 
          className="inline-block bg-gradient-to-r from-accent-600 to-accent-700 text-text-primary text-xl font-display py-4 px-8 rounded-full 
                     transition duration-300 ease-in-out transform hover:scale-105 hover:-translate-y-1 
                     shadow-lg hover:shadow-accent-500/50 hover:from-accent-500 hover:to-accent-600">
          Start Your Adventure
        </Link>
        
        <div className="mt-12 flex justify-center space-x-6">
          <Link href="/about" className="text-text-secondary hover:text-accent-400 transition-colors">About</Link>
          <Link href="/rules" className="text-text-secondary hover:text-accent-400 transition-colors">Rules</Link>
          <Link href="/contact" className="text-text-secondary hover:text-accent-400 transition-colors">Contact</Link>
        </div>
      </main>
      
      <footer className="relative z-10 mt-8 text-text-secondary text-sm">
        © 2023 D&D Web Adventure. All rights reserved.
      </footer>
    </div>
  );
}
