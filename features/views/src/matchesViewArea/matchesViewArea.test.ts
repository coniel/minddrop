import { describe, expect, it } from 'vitest';
import { Views } from '@minddrop/views';
import { matchesViewArea } from './matchesViewArea';

describe('matchesViewArea', () => {
  it('matches when the event targets the given area', () => {
    expect(matchesViewArea('secondary', 'secondary')).toBe(true);
  });

  it('does not match a different area', () => {
    expect(matchesViewArea('secondary', 'main')).toBe(false);
  });

  it('treats a missing event area as the default area', () => {
    // A missing viewAreaId resolves to the default area
    expect(matchesViewArea(undefined, Views.constants.DefaultAreaId)).toBe(
      true,
    );
    expect(matchesViewArea(undefined, 'secondary')).toBe(false);
  });
});
