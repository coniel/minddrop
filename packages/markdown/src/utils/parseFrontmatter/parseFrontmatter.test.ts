import { describe, expect, it } from 'vitest';
import { parseFrontmatter } from './parseFrontmatter';

describe('parseFrontmatter', () => {
  it('splits frontmatter from the body', () => {
    expect(parseFrontmatter('---\ntitle: Test\n---\n\nContent')).toEqual({
      source: 'title: Test',
      body: 'Content',
    });
  });

  it('returns no source when there is no frontmatter', () => {
    expect(parseFrontmatter('# Heading\n\nContent')).toEqual({
      source: null,
      body: '# Heading\n\nContent',
    });
  });

  it('does not treat a thematic break in the body as frontmatter', () => {
    const content = '# Heading\n\n---\n\nContent';

    expect(parseFrontmatter(content)).toEqual({
      source: null,
      body: content,
    });
  });

  it('does not mangle a body containing a thematic break', () => {
    const result = parseFrontmatter(
      '---\ntitle: Test\n---\n\nOne\n\n---\n\nTwo',
    );

    expect(result.source).toBe('title: Test');
    expect(result.body).toBe('One\n\n---\n\nTwo');
  });

  it('handles empty frontmatter', () => {
    expect(parseFrontmatter('---\n---\n\nContent')).toEqual({
      source: '',
      body: 'Content',
    });
  });

  it('handles an unclosed opening fence', () => {
    const content = '---\ntitle: Test\n\nContent';

    expect(parseFrontmatter(content)).toEqual({
      source: null,
      body: content,
    });
  });

  it('handles frontmatter with no body', () => {
    expect(parseFrontmatter('---\ntitle: Test\n---\n')).toEqual({
      source: 'title: Test',
      body: '',
    });
  });

  it('handles CRLF line endings', () => {
    const result = parseFrontmatter('---\r\ntitle: Test\r\n---\r\n\r\nContent');

    expect(result.source).toBe('title: Test');
  });
});
