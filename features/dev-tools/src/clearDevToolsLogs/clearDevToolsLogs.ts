import { DevToolsLogsStore } from '../DevToolsLogsStore';

/**
 * Removes all captured console calls from the logs.
 */
export function clearDevToolsLogs(): void {
  DevToolsLogsStore.clear();
}
