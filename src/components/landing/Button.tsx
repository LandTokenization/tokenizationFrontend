import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from './utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'lg' | 'icon';
  isLoading?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'default', size = 'default', isLoading = false, className = '', disabled, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';
    const variants = {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md active:shadow-sm',
      outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:shadow-sm',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
    };
    const sizes = {
      default: 'h-10 px-4 py-2',
      lg: 'h-11 px-8',
      icon: 'h-10 w-10',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
