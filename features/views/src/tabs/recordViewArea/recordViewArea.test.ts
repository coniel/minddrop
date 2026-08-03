import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { SetViewAreaEventData } from '@minddrop/events';
import { TabSetsStore } from '../TabSetsStore';
import { getSet } from '../getSet';
import { newTab } from '../newTab';
import { recordViewArea } from './recordViewArea';

const VIEW_AREA_ID = 'test-set';

function state(
  main: SetViewAreaEventData['main'],
  split: SetViewAreaEventData['split'] = null,
  splitRatio = 50,
): SetViewAreaEventData {
  return { viewAreaId: VIEW_AREA_ID, main, split, splitRatio };
}

describe('recordViewArea', () => {
  beforeEach(() => {
    TabSetsStore.clear();
  });

  afterEach(() => {
    TabSetsStore.clear();
  });

  it('records the main view onto the active tab', () => {
    newTab(VIEW_AREA_ID);

    recordViewArea(VIEW_AREA_ID, state({ view: 'designs:view:studio' }));

    expect(getSet(VIEW_AREA_ID).tabs[0].main?.view).toBe('designs:view:studio');
  });

  it('clears the split when recording a state without one', () => {
    newTab(VIEW_AREA_ID);
    recordViewArea(VIEW_AREA_ID, state({ view: 'a' }, { view: 'b' }, 60));
    recordViewArea(VIEW_AREA_ID, state({ view: 'a' }));

    expect(getSet(VIEW_AREA_ID).tabs[0].split).toBeNull();
  });

  it('creates an active tab when none exists', () => {
    recordViewArea(VIEW_AREA_ID, state({ view: 'a' }));

    const { tabs, activeTabId } = getSet(VIEW_AREA_ID);

    expect(tabs).toHaveLength(1);
    expect(activeTabId).not.toBeNull();
  });
});
