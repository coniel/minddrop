import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Fs, initializeMockFileSystem } from '@minddrop/file-system';
import { i18n } from '@minddrop/i18n';
import {
  cleanup,
  collectionFileDescriptors,
  collectionMetadataPath,
  markdownCollection,
  setup,
} from '../test-utils';
import { createMarkdownCollectionEntry } from './createMarkdownCollectionEntry';

const UNTITLED = i18n.t('documents.untitled');
const UNTITLED_MD = `${UNTITLED}.md`;

const MockFs = initializeMockFileSystem(collectionFileDescriptors);

describe('createMarkdownCollectionEntry', () => {
  beforeEach(setup);

  afterEach(() => {
    cleanup();
    MockFs.reset();
  });

  it('writes the entry markdown file', async () => {
    await createMarkdownCollectionEntry(markdownCollection.path, {}, {});

    expect(
      MockFs.exists(Fs.concatPath(markdownCollection.path, UNTITLED_MD)),
    ).toBe(true);
  });

  it('increments the entry number if the file already exists', async () => {
    await createMarkdownCollectionEntry(markdownCollection.path, {}, {});
    await createMarkdownCollectionEntry(markdownCollection.path, {}, {});

    expect(
      MockFs.exists(Fs.concatPath(markdownCollection.path, `${UNTITLED} 1.md`)),
    ).toBe(true);
  });

  it('writes the title as the markdown heading', async () => {
    await createMarkdownCollectionEntry(markdownCollection.path, {}, {});

    const markdown = MockFs.readTextFile(
      Fs.concatPath(markdownCollection.path, UNTITLED_MD),
    );

    expect(markdown).toMatch(`# ${UNTITLED}`);
  });

  it('writes properties as frontmatter', async () => {
    const properties = { foo: 'bar' };

    await createMarkdownCollectionEntry(
      markdownCollection.path,
      properties,
      {},
    );

    const markdown = MockFs.readTextFile(
      Fs.concatPath(markdownCollection.path, UNTITLED_MD),
    );

    expect(markdown).toMatch(`foo: ${properties.foo}`);
  });

  it('creates a metadata file', async () => {
    const metadata = { foo: 'bar' };

    await createMarkdownCollectionEntry(markdownCollection.path, {}, metadata);

    const metadataFile = MockFs.readTextFile(
      Fs.concatPath(collectionMetadataPath, `${UNTITLED}.json`),
    );

    expect(metadataFile).toBe(JSON.stringify(metadata));
  });

  it('returns the entry', async () => {
    const properties = { foo: 'bar' };
    const metadata = { bar: 'baz' };
    const entry = await createMarkdownCollectionEntry(
      markdownCollection.path,
      properties,
      metadata,
    );

    expect(entry).toEqual({
      path: UNTITLED_MD,
      collectionPath: markdownCollection.path,
      title: UNTITLED,
      properties,
      metadata,
    });
  });
});
