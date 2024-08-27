'use client';

import { CharacterProvider } from '../context/CharacterContext';
import { useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const steps = [
  { title: 'Race', path: '/character-creation/race' },
  { title: 'Class', path: '/character-creation/class' },
  { title: 'Abilities', path: '/character-creation/abilities' },
  { title: 'Background', path: '/character-creation/background' },
  { title: 'Summary', path: '/character-creation/summary' },
];

interface CharacterCreationProps {
  children: ReactNode;
}

export default function CharacterCreation({ children }: CharacterCreationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const path = window.location.pathname;
    const index = steps.findIndex(step => step.path === path);
    if (index !== -1) {
      setCurrentStep(index);
    }
  }, []);

  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      router.push(steps[currentStep + 1].path);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      router.push(steps[currentStep - 1].path);
    }
  };

  return (
    <CharacterProvider>
      <div className="min-h-screen bg-gradient-to-b from-primary-900 to-primary-800 text-text-primary p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-display text-accent mb-8 text-center">Character Creation</h1>
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className={`text-sm ${
                    index === currentStep ? 'text-accent font-bold' : 'text-muted'
                  }`}
                >
                  {step.title}
                </div>
              ))}
            </div>
            <div className="h-2 bg-secondary rounded-full">
              <motion.div
                className="h-full bg-accent rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              ></motion.div>
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
          <div className="mt-8 flex justify-between">
            {currentStep > 0 && (
              <button onClick={goToPreviousStep} className="bg-secondary text-primary px-6 py-2 rounded-full hover:bg-secondary-600 transition-colors">
                Previous
              </button>
            )}
            {currentStep < steps.length - 1 && (
              <button onClick={goToNextStep} className="bg-accent text-primary px-6 py-2 rounded-full hover:bg-accent-600 transition-colors ml-auto">
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </CharacterProvider>
  );
}
