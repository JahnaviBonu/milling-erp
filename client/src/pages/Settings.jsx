import React, { useState } from 'react';
import Button from '../components/shared/Button.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const gradeOptions = ['Premium', 'Standard', 'Whole Wheat', 'Semolina'];

export default function Settings() {
  const { user } = useAuth();

  const [millName, setMillName] = useState('Mill Ops Facility');
  const [targetExtractionRate, setTargetExtractionRate] = useState('75');
  const [energyTarget, setEnergyTarget] = useState('55');
  const [defaultGrade, setDefaultGrade] = useState('Standard');

  const [toast, setToast] = useState('');

  const showToast = (message) => {
    setToast(message);
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(''), 2500);
  };

  const handleSave = (e) => {
    e.preventDefault();
    showToast('Settings saved.');
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed right-6 top-6 z-50 rounded-xl border border-emerald-500/30 bg-emerald-500/15 px-4 py-3 text-sm font-medium text-emerald-200 shadow-lg">
          {toast}
        </div>
      )}

      <div>
        <h2 className="text-base font-semibold text-slate-100">Settings</h2>
        <p className="text-sm text-slate-400">
          Configure mill targets and view account details.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Mill Configuration */}
        <div className="rounded-2xl border border-slate-800 bg-[#14110b] p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-100">
              Mill Configuration
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Set default targets used across dashboards and reports.
            </p>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-300">
                Mill Name
              </label>
              <input
                value={millName}
                onChange={(e) => setMillName(e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
                placeholder="e.g. Central Milling Plant"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-300">
                  Target Extraction Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={targetExtractionRate}
                  onChange={(e) => setTargetExtractionRate(e.target.value)}
                  className="w-full rounded-md border border-slate-700 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-300">
                  Energy Target (kWh/MT)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={energyTarget}
                  onChange={(e) => setEnergyTarget(e.target.value)}
                  className="w-full rounded-md border border-slate-700 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-300">
                Default Grade
              </label>
              <select
                value={defaultGrade}
                onChange={(e) => setDefaultGrade(e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
              >
                {gradeOptions.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit">Save</Button>
            </div>
          </form>
        </div>

        {/* Account Info */}
        <div className="rounded-2xl border border-slate-800 bg-[#14110b] p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-100">Account Info</h3>
            <p className="mt-1 text-xs text-slate-400">
              Currently signed-in user details.
            </p>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-950/30 px-4 py-3">
              <div className="text-slate-400">Name</div>
              <div className="font-medium text-slate-100">
                {user?.name ?? '-'}
              </div>
            </div>
            <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-950/30 px-4 py-3">
              <div className="text-slate-400">Email</div>
              <div className="font-medium text-slate-100">
                {user?.email ?? '-'}
              </div>
            </div>
            <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-950/30 px-4 py-3">
              <div className="text-slate-400">Role</div>
              <div className="font-medium capitalize text-slate-100">
                {user?.role ?? '-'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}