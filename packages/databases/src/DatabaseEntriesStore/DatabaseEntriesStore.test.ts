// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup as cleanupRender, renderHook } from '@minddrop/test-utils';
import { cleanup, objectEntry1, setup } from '../test-utils';
import {
  DatabaseEntriesStore,
  useEntryPropertyMetadata,
} from './DatabaseEntriesStore';

// The Paper property's metadata
const paperMetadata = { annotations: [{ id: 'a1' }] };

describe('DatabaseEntriesStore', () => {
  beforeEach(() => {
    setup();

    // Give the entry's Paper property metadata
    DatabaseEntriesStore.update(objectEntry1.id, {
      metadata: { properties: { Paper: paperMetadata } },
    });
  });

  afterEach(async () => {
    cleanupRender();

    await cleanup();
  });

  describe('useEntryPropertyMetadata', () => {
    it("returns the property's metadata", () => {
      const { result } = renderHook(() =>
        useEntryPropertyMetadata(objectEntry1.id, 'Paper'),
      );

      expect(result.current).toEqual(paperMetadata);
    });

    it('returns the same empty metadata for a property without any on every render', () => {
      const { result, rerender } = renderHook(() =>
        useEntryPropertyMetadata(objectEntry1.id, 'Cover'),
      );
      const first = result.current;

      rerender();

      expect(first).toEqual({});
      expect(result.current).toBe(first);
    });

    it('returns empty metadata for an entry which does not exist', () => {
      const { result } = renderHook(() =>
        useEntryPropertyMetadata('missing', 'Paper'),
      );

      expect(result.current).toEqual({});
    });
  });
});
