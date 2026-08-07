import { describe, expect, it } from 'vitest';
import { matchesEventNamePath } from './matchesEventNamePath';

describe('matchesEventNamePath', () => {
  it('matches every name without a path', () => {
    expect(matchesEventNamePath('databases:create', null)).toBe(true);
  });

  it('matches the name at the path', () => {
    expect(matchesEventNamePath('databases:create', 'databases:create')).toBe(
      true,
    );
  });

  it('matches names below the path', () => {
    expect(matchesEventNamePath('databases:entries:create', 'databases')).toBe(
      true,
    );
  });

  it('does not match names which only share a segment prefix', () => {
    expect(matchesEventNamePath('databases-legacy:create', 'databases')).toBe(
      false,
    );
  });

  it('does not match unrelated names', () => {
    expect(matchesEventNamePath('views:open', 'databases')).toBe(false);
  });
});
