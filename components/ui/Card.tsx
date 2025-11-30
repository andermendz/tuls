import React from 'react';
import { twMerge } from 'tailwind-merge';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  variant?: 'filled' | 'elevated' | 'outlined';
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  onClick,
  hoverable = false,
  variant = 'filled'
}) => {
  const variants = {
    filled: "bg-surface-container-low",
    elevated: "bg-surface-container-lowest shadow-m3-1 hover:shadow-m3-2",
    outlined: "bg-surface border border-outline-variant/40",
  };

  return (
    <div
      onClick={onClick}
      className={twMerge(
        "rounded-m3-xl p-6 transition-all duration-300 relative overflow-hidden",
        variants[variant],
        hoverable && "cursor-pointer hover:bg-surface-container active:scale-[0.99] m3-ripple",
        className
      )}
    >
      {children}
    </div>
  );
};