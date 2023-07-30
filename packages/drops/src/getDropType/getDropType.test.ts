import { describe, it, expect } from 'vitest';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { getDropType } from './getDropType';
import { RootContent } from 'mdast';

const heading1 = '# Heading 1\n';

const heading2 = '## Heading 2\n';

const heading3 = '### Heading 3\n';

const text = 'Lorem ipsum dolor sit amet.\n';

const image = '![Image description](img.png "Image title")\n';

const file = '![File description](file.pdf "File title")\n';

const link = '[Link description](https://minddrop.app "Link title")\n';

const table = '| a | b  |  c |  d  |\n| - | :- | -: | :-: |\n';

function markdownToMdast(markdown: string) {
  return unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .parse(markdown).children as RootContent[];
}

describe('mdastNodesToDrop', () => {
  describe('headers', () => {
    it('parses heading 3 followed by content as "text"', () => {
      const dropType = getDropType(markdownToMdast(`${heading3}\n${text}`));

      expect(dropType).toBe('text');
    });

    it('parses level 1 headings as "heading"', () => {
      const dropType = getDropType(markdownToMdast(heading1));

      expect(dropType).toBe('heading');
    });

    it('parses level 2 headings as "heading"', () => {
      const dropType = getDropType(markdownToMdast(heading2));

      expect(dropType).toBe('heading');
    });
  });

  describe('images', () => {
    it('parses images as a "image"', () => {
      const dropType = getDropType(markdownToMdast(image));

      expect(dropType).toBe('image');
    });
  });

  describe('files', () => {
    it('parses files as "file"', () => {
      const dropType = getDropType(markdownToMdast(file));

      expect(dropType).toBe('file');
    });
  });

  describe('links', () => {
    it('parses paragraphs consisting of a single link as "link"', () => {
      const dropType = getDropType(markdownToMdast(link));

      expect(dropType).toBe('link');
    });
  });

  describe('table', () => {
    it('parses tables as "table"', () => {
      const dropType = getDropType(markdownToMdast(table));

      expect(dropType).toBe('table');
    });
  });
});
