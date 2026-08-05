import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  CloseViewEvent,
  Events,
  UpdateViewEvent,
  ViewAreaChangedEvent,
  ViewAreaChangedEventData,
} from '@minddrop/events';
import { TabSetsStore } from '../TabSetsStore';
import { getSet } from '../getSet';
import { newTab } from '../newTab';
import { initializeTabsSyncListeners } from './initializeTabsSyncListeners';

const VIEW_AREA_ID = 'test-set';
const OTHER_VIEW_AREA_ID = 'other-set';

let cleanup: VoidFunction;

function changed(
  viewAreaId: string,
  main: ViewAreaChangedEventData['main'],
  split: ViewAreaChangedEventData['split'] = null,
  splitRatio = 50,
): ViewAreaChangedEventData {
  return { viewAreaId, main, split, splitRatio };
}

describe('initializeTabsSyncListeners', () => {
  beforeEach(() => {
    TabSetsStore.clear();
    cleanup = initializeTabsSyncListeners(VIEW_AREA_ID);
  });

  afterEach(() => {
    cleanup();
    TabSetsStore.clear();
  });

  it('records view area changes onto the active tab', () => {
    newTab(VIEW_AREA_ID);

    Events.dispatch<ViewAreaChangedEventData>(
      ViewAreaChangedEvent,
      changed(VIEW_AREA_ID, { view: 'db:view', id: 'db:a' }),
    );

    expect(getSet(VIEW_AREA_ID).tabs[0].main?.id).toBe('db:a');
  });

  it('ignores view area changes from another view area', () => {
    newTab(VIEW_AREA_ID);

    Events.dispatch<ViewAreaChangedEventData>(
      ViewAreaChangedEvent,
      changed(OTHER_VIEW_AREA_ID, { view: 'db:view', id: 'db:a' }),
    );

    expect(getSet(VIEW_AREA_ID).tabs[0].main).toBeNull();
  });

  it('updates tabs when a view changes', () => {
    newTab(VIEW_AREA_ID);
    Events.dispatch<ViewAreaChangedEventData>(
      ViewAreaChangedEvent,
      changed(VIEW_AREA_ID, { view: 'db:view', id: 'db:a', title: 'A' }),
    );

    Events.dispatch(UpdateViewEvent, {
      viewAreaId: VIEW_AREA_ID,
      id: 'db:a',
      newId: 'db:b',
      title: 'B',
    });

    expect(getSet(VIEW_AREA_ID).tabs[0].main?.id).toBe('db:b');
    expect(getSet(VIEW_AREA_ID).tabs[0].main?.title).toBe('B');
  });

  it('ignores view updates targeting another view area', () => {
    newTab(VIEW_AREA_ID);
    Events.dispatch<ViewAreaChangedEventData>(
      ViewAreaChangedEvent,
      changed(VIEW_AREA_ID, { view: 'db:view', id: 'db:a', title: 'A' }),
    );

    Events.dispatch(UpdateViewEvent, {
      viewAreaId: OTHER_VIEW_AREA_ID,
      id: 'db:a',
      newId: 'db:b',
      title: 'B',
    });

    expect(getSet(VIEW_AREA_ID).tabs[0].main?.id).toBe('db:a');
  });

  it('closes tabs when a view closes', () => {
    newTab(VIEW_AREA_ID);
    Events.dispatch<ViewAreaChangedEventData>(
      ViewAreaChangedEvent,
      changed(VIEW_AREA_ID, { view: 'db:view', id: 'db:a' }),
    );

    Events.dispatch(CloseViewEvent, { viewAreaId: VIEW_AREA_ID, id: 'db:a' });

    expect(getSet(VIEW_AREA_ID).tabs).toHaveLength(0);
  });

  it('ignores view closes targeting another view area', () => {
    newTab(VIEW_AREA_ID);
    Events.dispatch<ViewAreaChangedEventData>(
      ViewAreaChangedEvent,
      changed(VIEW_AREA_ID, { view: 'db:view', id: 'db:a' }),
    );

    Events.dispatch(CloseViewEvent, {
      viewAreaId: OTHER_VIEW_AREA_ID,
      id: 'db:a',
    });

    expect(getSet(VIEW_AREA_ID).tabs).toHaveLength(1);
  });

  it('builds up navigation history from view area changes', () => {
    newTab(VIEW_AREA_ID);

    Events.dispatch<ViewAreaChangedEventData>(
      ViewAreaChangedEvent,
      changed(VIEW_AREA_ID, { view: 'db:view', id: 'db:a' }),
    );
    Events.dispatch<ViewAreaChangedEventData>(
      ViewAreaChangedEvent,
      changed(VIEW_AREA_ID, { view: 'db:view', id: 'db:b' }),
    );

    const tab = getSet(VIEW_AREA_ID).tabs[0];

    expect(tab.backHistory).toHaveLength(1);
    expect(tab.backHistory?.[0].main?.id).toBe('db:a');
  });

  it('patches history entries when a view changes', () => {
    newTab(VIEW_AREA_ID);
    Events.dispatch<ViewAreaChangedEventData>(
      ViewAreaChangedEvent,
      changed(VIEW_AREA_ID, { view: 'db:view', id: 'db:a', title: 'A' }),
    );
    Events.dispatch<ViewAreaChangedEventData>(
      ViewAreaChangedEvent,
      changed(VIEW_AREA_ID, { view: 'db:view', id: 'db:b' }),
    );

    Events.dispatch(UpdateViewEvent, {
      viewAreaId: VIEW_AREA_ID,
      id: 'db:a',
      newId: 'db:a2',
      title: 'A2',
    });

    const historyEntry = getSet(VIEW_AREA_ID).tabs[0].backHistory?.[0];

    expect(historyEntry?.main?.id).toBe('db:a2');
    expect(historyEntry?.main?.title).toBe('A2');
  });

  it('prunes history entries when a view closes', () => {
    newTab(VIEW_AREA_ID);
    Events.dispatch<ViewAreaChangedEventData>(
      ViewAreaChangedEvent,
      changed(VIEW_AREA_ID, { view: 'db:view', id: 'db:a' }),
    );
    Events.dispatch<ViewAreaChangedEventData>(
      ViewAreaChangedEvent,
      changed(VIEW_AREA_ID, { view: 'db:view', id: 'db:b' }),
    );

    Events.dispatch(CloseViewEvent, { viewAreaId: VIEW_AREA_ID, id: 'db:a' });

    expect(getSet(VIEW_AREA_ID).tabs[0].backHistory).toHaveLength(0);
  });

  it('stops recording after cleanup', () => {
    newTab(VIEW_AREA_ID);
    cleanup();

    Events.dispatch<ViewAreaChangedEventData>(
      ViewAreaChangedEvent,
      changed(VIEW_AREA_ID, { view: 'db:view', id: 'db:a' }),
    );

    expect(getSet(VIEW_AREA_ID).tabs[0].main).toBeNull();
  });
});
