import { describe, expect, it } from 'vitest';
import { matchesEntryFocusRequest } from './matchesEntryFocusRequest';

describe('matchesEntryFocusRequest', () => {
  it('does not match when there is no request', () => {
    expect(matchesEntryFocusRequest(null, 'entry-1')).toBe(false);
  });

  it('does not match another entry', () => {
    expect(matchesEntryFocusRequest({ entryId: 'entry-1' }, 'entry-2')).toBe(
      false,
    );
  });

  it('matches the requested entry', () => {
    expect(matchesEntryFocusRequest({ entryId: 'entry-1' }, 'entry-1')).toBe(
      true,
    );
  });

  it('matches an unscoped request in any view', () => {
    expect(
      matchesEntryFocusRequest({ entryId: 'entry-1' }, 'entry-1', 'view-1'),
    ).toBe(true);
  });

  it('matches a scoped request in the view it names', () => {
    expect(
      matchesEntryFocusRequest(
        { entryId: 'entry-1', viewId: 'view-1' },
        'entry-1',
        'view-1',
      ),
    ).toBe(true);
  });

  it('does not match a scoped request in another view', () => {
    expect(
      matchesEntryFocusRequest(
        { entryId: 'entry-1', viewId: 'view-1' },
        'entry-1',
        'view-2',
      ),
    ).toBe(false);
  });

  it('does not match a scoped request outside a view', () => {
    expect(
      matchesEntryFocusRequest(
        { entryId: 'entry-1', viewId: 'view-1' },
        'entry-1',
      ),
    ).toBe(false);
  });
});
