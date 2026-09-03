import { describe, expect, it } from 'vitest';
import { resolveLaneStyle } from './resolveLaneStyle';

describe('resolveLaneStyle', () => {
  it("returns the option's colour as the lane surface", () => {
    expect(resolveLaneStyle('green')).toEqual({
      '--kanban-lane-surface': 'var(--green-200)',
    });
  });

  it('returns nothing when the option has no colour', () => {
    expect(resolveLaneStyle()).toEqual({});
  });

  it('returns nothing when the option uses the default colour', () => {
    expect(resolveLaneStyle('default')).toEqual({});
  });
});
