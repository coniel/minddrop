import { describe, expect, it } from 'vitest';
import { contentIconFromName } from './contentIconFromName';

describe('contentIconFromName', () => {
  it('stringifies the name as a default coloured content icon', () => {
    expect(contentIconFromName('table')).toBe('lucide:table:default');
  });

  it('stringifies the name with the given color', () => {
    expect(contentIconFromName('table', 'red')).toBe('lucide:table:red');
  });
});
