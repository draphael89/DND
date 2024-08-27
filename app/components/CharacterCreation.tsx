'use client';

import { CharacterProvider } from '../context/CharacterContext';
import RaceSelection from '../character-creation/race/page';
import ClassSelection from '../character-creation/class/page';
import AbilityScores from '../character-creation/abilities/page';
import BackgroundSelection from '../character-creation/background/page';
import CharacterSummary from '../character-creation/summary/page';
import { useState } from 'react';

const steps = [
  { component: RaceSelection, title: 'Race' },
  { component: ClassSelection, title: 'Class' },
  { component: AbilityScores, title: 'Abilities' },
  { component: BackgroundSelection, title: 'Background' },
  { component: CharacterSummary, title: 'Summary' },
];

export default function CharacterCreation() {
  const [currentStep, setCurrentStep] = useState(0);

  const CurrentStepComponent = steps[currentStep].component;

  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <CharacterProvider>
      <div className="min-h-screen bg-primary text-text p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-display text-accent mb-8 text-center">Character Creation</h1>
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
              <div
                className="h-full bg-accent rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>
          <CurrentStepComponent
            goToNextStep={goToNextStep}
            goToPreviousStep={goToPreviousStep}
          />
        </div>
      </div>
    </CharacterProvider>
  );
}
