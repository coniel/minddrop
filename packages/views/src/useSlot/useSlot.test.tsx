import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, renderHook } from '@minddrop/test-utils';
import { ViewPaneProvider } from '../ViewPaneContext';
import { ViewSessionProvider } from '../ViewSessionContext';
import { ViewSessionsStore } from '../sessions/ViewSessionsStore';
import { createViewSession } from '../sessions/createViewSession';
import { getActiveViewSession } from '../sessions/getActiveViewSession';
import { getViewSession } from '../sessions/getViewSession';
import { setSlot } from '../sessions/setSlot';
import { SessionSlot } from '../types';
import { useSlot } from './useSlot';

const VIEW_AREA_ID = 'test-set';
const FillId = 'test:sidebar:fill';

let sessionId: string;

/**
 * Renders the hook within the given session of the test view area.
 */
function renderSlotHook(
  state: SessionSlot = { fill: FillId },
  boundSessionId: string = sessionId,
) {
  return renderHook((hookState: SessionSlot) => useSlot('sidebar', hookState), {
    initialProps: state,
    wrapper: ({ children }) => (
      <ViewPaneProvider viewAreaId={VIEW_AREA_ID} pane="main">
        <ViewSessionProvider sessionId={boundSessionId}>
          {children}
        </ViewSessionProvider>
      </ViewPaneProvider>
    ),
  });
}

describe('useSlot', () => {
  beforeEach(() => {
    createViewSession(VIEW_AREA_ID);
    sessionId = getActiveViewSession(VIEW_AREA_ID)!.id;
  });

  afterEach(() => {
    cleanup();
    ViewSessionsStore.clear();
  });

  it('sets the slot state when the session has none', () => {
    renderSlotHook({ fill: FillId, props: { entryId: 'a' }, hidden: true });

    expect(getViewSession(VIEW_AREA_ID, sessionId)?.slots).toEqual({
      sidebar: { fill: FillId, props: { entryId: 'a' }, hidden: true },
    });
  });

  it('leaves an existing slot state alone', () => {
    setSlot(VIEW_AREA_ID, sessionId, 'sidebar', {
      fill: 'test:sidebar:other',
    });

    renderSlotHook({ fill: FillId });

    expect(getViewSession(VIEW_AREA_ID, sessionId)?.slots).toEqual({
      sidebar: { fill: 'test:sidebar:other' },
    });
  });

  it('keeps the slot state on unmount', () => {
    const { unmount } = renderSlotHook();

    unmount();

    expect(getViewSession(VIEW_AREA_ID, sessionId)?.slots).toEqual({
      sidebar: { fill: FillId },
    });
  });

  it("fills the slot for the provider's session, active or not", () => {
    // Open a second session, making it the active one
    createViewSession(VIEW_AREA_ID);

    renderSlotHook({ fill: FillId }, sessionId);

    expect(getViewSession(VIEW_AREA_ID, sessionId)?.slots).toEqual({
      sidebar: { fill: FillId },
    });
    expect(getActiveViewSession(VIEW_AREA_ID)?.slots).toBeUndefined();
  });

  it('skips rewrites for equal state', () => {
    const { rerender } = renderSlotHook({ fill: FillId, props: { id: 'a' } });

    const filled = getViewSession(VIEW_AREA_ID, sessionId);

    // A new but equal state object
    rerender({ fill: FillId, props: { id: 'a' } });

    expect(getViewSession(VIEW_AREA_ID, sessionId)).toBe(filled);
  });

  it('does not apply a changed default to a filled slot', () => {
    const { rerender } = renderSlotHook({ fill: FillId, props: { id: 'a' } });

    rerender({ fill: FillId, props: { id: 'b' } });

    expect(getViewSession(VIEW_AREA_ID, sessionId)?.slots).toEqual({
      sidebar: { fill: FillId, props: { id: 'a' } },
    });
  });

  it('does nothing outside of a session', () => {
    renderHook(() => useSlot('sidebar', { fill: FillId }));

    expect(getViewSession(VIEW_AREA_ID, sessionId)?.slots).toBeUndefined();
  });
});
