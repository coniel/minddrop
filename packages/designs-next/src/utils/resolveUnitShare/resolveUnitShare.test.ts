import { describe, expect, it } from 'vitest';
import { resolveUnitShare } from './resolveUnitShare';

describe('resolveUnitShare', () => {
  it('splits the units by whether they scale', () => {
    expect(resolveUnitShare([false, true, true, false, false])).toEqual({
      fixed: 3,
      scaling: 2,
    });
  });

  it('counts nothing for no units', () => {
    expect(resolveUnitShare([])).toEqual({ fixed: 0, scaling: 0 });
  });
});
