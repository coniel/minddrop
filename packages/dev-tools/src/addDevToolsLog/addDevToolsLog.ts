import { DevToolsLogsStore } from '../DevToolsLogsStore';
import { MaxLogEntries } from '../constants';
import { DevToolsLogLevel, DevToolsLogSource } from '../types';

// Log entries are disposable, so a counter is enough to tell
// them apart within a session
let logCount = 0;

/**
 * Adds a captured console call to the logs, dropping the oldest
 * entries once the maximum is exceeded.
 *
 * @param level - The console method the call was made on.
 * @param args - The values passed to the console call.
 * @param source - Where the console call was made.
 */
export function addDevToolsLog(
  level: DevToolsLogLevel,
  args: unknown[],
  source: DevToolsLogSource | null = null,
): void {
  logCount += 1;

  DevToolsLogsStore.add({
    id: `log_${logCount}`,
    level,
    args,
    timestamp: Date.now(),
    source,
  });

  const entries = DevToolsLogsStore.getAll();
  const overflow = Math.max(entries.length - MaxLogEntries, 0);

  // Drop the oldest entries which no longer fit
  entries.slice(0, overflow).forEach((entry) => {
    DevToolsLogsStore.remove(entry.id);
  });
}
