import { initializeSearchSync } from './initializeSearchSync';

/**
 * Initializes search by registering the event listeners which keep
 * loaded workspaces' search indexes in step with their databases.
 */
export function initializeSearch(): void {
  initializeSearchSync();
}
