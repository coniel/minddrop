import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MockFs, cleanup, markdownItem1, pdfItem1, setup } from '../test-utils';
import {
  itemCorePropertiesFilePath,
  itemUserPropertiesFilePath,
} from '../utils';
import { readItem } from './readItem';

describe('readItem', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns null if the file does not exist', async () => {
    const item = await readItem(markdownItem1.type, '/non/existent/path.md');
    expect(item).toBeNull();
  });

  it('returns null if the core properties file does not exist', async () => {
    // Delete the core properties file
    MockFs.removeFile(itemCorePropertiesFilePath(markdownItem1.path));

    const item = await readItem(markdownItem1.type, markdownItem1.path);

    expect(item).toBeNull();
  });

  it('returns markdown based items', async () => {
    const item = await readItem(markdownItem1.type, markdownItem1.path);

    expect(item).toEqual(markdownItem1);
  });

  it('returns non-markdown based items', async () => {
    const item = await readItem(pdfItem1.type, pdfItem1.path);

    expect(item).toEqual(pdfItem1);
  });

  it('returns empty properties and markdown for non-markdown items without user properties', async () => {
    // Delete the user properties file
    MockFs.removeFile(itemUserPropertiesFilePath(pdfItem1.path));

    const item = await readItem(pdfItem1.type, pdfItem1.path);

    expect(item).toEqual({
      ...pdfItem1,
      properties: {},
      markdown: '',
    });
  });

  it('returns null for a non-markdown file in a markdown based item type', async () => {
    const item = await readItem(markdownItem1.type, pdfItem1.path);

    expect(item).toBeNull();
  });
});
