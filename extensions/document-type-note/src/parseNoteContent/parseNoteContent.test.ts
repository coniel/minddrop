import { describe, it, expect } from 'vitest';
import { parseNoteContent } from './parseNoteContent';
import { Ast } from '@minddrop/ast';

const markdown = `# Title

Some content`;

const fileTextContent = `---
  icon: 'content:cat:cyan'
---

${markdown}`;

const parsedNoteContent = Ast.fromMarkdown(markdown);

describe('parseNoteContent', () => {
  it('parses the markdown content of the file text content', () => {
    expect(parseNoteContent(fileTextContent)).toEqual(parsedNoteContent);
  });
});
