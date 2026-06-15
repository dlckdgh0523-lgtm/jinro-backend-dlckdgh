import { AsyncLocalStorage } from 'node:async_hooks';
import { randomUUID } from 'node:crypto';

interface TraceStore {
  traceId: string;
}

const als = new AsyncLocalStorage<TraceStore>();

export function runWithTrace<T>(traceId: string | undefined, fn: () => T): T {
  return als.run({ traceId: traceId || randomUUID() }, fn);
}

export function currentTraceId(): string {
  return als.getStore()?.traceId ?? 'no-trace';
}
