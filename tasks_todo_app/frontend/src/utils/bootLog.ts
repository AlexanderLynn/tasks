declare global {
  interface Window {
    __tasksBootLog?: Array<{ stage: string; detail?: string }>;
  }
}

function sendBeacon(stage: string, detail?: string): void {
  try {
    const url = new URL('/frontend-log', window.location.origin);
    url.searchParams.set('stage', stage);
    if (detail) {
      url.searchParams.set('detail', detail.slice(0, 500));
    }

    if (navigator.sendBeacon) {
      navigator.sendBeacon(url.toString());
      return;
    }

    fetch(url.toString(), {
      method: 'GET',
      cache: 'no-store',
      credentials: 'same-origin',
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Ignore logging failures to avoid cascading boot issues.
  }
}

export function logBoot(stage: string, detail?: string): void {
  try {
    window.__tasksBootLog = window.__tasksBootLog ?? [];
    window.__tasksBootLog.push({ stage, detail });
    console.log('[tasks-boot]', stage, detail ?? '');
  } catch {
    // Ignore logging failures to avoid cascading boot issues.
  }

  sendBeacon(stage, detail);
}

export function installBootErrorHandlers(): void {
  window.addEventListener('error', (event) => {
    const detail = `${event.message} @ ${event.filename}:${event.lineno}:${event.colno}`;
    logBoot('window_error', detail);
  });

  window.addEventListener('unhandledrejection', (event) => {
    const detail =
      typeof event.reason === 'string'
        ? event.reason
        : JSON.stringify(event.reason, null, 2);
    logBoot('unhandled_rejection', detail);
  });
}
