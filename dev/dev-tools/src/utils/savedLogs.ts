import { SavedLog } from '../types';

const STORAGE_KEY = 'dev-tools-saved-logs';

// Recursively convert a value to a JSON-safe representation so it survives
// localStorage serialization (handles Dates, functions, circular refs, etc.).
function toJsonSafe(value: unknown): unknown {
  if (value === null || value === undefined) return value;
  if (typeof value === 'function') return '[Function]';
  if (typeof value === 'symbol') return String(value);
  if (value instanceof Date) return value.toISOString();
  if (value instanceof Error)
    return { __error: true, name: value.name, message: value.message };
  if (Array.isArray(value)) return value.map(toJsonSafe);
  if (typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      try {
        out[k] = toJsonSafe(v);
      } catch {
        out[k] = String(v);
      }
    }
    return out;
  }
  return value;
}

export function loadSavedLogs(): SavedLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedLog[]) : [];
  } catch {
    return [];
  }
}

export function persistSavedLog(log: SavedLog): void {
  try {
    const logs = loadSavedLogs();
    logs.push({ ...log, args: log.args.map(toJsonSafe) });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  } catch {
    // ignore storage errors
  }
}

export function clearSavedLogsByFile(file: string): void {
  try {
    const logs = loadSavedLogs().filter((l) => l.file !== file);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  } catch {
    // ignore
  }
}
