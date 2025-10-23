import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Markdown } from '@minddrop/markdown';
import { Properties } from '@minddrop/properties';
import { MockFs, cleanup, markdownItem1, pdfItem1, setup } from '../test-utils';
import {
  itemCoreProperties,
  itemCorePropertiesFilePath,
  itemUserPropertiesFilePath,
} from '../utils';
import { writeItem } from './writeItem';

describe('writeItem', () => {
  beforeEach(() => {
    setup({ loadItems: true });

    MockFs.removeFile(itemCorePropertiesFilePath(markdownItem1.path));
    MockFs.removeFile(markdownItem1.path);
    MockFs.removeFile(itemUserPropertiesFilePath(pdfItem1.path));
  });

  afterEach(cleanup);

  it("writes the item's core properties", async () => {
    await writeItem(markdownItem1.path);

    const properties = Properties.parse(
      MockFs.readTextFile(itemCorePropertiesFilePath(markdownItem1.path)),
    );

    expect(properties).toEqual(itemCoreProperties(markdownItem1));
  });

  describe('markdown based item', () => {
    it("writes the item's markdown file", async () => {
      await writeItem(markdownItem1.path);

      const markdownContent = Markdown.setProperties(
        markdownItem1.markdown,
        markdownItem1.properties,
      );

      expect(MockFs.readTextFile(markdownItem1.path)).toBe(markdownContent);
    });
  });

  describe('non-markdown based item', () => {
    it("writes the item's markdown file to the meta directory", async () => {
      await writeItem(pdfItem1.path);

      const markdownContent = Markdown.setProperties(
        pdfItem1.markdown,
        pdfItem1.properties,
      );

      expect(
        MockFs.readTextFile(itemUserPropertiesFilePath(pdfItem1.path)),
      ).toBe(markdownContent);
    });
  });
});
