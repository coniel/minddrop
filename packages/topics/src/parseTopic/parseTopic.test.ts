import { describe, it, expect, vi } from 'vitest';
import { parseTopic } from './parseTopic';

vi.mock('uuid', () => ({
  v4: () => 'some-id',
}));

const yaml = `---
foo: bar
---\n`;

const heading1 = '# Heading 1\n';

const text = 'Lorem ipsum dolor sit amet.\n';

const image = '![Image description](img.png "Image title")\n';

const link = '![Link description](https://minddrop.app "Link title")\n';

const thematicBreak = '---\n';

function toMarkdownString(parts: string[]): string {
  return parts.join('\n');
}

describe('parseTopic', () => {
  describe('title', () => {
    it('parses the topic title', () => {
      const { title } = parseTopic(heading1);

      expect(title).toBe('Heading 1');
    });

    it('parses the topic title with yaml', () => {
      const markdown = toMarkdownString([yaml, heading1]);

      const { title } = parseTopic(markdown);

      expect(title).toBe('Heading 1');
    });
  });

  describe('columns', () => {
    it('seperates columns using thematic breaks', () => {
      const markdown = toMarkdownString([
        text,
        thematicBreak,
        text,
        thematicBreak,
      ]);

      const { columns } = parseTopic(markdown);

      expect(columns.length).toBe(3);
    });

    it('generates a column ID', () => {
      const { columns } = parseTopic(heading1);

      expect(columns[0].id).toBe('some-id');
    });

    it('sets the column seperator markdown', () => {
      const markdown = toMarkdownString([text, thematicBreak, text]);

      const { columns } = parseTopic(markdown);

      expect(columns[0].seperator).not.toBeDefined();
      expect(columns[1].seperator).toBe(thematicBreak);
    });
  });

  describe('drops', () => {
    it('parses drops into their columns', () => {
      const markdown = toMarkdownString([
        text,
        image,
        thematicBreak,
        text,
        thematicBreak,
        link,
      ]);

      const { columns } = parseTopic(markdown);

      expect(columns[0].drops.length).toBe(2);
      expect(columns[1].drops.length).toBe(1);
      expect(columns[2].drops.length).toBe(1);
    });
  });
});
