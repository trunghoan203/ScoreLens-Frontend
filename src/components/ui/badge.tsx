import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
  'inline-flex items-center justify-center text-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 w-40 h-8 whitespace-nowrap',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-gray-200 text-gray-700',
        success: 'border-transparent bg-green-500 text-white',
        danger: 'border-transparent bg-red-500 text-white',
        warning: 'border-transparent bg-yellow-500 text-black',
        outline: 'border border-gray-400 text-gray-950 bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={badgeVariants({ variant, className })} {...props} />
  );
}

export { Badge, badgeVariants };
