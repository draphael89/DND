import ProgressBar from './ProgressBar';

interface GameLayoutProps {
  children: React.ReactNode;
  currentStep?: number;
  totalSteps?: number;
}

export default function GameLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-radial from-background to-surface p-8">
      <div className="max-w-4xl mx-auto bg-surface bg-opacity-30 backdrop-blur-md p-8 rounded-lg shadow-lg">
        {children}
      </div>
    </div>
  );
}