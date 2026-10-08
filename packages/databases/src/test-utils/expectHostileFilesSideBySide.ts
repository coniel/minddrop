import { expect } from 'vitest';
import { HostileCase } from './fixtures/hostile-workspace.fixtures';

/**
 * Asserts that a case's broken file sits beside its healthy one rather
 * than over it, as on a case-sensitive file system. A test relying on
 * the two files existing would otherwise pass vacuously.
 *
 * @param files - The workspace's file contents, keyed by path.
 * @param hostileCase - The case whose files to check.
 */
export function expectHostileFilesSideBySide(
  files: Record<string, string>,
  hostileCase: HostileCase,
): void {
  // Check both files exist
  expect(Object.keys(files)).toEqual(
    expect.arrayContaining([
      hostileCase.healthyFiles[0].path,
      hostileCase.brokenFiles[0].path,
    ]),
  );
}
