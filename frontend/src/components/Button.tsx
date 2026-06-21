import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  children: ReactNode;
}

const Button = ({ variant = 'primary', children, className = '', ...props }: ButtonProps) => {
  const baseStyles = 'px-4 py-2 rounded-md transition-colors font-medium';
  
  const variantStyles = {
    primary: 'bg-kibana-accent hover:bg-kibana-accentHover text-white',
    secondary: 'bg-kibana-card border border-kibana-border hover:border-kibana-accent text-kibana-text',
    danger: 'bg-kibana-danger hover:bg-red-600 text-white',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
