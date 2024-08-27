import Link from 'next/link';

interface GameButtonProps {
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

export default function GameButton({ href, onClick, disabled, children, className }: GameButtonProps) {
  const baseClasses = "inline-block bg-gradient-to-r from-accent-500 to-accent-600 text-text-primary text-center font-display py-3 px-6 rounded transition-all duration-300 cursor-fantasy";
  const enabledClasses = "hover:from-accent-600 hover:to-accent-700 hover:shadow-lg transform hover:-translate-y-1";
  const disabledClasses = "opacity-50 cursor-not-allowed";

  const buttonClasses = `${baseClasses} ${disabled ? disabledClasses : enabledClasses} ${className || ''}`;

  if (href) {
    return (
      <Link
        href={disabled ? '#' : href}
        onClick={disabled ? undefined : onClick}
        className={buttonClasses}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={buttonClasses}
    >
      {children}
    </button>
  );
}