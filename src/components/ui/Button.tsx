import { ButtonHTMLAttributes, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  className?: string;
}

export function Button({ children, variant = 'primary', className, ...props }: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center px-6 py-3 rounded-full font-medium transition-all duration-300 ease-out transform active:scale-95";
  
  const variants = {
    primary: "bg-brand hover:bg-brand-hover text-white shadow-[0_0_15px_rgba(139,92,246,0.5)] hover:shadow-[0_0_25px_rgba(139,92,246,0.7)]",
    secondary: "bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10",
    outline: "border-2 border-brand text-brand hover:bg-brand/10",
    ghost: "text-gray-300 hover:text-white hover:bg-white/5",
  };

  return (
    <button 
      className={twMerge(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}
