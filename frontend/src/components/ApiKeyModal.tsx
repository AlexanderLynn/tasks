import { useEffect, useState } from 'react';
import { Copy, Eye, EyeOff, KeyRound, X } from 'lucide-react';
import Button from './Button';
import { usersApi } from '../services/usersApi';

interface ApiKeyModalProps {
  onClose: () => void;
}

const ApiKeyModal = ({ onClose }: ApiKeyModalProps) => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    usersApi
      .getApiKey()
      .then((key) => setApiKey(key))
      .catch((err: any) => {
        setError(err?.response?.data?.error?.message ?? 'Unable to load API key');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleCopy = async () => {
    if (!apiKey) {
      return;
    }
    await navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-30 flex items-end bg-black/70 p-4 sm:items-center sm:justify-center">
      <div className="w-full max-w-lg rounded-lg border border-kibana-border bg-kibana-card p-5 shadow-xl">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-kibana-accent" />
            <h2 className="text-xl font-semibold">API key</h2>
          </div>
          <button type="button" onClick={onClose} className="text-kibana-textSecondary hover:text-kibana-text">
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mb-4 text-sm text-kibana-textSecondary">
          Use this key for MCP server and Home Assistant integrations. Keep it secret — anyone with this key can access your account.
        </p>

        {loading && <p className="text-sm text-kibana-textSecondary">Loading API key...</p>}
        {error && <p className="mb-4 text-sm text-kibana-danger">{error}</p>}

        {apiKey && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 rounded-md border border-kibana-border bg-kibana-bg p-3">
              <code className="flex-1 overflow-hidden text-sm text-kibana-text">
                {visible ? apiKey : '•'.repeat(40)}
              </code>
              <button
                type="button"
                onClick={() => setVisible((value) => !value)}
                className="text-kibana-textSecondary hover:text-kibana-text"
                aria-label={visible ? 'Hide API key' : 'Show API key'}
              >
                {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className="text-kibana-textSecondary hover:text-kibana-text"
                aria-label="Copy API key"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
            {copied && <p className="text-xs text-kibana-success">Copied to clipboard</p>}
          </div>
        )}

        <div className="mt-5 flex justify-end">
          <Button type="button" variant="secondary" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;
