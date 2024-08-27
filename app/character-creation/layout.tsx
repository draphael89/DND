'use client';

import { motion } from 'framer-motion';
import ProgressBar from '../components/ProgressBar';
import { usePathname } from 'next/navigation';

const steps = ['race', 'class', 'background', 'abilities', 'summary'];

export default function CharacterCreationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const currentStep = steps.indexOf(pathname.split('/').pop() || '') + 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-900 to-primary-800 text-text-primary p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-display text-accent mb-8 text-center">Character Creation</h1>
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