import { describe, expect, it } from 'vitest';
import { SessionView } from '../../types';
import { viewMatches } from './viewMatches';

const sessionView: SessionView = {
  view: 'db:view',
  id: 'db:a',
  contentIcon: 'icon-a',
};

describe('viewMatches', () => {
  it('returns true when the id matches', () => {
    expect(viewMatches(sessionView, 'db:a')).toBe(true);
  });

  it('returns false when the id does not match', () => {
    expect(viewMatches(sessionView, 'db:b')).toBe(false);
  });

  it('returns false for a null session view', () => {
    expect(viewMatches(null, 'db:a')).toBe(false);
  });
});
