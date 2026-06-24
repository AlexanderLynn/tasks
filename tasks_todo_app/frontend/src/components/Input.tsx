import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = ({ label, error, className = '', ...props }: InputProps) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-kibana-text">
          {label}
        </label>
      )}
      <input
        className={`w-full px-3 py-2 bg-kibana-bg border border-kibana-border rounded-md text-kibana-text placeholder-kibana-textSecondary focus:outline-none focus:ring-2 focus:ring-kibana-accent ${className}`}
        {...props}
      />
      {error && (
        <p className="text-sm text-kibana-danger">{error}</p>
      )}
    </div>
  );
};

export default Input;
