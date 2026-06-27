import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { installBootErrorHandlers, logBoot } from './utils/bootLog';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations()
    .then((registrations) => {
      logBoot('service_worker_registrations_found', String(registrations.length));
      return Promise.all(registrations.map((registration) => registration.unregister()));
    })
    .then(() => {
      logBoot('service_worker_unregistered');
    })
    .catch((error: unknown) => {
      const detail = error instanceof Error ? error.message : String(error);
      logBoot('service_worker_unregister_failed', detail);
    });
}

installBootErrorHandlers();
logBoot('main_module_loaded', navigator.userAgent);

const rootElement = document.getElementById('root');

if (!rootElement) {
  logBoot('root_missing');
  throw new Error('Root element #root not found');
}

logBoot('react_mount_start');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

logBoot('react_mount_complete');
