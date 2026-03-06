import React, { useEffect, useMemo, useState } from 'react';
import { Plus, RefreshCcw, Package } from 'lucide-react';
import {
  createProcurement,
  getProcurement,
} from '../services/api.js';
import Button from '../components/shared/Button.jsx';
import LoadingSpinner from '../components/shared/LoadingSpinner.jsx';
import EmptyState from '../components/shared/EmptyState.jsx';
import StatusBadge from '../components/shared/StatusBadge.jsx';
import Modal from '../components/shared/Modal.jsx';

const grainTypes = [
  'Hard Red Wheat',
  'Soft White Wheat',
  'Durum Wheat',
  'Whole Wheat',
  'Soft Red Wheat',
];

const priorityOptions = ['Normal', 'High', 'Urgent', 'Critical'];
const statusOptions = ['Pending', 'In Progress', 'Completed'];

function formatNumber(value, decimals = 0) {
  const n = Number(value);
  if (Number.isNaN(n)) return 0;
  return Number(n.toFixed(decimals));
}

function progressColor(pct) {
  if (pct > 70) return 'bg-emerald-500';
  if (pct >= 40) return 'bg-amber-500';
  return 'bg-red-500';
}

function NewOrderModal({ isOpen, onClose, onCreated }) {
  const [form, setForm] = useState(() => ({
    grain_type: grainTypes[0],
    supplier_name: '',
    target_mt: '',
    procured_mt: '0',
    cost_per_mt: '',
    order_date: new Date().toISOString().slice(0, 10),
    expected_delivery: '',
    lead_time_days: '',
    priority: 'Normal',
    status: 'Pending',
    quarter: 'Q2 FY2025',
  }));

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const updateField = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = {
        ...form,
        target_mt: form.target_mt === '' ? null : Number(form.target_mt),
        procured_mt: form.procured_mt === '' ? 0 : Number(form.procured_mt),
        cost_per_mt: form.cost_per_mt === '' ? null : Number(form.cost_per_mt),
        lead_time_days: form.lead_time_days === '' ? null : Number(form.lead_time_days),
      };

      const created = await createProcurement(payload);
      onCreated?.(created);
      onClose?.();
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to create procurement record.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Order" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">
              Grain Type
            </label>
            <select
              value={form.grain_type}
              onChange={updateField('grain_type')}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
            >
              {grainTypes.map((gt) => (
                <option key={gt} value={gt}>
                  {gt}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">
              Supplier
            </label>
            <input
              value={form.supplier_name}
              onChange={updateField('supplier_name')}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
              placeholder="Supplier name"
              required
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">
              Target MT
            </label>
            <input
              type="number"
              step="0.01"
              value={form.target_mt}
              onChange={updateField('target_mt')}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">
              Procured MT
            </label>
            <input
              type="number"
              step="0.01"
              value={form.procured_mt}
              onChange={updateField('procured_mt')}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">
              Cost / MT
            </label>
            <input
              type="number"
              step="0.01"
              value={form.cost_per_mt}
              onChange={updateField('cost_per_mt')}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">
              Order Date
            </label>
            <input
              type="date"
              value={form.order_date}
              onChange={updateField('order_date')}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">
              Expected Delivery
            </label>
            <input
              type="date"
              value={form.expected_delivery}
              onChange={updateField('expected_delivery')}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">
              Lead Time (days)
            </label>
            <input
              type="number"
              value={form.lead_time_days}
              onChange={updateField('lead_time_days')}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">
              Priority
            </label>
            <select
              value={form.priority}
              onChange={updateField('priority')}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
            >
              {priorityOptions.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">
              Status
            </label>
            <select
              value={form.status}
              onChange={updateField('status')}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">
              Quarter
            </label>
            <input
              value={form.quarter}
              onChange={updateField('quarter')}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
              placeholder="e.g. Q2 FY2025"
            />
          </div>
        </div>

        {error && (
          <p className="text-xs font-medium text-red-600">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" type="button" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            Create Order
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default function Procurement() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isNewOpen, setIsNewOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProcurement();
      setRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const summary = useMemo(() => {
    const totalTarget = records.reduce((sum, r) => sum + Number(r.target_mt || 0), 0);
    const totalProcured = records.reduce((sum, r) => sum + Number(r.procured_mt || 0), 0);
    return {
      totalTarget,
      totalProcured,
      count: records.length,
    };
  }, [records]);

  const openNew = () => {
    setFormKey((k) => k + 1);
    setIsNewOpen(true);
  };

  const closeNew = () => setIsNewOpen(false);

  const handleCreated = (created) => {
    setRecords((prev) => [created, ...prev]);
  };

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
          title="Unable to load procurement"
          description="There was an issue fetching procurement records. Please try again."
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
          <h2 className="text-base font-semibold text-slate-100">Procurement</h2>
          <p className="text-sm text-slate-400">
            Track grain purchasing, delivery status, and supplier performance.
          </p>
        </div>
        <Button onClick={openNew}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          New Order
        </Button>
      </div>

      {/* Summary cards */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-[#14110b] p-5">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-[#c9a84c]/70 via-[#c9a84c]/40 to-transparent" />
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Total Target MT
          </div>
          <div className="mt-2 text-2xl font-semibold text-slate-50">
            {formatNumber(summary.totalTarget, 0)}
            <span className="ml-2 text-xs text-slate-400">MT</span>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-[#14110b] p-5">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-[#c9a84c]/70 via-[#c9a84c]/40 to-transparent" />
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Total Procured MT
          </div>
          <div className="mt-2 text-2xl font-semibold text-slate-50">
            {formatNumber(summary.totalProcured, 0)}
            <span className="ml-2 text-xs text-slate-400">MT</span>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-[#14110b] p-5">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-[#c9a84c]/70 via-[#c9a84c]/40 to-transparent" />
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Records
          </div>
          <div className="mt-2 text-2xl font-semibold text-slate-50">
            {summary.count}
          </div>
        </div>
      </section>

      {/* Table */}
      {records.length === 0 ? (
        <EmptyState
          title="No procurement records"
          description="Create a new order to begin tracking target vs procured grain and delivery timelines."
          icon={Package}
          actionLabel="New Order"
          onAction={openNew}
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#14110b]">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-800 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3">Grain Type</th>
                <th className="px-4 py-3">Supplier</th>
                <th className="px-4 py-3">Target MT</th>
                <th className="px-4 py-3">Procured MT</th>
                <th className="px-4 py-3">Remaining MT</th>
                <th className="px-4 py-3">Progress</th>
                <th className="px-4 py-3">Cost/MT</th>
                <th className="px-4 py-3">Expected Delivery</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900">
              {records.map((r) => {
                const target = Number(r.target_mt || 0);
                const procured = Number(r.procured_mt || 0);
                const remaining = target - procured;
                const pct = target > 0 ? (procured / target) * 100 : 0;
                const barClass = progressColor(pct);

                return (
                  <tr key={r.id} className="hover:bg-slate-900/60">
                    <td className="px-4 py-3 font-medium text-slate-100">
                      {r.grain_type || '-'}
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {r.supplier_name || '-'}
                    </td>
                    <td className="px-4 py-3 text-slate-200">
                      {formatNumber(target, 0)}
                    </td>
                    <td className="px-4 py-3 text-slate-200">
                      {formatNumber(procured, 0)}
                    </td>
                    <td className="px-4 py-3 text-slate-200">
                      {formatNumber(remaining, 0)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="w-44">
                        <div className="mb-1 flex items-center justify-between text-[11px] text-slate-400">
                          <span>{formatNumber(pct, 0)}%</span>
                          <span>{formatNumber(procured, 0)}/{formatNumber(target, 0)} MT</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-800">
                          <div
                            className={`h-2 rounded-full ${barClass}`}
                            style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {r.cost_per_mt != null && r.cost_per_mt !== ''
                        ? `$${formatNumber(r.cost_per_mt, 2)}`
                        : '-'}
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {r.expected_delivery || '-'}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={r.priority} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={r.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <NewOrderModal
        key={formKey}
        isOpen={isNewOpen}
        onClose={closeNew}
        onCreated={handleCreated}
      />
    </div>
  );
}