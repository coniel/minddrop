import { describe, it, expect } from 'vitest';
import { htmlToMarkdown } from './htmlToMarkdown';

describe('htmlToMarkdown', () => {
  it('parses HTML to markdown', async () => {
    const result = await htmlToMarkdown('<h1>Heading 1</h1>');

    expect(result).toBe('# Heading 1\n');
  });
});
