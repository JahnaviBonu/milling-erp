import React, { useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Download, RefreshCcw } from 'lucide-react';
import { getKPIs, getMonthlySummary } from '../services/api.js';
import LoadingSpinner from '../components/shared/LoadingSpinner.jsx';
import EmptyState from '../components/shared/EmptyState.jsx';
import Button from '../components/shared/Button.jsx';

function formatToday() {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());
}

function num(value, decimals = 1) {
  const n = Number(value);
  if (Number.isNaN(n)) return 0;
  return Number(n.toFixed(decimals));
}

export default function Reports() {
  const [kpis, setKpis] = useState(null);
  const [monthly, setMonthly] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [kpiData, monthlyData] = await Promise.all([
        getKPIs(),
        getMonthlySummary(),
      ]);
      setKpis(kpiData);
      setMonthly(Array.isArray(monthlyData) ? monthlyData : []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const reportDate = useMemo(() => formatToday(), []);

  const metrics = useMemo(() => {
    const totalInput = num(kpis?.total_input_mt, 1);
    const totalOutput = num(kpis?.total_output_mt, 1);
    const avgExtraction = kpis?.avg_extraction_rate != null ? num(kpis.avg_extraction_rate, 1) : null;
    const qcPassRate = kpis?.qc_pass_rate != null ? num(kpis.qc_pass_rate, 1) : null;
    const totalBatches = Number(kpis?.total_batches ?? 0);

    const yieldLoss = totalInput > 0 ? num(((totalInput - totalOutput) / totalInput) * 100, 1) : 0;
    const avgMonthlyInput = monthly.length > 0
      ? num(monthly.reduce((sum, m) => sum + Number(m.input || 0), 0) / monthly.length, 0)
      : 0;
    const avgMonthlyOutput = monthly.length > 0
      ? num(monthly.reduce((sum, m) => sum + Number(m.output || 0), 0) / monthly.length, 0)
      : 0;

    return {
      totalInput,
      totalOutput,
      avgExtraction,
      qcPassRate,
      totalBatches,
      yieldLoss,
      avgMonthlyInput,
      avgMonthlyOutput,
    };
  }, [kpis, monthly]);

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
          title="Unable to load reports"
          description="There was an issue fetching report data. Please try again."
          icon={RefreshCcw}
          actionLabel="Retry"
          onAction={load}
        />
      </div>
    );
  }

  if (!kpis) return null;

  return (
    <div className="report-page space-y-6">
      <style>{`
        @media print {
          aside, header { display: none !important; }
          main { padding: 0 !important; background: #fff !important; }
          body { background: #fff !important; color: #111827 !important; }
          .no-print { display: none !important; }
          .report-page { background: #fff !important; color: #111827 !important; }
          .report-card { background: #fff !important; border-color: #e5e7eb !important; }
          .report-muted { color: #4b5563 !important; }
          table { border-color: #e5e7eb !important; }
          thead { color: #374151 !important; }
          tbody tr { break-inside: avoid; }
        }
      `}</style>

      {/* Report header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400 report-muted">
            {reportDate}
          </div>
          <h2 className="mt-1 text-xl font-semibold text-slate-100">
            Mill Operations Report
          </h2>
          <p className="mt-1 text-sm text-slate-400 report-muted">
            Summary of throughput, efficiency, and quality outcomes.
          </p>
        </div>
        <div className="no-print">
          <Button onClick={() => window.print()}>
            <Download className="h-4 w-4" aria-hidden="true" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* KPI summary */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="report-card relative overflow-hidden rounded-2xl border border-slate-800 bg-[#14110b] p-5">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-[#c9a84c]/70 via-[#c9a84c]/40 to-transparent" />
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400 report-muted">
            Total Input MT
          </div>
          <div className="mt-2 text-2xl font-semibold text-slate-50">
            {metrics.totalInput}
            <span className="ml-2 text-xs text-slate-400 report-muted">MT</span>
          </div>
        </div>
        <div className="report-card relative overflow-hidden rounded-2xl border border-slate-800 bg-[#14110b] p-5">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-[#c9a84c]/70 via-[#c9a84c]/40 to-transparent" />
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400 report-muted">
            Total Output MT
          </div>
          <div className="mt-2 text-2xl font-semibold text-slate-50">
            {metrics.totalOutput}
            <span className="ml-2 text-xs text-slate-400 report-muted">MT</span>
          </div>
        </div>
        <div className="report-card relative overflow-hidden rounded-2xl border border-slate-800 bg-[#14110b] p-5">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-[#c9a84c]/70 via-[#c9a84c]/40 to-transparent" />
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400 report-muted">
            Avg Extraction Rate
          </div>
          <div className="mt-2 text-2xl font-semibold text-slate-50">
            {metrics.avgExtraction ?? 0}
            <span className="ml-2 text-xs text-slate-400 report-muted">%</span>
          </div>
        </div>
        <div className="report-card relative overflow-hidden rounded-2xl border border-slate-800 bg-[#14110b] p-5">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-[#c9a84c]/70 via-[#c9a84c]/40 to-transparent" />
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400 report-muted">
            QC Pass Rate
          </div>
          <div className="mt-2 text-2xl font-semibold text-slate-50">
            {metrics.qcPassRate ?? 0}
            <span className="ml-2 text-xs text-slate-400 report-muted">%</span>
          </div>
        </div>
      </section>

      {/* Monthly bar chart */}
      <section className="report-card rounded-2xl border border-slate-800 bg-[#14110b] p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-100">
            Monthly Input vs Output
          </h3>
          <span className="text-xs text-slate-400 report-muted">MT by month</span>
        </div>
        {monthly.length === 0 ? (
          <div className="flex h-60 items-center justify-center text-sm text-slate-500 report-muted">
            No monthly data yet.
          </div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1f2933"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: '#9ca3af', fontSize: 11 }}
                  axisLine={{ stroke: '#374151' }}
                />
                <YAxis
                  tick={{ fill: '#9ca3af', fontSize: 11 }}
                  axisLine={{ stroke: '#374151' }}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(15,23,42,0.4)' }}
                  contentStyle={{
                    backgroundColor: '#020617',
                    border: '1px solid #1e293b',
                    borderRadius: '0.5rem',
                  }}
                  labelStyle={{ color: '#e5e7eb' }}
                />
                <Legend wrapperStyle={{ color: '#9ca3af' }} />
                <Bar
                  dataKey="input"
                  name="Input MT"
                  fill="#c9a84c"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="output"
                  name="Output MT"
                  fill="#f59e0b"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      {/* Key metrics table */}
      <section className="report-card overflow-hidden rounded-2xl border border-slate-800 bg-[#14110b]">
        <div className="border-b border-slate-800 px-5 py-4">
          <h3 className="text-sm font-semibold text-slate-100">Key Metrics</h3>
          <p className="mt-1 text-xs text-slate-400 report-muted">
            Snapshot of operational KPIs derived from recorded batches.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-800 text-xs uppercase tracking-wide text-slate-400 report-muted">
              <tr>
                <th className="px-5 py-3">Metric</th>
                <th className="px-5 py-3">Value</th>
                <th className="px-5 py-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900">
              <tr>
                <td className="px-5 py-3 text-slate-100">Total Batches</td>
                <td className="px-5 py-3 text-slate-200">{metrics.totalBatches}</td>
                <td className="px-5 py-3 text-slate-400 report-muted">All recorded batches</td>
              </tr>
              <tr>
                <td className="px-5 py-3 text-slate-100">Yield Loss</td>
                <td className="px-5 py-3 text-slate-200">{metrics.yieldLoss}%</td>
                <td className="px-5 py-3 text-slate-400 report-muted">Calculated from input vs output</td>
              </tr>
              <tr>
                <td className="px-5 py-3 text-slate-100">Avg Monthly Input</td>
                <td className="px-5 py-3 text-slate-200">{metrics.avgMonthlyInput} MT</td>
                <td className="px-5 py-3 text-slate-400 report-muted">Across available months</td>
              </tr>
              <tr>
                <td className="px-5 py-3 text-slate-100">Avg Monthly Output</td>
                <td className="px-5 py-3 text-slate-200">{metrics.avgMonthlyOutput} MT</td>
                <td className="px-5 py-3 text-slate-400 report-muted">Across available months</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}