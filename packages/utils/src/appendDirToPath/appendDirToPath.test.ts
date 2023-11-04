import { describe, it, expect } from 'vitest';
import { appendDirToPath } from './appendDirToPath';

describe('appendDirToPath', () => {
  it('appends dirName to path', () => {
    expect(appendDirToPath('Workspace', '/User/Documents/')).toEqual(
      '/User/Documents/Workspace',
    );
  });

  it('adds a trailing / to path if needed', () => {
    expect(appendDirToPath('Workspace', '/User/Documents')).toEqual(
      '/User/Documents/Workspace',
    );
  });
});
