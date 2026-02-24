import { LogEntry, LogLevel } from '../types';

export const MAX_LOGS = 200;

let interceptorsInstalled = false;
let logCounter = 0;
let listener: ((entry: LogEntry) => void) | null = null;

export function setLogListener(fn: ((entry: LogEntry) => void) | null) {
  listener = fn;
}

export function installConsoleInterceptors() {
  if (interceptorsInstalled) return;
  interceptorsInstalled = true;

  const levels: LogLevel[] = ['log', 'info', 'warn', 'error'];

  levels.forEach((level) => {
    const original = console[level].bind(console);

    console[level] = (...args: unknown[]) => {
      original(...args);
      listener?.({ id: ++logCounter, level, args, timestamp: Date.now() });
    };
  });
}
