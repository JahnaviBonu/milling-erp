import React, { useState } from 'react';
import Modal from '../shared/Modal.jsx';
import Button from '../shared/Button.jsx';

const grainTypes = [
  'Hard Red Wheat',
  'Soft White Wheat',
  'Durum Wheat',
  'Whole Wheat',
  'Soft Red Wheat',
];

const gradeOptions = ['Premium', 'Standard', 'Whole Wheat', 'Semolina'];

const statusOptions = ['Passed', 'Failed', 'Review', 'Pending'];

function toInputValue(value) {
  if (value === null || value === undefined) return '';
  return String(value);
}

function BatchForm({ isOpen, onClose, onSubmit, initialData }) {
  const isEdit = Boolean(initialData && initialData.id);
  const title = isEdit ? 'Edit Batch' : 'New Batch';

  const [form, setForm] = useState(() => ({
    batch_number: initialData?.batch_number ?? '',
    date: initialData?.date ?? '',
    grain_type: initialData?.grain_type ?? grainTypes[0],
    input_mt: toInputValue(initialData?.input_mt ?? ''),
    output_mt: toInputValue(initialData?.output_mt ?? ''),
    ash_content: toInputValue(initialData?.ash_content ?? ''),
    moisture_pct: toInputValue(initialData?.moisture_pct ?? ''),
    protein_pct: toInputValue(initialData?.protein_pct ?? ''),
    grade: initialData?.grade ?? gradeOptions[0],
    status: initialData?.status ?? 'Pending',
    operator_name: initialData?.operator_name ?? '',
    notes: initialData?.notes ?? '',
  }));

  const updateField = (key) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      input_mt: form.input_mt === '' ? null : Number(form.input_mt),
      output_mt: form.output_mt === '' ? null : Number(form.output_mt),
      ash_content: form.ash_content === '' ? null : Number(form.ash_content),
      moisture_pct: form.moisture_pct === '' ? null : Number(form.moisture_pct),
      protein_pct: form.protein_pct === '' ? null : Number(form.protein_pct),
    };

    onSubmit?.(payload);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">
              Batch Number
            </label>
            <input
              value={form.batch_number}
              onChange={updateField('batch_number')}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
              placeholder="e.g. B-2025-03-01"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">
              Date
            </label>
            <input
              type="date"
              value={form.date}
              onChange={updateField('date')}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
            />
          </div>

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
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">
              Input MT
            </label>
            <input
              type="number"
              step="0.01"
              value={form.input_mt}
              onChange={updateField('input_mt')}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
              placeholder="e.g. 120"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">
              Output MT
            </label>
            <input
              type="number"
              step="0.01"
              value={form.output_mt}
              onChange={updateField('output_mt')}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
              placeholder="e.g. 90.6"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">
              Grade
            </label>
            <select
              value={form.grade}
              onChange={updateField('grade')}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
            >
              {gradeOptions.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          Note: Extraction Rate will be calculated automatically from Input MT and Output MT.
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">
              Ash Content (%)
            </label>
            <input
              type="number"
              step="0.01"
              value={form.ash_content}
              onChange={updateField('ash_content')}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
              placeholder="e.g. 0.55"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">
              Moisture (%)
            </label>
            <input
              type="number"
              step="0.01"
              value={form.moisture_pct}
              onChange={updateField('moisture_pct')}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
              placeholder="e.g. 13.4"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">
              Protein (%)
            </label>
            <input
              type="number"
              step="0.01"
              value={form.protein_pct}
              onChange={updateField('protein_pct')}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
              placeholder="e.g. 12.8"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">
              Operator Name
            </label>
            <input
              value={form.operator_name}
              onChange={updateField('operator_name')}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
              placeholder="e.g. Rahul Sharma"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">
              Notes
            </label>
            <textarea
              value={form.notes}
              onChange={updateField('notes')}
              rows={3}
              className="w-full resize-none rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
              placeholder="Optional notes..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            {isEdit ? 'Save Changes' : 'Create Batch'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default BatchForm;