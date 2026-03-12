// @vitest-environment happy-dom
import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import {
  DatabaseEntryRenamedEvent,
  DatabaseEntryRenamedEventData,
} from '../events';
import { objectEntry1 } from '../test-utils';
import { DatabaseEntry } from '../types';
import { useRenameAwareEntryId } from './useRenameAwareEntryId';

// Creates an entry based on a fixture with the given ID
function makeEntry(id: string): DatabaseEntry {
  return {
    ...objectEntry1,
    id,
    title: id.split('/').pop()?.replace('.md', '') ?? id,
    path: `/workspace/${id}`,
  };
}

describe('useRenameAwareEntryId', () => {
  afterEach(() => {
    Events._clearAll();
  });

  it('returns the initial entry ID', () => {
    const { result } = renderHook(() => useRenameAwareEntryId(objectEntry1.id));

    expect(result.current).toBe(objectEntry1.id);
  });

  it('updates when the entry is renamed', () => {
    const renamedEntry = makeEntry('Objects/Renamed.md');

    const { result } = renderHook(() => useRenameAwareEntryId(objectEntry1.id));

    // Dispatch a rename event
    act(() => {
      Events.dispatch<DatabaseEntryRenamedEventData>(
        DatabaseEntryRenamedEvent,
        {
          original: objectEntry1,
          updated: renamedEntry,
        },
      );
    });

    expect(result.current).toBe(renamedEntry.id);
  });

  it('tracks the prop when it changes externally', () => {
    const otherEntry = makeEntry('Objects/Other.md');

    const { result, rerender } = renderHook(
      ({ entryId }) => useRenameAwareEntryId(entryId),
      { initialProps: { entryId: objectEntry1.id } },
    );

    expect(result.current).toBe(objectEntry1.id);

    // Simulate navigation to a different entry
    rerender({ entryId: otherEntry.id });

    expect(result.current).toBe(otherEntry.id);
  });

  it('stops tracking the old ID after prop change', () => {
    const otherEntry = makeEntry('Objects/Other.md');
    const renamedEntry = makeEntry('Objects/Renamed.md');

    const { result, rerender } = renderHook(
      ({ entryId }) => useRenameAwareEntryId(entryId),
      { initialProps: { entryId: objectEntry1.id } },
    );

    // Navigate to other entry
    rerender({ entryId: otherEntry.id });

    // Rename original (should not affect hook since it now tracks other)
    act(() => {
      Events.dispatch<DatabaseEntryRenamedEventData>(
        DatabaseEntryRenamedEvent,
        {
          original: objectEntry1,
          updated: renamedEntry,
        },
      );
    });

    expect(result.current).toBe(otherEntry.id);
  });

  it('cleans up on unmount', () => {
    const renamedEntry = makeEntry('Objects/Renamed.md');

    const { result, unmount } = renderHook(() =>
      useRenameAwareEntryId(objectEntry1.id),
    );

    unmount();

    // Dispatch a rename after unmount (should not throw)
    act(() => {
      Events.dispatch<DatabaseEntryRenamedEventData>(
        DatabaseEntryRenamedEvent,
        {
          original: objectEntry1,
          updated: renamedEntry,
        },
      );
    });

    // The result is stale after unmount, but the important thing
    // is that no error was thrown
    expect(result.current).toBe(objectEntry1.id);
  });
});
