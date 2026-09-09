import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  clearEntryFocusRequest,
  getEntryFocusRequest,
} from '../EntryFocusRequestStore';
import { EntryFocusRequestTimeoutMs } from '../constants';
import { requestEntryFocus } from './requestEntryFocus';

describe('requestEntryFocus', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    clearEntryFocusRequest();
    vi.useRealTimers();
  });

  it('sets the pending request', () => {
    requestEntryFocus('entry-1');

    expect(getEntryFocusRequest()).toEqual({
      entryId: 'entry-1',
      viewId: undefined,
    });
  });

  it('scopes the request to a view', () => {
    requestEntryFocus('entry-1', { viewId: 'view-1' });

    expect(getEntryFocusRequest()).toEqual({
      entryId: 'entry-1',
      viewId: 'view-1',
    });
  });

  it('replaces a pending request', () => {
    requestEntryFocus('entry-1');
    requestEntryFocus('entry-2');

    expect(getEntryFocusRequest()).toEqual({
      entryId: 'entry-2',
      viewId: undefined,
    });
  });

  it('clears the request once it expires', () => {
    requestEntryFocus('entry-1');

    vi.advanceTimersByTime(EntryFocusRequestTimeoutMs);

    expect(getEntryFocusRequest()).toBeNull();
  });

  it('keeps the request pending until it expires', () => {
    requestEntryFocus('entry-1');

    vi.advanceTimersByTime(EntryFocusRequestTimeoutMs - 1);

    expect(getEntryFocusRequest()).not.toBeNull();
  });

  it('restarts the expiry when a request replaces another', () => {
    requestEntryFocus('entry-1');

    // Let most of the first request's window pass before replacing it
    vi.advanceTimersByTime(EntryFocusRequestTimeoutMs - 1);
    requestEntryFocus('entry-2');

    // The first request's expiry would have fired by now
    vi.advanceTimersByTime(1);

    expect(getEntryFocusRequest()).toEqual({
      entryId: 'entry-2',
      viewId: undefined,
    });
  });
});
