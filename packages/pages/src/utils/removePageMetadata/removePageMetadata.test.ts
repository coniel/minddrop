import { describe, it, expect } from 'vitest';
import { removePageMetadata } from './removePageMetadata';

// YAML front matter
const FRONT_MATTER = '---\nicon: "content-icon:cat:cyan"\n---\n';
// Content containing thematic breaks resembling front matter delimeters
const CONTENT = '# Title\n\n---\n\nContent\n\n---\n';

describe('removePageMetadata', () => {
  it('removes YAML front matter from page content', () => {
    expect(removePageMetadata(`${FRONT_MATTER}${CONTENT}`)).toEqual(CONTENT);
  });

  it('does nothing if content does not start with ---', () => {
    expect(removePageMetadata(CONTENT)).toEqual(CONTENT);
  });
});
