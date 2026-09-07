import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { SetViewAreaEventData } from '../../events';
import { ViewSessionsStore } from '../ViewSessionsStore';
import { createViewSession } from '../createViewSession';
import { recordViewArea } from '../recordViewArea';
import { getOpenViews } from './getOpenViews';

const VIEW_AREA_ID = 'test-set';

function state(
  main: SetViewAreaEventData['main'],
  split: SetViewAreaEventData['split'] = null,
  splitRatio = 50,
): SetViewAreaEventData {
  return { viewAreaId: VIEW_AREA_ID, main, split, splitRatio };
}

describe('getOpenViews', () => {
  beforeEach(() => {
    ViewSessionsStore.clear();
  });

  afterEach(() => {
    ViewSessionsStore.clear();
  });

  it('returns main and split views across sessions', () => {
    createViewSession(VIEW_AREA_ID);
    recordViewArea(
      VIEW_AREA_ID,
      state({ view: 'db:view', id: 'db:a' }, { view: 'db:entry', id: 'db:b' }),
    );
    createViewSession(VIEW_AREA_ID);
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:c' }));

    const sessions = getOpenViews();

    expect(sessions.map((sessionView) => sessionView.id)).toEqual([
      'db:a',
      'db:b',
      'db:c',
    ]);
  });

  it('filters by view type', () => {
    createViewSession(VIEW_AREA_ID);
    recordViewArea(
      VIEW_AREA_ID,
      state({ view: 'db:view', id: 'db:a' }, { view: 'db:entry', id: 'db:b' }),
    );

    const sessions = getOpenViews('db:entry');

    expect(sessions.map((sessionView) => sessionView.id)).toEqual(['db:b']);
  });

  it('returns an empty array when no sessions are open', () => {
    expect(getOpenViews()).toEqual([]);
  });

  it('ignores sets without sessions', () => {
    // A hydrated set may lack the sessions array entirely
    ViewSessionsStore.load([{ id: 'tabless-set' } as never]);

    expect(getOpenViews()).toEqual([]);
  });
});
