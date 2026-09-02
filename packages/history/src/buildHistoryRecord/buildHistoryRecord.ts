import { hashContents } from '@minddrop/file-system';
import { HistoryRecord, RecordHistoryOptions } from '../types';
import { writeHistoryContent } from '../writeHistoryContent';

/**
 * Builds the record to append from the change handed over, stamping
 * it with the current time.
 *
 * A content change has its contents stored beside the log, and the
 * record it returns references the file they were stored under.
 *
 * @param options - The change being recorded.
 * @returns The record to append.
 */
export async function buildHistoryRecord(
  options: RecordHistoryOptions,
): Promise<HistoryRecord> {
  const { runId } = options;

  // Build the fields every record carries, whatever its kind
  const base = { timestamp: new Date(), ...(runId ? { runId } : {}) };

  // Store a content change's contents and record where they went
  if (options.kind === 'content') {
    return {
      ...base,
      kind: 'content',
      file: await writeHistoryContent(options, base.timestamp),
      contentHash: hashContents(options.contents),
    };
  }

  // Record the properties changed together
  if (options.kind === 'property') {
    return { ...base, kind: 'property', changes: options.changes };
  }

  // Record a value label rename against the property holding it
  if (options.kind === 'rename' && options.target === 'value-label') {
    return {
      ...base,
      kind: 'rename',
      target: 'value-label',
      property: options.property,
      from: options.from,
      to: options.to,
    };
  }

  // Record every other rename by target alone
  if (options.kind === 'rename') {
    return {
      ...base,
      kind: 'rename',
      target: options.target,
      from: options.from,
      to: options.to,
    };
  }

  // Record the creation opening the timeline
  if (options.kind === 'created') {
    return { ...base, kind: 'created' };
  }

  // Record the deletion closing it
  return { ...base, kind: 'deleted' };
}
