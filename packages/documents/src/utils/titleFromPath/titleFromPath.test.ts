import { describe, expect, it } from 'vitest';
import { titleFromPath } from './titleFromPath';

describe('titleFromPath', () => {
  it('returns the document title', () => {
    expect(titleFromPath('path/to/Document title.md')).toBe('Document title');
  });

  it('supports title with periods', () => {
    expect(titleFromPath('path/to/Some.weird.name.foo')).toBe(
      'Some.weird.name',
    );
  });
});
