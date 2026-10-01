import { Fs } from '@minddrop/file-system';
import { readHistoryLog } from '../readHistoryLog';
import { BaseHistoryRecord } from '../types';
import { resolveLogFilePath } from '../utils';

// The append in flight for each log, keyed by its directory path.
const appendsInFlight = new Map<string, Promise<unknown>>();

/**
 * Appends a record to the log in a directory, rolling the log over
 * first when it has outgrown its size limit.
 *
 * Appends to one log run one at a time, in the order they were made.
 * Each reads the log and then writes it back, so two at once would
 * overwrite one another. The record is built once its turn comes, so
 * that its timestamp follows that order.
 *
 * @param logDirPath - The absolute path of the directory holding the log.
 * @param build - Builds the record to append.
 * @returns The appended record.
 */
export async function appendLogRecord<TRecord extends BaseHistoryRecord>(
  logDirPath: string,
  build: () => Promise<TRecord>,
): Promise<TRecord> {
  // Get the log's append in flight, if it has one
  const pending = appendsInFlight.get(logDirPath) ?? Promise.resolve();

  // Chain this append behind it, whether or not it succeeded
  const append = pending
    .catch(() => undefined)
    .then(() => appendRecord(logDirPath, build));

  // Store this append as the log's latest
  appendsInFlight.set(logDirPath, append);

  try {
    return await append;
  } finally {
    // Check this is still the log's latest append, and if so remove
    // it from the map.
    if (appendsInFlight.get(logDirPath) === append) {
      appendsInFlight.delete(logDirPath);
    }
  }
}

/**
 * Builds the record and appends it to the log, once the appends
 * before it have settled.
 */
async function appendRecord<TRecord extends BaseHistoryRecord>(
  logDirPath: string,
  build: () => Promise<TRecord>,
): Promise<TRecord> {
  const logFilePath = resolveLogFilePath(logDirPath);

  // Ensure the log directory exists, in case this is the log's first
  // record.
  await Fs.ensureDir(logDirPath);

  // Read the records already in the log
  const log = await readHistoryLog(logFilePath);

  // Build the record to append
  const record = await build();

  // Write the log back with the record appended
  await Fs.writeJsonFile(logFilePath, [...log, record], true);

  return record;
}
