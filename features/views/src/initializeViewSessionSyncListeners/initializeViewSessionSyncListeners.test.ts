import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { EventData, EventName, Events } from '@minddrop/events';
import { ViewAreaChangedEventData, ViewSessions, Views } from '@minddrop/views';
import { initializeViewSessionSyncListeners } from './initializeViewSessionSyncListeners';

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

describe('initializeViewSessionSyncListeners', () => {
  beforeEach(() => {
    ViewSessions.Store.clear();
    cleanup = initializeViewSessionSyncListeners(VIEW_AREA_ID);
  });

  afterEach(() => {
    cleanup();
    ViewSessions.Store.clear();
  });

  it('records view area changes onto the active session', async () => {
    ViewSessions.create(VIEW_AREA_ID);

    await dispatch(
      Views.events.AreaChanged,
      changed(VIEW_AREA_ID, { view: 'db:view', id: 'db:a' }),
    );

    expect(ViewSessions.getAll(VIEW_AREA_ID)[0].main?.id).toBe('db:a');
  });

  it('ignores view area changes from another view area', async () => {
    ViewSessions.create(VIEW_AREA_ID);

    await dispatch(
      Views.events.AreaChanged,
      changed(OTHER_VIEW_AREA_ID, { view: 'db:view', id: 'db:a' }),
    );

    expect(ViewSessions.getAll(VIEW_AREA_ID)[0].main?.view).toBe(
      Views.constants.DefaultName,
    );
  });

  it('updates sessions when a view changes', async () => {
    ViewSessions.create(VIEW_AREA_ID);
    await dispatch(
      Views.events.AreaChanged,
      changed(VIEW_AREA_ID, { view: 'db:view', id: 'db:a', title: 'A' }),
    );

    await dispatch(Views.events.Update, {
      viewAreaId: VIEW_AREA_ID,
      id: 'db:a',
      newId: 'db:b',
      title: 'B',
    });

    expect(ViewSessions.getAll(VIEW_AREA_ID)[0].main?.id).toBe('db:b');
    expect(ViewSessions.getAll(VIEW_AREA_ID)[0].main?.title).toBe('B');
  });

  it('ignores view updates targeting another view area', async () => {
    ViewSessions.create(VIEW_AREA_ID);
    await dispatch(
      Views.events.AreaChanged,
      changed(VIEW_AREA_ID, { view: 'db:view', id: 'db:a', title: 'A' }),
    );

    await dispatch(Views.events.Update, {
      viewAreaId: OTHER_VIEW_AREA_ID,
      id: 'db:a',
      newId: 'db:b',
      title: 'B',
    });

    expect(ViewSessions.getAll(VIEW_AREA_ID)[0].main?.id).toBe('db:a');
  });

  it('closes sessions when a view closes', async () => {
    ViewSessions.create(VIEW_AREA_ID);
    await dispatch(
      Views.events.AreaChanged,
      changed(VIEW_AREA_ID, { view: 'db:view', id: 'db:a' }),
    );

    await dispatch(Views.events.Close, {
      viewAreaId: VIEW_AREA_ID,
      id: 'db:a',
    });

    expect(ViewSessions.getAll(VIEW_AREA_ID)).toHaveLength(0);
  });

  it('ignores view closes targeting another view area', async () => {
    ViewSessions.create(VIEW_AREA_ID);
    await dispatch(
      Views.events.AreaChanged,
      changed(VIEW_AREA_ID, { view: 'db:view', id: 'db:a' }),
    );

    await dispatch(Views.events.Close, {
      viewAreaId: OTHER_VIEW_AREA_ID,
      id: 'db:a',
    });

    expect(ViewSessions.getAll(VIEW_AREA_ID)).toHaveLength(1);
  });

  it('builds up navigation history from view area changes', async () => {
    ViewSessions.create(VIEW_AREA_ID);

    await dispatch(
      Views.events.AreaChanged,
      changed(VIEW_AREA_ID, { view: 'db:view', id: 'db:a' }),
    );
    await dispatch(
      Views.events.AreaChanged,
      changed(VIEW_AREA_ID, { view: 'db:view', id: 'db:b' }),
    );

    const session = ViewSessions.getAll(VIEW_AREA_ID)[0];

    // The first entry is the search view the session was opened on
    expect(session.backHistory).toHaveLength(2);
    expect(session.backHistory?.[1].main?.id).toBe('db:a');
  });

  it('patches history entries when a view changes', async () => {
    ViewSessions.create(VIEW_AREA_ID);
    await dispatch(
      Views.events.AreaChanged,
      changed(VIEW_AREA_ID, { view: 'db:view', id: 'db:a', title: 'A' }),
    );
    await dispatch(
      Views.events.AreaChanged,
      changed(VIEW_AREA_ID, { view: 'db:view', id: 'db:b' }),
    );

    await dispatch(Views.events.Update, {
      viewAreaId: VIEW_AREA_ID,
      id: 'db:a',
      newId: 'db:a2',
      title: 'A2',
    });

    // The first entry is the search view the session was opened on
    const historyEntry = ViewSessions.getAll(VIEW_AREA_ID)[0].backHistory?.[1];

    expect(historyEntry?.main?.id).toBe('db:a2');
    expect(historyEntry?.main?.title).toBe('A2');
  });

  it('prunes history entries when a view closes', async () => {
    ViewSessions.create(VIEW_AREA_ID);
    await dispatch(
      Views.events.AreaChanged,
      changed(VIEW_AREA_ID, { view: 'db:view', id: 'db:a' }),
    );
    await dispatch(
      Views.events.AreaChanged,
      changed(VIEW_AREA_ID, { view: 'db:view', id: 'db:b' }),
    );

    await dispatch(Views.events.Close, {
      viewAreaId: VIEW_AREA_ID,
      id: 'db:a',
    });

    // The search view the session was opened on is not pruned
    expect(ViewSessions.getAll(VIEW_AREA_ID)[0].backHistory).toHaveLength(1);
  });

  it('stops recording after cleanup', async () => {
    ViewSessions.create(VIEW_AREA_ID);
    cleanup();

    await dispatch(
      Views.events.AreaChanged,
      changed(VIEW_AREA_ID, { view: 'db:view', id: 'db:a' }),
    );

    expect(ViewSessions.getAll(VIEW_AREA_ID)[0].main?.view).toBe(
      Views.constants.DefaultName,
    );
  });
});
