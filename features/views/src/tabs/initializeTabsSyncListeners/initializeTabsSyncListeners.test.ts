import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  CloseMainContentViewEvent,
  Events,
  MainContentChangedEvent,
  MainContentChangedEventData,
  UpdateMainContentViewEvent,
} from '@minddrop/events';
import { TabSetsStore } from '../TabSetsStore';
import { getSet } from '../getSet';
import { newTab } from '../newTab';
import { initializeTabsSyncListeners } from './initializeTabsSyncListeners';

const SET_ID = 'test-set';

let cleanup: VoidFunction;

function changed(
  main: MainContentChangedEventData['main'],
  split: MainContentChangedEventData['split'] = null,
  splitRatio = 50,
): MainContentChangedEventData {
  return { main, split, splitRatio };
}

describe('initializeTabsSyncListeners', () => {
  beforeEach(() => {
    TabSetsStore.clear();
    cleanup = initializeTabsSyncListeners(SET_ID);
  });

  afterEach(() => {
    cleanup();
    TabSetsStore.clear();
  });

  it('records main content changes onto the active tab', () => {
    newTab(SET_ID);

    Events.dispatch<MainContentChangedEventData>(
      MainContentChangedEvent,
      changed({ view: 'db:view', id: 'db:a' }),
    );

    expect(getSet(SET_ID).tabs[0].main?.id).toBe('db:a');
  });

  it('updates tabs when a view changes', () => {
    newTab(SET_ID);
    Events.dispatch<MainContentChangedEventData>(
      MainContentChangedEvent,
      changed({ view: 'db:view', id: 'db:a', title: 'A' }),
    );

    Events.dispatch(UpdateMainContentViewEvent, {
      id: 'db:a',
      newId: 'db:b',
      title: 'B',
    });

    expect(getSet(SET_ID).tabs[0].main?.id).toBe('db:b');
    expect(getSet(SET_ID).tabs[0].main?.title).toBe('B');
  });

  it('closes tabs when a view closes', () => {
    newTab(SET_ID);
    Events.dispatch<MainContentChangedEventData>(
      MainContentChangedEvent,
      changed({ view: 'db:view', id: 'db:a' }),
    );

    Events.dispatch(CloseMainContentViewEvent, { id: 'db:a' });

    expect(getSet(SET_ID).tabs).toHaveLength(0);
  });

  it('stops recording after cleanup', () => {
    newTab(SET_ID);
    cleanup();

    Events.dispatch<MainContentChangedEventData>(
      MainContentChangedEvent,
      changed({ view: 'db:view', id: 'db:a' }),
    );

    expect(getSet(SET_ID).tabs[0].main).toBeNull();
  });
});
