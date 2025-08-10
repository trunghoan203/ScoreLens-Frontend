import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-lime-500 text-white hover:bg-lime-600',
        default: 'bg-gray-900 text-gray-50 hover:bg-gray-900/90',
        destructive: 'bg-gradient-to-r from-red-500 to-red-600 text-white font-bold shadow-md hover:from-red-600 hover:to-red-500 hover:shadow-lg hover:-translate-y-0.5 focus:ring-red-500/50 focus:ring-2 px-6 py-3 rounded-xl transition-all duration-200',
        outline: 'border border-gray-200 bg-white hover:bg-gray-100 hover:text-gray-900',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-100/80',
        ghost: 'hover:bg-gray-100 hover:text-gray-900',
        link: 'text-gray-900 underline-offset-4 hover:underline',
        lime: 'bg-gradient-to-r from-lime-400 to-lime-500 text-gray-900 font-bold shadow-md hover:from-lime-500 hover:to-lime-400 hover:shadow-lg hover:-translate-y-0.5 focus:ring-lime-400/50 focus:ring-2 px-6 py-3 rounded-xl transition-all duration-200',
      },
      size: {
        xl: 'h-14 px-8 py-4',
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, ...props }, ref) => {
    return (
      <button
        className={buttonVariants({ variant, size, className }) + (fullWidth ? ' w-full' : '')}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants }; 