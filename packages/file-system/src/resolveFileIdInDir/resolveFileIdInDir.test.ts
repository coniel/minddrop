import { describe, expect, it } from 'vitest';
import { resolveFileIdInDir } from './resolveFileIdInDir';

const dirPath = 'Workspace/.minddrop/views';

describe('resolveFileIdInDir', () => {
  it('returns the name of a file in the directory without its extension', () => {
    expect(resolveFileIdInDir(`${dirPath}/view_1.json`, dirPath, 'json')).toBe(
      'view_1',
    );
  });

  it('keeps dots inside the file name', () => {
    expect(resolveFileIdInDir(`${dirPath}/view.1.json`, dirPath, 'json')).toBe(
      'view.1',
    );
  });

  it('returns null for a file with another extension', () => {
    expect(resolveFileIdInDir(`${dirPath}/notes.md`, dirPath, 'json')).toBe(
      null,
    );
  });

  it('returns null for a file whose name is only the extension', () => {
    expect(resolveFileIdInDir(`${dirPath}/.json`, dirPath, 'json')).toBe(null);
  });

  it('returns null for a file outside the directory', () => {
    expect(resolveFileIdInDir('Workspace/view_1.json', dirPath, 'json')).toBe(
      null,
    );
  });

  it('returns null for a sibling file whose name starts with the directory name', () => {
    expect(resolveFileIdInDir(`${dirPath}-view_1.json`, dirPath, 'json')).toBe(
      null,
    );
  });

  it('returns null for a file nested below the directory', () => {
    expect(
      resolveFileIdInDir(`${dirPath}/archive/view_1.json`, dirPath, 'json'),
    ).toBe(null);
  });

  it('returns null for the directory itself', () => {
    expect(resolveFileIdInDir(dirPath, dirPath, 'json')).toBe(null);
  });
});
