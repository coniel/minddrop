export interface ContentCapture {
  /**
   * When the content was captured.
   */
  capturedAt: Date;

  /**
   * Hash of the content captured then.
   */
  contentHash: string;
}

// The most recent content capture of each entry, keyed by its
// database path and title. Derived state, seeded from the entry's
// history log on a miss.
const captures = new Map<string, ContentCapture>();

/**
 * Returns the key an entry's capture is stored under.
 *
 * @param databasePath - The absolute path of the entry's database.
 * @param title - The entry's title.
 * @returns The capture key.
 */
export function contentCaptureKey(databasePath: string, title: string): string {
  return `${databasePath}/${title}`;
}

/**
 * Records an entry's most recent content capture, so the writes that
 * follow can be measured against it without reading its history.
 *
 * @param key - The entry's capture key.
 * @param capture - The capture to record.
 */
export function recordContentCapture(
  key: string,
  capture: ContentCapture,
): void {
  captures.set(key, capture);
}

/**
 * Returns an entry's most recent content capture as recorded in this
 * session.
 *
 * @param key - The entry's capture key.
 * @returns The capture, or null if the entry has not been captured in this session.
 */
export function getContentCapture(key: string): ContentCapture | null {
  return captures.get(key) ?? null;
}

/**
 * Clears an entry's recorded capture, so an entry taking its key next
 * is not measured against it.
 *
 * @param key - The entry's capture key.
 */
export function clearContentCapture(key: string): void {
  captures.delete(key);
}

/**
 * Moves a recorded capture to follow an entry to a new key.
 *
 * @param fromKey - The entry's previous capture key.
 * @param toKey - The entry's new capture key.
 */
export function moveContentCapture(fromKey: string, toKey: string): void {
  const capture = captures.get(fromKey);

  // The old key gives up its capture either way
  captures.delete(fromKey);

  if (!capture) {
    return;
  }

  captures.set(toKey, capture);
}

/**
 * Clears all recorded captures.
 */
export function clearContentCaptureRegistry(): void {
  captures.clear();
}
