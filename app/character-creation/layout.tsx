'use client';

import { motion } from 'framer-motion';
import ProgressBar from '../components/ProgressBar';
import { usePathname } from 'next/navigation';
import StarryBackground from '../components/StarryBackground';

const steps = ['race', 'class', 'background', 'abilities', 'summary'];

export default function CharacterCreationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const currentStep = steps.indexOf(pathname.split('/').pop() || '') + 1;

  return (
    <div className="min-h-screen text-text-primary relative overflow-hidden">
      <StarryBackground />
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-5xl font-display text-center mb-8 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]">Character Creation</h1>
        <ProgressBar currentStep={currentStep} totalSteps={steps.length} />
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}