import { describe, it, expect } from 'vitest';
import { removeDocumentMetadata } from './removeDocumentMetadata';

// YAML front matter
const FRONT_MATTER = '---\nicon: "content-icon:cat:cyan"\n---\n\n';
// Content containing thematic breaks resembling front matter delimeters
const CONTENT = '# Title\n\n---\n\nContent\n\n---\n';

describe('removeDocumentMetadata', () => {
  it('removes YAML front matter from document content', () => {
    expect(removeDocumentMetadata(`${FRONT_MATTER}${CONTENT}`)).toEqual(CONTENT);
  });

  it('does nothing if content does not start with ---', () => {
    expect(removeDocumentMetadata(CONTENT)).toEqual(CONTENT);
  });
});
