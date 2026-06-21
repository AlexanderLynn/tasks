import { useAppSelector } from '../store/hooks';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const lists = useAppSelector((state) => state.lists.lists);

  return (
    <div className="min-h-screen bg-kibana-bg p-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-kibana-text">Dashboard</h1>
        </header>
        <div className="grid gap-4">
          {lists.map((list) => (
            <Link
              key={list.id}
              to={`/lists/${list.id}`}
              className="block bg-kibana-card border border-kibana-border rounded-lg p-4 hover:border-kibana-accent transition-colors"
            >
              <h2 className="text-xl font-semibold text-kibana-text">{list.name}</h2>
              {list.description && (
                <p className="text-kibana-textSecondary mt-1">{list.description}</p>
              )}
            </Link>
          ))}
          <button className="w-full py-3 px-4 border-2 border-dashed border-kibana-border rounded-lg text-kibana-textSecondary hover:border-kibana-accent hover:text-kibana-accent transition-colors">
            + Create New List
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
