/**
 * Keys handled by the dev tools shell itself. Panels cannot
 * use these as their shortcut key.
 */
export const ReservedShortcutKeys = ['d', 'f', 'a', '?', '[', ']', 'Escape'];

/**
 * Toggles the dev tools open and closed.
 */
export const ToggleDevToolsShortcutKey = 'd';

/**
 * Gap between the app window edge and the dev tools window
 * when snapped to a side, in pixels.
 */
export const SnappedWindowGap = 12;

/**
 * Width of the dev tools window when snapped to a side, in pixels.
 */
export const SnappedWindowWidth = 500;

/**
 * Smallest size the dev tools window can be resized to, in pixels.
 */
export const MinWindowSize = { width: 320, height: 200 };

/**
 * Number of console calls kept before the oldest are dropped.
 */
export const MaxLogEntries = 200;

/**
 * Number of dispatched events kept before the oldest are dropped.
 */
export const MaxEventEntries = 200;

/**
 * ID the dev tools register their own event listeners under.
 */
export const DevToolsListenerId = 'dev-tools';
