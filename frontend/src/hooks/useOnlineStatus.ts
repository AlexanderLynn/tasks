import { useEffect } from 'react';
import { useAppDispatch } from '../store/hooks';
import { setOnline } from '../store/slices/offlineSlice';

export function useOnlineStatus(): boolean {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const updateStatus = () => {
      dispatch(setOnline(navigator.onLine));
    };

    updateStatus();
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);

    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
    };
  }, [dispatch]);

  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}
