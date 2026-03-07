import React from 'react';
import { Edit2, Trash2, ClipboardList } from 'lucide-react';
import StatusBadge from '../shared/StatusBadge.jsx';
import Button from '../shared/Button.jsx';
import EmptyState from '../shared/EmptyState.jsx';

function formatNumber(value, decimals = 1) {
  const n = Number(value);
  if (Number.isNaN(n)) return '-';
  return n.toFixed(decimals);
}

function extractionClass(rate) {
  const r = Number(rate);
  if (Number.isNaN(r)) return 'text-slate-300';
  if (r > 75) return 'text-emerald-400';
  if (r >= 70) return 'text-amber-400';
  return 'text-red-400';
}

function TableSkeleton() {
  const rows = 5;
  const colCount = 9;
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#14110b]">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-slate-800 text-xs uppercase tracking-wide text-slate-400">
          <tr>
            <th className="px-4 py-3">Batch Number</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Grain Type</th>
            <th className="px-4 py-3">Input MT</th>
            <th className="px-4 py-3">Output MT</th>
            <th className="px-4 py-3">Extraction Rate</th>
            <th className="px-4 py-3">Grade</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-900">
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i}>
              {Array.from({ length: colCount }).map((_, j) => (
                <td key={j} className="px-4 py-3">
                  <span
                    className="inline-block h-5 min-w-[3rem] rounded bg-slate-700/80 animate-pulse"
                    style={{ width: j === 0 ? '6rem' : j === colCount - 1 ? '4rem' : '4rem' }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BatchTable({ batches = [], onEdit, onDelete, loading = false }) {
  if (loading) {
    return <TableSkeleton />;
  }

  if (!batches || batches.length === 0) {
    return (
      <EmptyState
        title="No batches yet"
        description="Create your first batch to start tracking milling output, quality, and performance."
        icon={ClipboardList}
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#14110b]">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-slate-800 text-xs uppercase tracking-wide text-slate-400">
          <tr>
            <th className="px-4 py-3">Batch Number</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Grain Type</th>
            <th className="px-4 py-3">Input MT</th>
            <th className="px-4 py-3">Output MT</th>
            <th className="px-4 py-3">Extraction Rate</th>
            <th className="px-4 py-3">Grade</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-900">
          {batches.map((batch) => (
            <tr key={batch.id} className="hover:bg-slate-900/60">
              <td className="px-4 py-3 font-medium text-slate-100">
                {batch.batch_number ?? '-'}
              </td>
              <td className="px-4 py-3 text-slate-300">
                {batch.date ?? '-'}
              </td>
              <td className="px-4 py-3 text-slate-300">
                {batch.grain_type ?? '-'}
              </td>
              <td className="px-4 py-3 text-slate-200">
                {formatNumber(batch.input_mt, 1)}
              </td>
              <td className="px-4 py-3 text-slate-200">
                {formatNumber(batch.output_mt, 1)}
              </td>
              <td className={`px-4 py-3 font-medium ${extractionClass(batch.extraction_rate)}`}>
                {formatNumber(batch.extraction_rate, 1)}%
              </td>
              <td className="px-4 py-3 text-slate-300">
                {batch.grade ?? '-'}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={batch.status} />
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onEdit?.(batch)}
                    className="px-2.5"
                  >
                    <Edit2 className="h-4 w-4" aria-hidden="true" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onDelete?.(batch.id)}
                    className="px-2.5"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BatchTable;