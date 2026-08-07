/**
 * The console method a log entry came from.
 */
export type DevToolsLogLevel = 'log' | 'info' | 'warn' | 'error';

/**
 * The source location a log entry was called from.
 */
export interface DevToolsLogSource {
  /**
   * Name of the file containing the console call.
   */
  file: string;

  /**
   * Line within the file the console call was made on.
   */
  line: number;
}

/**
 * A filter applied by clicking a log entry's label or source file.
 */
export interface DevToolsLogQuickFilter {
  /**
   * The part of the entry the filter matches against.
   */
  type: 'label' | 'file';

  /**
   * The label or file name entries must match.
   */
  value: string;
}

/**
 * A captured console call.
 */
export interface DevToolsLogEntry {
  /**
   * Unique identifier of the log entry.
   */
  id: string;

  /**
   * The console method the entry came from.
   */
  level: DevToolsLogLevel;

  /**
   * The values passed to the console call.
   */
  args: unknown[];

  /**
   * Timestamp of the console call.
   */
  timestamp: number;

  /**
   * Where the console call was made, when it could be
   * recovered from the call stack.
   */
  source: DevToolsLogSource | null;
}
