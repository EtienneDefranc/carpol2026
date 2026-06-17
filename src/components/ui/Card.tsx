import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={twMerge("glass-card rounded-2xl p-6 hover:border-brand/50 transition-colors duration-500", className)}>
      {children}
    </div>
  );
}
