import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
  'inline-flex items-center justify-center w-28 text-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-gray-200 text-gray-700',          // Xám
        success: 'border-transparent bg-green-500 text-white',            // Xanh
        danger: 'border-transparent bg-red-500 text-white',               // Đỏ
        warning: 'border-transparent bg-yellow-500 text-black',           // Vàng
        outline: 'border border-gray-400 text-gray-950 bg-transparent',   // Viền đen, chữ đen
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={badgeVariants({ variant, className })} {...props} />
  );
}

export { Badge, badgeVariants };
