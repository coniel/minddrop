import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { SetViewAreaEventData } from '../../events';
import { ViewSessionsStore } from '../ViewSessionsStore';
import { createViewSession } from '../createViewSession';
import { recordViewArea } from '../recordViewArea';
import { findViewSessionPane } from './findViewSessionPane';

const VIEW_AREA_ID = 'test-set';

/**
 * Builds the view area state showing the given views.
 *
 * @param main - The view in the main pane.
 * @param split - The view in the split pane.
 * @returns The view area state.
 */
function state(
  main: SetViewAreaEventData['main'],
  split: SetViewAreaEventData['split'] = null,
): SetViewAreaEventData {
  return { viewAreaId: VIEW_AREA_ID, main, split, splitRatio: 50 };
}

describe('findViewSessionPane', () => {
  beforeEach(() => {
    ViewSessionsStore.clear();
  });

  afterEach(() => {
    ViewSessionsStore.clear();
  });

  it('finds a view in the main pane', () => {
    createViewSession(VIEW_AREA_ID);
    recordViewArea(
      VIEW_AREA_ID,
      state({ view: 'db:entry', id: 'db:a' }, { view: 'db:entry', id: 'db:b' }),
    );

    expect(findViewSessionPane(VIEW_AREA_ID, 'db:a')).toBe('main');
  });

  it('finds a view in the split pane', () => {
    createViewSession(VIEW_AREA_ID);
    recordViewArea(
      VIEW_AREA_ID,
      state({ view: 'db:entry', id: 'db:a' }, { view: 'db:entry', id: 'db:b' }),
    );

    expect(findViewSessionPane(VIEW_AREA_ID, 'db:b')).toBe('split');
  });

  it('ignores views shown by sessions other than the active one', () => {
    createViewSession(VIEW_AREA_ID);
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:entry', id: 'db:a' }));
    createViewSession(VIEW_AREA_ID);
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:entry', id: 'db:b' }));

    expect(findViewSessionPane(VIEW_AREA_ID, 'db:a')).toBeNull();
  });

  it('finds nothing in a view area without sessions', () => {
    expect(findViewSessionPane(VIEW_AREA_ID, 'db:a')).toBeNull();
  });
});
