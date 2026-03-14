import { useState } from 'react';
import {
  Bar, BarChart, CartesianGrid, Legend,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { Download, Printer, RefreshCcw } from 'lucide-react';
import { getKPIs, getMonthlySummary, getBatches, getProcurement } from '../services/api.js';
import LoadingSpinner from '../components/shared/LoadingSpinner.jsx';

export default function Reports() {
  const today = new Date().toISOString().split('T')[0];
  const threeMonthsAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [fromDate, setFromDate] = useState(threeMonthsAgo);
  const [toDate, setToDate] = useState(today);
  const [kpis, setKpis] = useState(null);
  const [monthly, setMonthly] = useState([]);
  const [batches, setBatches] = useState([]);
  const [procurement, setProcurement] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [error, setError] = useState(null);

  const generateReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const [kpiData, monthlyData, batchData, procData] = await Promise.all([
        getKPIs(),
        getMonthlySummary(),
        getBatches({ from: fromDate, to: toDate }),
        getProcurement(),
      ]);
      setKpis(kpiData);
      setMonthly(Array.isArray(monthlyData) ? monthlyData : []);
      setBatches(Array.isArray(batchData) ? batchData : []);
      setProcurement(Array.isArray(procData) ? procData : []);
      setGenerated(true);
    } catch {
      setError('Failed to load report data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const passedBatches = batches.filter(b => b.status === 'Passed').length;
  const failedBatches = batches.filter(b => b.status === 'Failed').length;
  const passRate = batches.length > 0
    ? ((passedBatches / batches.length) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-6">

      {/* Print styles — preserves dark theme when printing */}
      <style>{`
  @media print {
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    
    /* Hide sidebar, header, controls */
    .fixed.inset-y-0.left-0 { display: none !important; }
    header { display: none !important; }
    .no-print { display: none !important; }
    
    /* Remove sidebar offset */
    .ml-60 { margin-left: 0 !important; }
    .flex.min-h-screen { display: block !important; }
    
    /* THIS IS THE KEY FIX — remove fixed height and overflow hidden */
    /* These were clipping the scrollable content */
    .flex.h-screen.flex-1.flex-col.overflow-hidden {
      height: auto !important;
      overflow: visible !important;
    }
    
    main {
      padding: 12px !important;
      overflow: visible !important;
      height: auto !important;
      max-height: none !important;
      background: #0f0d0a !important;
    }
    
    /* Report fills full page */
    #report-content {
      border: none !important;
      border-radius: 0 !important;
      padding: 0 !important;
      margin: 0 !important;
      width: 100% !important;
    }
    
    /* Allow content to break across pages */
    .space-y-6 > * { break-inside: avoid; }
    table { break-inside: auto; }
    tr { break-inside: avoid; }
    
    body { background: #0f0d0a !important; }
    
    @page { margin: 12mm; size: A4; }
  }
`}</style>

      {/* Controls — hidden when printing */}
      <div className="no-print flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-100">Mill Operations Report</h2>
          <p className="mt-1 text-sm text-slate-400">Select a date range and generate your report.</p>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-400">From</label>
            <input
              type="date"
              value={fromDate}
              onChange={e => setFromDate(e.target.value)}
              className="rounded border border-slate-700 bg-[#1a1710] px-3 py-2 text-sm text-slate-100 focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-400">To</label>
            <input
              type="date"
              value={toDate}
              onChange={e => setToDate(e.target.value)}
              className="rounded border border-slate-700 bg-[#1a1710] px-3 py-2 text-sm text-slate-100 focus:border-amber-500 focus:outline-none"
            />
          </div>
          <button
            onClick={generateReport}
            disabled={loading}
            className="flex items-center gap-2 rounded bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-500 disabled:opacity-50 transition-colors"
          >
            <RefreshCcw className="h-4 w-4" />
            {loading ? 'Generating...' : 'Generate Report'}
          </button>
          {generated && (
            <>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 rounded border border-amber-600 px-4 py-2 text-sm font-medium text-amber-500 hover:bg-amber-600/10 transition-colors"
              >
                <Download className="h-4 w-4" />
                Export PDF
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 rounded border border-slate-600 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700 transition-colors"
              >
                <Printer className="h-4 w-4" />
                Print
              </button>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="no-print rounded border border-red-700 bg-red-900/30 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading && (
        <div className="no-print flex min-h-[200px] items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {/* Empty state */}
      {!generated && !loading && (
        <div className="no-print flex min-h-[300px] items-center justify-center rounded-2xl border border-dashed border-slate-700">
          <div className="text-center">
            <div className="text-4xl mb-3">📊</div>
            <p className="text-slate-400 text-sm">Select a date range and click Generate Report</p>
          </div>
        </div>
      )}

      {/* Report content */}
      {generated && !loading && (
        <div id="report-content" className="space-y-6 rounded-2xl border border-slate-800 bg-[#0f0d0a] p-6">

          {/* Report header */}
          <div className="border-b border-slate-800 pb-4">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-amber-400">🌾 Mill Ops</h1>
                <p className="text-sm text-slate-400">Grain Milling ERP — Operations Report</p>
              </div>
              <div className="text-right text-xs text-slate-400">
                <div>Period: {fromDate} to {toDate}</div>
                <div>Generated: {new Date().toLocaleDateString()}</div>
              </div>
            </div>
          </div>

          {/* KPI summary */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">KPI Summary</h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                { label: 'Total Input MT', value: kpis?.total_input_mt?.toFixed(1), unit: 'MT' },
                { label: 'Total Output MT', value: kpis?.total_output_mt?.toFixed(1), unit: 'MT' },
                { label: 'Avg Extraction Rate', value: kpis?.avg_extraction_rate?.toFixed(1), unit: '%' },
                { label: 'QC Pass Rate', value: kpis?.qc_pass_rate?.toFixed(1), unit: '%' },
              ].map(({ label, value, unit }) => (
                <div key={label} className="rounded-xl border border-slate-800 bg-[#14110b] p-4">
                  <div className="text-xs text-slate-400">{label}</div>
                  <div className="mt-1 text-2xl font-bold text-slate-100">
                    {value ?? '—'}<span className="ml-1 text-xs text-slate-400">{unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly chart */}
          {monthly.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">Monthly Throughput</h3>
              <div className="rounded-xl border border-slate-800 bg-[#14110b] p-4">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthly}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1f2933" vertical={false} />
                      <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                      <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '0.5rem' }}
                        labelStyle={{ color: '#e5e7eb' }}
                      />
                      <Legend wrapperStyle={{ color: '#9ca3af' }} />
                      <Bar dataKey="input" name="Input MT" fill="#c9a84c" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="output" name="Output MT" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Batch summary */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
              Batch Summary ({batches.length} batches in period)
            </h3>
            <div className="rounded-xl border border-slate-800 bg-[#14110b] overflow-hidden">
              <div className="grid grid-cols-3 gap-4 border-b border-slate-800 p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{passedBatches}</div>
                  <div className="text-xs text-slate-400">Passed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">{failedBatches}</div>
                  <div className="text-xs text-slate-400">Failed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-400">{passRate}%</div>
                  <div className="text-xs text-slate-400">Pass Rate</div>
                </div>
              </div>
              {batches.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="border-b border-slate-800 text-xs uppercase tracking-wide text-slate-400">
                      <tr>
                        <th className="px-4 py-3 text-left">Batch</th>
                        <th className="px-4 py-3 text-left">Date</th>
                        <th className="px-4 py-3 text-left">Grain Type</th>
                        <th className="px-4 py-3 text-left">Input MT</th>
                        <th className="px-4 py-3 text-left">Output MT</th>
                        <th className="px-4 py-3 text-left">Extraction %</th>
                        <th className="px-4 py-3 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900">
                      {batches.slice(0, 10).map(b => (
                        <tr key={b.id}>
                          <td className="px-4 py-3 text-slate-100 font-mono text-xs">{b.batch_number}</td>
                          <td className="px-4 py-3 text-slate-300">{b.date}</td>
                          <td className="px-4 py-3 text-slate-300">{b.grain_type}</td>
                          <td className="px-4 py-3 text-slate-300">{b.input_mt}</td>
                          <td className="px-4 py-3 text-slate-300">{b.output_mt}</td>
                          <td className="px-4 py-3">
                            <span className={
                              b.extraction_rate == null ? 'text-slate-400' :
                              b.extraction_rate >= 75 ? 'text-green-400' :
                              b.extraction_rate >= 70 ? 'text-amber-400' : 'text-red-400'
                            }>
                              {b.extraction_rate != null ? `${b.extraction_rate.toFixed(1)}%` : '—'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                              b.status === 'Passed' ? 'bg-green-900/50 text-green-300' :
                              b.status === 'Failed' ? 'bg-red-900/50 text-red-300' :
                              'bg-amber-900/50 text-amber-300'
                            }`}>
                              {b.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {batches.length > 10 && (
                    <p className="px-4 py-2 text-xs text-slate-500">
                      Showing 10 of {batches.length} batches. Export PDF for full list.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Procurement status */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">Procurement Status</h3>
            <div className="rounded-xl border border-slate-800 bg-[#14110b] overflow-hidden">
              <table className="min-w-full text-sm">
                <thead className="border-b border-slate-800 text-xs uppercase tracking-wide text-slate-400">
                  <tr>
                    <th className="px-4 py-3 text-left">Grain Type</th>
                    <th className="px-4 py-3 text-left">Supplier</th>
                    <th className="px-4 py-3 text-left">Target MT</th>
                    <th className="px-4 py-3 text-left">Procured MT</th>
                    <th className="px-4 py-3 text-left">Progress</th>
                    <th className="px-4 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  {procurement.map(p => {
                    const procured = Number(p.procured_mt) || 0;
                    const target = Number(p.target_mt) || 0;
                    const pct = target > 0 ? Math.min(100, (procured / target) * 100) : 0;
                    return (
                      <tr key={p.id}>
                        <td className="px-4 py-3 text-slate-100">{p.grain_type}</td>
                        <td className="px-4 py-3 text-slate-300">{p.supplier_name}</td>
                        <td className="px-4 py-3 text-slate-300">{p.target_mt}</td>
                        <td className="px-4 py-3 text-slate-300">{p.procured_mt}</td>
                        <td className="px-4 py-3 w-32">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 rounded-full bg-slate-800 h-1.5">
                              <div
                                className={`h-1.5 rounded-full ${pct >= 70 ? 'bg-green-500' : pct >= 40 ? 'bg-amber-500' : 'bg-red-500'}`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="text-xs text-slate-400">{pct.toFixed(0)}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            p.status === 'Completed' ? 'bg-green-900/50 text-green-300' :
                            p.status === 'In Progress' ? 'bg-blue-900/50 text-blue-300' :
                            p.status === 'Pending' ? 'bg-amber-900/50 text-amber-300' :
                            'bg-slate-800 text-slate-300'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quality metrics */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">Quality Metrics</h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                { label: 'Total Batches', value: batches.length },
                { label: 'Passed', value: passedBatches, color: 'text-green-400' },
                { label: 'Failed', value: failedBatches, color: 'text-red-400' },
                { label: 'Pass Rate', value: `${passRate}%`, color: 'text-amber-400' },
              ].map(({ label, value, color }) => (
                <div key={label} className="rounded-xl border border-slate-800 bg-[#14110b] p-4 text-center">
                  <div className={`text-2xl font-bold ${color || 'text-slate-100'}`}>{value}</div>
                  <div className="text-xs text-slate-400 mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}