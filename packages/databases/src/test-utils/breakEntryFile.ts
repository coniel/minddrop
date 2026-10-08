import { Entry } from '../types';
import { entryFilePath } from './fixtures';
import { MockFs } from './setup-tests';

/**
 * Replaces an entry's file contents with frontmatter which is not
 * valid YAML.
 *
 * @param entry - The fixture entry whose file to break.
 */
export function breakEntryFile(entry: Pick<Entry, 'database' | 'path'>): void {
  MockFs.writeTextFile(
    entryFilePath(entry),
    '---\nSummary: Nested: mapping\n---\n',
  );
}
