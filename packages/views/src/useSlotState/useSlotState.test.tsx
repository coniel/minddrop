import { FC } from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, renderHook } from '@minddrop/test-utils';
import { SlotFillsStore } from '../SlotFillsStore';
import { ViewPaneProvider } from '../ViewPaneContext';
import { registerFill } from '../registerFill';
import { ViewSessionsStore } from '../sessions/ViewSessionsStore';
import { createViewSession } from '../sessions/createViewSession';
import { getActiveViewSession } from '../sessions/getActiveViewSession';
import { setSlot } from '../sessions/setSlot';
import { SessionSlot } from '../types';
import { useSlotState } from './useSlotState';

const VIEW_AREA_ID = 'test-set';
const SessionFillId = 'test:sidebar:session';
const FallbackFillId = 'test:sidebar:fallback';

const SessionFill: FC = () => <div />;
const FallbackFill: FC = () => <div />;

/**
 * Renders the hook within a pane of the test view area.
 */
function renderSlotState(fallback?: SessionSlot | string) {
  return renderHook(() => useSlotState('sidebar', fallback), {
    wrapper: ({ children }) => (
      <ViewPaneProvider viewAreaId={VIEW_AREA_ID} pane="main">
        {children}
      </ViewPaneProvider>
    ),
  });
}

/**
 * Creates a session in the test view area, setting the given state
 * for the sidebar slot.
 */
function createSession(state?: SessionSlot) {
  createViewSession(VIEW_AREA_ID);

  const session = getActiveViewSession(VIEW_AREA_ID)!;

  if (state) {
    setSlot(VIEW_AREA_ID, session.id, 'sidebar', state);
  }
}

describe('useSlotState', () => {
  beforeEach(() => {
    registerFill('sidebar', { id: SessionFillId, component: SessionFill });
    registerFill('sidebar', { id: FallbackFillId, component: FallbackFill });
  });

  afterEach(() => {
    cleanup();
    SlotFillsStore.clear();
    ViewSessionsStore.clear();
  });

  it("returns the active session's slot state", () => {
    createSession({ fill: SessionFillId, props: { entryId: 'a' } });

    const { result } = renderSlotState(FallbackFillId);

    expect(result.current.fill).toBe(SessionFillId);
    expect(result.current.props).toEqual({ entryId: 'a' });
    expect(result.current.hidden).toBe(false);
    expect(result.current.resolved?.fill.component).toBe(SessionFill);
    expect(result.current.resolved?.props).toEqual({ entryId: 'a' });
  });

  it('resolves the fallback when the session names no fill', () => {
    createSession();

    const { result } = renderSlotState({
      fill: FallbackFillId,
      props: { entryId: 'b' },
    });

    expect(result.current.fill).toBeUndefined();
    expect(result.current.resolved?.fill.component).toBe(FallbackFill);
    expect(result.current.resolved?.props).toEqual({ entryId: 'b' });
  });

  it('resolves nothing when the slot is hidden', () => {
    createSession({ fill: SessionFillId, hidden: true });

    const { result } = renderSlotState(FallbackFillId);

    expect(result.current.hidden).toBe(true);
    expect(result.current.fill).toBe(SessionFillId);
    expect(result.current.resolved).toBeNull();
  });

  it('resolves nothing without a fallback', () => {
    createSession();

    const { result } = renderSlotState();

    expect(result.current.resolved).toBeNull();
  });
});
