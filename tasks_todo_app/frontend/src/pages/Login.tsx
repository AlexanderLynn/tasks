import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import { usersApi } from '../services/usersApi';
import { useAppDispatch } from '../store/hooks';
import { setApiKey, setUser } from '../store/slices/authSlice';

type AuthMode = 'signin' | 'signup';

const Login = () => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const completeAuth = (apiKey: string, user: Awaited<ReturnType<typeof usersApi.getCurrent>>) => {
    dispatch(setApiKey(apiKey));
    dispatch(setUser(user));
    navigate('/');
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        const { user, apiKey } = await usersApi.create({
          name: name.trim(),
          email: email.trim(),
          password,
        });
        completeAuth(apiKey, user);
      } else {
        const { user, apiKey } = await usersApi.login({
          email: email.trim(),
          password,
        });
        completeAuth(apiKey, user);
      }
    } catch (err: any) {
      const message = err?.response?.data?.error?.message;
      if (mode === 'signup' && err?.response?.data?.error?.code === 'EMAIL_EXISTS') {
        setError('An account with this email already exists');
      } else if (mode === 'signin') {
        setError(message ?? 'Invalid email or password');
      } else {
        setError(message ?? 'Unable to create account');
      }
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setError('');
    setPassword('');
  };

  return (
    <div className="min-h-screen bg-kibana-bg p-4 text-kibana-text">
      <div className="mx-auto flex min-h-screen w-full max-w-md items-center">
        <div className="w-full rounded-lg border border-kibana-border bg-kibana-card p-6">
          <div className="mb-6 flex items-center gap-3">
            <img src="/tasks-logo.svg" alt="Tasks" className="h-12 w-12 rounded-2xl border border-kibana-border bg-kibana-bg p-2" />
            <div>
              <h1 className="text-3xl font-bold leading-tight">Tasks</h1>
              <p className="text-sm text-kibana-textSecondary">Task management for Home Assistant</p>
            </div>
          </div>
          <div className="mb-6">
            <p className="mt-2 text-sm text-kibana-textSecondary">
              {mode === 'signin' ? 'Sign in to manage your lists and habits.' : 'Create an account to get started.'}
            </p>
          </div>

          <div className="mb-6 flex rounded-md border border-kibana-border bg-kibana-bg p-1">
            <button
              type="button"
              onClick={() => switchMode('signin')}
              className={`flex-1 rounded px-3 py-2 text-sm font-medium transition-colors ${
                mode === 'signin' ? 'bg-kibana-accent text-white' : 'text-kibana-textSecondary hover:text-kibana-text'
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => switchMode('signup')}
              className={`flex-1 rounded px-3 py-2 text-sm font-medium transition-colors ${
                mode === 'signup' ? 'bg-kibana-accent text-white' : 'text-kibana-textSecondary hover:text-kibana-text'
              }`}
            >
              Sign up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <Input
                label="Name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                autoComplete="name"
              />
            )}
            <Input
              type="email"
              label="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
            />
            <Input
              type="password"
              label="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              error={error}
              required
              minLength={mode === 'signup' ? 8 : undefined}
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            />
            {mode === 'signup' && !error && (
              <p className="text-xs text-kibana-textSecondary">Use at least 8 characters.</p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (mode === 'signup' ? 'Creating account' : 'Signing in') : mode === 'signup' ? 'Create account' : 'Sign in'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
