import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { EventData, EventName, Events } from '@minddrop/events';
import {
  CloseViewEvent,
  DefaultViewName,
  UpdateViewEvent,
  ViewAreaChangedEvent,
  ViewAreaChangedEventData,
} from '@minddrop/views';
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

/**
 * Dispatches an event and waits for its queued listeners to run.
 *
 * @param name - The name of the event.
 * @param data - The data associated with the event.
 */
async function dispatch<TEvent extends EventName>(
  name: TEvent,
  data?: EventData<TEvent>,
): Promise<void> {
  Events.dispatch(name, data);

  await new Promise((resolve) => {
    setTimeout(resolve);
  });
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

  it('records view area changes onto the active tab', async () => {
    newTab(VIEW_AREA_ID);

    await dispatch(
      ViewAreaChangedEvent,
      changed(VIEW_AREA_ID, { view: 'db:view', id: 'db:a' }),
    );

    expect(getSet(VIEW_AREA_ID).tabs[0].main?.id).toBe('db:a');
  });

  it('ignores view area changes from another view area', async () => {
    newTab(VIEW_AREA_ID);

    await dispatch(
      ViewAreaChangedEvent,
      changed(OTHER_VIEW_AREA_ID, { view: 'db:view', id: 'db:a' }),
    );

    expect(getSet(VIEW_AREA_ID).tabs[0].main?.view).toBe(DefaultViewName);
  });

  it('updates tabs when a view changes', async () => {
    newTab(VIEW_AREA_ID);
    await dispatch(
      ViewAreaChangedEvent,
      changed(VIEW_AREA_ID, { view: 'db:view', id: 'db:a', title: 'A' }),
    );

    await dispatch(UpdateViewEvent, {
      viewAreaId: VIEW_AREA_ID,
      id: 'db:a',
      newId: 'db:b',
      title: 'B',
    });

    expect(getSet(VIEW_AREA_ID).tabs[0].main?.id).toBe('db:b');
    expect(getSet(VIEW_AREA_ID).tabs[0].main?.title).toBe('B');
  });

  it('ignores view updates targeting another view area', async () => {
    newTab(VIEW_AREA_ID);
    await dispatch(
      ViewAreaChangedEvent,
      changed(VIEW_AREA_ID, { view: 'db:view', id: 'db:a', title: 'A' }),
    );

    await dispatch(UpdateViewEvent, {
      viewAreaId: OTHER_VIEW_AREA_ID,
      id: 'db:a',
      newId: 'db:b',
      title: 'B',
    });

    expect(getSet(VIEW_AREA_ID).tabs[0].main?.id).toBe('db:a');
  });

  it('closes tabs when a view closes', async () => {
    newTab(VIEW_AREA_ID);
    await dispatch(
      ViewAreaChangedEvent,
      changed(VIEW_AREA_ID, { view: 'db:view', id: 'db:a' }),
    );

    await dispatch(CloseViewEvent, { viewAreaId: VIEW_AREA_ID, id: 'db:a' });

    expect(getSet(VIEW_AREA_ID).tabs).toHaveLength(0);
  });

  it('ignores view closes targeting another view area', async () => {
    newTab(VIEW_AREA_ID);
    await dispatch(
      ViewAreaChangedEvent,
      changed(VIEW_AREA_ID, { view: 'db:view', id: 'db:a' }),
    );

    await dispatch(CloseViewEvent, {
      viewAreaId: OTHER_VIEW_AREA_ID,
      id: 'db:a',
    });

    expect(getSet(VIEW_AREA_ID).tabs).toHaveLength(1);
  });

  it('builds up navigation history from view area changes', async () => {
    newTab(VIEW_AREA_ID);

    await dispatch(
      ViewAreaChangedEvent,
      changed(VIEW_AREA_ID, { view: 'db:view', id: 'db:a' }),
    );
    await dispatch(
      ViewAreaChangedEvent,
      changed(VIEW_AREA_ID, { view: 'db:view', id: 'db:b' }),
    );

    const tab = getSet(VIEW_AREA_ID).tabs[0];

    // The first entry is the search view the tab was opened on
    expect(tab.backHistory).toHaveLength(2);
    expect(tab.backHistory?.[1].main?.id).toBe('db:a');
  });

  it('patches history entries when a view changes', async () => {
    newTab(VIEW_AREA_ID);
    await dispatch(
      ViewAreaChangedEvent,
      changed(VIEW_AREA_ID, { view: 'db:view', id: 'db:a', title: 'A' }),
    );
    await dispatch(
      ViewAreaChangedEvent,
      changed(VIEW_AREA_ID, { view: 'db:view', id: 'db:b' }),
    );

    await dispatch(UpdateViewEvent, {
      viewAreaId: VIEW_AREA_ID,
      id: 'db:a',
      newId: 'db:a2',
      title: 'A2',
    });

    // The first entry is the search view the tab was opened on
    const historyEntry = getSet(VIEW_AREA_ID).tabs[0].backHistory?.[1];

    expect(historyEntry?.main?.id).toBe('db:a2');
    expect(historyEntry?.main?.title).toBe('A2');
  });

  it('prunes history entries when a view closes', async () => {
    newTab(VIEW_AREA_ID);
    await dispatch(
      ViewAreaChangedEvent,
      changed(VIEW_AREA_ID, { view: 'db:view', id: 'db:a' }),
    );
    await dispatch(
      ViewAreaChangedEvent,
      changed(VIEW_AREA_ID, { view: 'db:view', id: 'db:b' }),
    );

    await dispatch(CloseViewEvent, { viewAreaId: VIEW_AREA_ID, id: 'db:a' });

    // The search view the tab was opened on is not pruned
    expect(getSet(VIEW_AREA_ID).tabs[0].backHistory).toHaveLength(1);
  });

  it('stops recording after cleanup', async () => {
    newTab(VIEW_AREA_ID);
    cleanup();

    await dispatch(
      ViewAreaChangedEvent,
      changed(VIEW_AREA_ID, { view: 'db:view', id: 'db:a' }),
    );

    expect(getSet(VIEW_AREA_ID).tabs[0].main?.view).toBe(DefaultViewName);
  });
});
