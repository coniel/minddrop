import { describe, it, expect, beforeEach, vi } from 'vitest';
import { updateMarkdownFileHeading } from './updateMarkdownFileHeading';
import {
  Fs,
  InvalidParameterError,
  registerFileSystemAdapter,
} from '@minddrop/core';
import { MockFsAdapter } from '@minddrop/test-utils';

const MD_FILE_PATH = '/path/to/file.md';

describe('updateMarkdownFileHeading', () => {
  beforeEach(() => {
    registerFileSystemAdapter({
      ...MockFsAdapter,
      exists: vi
        .fn()
        .mockImplementation(
          (path) => new Promise((resolve) => resolve(path === MD_FILE_PATH)),
        ),
      readTextFile: vi.fn().mockResolvedValue('# Old heading\n'),
    });
  });

  it('throws if the file does not exist', () => {
    // Attempt to update the heading of a file that does
    // not exist. Should throw an InvalidParameterError.
    expect(() =>
      updateMarkdownFileHeading('foo.md', 'New heading'),
    ).rejects.toThrowError(InvalidParameterError);
  });

  it('updates the markdown file heading', async () => {
    vi.spyOn(Fs, 'writeTextFile');

    // Update the heading of a file
    await updateMarkdownFileHeading(MD_FILE_PATH, 'New heading');

    // Should write the updated markdown to the file
    expect(Fs.writeTextFile).toHaveBeenCalledWith(
      MD_FILE_PATH,
      '# New heading\n',
    );
  });
});
