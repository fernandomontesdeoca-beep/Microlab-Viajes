/**
 * @file Button.jsx
 * @description Botón reutilizable con variantes de estilo.
 * @version 1.0.0
 */
import React from 'react';
import { Loader2 } from 'lucide-react';

const VARIANTS = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200',
  secondary: 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50',
  danger: 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100',
  ghost: 'text-gray-400 hover:text-gray-600'
};

export const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  isLoading = false, 
  disabled = false,
  className = '',
  type = 'button'
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        w-full py-4 rounded-xl font-bold transition-all active:scale-[0.98] 
        flex items-center justify-center gap-2
        disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
        ${VARIANTS[variant]} 
        ${className}
      `}
    >
      {isLoading && <Loader2 className="animate-spin" size={20} />}
      {children}
    </button>
  );
};