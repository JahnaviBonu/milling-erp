import React from 'react';

function KPICard({
  label,
  value,
  unit,
  delta,
  deltaType = 'up',
  subtext,
  icon: Icon,
}) {
  const isUp = deltaType === 'up';
  const deltaClasses = isUp
    ? 'text-emerald-400'
    : 'text-red-400';

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-[#1a1710] px-4 py-4 shadow-sm transition-transform transition-colors duration-150 hover:-translate-y-0.5 hover:border-[#c9a84c]/60 hover:shadow-md">
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-[#c9a84c]/70 via-[#c9a84c]/40 to-transparent" />
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5">
          {label && (
            <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
              {label}
            </div>
          )}
          <div className="flex items-baseline gap-1.5">
            <span
              style={{ fontFamily: 'Georgia, serif' }}
              className="text-2xl font-semibold text-slate-50"
            >
              {value}
            </span>
            {unit && (
              <span className="text-xs text-slate-400">
                {unit}
              </span>
            )}
          </div>
          {delta && (
            <div className={`text-xs font-medium ${deltaClasses}`}>
              {delta}
            </div>
          )}
        </div>

        {Icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900/70 text-[#c9a84c]">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </div>
        )}
      </div>

      {subtext && (
        <p className="mt-3 text-xs text-slate-500">
          {subtext}
        </p>
      )}
    </div>
  );
}

export default KPICard;