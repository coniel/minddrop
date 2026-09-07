import { FC } from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@minddrop/test-utils';
import { SessionSlot, ViewSessions, Views } from '@minddrop/views';
import { Slot } from './Slot';

const VIEW_AREA_ID = 'test-set';
const SessionFillId = 'test:sidebar:session';
const FallbackFillId = 'test:sidebar:fallback';

interface FillProps {
  /**
   * A label rendered by the fill, to assert its props.
   */
  label?: string;
}

const SessionFill: FC<FillProps> = ({ label = 'none' }) => (
  <div data-testid="session">{label}</div>
);

const FallbackFill: FC<FillProps> = ({ label = 'none' }) => (
  <div data-testid="fallback">{label}</div>
);

/**
 * Renders the slot within a pane of the test view area.
 */
function renderSlot(fallback?: SessionSlot | string) {
  return render(
    <Views.PaneProvider viewAreaId={VIEW_AREA_ID} pane="main">
      <Slot id="sidebar" fallback={fallback} />
    </Views.PaneProvider>,
  );
}

/**
 * Creates a session in the test view area, setting the given state
 * for the sidebar slot.
 */
function createSession(state?: SessionSlot) {
  ViewSessions.create(VIEW_AREA_ID);

  const session = ViewSessions.getActive(VIEW_AREA_ID)!;

  if (state) {
    ViewSessions.setSlot(VIEW_AREA_ID, session.id, 'sidebar', state);
  }
}

describe('Slot', () => {
  beforeEach(() => {
    Views.registerFill('sidebar', {
      id: SessionFillId,
      component: SessionFill,
    });
    Views.registerFill('sidebar', {
      id: FallbackFillId,
      component: FallbackFill,
    });
  });

  afterEach(() => {
    cleanup();
    Views.FillsStore.clear();
    ViewSessions.Store.clear();
  });

  it("renders the session's fill with its props", () => {
    createSession({ fill: SessionFillId, props: { label: 'session props' } });

    renderSlot(FallbackFillId);

    expect(screen.getByTestId('session').textContent).toBe('session props');
    expect(screen.queryByTestId('fallback')).toBeNull();
  });

  it('falls back when the session names no fill', () => {
    createSession();

    renderSlot(FallbackFillId);

    expect(screen.getByTestId('fallback')).toBeDefined();
  });

  it('falls back when the named fill is not registered', () => {
    createSession({ fill: 'test:sidebar:unregistered' });

    renderSlot(FallbackFillId);

    expect(screen.getByTestId('fallback')).toBeDefined();
  });

  it('renders nothing when the session hides the slot', () => {
    createSession({ fill: SessionFillId, hidden: true });

    const { container } = renderSlot(FallbackFillId);

    expect(container.innerHTML).toBe('');
  });

  it('renders nothing when the session hides a slot it has no fill for', () => {
    createSession({ hidden: true });

    const { container } = renderSlot(FallbackFillId);

    expect(container.innerHTML).toBe('');
  });

  it('renders the fallback with its props in object form', () => {
    createSession();

    renderSlot({ fill: FallbackFillId, props: { label: 'fallback props' } });

    expect(screen.getByTestId('fallback').textContent).toBe('fallback props');
  });

  it('renders the fallback without props in string form', () => {
    createSession();

    renderSlot(FallbackFillId);

    expect(screen.getByTestId('fallback').textContent).toBe('none');
  });

  it('renders nothing without a fallback', () => {
    createSession();

    const { container } = renderSlot();

    expect(container.innerHTML).toBe('');
  });

  it('reads the main view area outside of a pane', () => {
    ViewSessions.create(Views.constants.DefaultAreaId);

    const session = ViewSessions.getActive(Views.constants.DefaultAreaId)!;

    ViewSessions.setSlot(Views.constants.DefaultAreaId, session.id, 'sidebar', {
      fill: SessionFillId,
    });

    render(<Slot id="sidebar" fallback={FallbackFillId} />);

    expect(screen.getByTestId('session')).toBeDefined();
  });
});
