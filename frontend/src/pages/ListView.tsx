import { useParams, Link } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { ChevronLeft } from 'lucide-react';

const ListView = () => {
  const { listId } = useParams<{ listId: string }>();
  const lists = useAppSelector((state) => state.lists.lists);
  const items = useAppSelector((state) => state.items.items);

  const currentList = lists.find((l) => l.id === listId);
  const listItems = items.filter((i) => i.listId === listId);

  if (!currentList) {
    return <div>List not found</div>;
  }

  return (
    <div className="min-h-screen bg-kibana-bg p-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6 flex items-center gap-4">
          <Link
            to="/"
            className="p-2 hover:bg-kibana-card rounded-md transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-kibana-text" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-kibana-text">{currentList.name}</h1>
            {currentList.description && (
              <p className="text-kibana-textSecondary">{currentList.description}</p>
            )}
          </div>
        </header>

        <div className="space-y-2">
          {listItems.map((item) => (
            <div
              key={item.id}
              className="bg-kibana-card border border-kibana-border rounded-lg p-4"
            >
              <h3 className="text-lg font-medium text-kibana-text">{item.title}</h3>
              {item.description && (
                <p className="text-kibana-textSecondary mt-1">{item.description}</p>
              )}
            </div>
          ))}
          <button className="w-full py-3 px-4 border-2 border-dashed border-kibana-border rounded-lg text-kibana-textSecondary hover:border-kibana-accent hover:text-kibana-accent transition-colors">
            + Add Item
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListView;
