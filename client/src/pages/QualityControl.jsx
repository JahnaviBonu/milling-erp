import React, { useEffect, useMemo, useState } from 'react';
import { RefreshCcw, FlaskConical } from 'lucide-react';
import { getBatches } from '../services/api.js';
import LoadingSpinner from '../components/shared/LoadingSpinner.jsx';
import EmptyState from '../components/shared/EmptyState.jsx';
import StatusBadge from '../components/shared/StatusBadge.jsx';

const statusOptions = ['', 'Passed', 'Failed', 'Review', 'Pending'];

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

export default function QualityControl() {
  const [batches, setBatches] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBatches();
      setBatches(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!statusFilter) return batches;
    return batches.filter((b) => b.status === statusFilter);
  }, [batches, statusFilter]);

  const stats = useMemo(() => {
    const total = batches.length;
    const passed = batches.filter((b) => b.status === 'Passed').length;
    const failed = batches.filter((b) => b.status === 'Failed').length;
    const passRate = total > 0 ? (passed / total) * 100 : 0;
    return { total, passed, failed, passRate };
  }, [batches]);

  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl">
        <EmptyState
          title="Unable to load quality control"
          description="There was an issue fetching batch QC data. Please try again."
          icon={RefreshCcw}
          actionLabel="Retry"
          onAction={load}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-100">
            Quality Control
          </h2>
          <p className="text-sm text-slate-400">
            Review ash, moisture, protein, and overall batch QC status.
          </p>
        </div>
        <div className="w-full sm:w-56">
          <label className="mb-1 block text-xs font-medium text-slate-300">
            Status Filter
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-md border border-slate-700 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
          >
            {statusOptions.map((s) => (
              <option key={s || 'all'} value={s}>
                {s ? s : 'All'}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stat cards */}
      <section className="grid gap-4 md:grid-cols-4">
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-[#14110b] p-5">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-[#c9a84c]/70 via-[#c9a84c]/40 to-transparent" />
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Total Batches
          </div>
          <div className="mt-2 text-2xl font-semibold text-slate-50">
            {stats.total}
          </div>
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-[#14110b] p-5">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-[#c9a84c]/70 via-[#c9a84c]/40 to-transparent" />
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Passed
          </div>
          <div className="mt-2 text-2xl font-semibold text-emerald-400">
            {stats.passed}
          </div>
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-[#14110b] p-5">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-[#c9a84c]/70 via-[#c9a84c]/40 to-transparent" />
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Failed
          </div>
          <div className="mt-2 text-2xl font-semibold text-red-400">
            {stats.failed}
          </div>
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-[#14110b] p-5">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-[#c9a84c]/70 via-[#c9a84c]/40 to-transparent" />
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Pass Rate
          </div>
          <div className="mt-2 text-2xl font-semibold text-slate-50">
            {stats.passRate.toFixed(1)}
            <span className="ml-1 text-xs text-slate-400">%</span>
          </div>
        </div>
      </section>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No QC records"
          description="No batches match the current filter."
          icon={FlaskConical}
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#14110b]">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-800 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3">Batch Number</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Grain Type</th>
                <th className="px-4 py-3">Ash Content (%)</th>
                <th className="px-4 py-3">Moisture (%)</th>
                <th className="px-4 py-3">Protein (%)</th>
                <th className="px-4 py-3">Extraction Rate (%)</th>
                <th className="px-4 py-3">Grade</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-slate-900/60">
                  <td className="px-4 py-3 font-medium text-slate-100">
                    {b.batch_number || '-'}
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {b.date || '-'}
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {b.grain_type || '-'}
                  </td>
                  <td className="px-4 py-3 text-slate-200">
                    {formatNumber(b.ash_content, 2)}
                  </td>
                  <td className="px-4 py-3 text-slate-200">
                    {formatNumber(b.moisture_pct, 1)}
                  </td>
                  <td className="px-4 py-3 text-slate-200">
                    {formatNumber(b.protein_pct, 1)}
                  </td>
                  <td className={`px-4 py-3 font-medium ${extractionClass(b.extraction_rate)}`}>
                    {formatNumber(b.extraction_rate, 1)}
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {b.grade || '-'}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={b.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}