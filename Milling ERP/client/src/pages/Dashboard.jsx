import React, { useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from 'recharts';
import {
  Factory,
  Gauge,
  Percent,
  ShieldCheck,
  Activity,
} from 'lucide-react';
import {
  getKPIs,
  getMonthlySummary,
  getBatches,
} from '../services/api.js';
import KPICard from '../components/dashboard/KPICard.jsx';
import LoadingSpinner from '../components/shared/LoadingSpinner.jsx';
import EmptyState from '../components/shared/EmptyState.jsx';
import StatusBadge from '../components/shared/StatusBadge.jsx';
import Button from '../components/shared/Button.jsx';

function Dashboard() {
  const [kpis, setKpis] = useState(null);
  const [monthly, setMonthly] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [kpiData, monthlyData, batchesData] = await Promise.all([
        getKPIs(),
        getMonthlySummary(),
        getBatches(),
      ]);
      setKpis(kpiData);
      setMonthly(monthlyData);
      setBatches(batchesData);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const gradeDistribution = useMemo(() => {
    const counts = batches.reduce((acc, batch) => {
      const grade = batch.grade || 'Unspecified';
      acc[grade] = (acc[grade] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([grade, count]) => ({
      grade,
      count,
    }));
  }, [batches]);

  const recentBatches = useMemo(
    () =>
      [...batches]
        .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
        .slice(0, 5),
    [batches],
  );

  const gradeColors = ['#c9a84c', '#f59e0b', '#22c55e', '#3b82f6', '#e11d48'];

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
          title="Unable to load dashboard"
          description="There was an issue fetching KPI and batch data. Please check your server and try again."
          icon={Activity}
          actionLabel="Retry"
          onAction={loadData}
        />
      </div>
    );
  }

  if (!kpis) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* KPIs */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <KPICard
          label="Total Input MT"
          value={kpis.total_input_mt?.toFixed(1) ?? '0.0'}
          unit="MT"
          delta={null}
          icon={Factory}
          subtext="Total grain received into mill"
        />
        <KPICard
          label="Total Output MT"
          value={kpis.total_output_mt?.toFixed(1) ?? '0.0'}
          unit="MT"
          delta={null}
          icon={Gauge}
          subtext="Finished flour produced"
        />
        <KPICard
          label="Avg Extraction Rate"
          value={
            kpis.avg_extraction_rate != null
              ? kpis.avg_extraction_rate.toFixed(1)
              : '0.0'
          }
          unit="%"
          delta={null}
          icon={Percent}
          subtext="Overall milling efficiency"
        />
        <KPICard
          label="QC Pass Rate"
          value={
            kpis.qc_pass_rate != null
              ? kpis.qc_pass_rate.toFixed(1)
              : '0.0'
          }
          unit="%"
          delta={null}
          icon={ShieldCheck}
          subtext="Batches meeting quality spec"
        />
        <KPICard
          label="Active Batches"
          value={kpis.total_batches ?? 0}
          unit="batches"
          delta={null}
          icon={Activity}
          subtext="Total batches recorded"
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {/* Monthly throughput chart */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-[#14110b] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-100">
              Monthly Throughput
            </h2>
            <span className="text-xs text-slate-400">
              Input vs output (MT)
            </span>
          </div>
          {monthly.length === 0 ? (
            <div className="flex h-60 items-center justify-center text-sm text-slate-500">
              No monthly data yet.
            </div>
          ) : (
            <div className="h-72">
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
                  <Legend
                    wrapperStyle={{
                      color: '#9ca3af',
                    }}
                  />
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
        </div>

        {/* Grade distribution */}
        <div className="rounded-2xl border border-slate-800 bg-[#14110b] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-100">
              Grade Mix
            </h2>
            <span className="text-xs text-slate-400">
              Distribution by batch count
            </span>
          </div>
          {gradeDistribution.length === 0 ? (
            <div className="flex h-60 items-center justify-center text-sm text-slate-500">
              No batches recorded yet.
            </div>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    cursor={{ fill: 'rgba(15,23,42,0.4)' }}
                    contentStyle={{
                      backgroundColor: '#020617',
                      border: '1px solid #1e293b',
                      borderRadius: '0.5rem',
                    }}
                    labelStyle={{ color: '#e5e7eb' }}
                  />
                  <Pie
                    data={gradeDistribution}
                    dataKey="count"
                    nameKey="grade"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={3}
                  >
                    {gradeDistribution.map((entry, index) => (
                      <Cell
                        key={entry.grade}
                        fill={
                          gradeColors[index % gradeColors.length]
                        }
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </section>

      {/* Recent batches */}
      <section className="rounded-2xl border border-slate-800 bg-[#14110b] p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">
              Recent Batches
            </h2>
            <p className="text-xs text-slate-400">
              Latest five batches from the mill
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-slate-300 hover:text-slate-50"
          >
            View all
          </Button>
        </div>
        {recentBatches.length === 0 ? (
          <div className="flex h-40 items-center justify-center text-sm text-slate-500">
            No batches recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-800 text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="py-2 pr-4">Batch</th>
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Grain</th>
                  <th className="py-2 pr-4">Input MT</th>
                  <th className="py-2 pr-4">Output MT</th>
                  <th className="py-2 pr-4">Grade</th>
                  <th className="py-2 pr-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900">
                {recentBatches.map((batch) => (
                  <tr key={batch.id} className="hover:bg-slate-900/60">
                    <td className="py-2 pr-4 text-slate-100">
                      {batch.batch_number}
                    </td>
                    <td className="py-2 pr-4 text-slate-300">
                      {batch.date}
                    </td>
                    <td className="py-2 pr-4 text-slate-300">
                      {batch.grain_type}
                    </td>
                    <td className="py-2 pr-4 text-slate-200">
                      {batch.input_mt}
                    </td>
                    <td className="py-2 pr-4 text-slate-200">
                      {batch.output_mt}
                    </td>
                    <td className="py-2 pr-4 text-slate-300">
                      {batch.grade}
                    </td>
                    <td className="py-2 pr-4">
                      <StatusBadge status={batch.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;