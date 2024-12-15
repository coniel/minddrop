import { describe, expect, it } from 'vitest';
import { parentDirPath } from './parentDirPath';

describe('pathParentDir', () => {
  it('returns the parent dir of a path', () => {
    expect(parentDirPath('path/to/some/file.md')).toEqual('path/to/some');
  });
});
