import { FormEvent, useState } from 'react';
import { Trash2, UserPlus } from 'lucide-react';
import Button from './Button';
import Input from './Input';
import type { ListMember, MemberPermission } from '../services/listsApi';

interface SharingPanelProps {
  members: ListMember[];
  onAdd: (userId: string, permission: MemberPermission) => Promise<void>;
  onUpdate: (userId: string, permission: MemberPermission) => Promise<void>;
  onRemove: (userId: string) => Promise<void>;
}

const permissions: MemberPermission[] = ['view', 'edit', 'admin'];

const SharingPanel = ({ members, onAdd, onUpdate, onRemove }: SharingPanelProps) => {
  const [userId, setUserId] = useState('');
  const [permission, setPermission] = useState<MemberPermission>('edit');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleAdd = async (event: FormEvent) => {
    event.preventDefault();
    if (!userId.trim()) {
      setError('User ID is required');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await onAdd(userId.trim(), permission);
      setUserId('');
      setPermission('edit');
    } catch (err: any) {
      setError(err?.response?.data?.error?.message ?? 'Unable to share list');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <UserPlus className="h-5 w-5 text-kibana-accent" />
        <h2 className="text-lg font-semibold text-kibana-text">Sharing</h2>
      </div>

      <form onSubmit={handleAdd} className="grid gap-3 sm:grid-cols-[1fr_140px_auto]">
        <Input value={userId} onChange={(event) => setUserId(event.target.value)} placeholder="User ID" error={error} />
        <select
          value={permission}
          onChange={(event) => setPermission(event.target.value as MemberPermission)}
          className="h-10 rounded-md border border-kibana-border bg-kibana-bg px-3 text-sm text-kibana-text outline-none focus:ring-2 focus:ring-kibana-accent"
        >
          {permissions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <Button type="submit" disabled={saving} className="h-10">{saving ? 'Adding' : 'Add'}</Button>
      </form>

      <div className="divide-y divide-kibana-border rounded-lg border border-kibana-border">
        {members.map((member) => (
          <div key={member.id} className="grid gap-3 p-3 sm:grid-cols-[1fr_140px_auto] sm:items-center">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-kibana-text">{member.userId}</p>
              <p className="text-xs text-kibana-textSecondary">Joined {new Date(member.joinedAt).toLocaleDateString()}</p>
            </div>
            <select
              value={member.permission}
              onChange={(event) => onUpdate(member.userId, event.target.value as MemberPermission)}
              className="h-10 rounded-md border border-kibana-border bg-kibana-bg px-3 text-sm text-kibana-text outline-none focus:ring-2 focus:ring-kibana-accent"
            >
              {permissions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => onRemove(member.userId)}
              className="flex h-10 items-center justify-center rounded-md border border-kibana-border px-3 text-kibana-textSecondary hover:border-kibana-danger hover:text-kibana-danger"
              aria-label={`Remove ${member.userId}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {members.length === 0 && (
          <p className="p-4 text-sm text-kibana-textSecondary">No members yet.</p>
        )}
      </div>
    </section>
  );
};

export default SharingPanel;
