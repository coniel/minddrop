/**
 * @vitest-environment happy-dom
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, renderHook } from '@minddrop/test-utils';
import { ContentViewTypesRegistry } from '../ContentViewTypesRegistry';
import {
  contentViewType_board,
  contentViewType_databaseOnly,
  contentViewType_table,
} from '../test-utils/fixtures/content-view-types.fixtures';
import { useContentViewTypesForDataSources } from './useContentViewTypesForDataSources';

describe('useContentViewTypesForDataSources', () => {
  beforeEach(() => {
    // Register a type supporting every source, a collection only
    // type and a database only type.
    ContentViewTypesRegistry.register(contentViewType_table);
    ContentViewTypesRegistry.register(contentViewType_board);
    ContentViewTypesRegistry.register(contentViewType_databaseOnly);
  });

  afterEach(() => {
    cleanup();
    ContentViewTypesRegistry.clear();
  });

  it('returns the view types supporting one of the data sources', () => {
    const { result } = renderHook(() =>
      useContentViewTypesForDataSources(['collection']),
    );

    expect(result.current).toEqual([
      contentViewType_table,
      contentViewType_board,
    ]);
  });

  it('returns every view type without data sources', () => {
    const { result } = renderHook(() => useContentViewTypesForDataSources());

    expect(result.current).toEqual([
      contentViewType_table,
      contentViewType_board,
      contentViewType_databaseOnly,
    ]);
  });
});
