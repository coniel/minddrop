import { describe, it, expect, vi } from 'vitest';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { mdastNodesToDrops } from './mdastNodesToDrops';
import { RootContent } from 'mdast';

vi.mock('uuid', () => ({
  v4: () => 'some-id',
}));

const heading1 = '# Heading 1\n';

const heading2 = '## Heading 2\n';

const heading3 = '### Heading 3\n';

const text = 'Lorem ipsum dolor sit amet.\n';

const image = '![Image description](img.png "Image title")\n';

const file = '![File description](file.pdf "File title")\n';

const link = '[Link description](https://minddrop.app "Link title")\n';

const table = '| a | b  |  c |  d  |\n| - | :- | -: | :-: |\n';

const thematicBreak = '---\n';

function toMarkdownString(parts: string[]): string {
  return parts.join('\n');
}

function markdownToMdast(markdown: string | string[]) {
  let md = Array.isArray(markdown) ? toMarkdownString(markdown) : markdown;

  return unified().use(remarkParse).use(remarkGfm).use(remarkMath).parse(md)
    .children as RootContent[];
}

describe('mdastNodesToDrop', () => {
  it('generates an ID', () => {
    const [drop] = mdastNodesToDrops(markdownToMdast(text));

    expect(drop.id).toBe('some-id');
  });

  it('adds children', () => {
    const children = markdownToMdast(text);
    const [drop] = mdastNodesToDrops(children);

    expect(drop.children).toEqual(children);
  });

  it('determines the drop type', () => {
    const [drop] = mdastNodesToDrops(markdownToMdast(text));

    expect(drop.type).toBe('text');
  });

  it('converts the AST to markdown', () => {
    const md = toMarkdownString([heading3, text]);
    const [drop] = mdastNodesToDrops(markdownToMdast(md));

    expect(drop.markdown).toBe(md);
  });

  describe('headers', () => {
    it('seperates drops when running into a thematicBreak', () => {
      const drops = mdastNodesToDrops(
        markdownToMdast([text, thematicBreak, text]),
      );

      expect(drops.length).toBe(2);
    });

    it('parses level 2 headers as a drop', () => {
      const [, drop2] = mdastNodesToDrops(
        markdownToMdast([text, heading2, text]),
      );

      expect(drop2.type).toBe('heading');
      expect(drop2.markdown).toBe(heading2);
    });

    it('parses level 1 headers not on line 1 as a drop', () => {
      const [, drop2] = mdastNodesToDrops(
        markdownToMdast([text, heading1, text]),
      );

      expect(drop2.type).toBe('heading');
      expect(drop2.markdown).toBe(heading1);
    });

    it('starts a new drop on level 3 header', () => {
      const drops = mdastNodesToDrops(
        markdownToMdast([heading3, text, heading3, text]),
      );

      expect(drops.length).toBe(2);

      expect(drops[0].type).toBe('text');
      expect(drops[0].markdown).toBe(toMarkdownString([heading3, text]));
    });
  });

  describe('images', () => {
    it('parses images as a drop', () => {
      const [, drop2] = mdastNodesToDrops(markdownToMdast([text, image, text]));

      expect(drop2.type).toBe('image');
      expect(drop2.markdown).toBe(image);
    });
  });

  describe('files', () => {
    it('parses files as a drop', () => {
      const [, drop2] = mdastNodesToDrops(markdownToMdast([text, file, text]));

      expect(drop2.type).toBe('file');
      expect(drop2.markdown).toBe(file);
    });
  });

  describe('links', () => {
    it('parses paragraphs consisting of a single link as a drop', () => {
      const [, drop2] = mdastNodesToDrops(markdownToMdast([text, link, text]));

      expect(drop2.type).toBe('link');
      expect(drop2.markdown).toBe(link);
    });
  });

  describe('table', () => {
    it('parses tables a drop', () => {
      const [, drop2] = mdastNodesToDrops(markdownToMdast([text, table, text]));

      expect(drop2.type).toBe('table');
      expect(drop2.markdown).toBe(table);
    });
  });
});
