import Link from 'next/link';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GameButtonProps {
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}

const GameButton: React.FC<GameButtonProps> = ({ href, onClick, disabled, children, className = '', icon }) => {
  const buttonClasses = `inline-flex items-center justify-center px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded-lg shadow-lg transition-colors ${className}`;

  const content = (
    <>
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </>
  );

  if (href) {
    return (
      <Link href={href} passHref>
        <motion.span
          className={`${buttonClasses} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          whileHover={!disabled ? { scale: 1.05 } : {}}
          whileTap={!disabled ? { scale: 0.95 } : {}}
        >
          {content}
        </motion.span>
      </Link>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
    >
      {content}
    </motion.button>
  );
};

export default GameButton;