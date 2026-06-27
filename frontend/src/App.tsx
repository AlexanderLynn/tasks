import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import OfflineIndicator from './components/OfflineIndicator';
import RootErrorBoundary from './components/RootErrorBoundary';
import SyncManager from './components/SyncManager';
import { store } from './store/store';
import Router from './router/Router';
import { logBoot } from './utils/bootLog';

function App() {
  logBoot('app_render');

  return (
    <RootErrorBoundary>
      <Provider store={store}>
        <BrowserRouter>
          <SyncManager />
          <Router />
          <OfflineIndicator />
        </BrowserRouter>
      </Provider>
    </RootErrorBoundary>
  );
}

export default App;
