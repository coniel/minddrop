export const HistoryDirName = 'history';
export const LedgersDirName = 'ledgers';
export const ContentDirName = 'content';
export const LogFileName = 'history.json';
export const LogFileExtension = 'json';

// The size at which the active log is archived and a fresh one
// started. This keeps the file that each append rewrites small.
export const LogSizeLimitBytes = 256 * 1024;

/**
 * The entity type of history actions, prefixing their IDs.
 */
export const HistoryActionEntityType = 'action';
