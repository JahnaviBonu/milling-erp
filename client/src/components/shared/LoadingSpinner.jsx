import React from 'react';

const sizeMap = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
};

function LoadingSpinner({ size = 'md', className = '' }) {
  const sizeClasses = sizeMap[size] ?? sizeMap.md;

  return (
    <span
      className={`inline-block ${sizeClasses} animate-spin rounded-full border-2 border-amber-500 border-r-transparent ${className}`}
      aria-hidden="true"
    />
  );
}

export default LoadingSpinner;