import React from 'react';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'filled' | 'tonal' | 'outlined' | 'text' | 'elevated';
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'filled', 
  className, 
  icon,
  size = 'md',
  ...props 
}) => {
  const baseStyles = `
    inline-flex items-center justify-center gap-2.5 
    rounded-m3-full font-medium tracking-wide 
    transition-all duration-200 
    active:scale-[0.97] 
    disabled:opacity-40 disabled:pointer-events-none 
    font-sans whitespace-nowrap overflow-hidden 
    relative isolate m3-ripple m3-focus
    select-none
  `;
  
  const sizeStyles = {
    sm: "h-9 px-4 text-sm gap-2",
    md: "h-11 px-6 text-sm",
    lg: "h-14 px-8 text-base gap-3"
  };

  const variants = {
    filled: `
      bg-primary text-primary-foreground 
      shadow-m3-1 hover:shadow-m3-2 
      hover:brightness-110
    `,
    tonal: `
      bg-secondary-container text-secondary-onContainer 
      hover:shadow-m3-1
      hover:bg-opacity-90
    `,
    outlined: `
      border border-outline text-primary 
      hover:bg-primary/8 
      active:bg-primary/12
    `,
    text: `
      text-primary 
      hover:bg-primary/8 
      active:bg-primary/12
      px-4 min-w-[64px]
    `,
    elevated: `
      bg-surface-container-low text-primary 
      shadow-m3-1 hover:shadow-m3-2 
      hover:bg-surface-container
    `,
  };

  return (
    <button 
      className={twMerge(baseStyles, sizeStyles[size], variants[variant], className)}
      {...props}
    >
      {icon && (
        <span className={twMerge(
          "flex-shrink-0 flex items-center justify-center",
          size === 'lg' ? "w-5 h-5" : size === 'sm' ? "w-4 h-4" : "w-[18px] h-[18px]"
        )}>
          {icon}
        </span>
      )}
      {children && <span className="relative">{children}</span>}
    </button>
  );
};