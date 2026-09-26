/**
 * @vitest-environment happy-dom
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  act,
  cleanup as cleanupRender,
  renderHook,
} from '@minddrop/test-utils';
import { DatabasesStore } from '../DatabasesStore';
import { cleanup, setup, urlDatabase } from '../test-utils';
import { useDatabasesByContentType } from './useDatabasesByContentType';

describe('useDatabasesByContentType', () => {
  beforeEach(setup);

  afterEach(async () => {
    cleanupRender();

    await cleanup();
  });

  it('returns the databases accepting the content type', () => {
    const { result } = renderHook(() => useDatabasesByContentType('url'));

    expect(result.current).toEqual([urlDatabase]);
  });

  it('updates when the databases change', () => {
    const { result } = renderHook(() => useDatabasesByContentType('url'));

    // Remove the only database accepting URLs
    act(() => {
      DatabasesStore.remove(urlDatabase.id);
    });

    expect(result.current).toEqual([]);
  });
});
