import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon,
  className = '',
  ...props 
}) => {
  const baseStyles = "relative overflow-hidden font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center rounded-xl backdrop-blur-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-neon-500/10 hover:bg-neon-500/20 text-neon-400 border border-neon-500/50 hover:border-neon-400 hover:shadow-[0_0_20px_rgba(136,214,0,0.3)]",
    secondary: "bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/30",
    danger: "bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50 hover:border-red-400 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]",
    ghost: "bg-transparent hover:bg-white/5 text-white/60 hover:text-white border-none",
  };

  const sizes = {
    sm: "text-xs px-4 py-2 space-x-2",
    md: "text-sm px-6 py-3 space-x-2",
    lg: "text-base px-8 py-4 space-x-3",
    xl: "text-lg px-12 py-6 space-x-4",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {icon && <span className="z-10">{icon}</span>}
      <span className="z-10">{children}</span>
    </button>
  );
};