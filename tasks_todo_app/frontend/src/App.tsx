import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import OfflineIndicator from './components/OfflineIndicator';
import SyncManager from './components/SyncManager';
import { store } from './store/store';
import Router from './router/Router';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <SyncManager />
        <Router />
        <OfflineIndicator />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
