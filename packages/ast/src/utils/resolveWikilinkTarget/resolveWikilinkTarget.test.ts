import { describe, expect, it } from 'vitest';
import { resolveWikilinkTarget } from './resolveWikilinkTarget';

describe('resolveWikilinkTarget', () => {
  it('spells a target with a fragment', () => {
    expect(resolveWikilinkTarget('Paper', '^abcd1234')).toBe('Paper#^abcd1234');
  });

  it('spells a target without a fragment as the reference', () => {
    expect(resolveWikilinkTarget('Paper')).toBe('Paper');
  });
});
