import { FC } from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { EventData, EventName, Events } from '@minddrop/events';
import { act, cleanup, render, screen } from '@minddrop/test-utils';
import { ViewSessions, Views } from '@minddrop/views';
import { initializeViewSessionSyncListeners } from '../initializeViewSessionSyncListeners';
import { ViewRenderer } from './ViewRenderer';

const VIEW_AREA_ID = 'test-set';
const ViewAType = 'test:view:a';
const ViewBType = 'test:view:b';
const FillAId = 'test:sidebar:a';
const FillBId = 'test:sidebar:b';

const ViewA: FC = () => {
  Views.useSlot('sidebar', { fill: FillAId });

  return <div data-testid="view-a" />;
};

const ViewB: FC = () => {
  Views.useSlot('sidebar', { fill: FillBId });

  return <div data-testid="view-b" />;
};

let stopListeners: VoidFunction;

/**
 * Renders the view area and lets it restore the active session's
 * content, so that later opens are not overtaken by the restore.
 */
async function mountViewArea(): Promise<void> {
  render(<ViewRenderer viewAreaId={VIEW_AREA_ID} />);

  await act(settle);
}

/**
 * Dispatches an event and lets its listeners, and the renders and
 * effects they cause, run.
 *
 * @param name - The name of the event.
 * @param data - The data associated with the event.
 */
async function dispatch<TEvent extends EventName>(
  name: TEvent,
  data?: EventData<TEvent>,
): Promise<void> {
  await act(async () => {
    Events.dispatch(name, data);

    await settle();
  });
}

/**
 * Resolves once the queued listeners have run.
 */
function settle(): Promise<unknown> {
  return new Promise((resolve) => {
    setTimeout(resolve);
  });
}

/**
 * Opens one of the test views in the view area's main pane.
 *
 * @param view - The type of the view to open.
 */
function openView(view: string): Promise<void> {
  return dispatch(Views.events.Open, { viewAreaId: VIEW_AREA_ID, view });
}

describe('ViewRenderer', () => {
  beforeEach(() => {
    Views.register({ type: ViewAType, component: ViewA });
    Views.register({ type: ViewBType, component: ViewB });
    ViewSessions.create(VIEW_AREA_ID);
    stopListeners = initializeViewSessionSyncListeners(VIEW_AREA_ID);
  });

  afterEach(() => {
    cleanup();
    stopListeners();
    Views.Store.clear();
    ViewSessions.Store.clear();
  });

  it("applies the mounted view's slot default to its session", async () => {
    await mountViewArea();

    await openView(ViewAType);

    expect(screen.getByTestId('view-a')).toBeDefined();
    expect(ViewSessions.getActive(VIEW_AREA_ID)?.slots).toEqual({
      sidebar: { fill: FillAId },
    });
  });

  it("replaces the slot state with the next view's default", async () => {
    await mountViewArea();

    await openView(ViewAType);
    await openView(ViewBType);

    // The navigation reset the slot state before the mounted view
    // applied its own default.
    expect(ViewSessions.getActive(VIEW_AREA_ID)?.slots).toEqual({
      sidebar: { fill: FillBId },
    });
  });

  it('drops slot state set after mount when navigating away', async () => {
    await mountViewArea();

    await openView(ViewAType);
    await dispatch(Views.events.SetSlot, {
      viewAreaId: VIEW_AREA_ID,
      slotId: 'sidebar',
      hidden: true,
    });

    await openView(ViewBType);

    expect(ViewSessions.getActive(VIEW_AREA_ID)?.slots).toEqual({
      sidebar: { fill: FillBId },
    });
  });

  it('restores the slot state when navigating back', async () => {
    await mountViewArea();

    await openView(ViewAType);
    await dispatch(Views.events.SetSlot, {
      viewAreaId: VIEW_AREA_ID,
      slotId: 'sidebar',
      hidden: true,
    });
    await openView(ViewBType);

    await act(async () => {
      ViewSessions.goBack(VIEW_AREA_ID);

      await settle();
    });

    expect(ViewSessions.getActive(VIEW_AREA_ID)?.slots).toEqual({
      sidebar: { fill: FillAId, hidden: true },
    });
  });
});
