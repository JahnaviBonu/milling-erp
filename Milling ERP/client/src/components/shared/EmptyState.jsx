import React from 'react';
import Button from './Button.jsx';

function EmptyState({ title, description, icon: Icon, actionLabel, onAction }) {
  return (
    <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/80 px-6 py-10 text-center">
      <div className="max-w-md space-y-4">
        {Icon && (
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-amber-400">
            <Icon className="h-6 w-6" aria-hidden="true" />
          </div>
        )}
        {title && (
          <h3 className="text-lg font-semibold text-slate-100">
            {title}
          </h3>
        )}
        {description && (
          <p className="text-sm text-slate-400">
            {description}
          </p>
        )}
        {actionLabel && onAction && (
          <div className="pt-2">
            <Button
              variant="primary"
              size="sm"
              onClick={onAction}
            >
              {actionLabel}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmptyState;