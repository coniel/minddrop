import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, objectDatabase, parentDir, setup } from '../../test-utils';
import { resolveDatabasePath } from './resolveDatabasePath';

describe('resolveDatabasePath', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("resolves the database's path against the workspace", () => {
    expect(resolveDatabasePath(objectDatabase)).toBe(
      `${parentDir}/${objectDatabase.path}`,
    );
  });

  it('resolves a workspace relative path', () => {
    expect(resolveDatabasePath(objectDatabase.path)).toBe(
      `${parentDir}/${objectDatabase.path}`,
    );
  });

  it('resolves against the given workspace', () => {
    expect(resolveDatabasePath(objectDatabase, 'path/to/other')).toBe(
      `path/to/other/${objectDatabase.path}`,
    );
  });
});
