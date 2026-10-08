import { beforeEach, describe, expect, it } from 'vitest';
import { initializeMockFileSystem } from '../../mock';
import { snapshotMockFiles } from './snapshotMockFiles';

const NotePath = 'workspace/notes/note.md';
const ImagePath = 'workspace/image.png';

const MockFileSystem = initializeMockFileSystem([
  'workspace/empty',
  { path: NotePath, textContent: 'Hello' },
  ImagePath,
]);

describe('snapshotMockFiles', () => {
  beforeEach(() => {
    MockFileSystem.reset();
  });

  it('returns the text contents of every file, keyed by path', () => {
    expect(snapshotMockFiles(MockFileSystem)).toEqual({
      [NotePath]: 'Hello',
      [ImagePath]: '',
    });
  });

  it('reflects changes made since the mock was initialized', () => {
    MockFileSystem.writeTextFile(NotePath, 'Changed');

    expect(snapshotMockFiles(MockFileSystem)[NotePath]).toBe('Changed');
  });
});
