interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="mb-8">
      <div className="h-2 bg-secondary rounded-full">
        <div
          className="h-full bg-accent rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-muted text-sm mt-2">Step {currentStep} of {totalSteps}</p>
    </div>
  );
}