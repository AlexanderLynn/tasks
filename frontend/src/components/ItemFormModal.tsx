import { FormEvent, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import Button from './Button';
import Input from './Input';
import ScheduleBuilder from './ScheduleBuilder';
import TagInput from './TagInput';
import type { Item, ItemType, ScheduleRule } from '../services/itemsApi';

interface ItemFormModalProps {
  listId: string;
  item?: Item;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description?: string;
    type: ItemType;
    schedule: ScheduleRule;
    tags: string[];
    sharedWith: string[];
    assignedTo?: string;
    version?: number;
  }) => Promise<void>;
}

const defaultSchedule = (): ScheduleRule => ({
  type: 'daily',
  time: '09:00',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
});

const splitIds = (value: string) => value.split(',').map((item) => item.trim()).filter(Boolean);

const ItemFormModal = ({ item, onClose, onSubmit }: ItemFormModalProps) => {
  const [title, setTitle] = useState(item?.title ?? '');
  const [description, setDescription] = useState(item?.description ?? '');
  const [type, setType] = useState<ItemType>(item?.type ?? 'task');
  const [schedule, setSchedule] = useState<ScheduleRule>(item?.schedule ?? defaultSchedule());
  const [tags, setTags] = useState<string[]>(item?.tags ?? []);
  const [assignedTo, setAssignedTo] = useState(item?.assignedTo ?? '');
  const [sharedWith, setSharedWith] = useState((item?.sharedWith ?? []).join(', '));
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const typeOptions = useMemo<ItemType[]>(() => ['habit', 'chore', 'task'], []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        type,
        schedule,
        tags,
        assignedTo: assignedTo.trim() || undefined,
        sharedWith: splitIds(sharedWith),
        version: item?.version,
      });
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.error?.message ?? 'Unable to save item');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-30 flex items-end bg-black/70 p-4 sm:items-center sm:justify-center">
      <form onSubmit={handleSubmit} className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-kibana-border bg-kibana-card p-5 shadow-xl">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-kibana-text">{item ? 'Edit item' : 'Create item'}</h2>
          <button type="button" onClick={onClose} className="rounded p-2 text-kibana-textSecondary hover:text-kibana-text" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5">
          <Input label="Title" value={title} onChange={(event) => setTitle(event.target.value)} error={error} autoFocus />
          <label className="space-y-2 text-sm font-medium text-kibana-text">
            Description
            <textarea
              value={description ?? ''}
              onChange={(event) => setDescription(event.target.value)}
              className="min-h-24 w-full rounded-md border border-kibana-border bg-kibana-bg px-3 py-2 text-kibana-text outline-none focus:ring-2 focus:ring-kibana-accent"
            />
          </label>

          <div>
            <label className="mb-2 block text-sm font-medium text-kibana-text">Type</label>
            <div className="grid grid-cols-3 gap-2">
              {typeOptions.map((option) => (
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

          <ScheduleBuilder value={schedule} onChange={setSchedule} />
          <TagInput value={tags} onChange={setTags} />

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Assigned user ID" value={assignedTo ?? ''} onChange={(event) => setAssignedTo(event.target.value)} />
            <Input label="Shared user IDs" value={sharedWith} onChange={(event) => setSharedWith(event.target.value)} placeholder="comma separated" />
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

export default ItemFormModal;
