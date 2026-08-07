/**
 * Number of console calls kept before the oldest are dropped.
 */
export const MaxLogEntries = 200;

/**
 * Number of dispatched events kept before the oldest are dropped.
 */
export const MaxEventEntries = 200;

/**
 * Namespace the dev tools register their event listeners and
 * persist their own state under.
 */
export const DevToolsNamespace = 'dev-tools';

/**
 * Longest pause between two events of the same batch, in
 * milliseconds.
 */
export const EventBatchGap = 1000;
