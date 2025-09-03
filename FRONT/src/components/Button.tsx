import React from 'react';
import { cn } from '@/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className,
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-2xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none touch-button relative overflow-hidden';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 focus:ring-blue-500 shadow-lg hover:shadow-xl transform hover:scale-105',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 shadow-md hover:shadow-lg transform hover:scale-105',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500 shadow-md hover:shadow-lg transform hover:scale-105',
    ghost: 'text-blue-600 hover:bg-blue-50 focus:ring-blue-500 hover:shadow-md',
    danger: 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 focus:ring-red-500 shadow-lg hover:shadow-xl transform hover:scale-105',
    gradient: 'bg-primary-gradient text-white shadow-lg hover:shadow-xl transform hover:scale-105 focus:ring-blue-500',
  };
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl',
  };

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        isLoading && 'pointer-events-none',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {/* 로딩 상태일 때 글로우 효과 */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-20 animate-pulse-soft"></div>
      )}
      
      {/* 로딩 스피너 */}
      {isLoading && (
        <div className="mr-3">
          <svg
            className="animate-spin h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      )}
      
      <span className={isLoading ? 'opacity-70' : ''}>{children}</span>
      
      {/* 호버 효과용 오버레이 */}
      <div className="absolute inset-0 bg-white bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 rounded-2xl"></div>
    </button>
  );
};

export default Button; 