import { DevToolsEventsStore } from '../DevToolsEventsStore';

/**
 * Removes all captured events.
 */
export function clearDevToolsEvents(): void {
  DevToolsEventsStore.clear();
}
