import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Fs } from '@minddrop/file-system';
import { markdownEntrySerializer } from '../entry-serializers';
import {
  MockFs,
  breakEntryFile,
  cleanup,
  entryFilePath,
  objectDatabase,
  objectEntry1,
  setup,
} from '../test-utils';
import { readEntryIfChanged } from './readEntryIfChanged';

describe('readEntryIfChanged', () => {
  beforeEach(() => setup({ loadEntries: false }));

  afterEach(cleanup);

  it('reads an entry which is not indexed', async () => {
    const result = await readEntryIfChanged(
      objectEntry1.path,
      objectDatabase,
      markdownEntrySerializer,
    );

    expect(result).toEqual({
      status: 'changed',
      entry: {
        ...objectEntry1,
        id: expect.any(String),
        contentHash: expect.any(String),
      },
    });
  });

  it('reports an entry whose contents match its indexed hash as unchanged', async () => {
    const result = await readEntryIfChanged(
      objectEntry1.path,
      objectDatabase,
      markdownEntrySerializer,
      {
        indexedHash: Fs.hashContents(
          MockFs.readTextFile(entryFilePath(objectEntry1)),
        ),
      },
    );

    expect(result).toEqual({ status: 'unchanged' });
  });

  it('reads an entry whose contents differ from its indexed hash', async () => {
    const result = await readEntryIfChanged(
      objectEntry1.path,
      objectDatabase,
      markdownEntrySerializer,
      { indexedHash: 'outdated-hash' },
    );

    expect(result.status).toBe('changed');
  });

  it('reports an entry whose file cannot be parsed as unreadable', async () => {
    breakEntryFile(objectEntry1);

    const result = await readEntryIfChanged(
      objectEntry1.path,
      objectDatabase,
      markdownEntrySerializer,
      { indexedHash: 'outdated-hash' },
    );

    expect(result).toEqual({ status: 'unreadable' });
  });

  it('reports an indexed entry whose file does not exist as unreadable', async () => {
    const result = await readEntryIfChanged(
      'Missing.md',
      objectDatabase,
      markdownEntrySerializer,
      { indexedHash: 'indexed-hash' },
    );

    expect(result).toEqual({ status: 'unreadable' });
  });
});
