import Link from 'next/link';
import { motion } from 'framer-motion';

interface GameButtonProps {
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

export default function GameButton({ href, onClick, disabled, children, className }: GameButtonProps) {
  const baseClasses = "inline-block bg-gradient-to-r from-accent-600 to-accent-700 text-text-primary text-center font-display py-3 px-6 rounded-full transition-all duration-300 cursor-fantasy relative overflow-hidden";
  const enabledClasses = "hover:from-accent-500 hover:to-accent-600 hover:shadow-lg transform hover:-translate-y-1";
  const disabledClasses = "opacity-50 cursor-not-allowed";

  const buttonClasses = `${baseClasses} ${disabled ? disabledClasses : enabledClasses} ${className || ''}`;

  const content = (
    <>
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-0 bg-gradient-shine bg-[length:200%_100%] animate-shine" />
    </>
  );

  if (href && !disabled) {
    return (
      <Link href={href} className={buttonClasses}>
        {content}
      </Link>
    );
  }

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={buttonClasses}
    >
      {content}
    </motion.button>
  );
}