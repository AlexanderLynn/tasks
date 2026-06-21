import { useState } from 'react';
import { useAppDispatch } from '../store/hooks';
import { setUser } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // Validate API key by making a test request
      const response = await fetch('/api/users/me', {
        headers: {
          'X-API-Key': apiKey,
        },
      });

      if (response.ok) {
        const user = await response.json();
        localStorage.setItem('apiKey', apiKey);
        dispatch(setUser(user));
        navigate('/');
      } else {
        setError('Invalid API key');
      }
    } catch (err) {
      setError('Failed to connect to server');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-kibana-bg p-4">
      <div className="w-full max-w-md">
        <div className="bg-kibana-card border border-kibana-border rounded-lg p-6">
          <h1 className="text-2xl font-bold text-kibana-text mb-6 text-center">
            Tasks
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium text-kibana-text mb-2">
                API Key
              </label>
              <input
                type="password"
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-3 py-2 bg-kibana-bg border border-kibana-border rounded-md text-kibana-text placeholder-kibana-textSecondary focus:outline-none focus:ring-2 focus:ring-kibana-accent"
                placeholder="Enter your API key"
                required
              />
            </div>
            {error && (
              <p className="text-sm text-kibana-danger">{error}</p>
            )}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-kibana-accent hover:bg-kibana-accentHover text-white rounded-md transition-colors"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
