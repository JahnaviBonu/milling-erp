import { useEffect, useMemo, useState } from 'react';
import { Plus, RefreshCcw } from 'lucide-react';
import {
  getBatches,
  createBatch,
  updateBatch,
  deleteBatch,
} from '../services/api.js';
import BatchTable from '../components/batches/BatchTable.jsx';
import BatchForm from '../components/batches/BatchForm.jsx';
import Button from '../components/shared/Button.jsx';
import EmptyState from '../components/shared/EmptyState.jsx';

const grainTypes = [
  'Hard Red Wheat',
  'Soft White Wheat',
  'Durum Wheat',
  'Whole Wheat',
  'Soft Red Wheat',
];

const statusOptions = ['Passed', 'Failed', 'Review', 'Pending'];

function Batches() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [grainTypeFilter, setGrainTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchText, setSearchText] = useState('');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null);
  const [formKey, setFormKey] = useState(0);
  const [saving, setSaving] = useState(false);

  // Micro-interaction state
  const [deletingId, setDeletingId] = useState(null);
  const [newlyAddedId, setNewlyAddedId] = useState(null);

  const refetch = async () => {
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
    refetch();
  }, []);

  const filteredBatches = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    return batches.filter((b) => {
      if (grainTypeFilter && b.grain_type !== grainTypeFilter) return false;
      if (statusFilter && b.status !== statusFilter) return false;
      if (query) {
        const bn = (b.batch_number || '').toLowerCase();
        if (!bn.includes(query)) return false;
      }
      return true;
    });
  }, [batches, grainTypeFilter, statusFilter, searchText]);

  const openCreate = () => {
    setEditingBatch(null);
    setFormKey((k) => k + 1);
    setIsFormOpen(true);
  };

  const openEdit = (batch) => {
    setEditingBatch(batch);
    setFormKey((k) => k + 1);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingBatch(null);
  };

  const handleSubmit = async (formData) => {
    setSaving(true);
    try {
      if (editingBatch?.id) {
        const updated = await updateBatch(editingBatch.id, formData);
        setBatches((prev) =>
          prev.map((b) => (b.id === editingBatch.id ? updated : b)),
        );
      } else {
        const created = await createBatch(formData);
        setBatches((prev) => [created, ...prev]);
        // Highlight the new row for 2 seconds
        setNewlyAddedId(created.id);
        setTimeout(() => setNewlyAddedId(null), 2000);
      }
      closeForm();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm('Delete this batch? This action cannot be undone.');
    if (!ok) return;

    // Start fade animation
    setDeletingId(id);

    // Wait for animation to complete before removing
    await new Promise(resolve => setTimeout(resolve, 400));

    const previous = batches;
    setBatches((prev) => prev.filter((b) => b.id !== id));
    setDeletingId(null);

    try {
      await deleteBatch(id);
    } catch {
      // Rollback if delete fails
      setBatches(previous);
    }
  };

  return (
    <div className="space-y-6">
      {/* Entrance animation style */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.35s ease forwards;
        }
      `}</style>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-100">Batch Log</h2>
          <p className="text-sm text-slate-400">
            Track milling throughput, grade, and quality status.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Log New Batch
        </Button>
      </div>

      {/* Filters */}
      <div className="grid gap-3 rounded-2xl border border-slate-800 bg-[#14110b] p-4 md:grid-cols-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-300">
            Search
          </label>
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Batch number..."
            className="w-full rounded-md border border-slate-700 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-300">
            Grain Type
          </label>
          <select
            value={grainTypeFilter}
            onChange={(e) => setGrainTypeFilter(e.target.value)}
            className="w-full rounded-md border border-slate-700 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
          >
            <option value="">All</option>
            {grainTypes.map((gt) => (
              <option key={gt} value={gt}>{gt}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-300">
            Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-md border border-slate-700 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
          >
            <option value="">All</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="flex items-end justify-end">
          <Button
            variant="secondary"
            onClick={() => {
              setGrainTypeFilter('');
              setStatusFilter('');
              setSearchText('');
            }}
          >
            Clear
          </Button>
        </div>
      </div>

      {error ? (
        <div className="max-w-xl rounded-2xl border border-red-900/50 bg-red-950/20 px-6 py-8">
          <EmptyState
            title="Unable to load batches"
            description={error?.message || 'There was an issue fetching the batch list. Please try again.'}
            icon={RefreshCcw}
            actionLabel="Try Again"
            onAction={refetch}
          />
        </div>
      ) : (
        <BatchTable
          batches={filteredBatches}
          loading={loading}
          onEdit={openEdit}
          onDelete={handleDelete}
          deletingId={deletingId}
          newlyAddedId={newlyAddedId}
        />
      )}

      <BatchForm
        key={formKey}
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={handleSubmit}
        initialData={editingBatch}
        saving={saving}
      />

      {saving && (
        <div className="fixed inset-0 z-40" aria-hidden="true" />
      )}
    </div>
  );
}

export default Batches;