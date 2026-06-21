import { FormEvent, useState } from 'react';
import { X } from 'lucide-react';
import Button from './Button';
import Input from './Input';
import type { List, ListType } from '../services/listsApi';

interface ListFormModalProps {
  list?: List;
  onClose: () => void;
  onSubmit: (data: { name: string; type: ListType; version?: number }) => Promise<void>;
}

const ListFormModal = ({ list, onClose, onSubmit }: ListFormModalProps) => {
  const [name, setName] = useState(list?.name ?? '');
  const [type, setType] = useState<ListType>(list?.type ?? 'personal');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await onSubmit({ name: name.trim(), type, version: list?.version });
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.error?.message ?? 'Unable to save list');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-30 flex items-end bg-black/70 p-4 sm:items-center sm:justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-lg rounded-lg border border-kibana-border bg-kibana-card p-5 shadow-xl">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-kibana-text">{list ? 'Edit list' : 'Create list'}</h2>
          <button type="button" onClick={onClose} className="rounded p-2 text-kibana-textSecondary hover:text-kibana-text" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <Input label="Name" value={name} onChange={(event) => setName(event.target.value)} error={error} autoFocus />
          <div>
            <label className="mb-2 block text-sm font-medium text-kibana-text">Type</label>
            <div className="grid grid-cols-2 gap-2">
              {(['personal', 'shared'] as ListType[]).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setType(option)}
                  className={`rounded-md border px-3 py-2 text-sm capitalize ${
                    type === option
                      ? 'border-kibana-accent bg-kibana-accent text-white'
                      : 'border-kibana-border bg-kibana-bg text-kibana-text hover:border-kibana-accent'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={saving}>{saving ? 'Saving' : 'Save'}</Button>
        </div>
      </form>
    </div>
  );
};

export default ListFormModal;
