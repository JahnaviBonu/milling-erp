import React, { useEffect } from 'react';

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
};

function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const panelSize = sizeClasses[size] ?? sizeClasses.md;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm transition-opacity duration-200 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      onClick={isOpen ? onClose : undefined}
      aria-modal={isOpen ? 'true' : undefined}
      aria-hidden={isOpen ? undefined : 'true'}
      role="dialog"
    >
      <div
        className={`relative w-full ${panelSize} transform rounded-xl bg-white p-6 shadow-xl transition-all duration-200 ease-out ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          </div>
        )}
        <div className="text-sm text-slate-700">{children}</div>
      </div>
    </div>
  );
}

export default Modal;