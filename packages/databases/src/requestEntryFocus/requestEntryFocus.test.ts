// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@minddrop/test-utils';
import {
  clearEntryFocusRequest,
  getEntryFocusRequest,
  useEntryFocusRequest,
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
      fragment: undefined,
    });
  });

  it('names the part of the entry to bring forward', () => {
    requestEntryFocus('entry-1', { fragment: '^abcd1234' });

    expect(getEntryFocusRequest()).toMatchObject({
      entryId: 'entry-1',
      fragment: '^abcd1234',
    });
  });

  it("reaches the entry's renderers with the part to bring forward", () => {
    const { result } = renderHook(() => useEntryFocusRequest('entry-1'));

    act(() => {
      requestEntryFocus('entry-1', { fragment: '^abcd1234' });
    });

    expect(result.current?.fragment).toBe('^abcd1234');
  });

  it("reaches the entry's renderers anew when a request is repeated", () => {
    const { result } = renderHook(() => useEntryFocusRequest('entry-1'));

    act(() => {
      requestEntryFocus('entry-1', { fragment: '^abcd1234' });
    });

    // The request the renderers received first
    const first = result.current;

    act(() => {
      requestEntryFocus('entry-1', { fragment: '^abcd1234' });
    });

    expect(result.current).not.toBe(first);
  });

  it("does not reach another entry's renderers", () => {
    const { result } = renderHook(() => useEntryFocusRequest('entry-2'));

    act(() => {
      requestEntryFocus('entry-1', { fragment: '^abcd1234' });
    });

    expect(result.current).toBeNull();
  });

  it('scopes the request to a view', () => {
    requestEntryFocus('entry-1', { viewId: 'view-1' });

    expect(getEntryFocusRequest()).toEqual({
      entryId: 'entry-1',
      viewId: 'view-1',
      fragment: undefined,
    });
  });

  it('replaces a pending request', () => {
    requestEntryFocus('entry-1');
    requestEntryFocus('entry-2');

    expect(getEntryFocusRequest()).toEqual({
      entryId: 'entry-2',
      viewId: undefined,
      fragment: undefined,
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
