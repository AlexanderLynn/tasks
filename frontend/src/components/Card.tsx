import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`bg-kibana-card border border-kibana-border rounded-lg ${className}`}>
      {children}
    </div>
  );
};

export default Card;
