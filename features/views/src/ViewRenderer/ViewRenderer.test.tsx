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
const SessionViewType = 'test:view:session';
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

// Renders the session it is rendered under, which its state is
// recorded onto.
const SessionView: FC = () => (
  <div data-testid="session">{Views.useSession()}</div>
);

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

/**
 * Opens a second session and returns to the first, leaving both
 * open with the first one active.
 *
 * @returns The id of the second session.
 */
async function createSecondSession(): Promise<string> {
  const first = ViewSessions.getActive(VIEW_AREA_ID)?.id ?? '';

  await act(async () => {
    ViewSessions.create(VIEW_AREA_ID);

    await settle();
  });

  const second = ViewSessions.getActive(VIEW_AREA_ID)?.id ?? '';

  await act(async () => {
    ViewSessions.setActive(VIEW_AREA_ID, first);

    await settle();
  });

  return second;
}

/**
 * Makes a session the active one without restoring its content into
 * the view area, reproducing the window between the two.
 *
 * @param sessionId - The id of the session to activate.
 */
async function activateWithoutRestoring(sessionId: string): Promise<void> {
  await act(async () => {
    ViewSessions.Store.update(VIEW_AREA_ID, { activeSessionId: sessionId });

    await settle();
  });
}

describe('ViewRenderer', () => {
  beforeEach(() => {
    Views.register({ type: ViewAType, component: ViewA });
    Views.register({ type: ViewBType, component: ViewB });
    Views.register({ type: SessionViewType, component: SessionView });
    ViewSessions.create(VIEW_AREA_ID);
    stopListeners = initializeViewSessionSyncListeners(VIEW_AREA_ID);
  });

  afterEach(() => {
    cleanup();
    stopListeners();
    Views.Store.clear();
    ViewSessions.Store.clear();
  });

  it('renders the views under the session they were restored from', async () => {
    await mountViewArea();
    await openView(SessionViewType);

    const rendered = ViewSessions.getActive(VIEW_AREA_ID);
    const other = await createSecondSession();

    // The other session becomes active without its state reaching
    // the area, as it does between a session being activated and
    // its content being restored.
    await activateWithoutRestoring(other);

    expect(screen.getByTestId('session').textContent).toBe(rendered?.id);
  });

  it('records a subview announced before the next session arrives onto the rendered session', async () => {
    await mountViewArea();
    await openView(ViewAType);

    const rendered = ViewSessions.getActive(VIEW_AREA_ID);
    const other = await createSecondSession();

    await activateWithoutRestoring(other);

    // The rendered view announces a subview, as a view labelling
    // its tab on mount does.
    await dispatch(Views.events.SetSubview, {
      viewAreaId: VIEW_AREA_ID,
      subview: { id: 'test:subview' },
    });

    expect(
      ViewSessions.get(VIEW_AREA_ID, rendered?.id ?? '')?.main?.subview?.id,
    ).toBe('test:subview');
    expect(
      ViewSessions.get(VIEW_AREA_ID, other)?.main?.subview,
    ).toBeUndefined();
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
