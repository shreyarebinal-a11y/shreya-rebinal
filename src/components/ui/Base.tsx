import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Card = ({ children, className, id, ...props }: { children: React.ReactNode, className?: string, id?: string, [key: string]: any }) => (
  <div id={id} className={cn("bg-white p-6 rounded-2xl shadow-sm border border-gray-100", className)} {...props}>
    {children}
  </div>
);

export const Button = ({ 
  children, 
  className, 
  variant = 'primary', 
  size = 'md',
  id,
  loading,
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost', size?: 'sm' | 'md' | 'lg', id?: string, loading?: boolean }) => {
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-800 text-white hover:bg-gray-900",
    outline: "border-2 border-gray-200 text-gray-700 hover:bg-gray-50",
    ghost: "text-gray-600 hover:bg-gray-100"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5",
    lg: "px-8 py-3.5 text-lg font-medium"
  };

  return (
    <button 
      id={id}
      disabled={loading || props.disabled}
      className={cn(
        "rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />
      )}
      {children}
    </button>
  );
};

export const Input = ({ label, id, error, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label?: string, error?: string, id?: string }) => (
  <div className="space-y-1.5 w-full">
    {label && <label className="text-sm font-medium text-gray-700" htmlFor={id}>{label}</label>}
    <input
      id={id}
      className={cn(
        "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all",
        error && "border-red-500 bg-red-50",
        props.className
      )}
      {...props}
    />
    {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
  </div>
);

export const Select = ({ label, id, options, error, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string, options: { label: string, value: string }[], error?: string, id?: string }) => (
  <div className="space-y-1.5 w-full">
    {label && <label className="text-sm font-medium text-gray-700" htmlFor={id}>{label}</label>}
    <select
      id={id}
      className={cn(
        "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer",
        error && "border-red-500 bg-red-50",
        props.className
      )}
      {...props}
    >
      <option value="">Select option</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
  </div>
);
