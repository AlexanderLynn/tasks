import { KeyboardEvent, useState } from 'react';
import { X } from 'lucide-react';

interface TagInputProps {
  label?: string;
  value: string[];
  onChange: (tags: string[]) => void;
}

const TagInput = ({ label = 'Tags', value, onChange }: TagInputProps) => {
  const [draft, setDraft] = useState('');

  const addTag = () => {
    const tag = draft.trim().replace(/^#/, '');
    if (!tag || value.includes(tag)) {
      setDraft('');
      return;
    }
    onChange([...value, tag]);
    setDraft('');
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      addTag();
    }
    if (event.key === 'Backspace' && !draft && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-kibana-text">{label}</label>
      <div className="min-h-11 rounded-md border border-kibana-border bg-kibana-bg px-2 py-2 focus-within:ring-2 focus-within:ring-kibana-accent">
        <div className="flex flex-wrap gap-2">
          {value.map((tag) => (
            <span
              key={tag}
              className="inline-flex max-w-full items-center gap-1 rounded bg-kibana-card px-2 py-1 text-sm text-kibana-text"
            >
              <span className="truncate">#{tag}</span>
              <button
                type="button"
                onClick={() => onChange(value.filter((item) => item !== tag))}
                className="rounded p-0.5 text-kibana-textSecondary hover:text-kibana-danger"
                aria-label={`Remove ${tag}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onBlur={addTag}
            onKeyDown={handleKeyDown}
            className="min-w-32 flex-1 bg-transparent px-1 py-1 text-sm text-kibana-text outline-none placeholder:text-kibana-textSecondary"
            placeholder={value.length ? '' : 'Add tag'}
          />
        </div>
      </div>
    </div>
  );
};

export default TagInput;
