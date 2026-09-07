import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, renderHook } from '@minddrop/test-utils';
import { ViewSessions, Views } from '@minddrop/views';
import { useSlot } from './useSlot';

const VIEW_AREA_ID = 'test-set';
const FillId = 'test:sidebar:fill';

let sessionId: string;

/**
 * Renders the hook within the given session of the test view area.
 */
function renderSlotHook(
  props?: Record<string, unknown>,
  boundSessionId: string = sessionId,
) {
  return renderHook(
    (hookProps: Record<string, unknown> | undefined) =>
      useSlot('sidebar', FillId, hookProps),
    {
      initialProps: props,
      wrapper: ({ children }) => (
        <Views.PaneProvider viewAreaId={VIEW_AREA_ID} pane="main">
          <Views.SessionProvider sessionId={boundSessionId}>
            {children}
          </Views.SessionProvider>
        </Views.PaneProvider>
      ),
    },
  );
}

describe('useSlot', () => {
  beforeEach(() => {
    ViewSessions.create(VIEW_AREA_ID);
    sessionId = ViewSessions.getActive(VIEW_AREA_ID)!.id;
  });

  afterEach(() => {
    cleanup();
    ViewSessions.Store.clear();
  });

  it('claims the slot while mounted', () => {
    renderSlotHook({ entryId: 'a' });

    expect(ViewSessions.get(VIEW_AREA_ID, sessionId)?.slots).toEqual({
      sidebar: { fill: FillId, props: { entryId: 'a' } },
    });
  });

  it('releases the slot on unmount', () => {
    const { unmount } = renderSlotHook();

    unmount();

    expect(ViewSessions.get(VIEW_AREA_ID, sessionId)?.slots).toEqual({});
  });

  it("claims the slot for the provider's session, active or not", () => {
    // Open a second session, making it the active one
    ViewSessions.create(VIEW_AREA_ID);

    renderSlotHook(undefined, sessionId);

    expect(ViewSessions.get(VIEW_AREA_ID, sessionId)?.slots).toEqual({
      sidebar: { fill: FillId },
    });
    expect(ViewSessions.getActive(VIEW_AREA_ID)?.slots).toBeUndefined();
  });

  it('skips rewrites for equal props', () => {
    const { rerender } = renderSlotHook({ entryId: 'a' });

    const claimed = ViewSessions.get(VIEW_AREA_ID, sessionId);

    // A new but equal props object
    rerender({ entryId: 'a' });

    expect(ViewSessions.get(VIEW_AREA_ID, sessionId)).toBe(claimed);
  });

  it('re-claims the slot when the props change', () => {
    const { rerender } = renderSlotHook({ entryId: 'a' });

    rerender({ entryId: 'b' });

    expect(ViewSessions.get(VIEW_AREA_ID, sessionId)?.slots).toEqual({
      sidebar: { fill: FillId, props: { entryId: 'b' } },
    });
  });

  it('does nothing outside of a session', () => {
    renderHook(() => useSlot('sidebar', FillId));

    expect(ViewSessions.get(VIEW_AREA_ID, sessionId)?.slots).toBeUndefined();
  });
});
