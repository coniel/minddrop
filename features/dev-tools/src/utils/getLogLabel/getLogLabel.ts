import { DevToolsLogEntry } from '../../types';

/**
 * Returns a log entry's label: the leading string of a console call
 * made with several values, such as `console.log('Databases', data)`.
 *
 * @param entry - The log entry to get the label of.
 * @returns The label, or null when the entry has none.
 */
export function getLogLabel(entry: DevToolsLogEntry): string | null {
  // A single value is the message itself rather than a label for it
  if (entry.args.length < 2) {
    return null;
  }

  const [first] = entry.args;

  return typeof first === 'string' ? first : null;
}
