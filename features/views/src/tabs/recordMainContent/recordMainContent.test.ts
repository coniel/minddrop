import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { SetMainContentEventData } from '@minddrop/events';
import { TabSetsStore } from '../TabSetsStore';
import { getSet } from '../getSet';
import { newTab } from '../newTab';
import { recordMainContent } from './recordMainContent';

const SET_ID = 'test-set';

function state(
  main: SetMainContentEventData['main'],
  split: SetMainContentEventData['split'] = null,
  splitRatio = 50,
): SetMainContentEventData {
  return { main, split, splitRatio };
}

describe('recordMainContent', () => {
  beforeEach(() => {
    TabSetsStore.clear();
  });

  afterEach(() => {
    TabSetsStore.clear();
  });

  it('records the main view onto the active tab', () => {
    newTab(SET_ID);

    recordMainContent(SET_ID, state({ view: 'designs:view:studio' }));

    expect(getSet(SET_ID).tabs[0].main?.view).toBe('designs:view:studio');
  });

  it('clears the split when recording a state without one', () => {
    newTab(SET_ID);
    recordMainContent(SET_ID, state({ view: 'a' }, { view: 'b' }, 60));
    recordMainContent(SET_ID, state({ view: 'a' }));

    expect(getSet(SET_ID).tabs[0].split).toBeNull();
  });

  it('creates an active tab when none exists', () => {
    recordMainContent(SET_ID, state({ view: 'a' }));

    const { tabs, activeTabId } = getSet(SET_ID);

    expect(tabs).toHaveLength(1);
    expect(activeTabId).not.toBeNull();
  });
});
