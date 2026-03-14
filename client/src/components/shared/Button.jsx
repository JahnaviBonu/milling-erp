import React from 'react';

const baseClasses =
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed gap-2';

const variants = {
  primary:
    'bg-[#c9a84c] text-slate-900 hover:bg-[#b4953f] focus-visible:ring-[#c9a84c]',
  secondary:
    'border border-slate-300 text-slate-800 bg-white hover:bg-slate-50 focus-visible:ring-slate-300',
  danger:
    'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
  ghost:
    'bg-transparent text-slate-800 hover:bg-slate-100 focus-visible:ring-slate-300',
};

const sizes = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-5 text-base',
};

const Spinner = () => (
  <span
    className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
    aria-hidden="true"
  />
);

function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  type = 'button',
  ...rest
}) {
  const isDisabled = disabled || loading;
  const variantClasses = variants[variant] ?? variants.primary;
  const sizeClasses = sizes[size] ?? sizes.md;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      {...rest}
    >
      {loading && <Spinner />}
      <span>{children}</span>
    </button>
  );
}

export default Button;