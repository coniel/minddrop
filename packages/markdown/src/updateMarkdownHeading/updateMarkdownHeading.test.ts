import { describe, it, expect } from 'vitest';
import { updateMarkdownHeading } from './updateMarkdownHeading';

const mdOldHeading = `# Untitled

## Column header

### Drop 1 header

**Drop 1** text`;

const mdNewHeading = `# New heading

## Column header

### Drop 1 header

**Drop 1** text`;

describe('updateDocumentHeading', () => {
  it('updates the heading', () => {
    const result = updateMarkdownHeading(mdOldHeading, 'New heading');

    expect(result).toEqual(mdNewHeading);
  });
});
