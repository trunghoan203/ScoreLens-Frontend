import * as React from 'react';

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ');
}

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'flex w-full border border-gray-300 rounded-md bg-white px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-black placeholder:text-gray-500 focus:outline-none focus:border-lime-500 hover:border-lime-400 transition-all',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = 'Input';

export { Input }; 