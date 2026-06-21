import { storage } from '../storage';
import type { OfflineOperation, OfflineOperationType } from './types';

function readQueue(): OfflineOperation[] {
  return storage.getCache<OfflineOperation[]>('OFFLINE_QUEUE') ?? [];
}

function writeQueue(queue: OfflineOperation[]): void {
  storage.setCache('OFFLINE_QUEUE', queue);
}

export function getQueue(): OfflineOperation[] {
  return readQueue();
}

export function getPendingCount(): number {
  return readQueue().length;
}

export function enqueue(type: OfflineOperationType, payload: Record<string, unknown>): OfflineOperation {
  const operation: OfflineOperation = {
    id: crypto.randomUUID(),
    type,
    payload,
    createdAt: new Date().toISOString(),
    retryCount: 0,
  };
  writeQueue([...readQueue(), operation]);
  return operation;
}

export function removeOperation(operationId: string): void {
  writeQueue(readQueue().filter((operation) => operation.id !== operationId));
}

export function incrementRetry(operationId: string): void {
  writeQueue(
    readQueue().map((operation) =>
      operation.id === operationId ? { ...operation, retryCount: operation.retryCount + 1 } : operation
    )
  );
}

export function clearQueue(): void {
  writeQueue([]);
}
