import { DevToolsNamespace } from '../../constants';

/**
 * Checks whether an event was dispatched by the dev tools
 * themselves, such as their own state being persisted.
 *
 * @param data - The data the event was dispatched with.
 * @returns Whether the event came from the dev tools.
 */
export function isDevToolsEvent(data: unknown): boolean {
  // Events of the dev tools' own stores carry their namespace
  if (data === null || typeof data !== 'object') {
    return false;
  }

  return (data as { namespace?: unknown }).namespace === DevToolsNamespace;
}
