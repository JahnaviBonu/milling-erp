import React from 'react';

const STATUS_STYLES = {
  Passed: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
  Completed: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
  Normal: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
  Failed: 'bg-red-100 text-red-800 ring-red-200',
  Critical: 'bg-red-100 text-red-800 ring-red-200',
  Review: 'bg-amber-100 text-amber-800 ring-amber-200',
  Pending: 'bg-amber-100 text-amber-800 ring-amber-200',
  Urgent: 'bg-amber-100 text-amber-800 ring-amber-200',
  High: 'bg-amber-100 text-amber-800 ring-amber-200',
  Confirmed: 'bg-sky-100 text-sky-800 ring-sky-200',
  'In Transit': 'bg-sky-100 text-sky-800 ring-sky-200',
  'In Progress': 'bg-sky-100 text-sky-800 ring-sky-200',
};

function StatusBadge({ status }) {
  const label = status || 'Unknown';
  const classes =
    STATUS_STYLES[label] ??
    'bg-slate-100 text-slate-700 ring-slate-200';

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${classes}`}
    >
      {label}
    </span>
  );
}

export default StatusBadge;