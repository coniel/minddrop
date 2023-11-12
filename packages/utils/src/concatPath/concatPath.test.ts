import { describe, it, expect } from 'vitest';
import { concatPath } from './concatPath';

describe('concatPath', () => {
  it('concatenates parts into a path', () => {
    expect(
      concatPath('Users/foo/', '/Documents', 'Workspace', 'Page.md'),
    ).toEqual('Users/foo/Documents/Workspace/Page.md');
  });
});
