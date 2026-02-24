import { LogEntry, LogLevel } from '../types';

export const MAX_LOGS = 200;

let interceptorsInstalled = false;
let logCounter = 0;
let listener: ((entry: LogEntry) => void) | null = null;

export function setLogListener(fn: ((entry: LogEntry) => void) | null) {
  listener = fn;
}

function captureSource(): { file: string; line: number } | undefined {
  const stack = new Error().stack;
  if (!stack) return undefined;

  for (const line of stack.split('\n')) {
    if (line.includes('consoleInterceptor')) continue;
    if (line.includes('node_modules')) continue;

    // Matches "filename.ext" optionally followed by Vite's "?t=..." query,
    // then ":line:col". Handles both V8 ("at ...") and WebKit ("fn@...") formats.
    const match = line.match(/([^/\\?]+\.[a-z]+)(?:\?[^:]*)?:(\d+):\d+/i);
    if (!match) continue;

    return { file: match[1], line: parseInt(match[2], 10) };
  }

  return undefined;
}

export function installConsoleInterceptors() {
  if (interceptorsInstalled) return;
  interceptorsInstalled = true;

  const levels: LogLevel[] = ['log', 'info', 'warn', 'error'];

  levels.forEach((level) => {
    const original = console[level].bind(console);

    console[level] = (...args: unknown[]) => {
      original(...args);
      listener?.({
        id: ++logCounter,
        level,
        args,
        timestamp: Date.now(),
        source: captureSource(),
      });
    };
  });
}
