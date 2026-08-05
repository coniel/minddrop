import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { SetViewAreaEventData } from '@minddrop/events';
import { TabSetsStore } from '../TabSetsStore';
import { getSet } from '../getSet';
import { newTab } from '../newTab';
import { recordViewArea } from '../recordViewArea';
import { goBack } from './goBack';

const VIEW_AREA_ID = 'test-set';

function state(
  main: SetViewAreaEventData['main'],
  split: SetViewAreaEventData['split'] = null,
  splitRatio = 50,
): SetViewAreaEventData {
  return { viewAreaId: VIEW_AREA_ID, main, split, splitRatio };
}

describe('goBack', () => {
  beforeEach(() => {
    TabSetsStore.clear();
  });

  afterEach(() => {
    TabSetsStore.clear();
  });

  it('restores the previous state onto the active tab', () => {
    newTab(VIEW_AREA_ID);
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:a' }));
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:b' }));

    goBack(VIEW_AREA_ID);

    const tab = getSet(VIEW_AREA_ID).tabs[0];

    expect(tab.main?.id).toBe('db:a');
    expect(tab.backHistory).toHaveLength(0);
    expect(tab.forwardHistory).toHaveLength(1);
    expect(tab.forwardHistory?.[0].main?.id).toBe('db:b');
  });

  it('does nothing without back history', () => {
    newTab(VIEW_AREA_ID);
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:a' }));

    goBack(VIEW_AREA_ID);

    const tab = getSet(VIEW_AREA_ID).tabs[0];

    expect(tab.main?.id).toBe('db:a');
    expect(tab.forwardHistory).toHaveLength(0);
  });

  it('does nothing without an active tab', () => {
    goBack(VIEW_AREA_ID);

    expect(getSet(VIEW_AREA_ID).tabs).toHaveLength(0);
  });

  it('restores a split arrangement', () => {
    newTab(VIEW_AREA_ID);
    recordViewArea(
      VIEW_AREA_ID,
      state(
        { view: 'db:view', id: 'db:a' },
        { view: 'db:view', id: 'db:b' },
        60,
      ),
    );
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:a' }));

    goBack(VIEW_AREA_ID);

    const tab = getSet(VIEW_AREA_ID).tabs[0];

    expect(tab.split?.id).toBe('db:b');
    expect(tab.splitRatio).toBe(60);
  });

  it('does not re-record the restored state as a navigation', () => {
    newTab(VIEW_AREA_ID);
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:a' }));
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:b' }));
    goBack(VIEW_AREA_ID);

    // Simulate the view area confirming the restored state
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:a' }));

    const tab = getSet(VIEW_AREA_ID).tabs[0];

    expect(tab.backHistory).toHaveLength(0);
    expect(tab.forwardHistory).toHaveLength(1);
  });
});
