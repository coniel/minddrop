import { FC } from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@minddrop/test-utils';
import { ViewSessions, Views } from '@minddrop/views';
import { Slot } from './Slot';

const VIEW_AREA_ID = 'test-set';
const ClaimedFillId = 'test:sidebar:claimed';
const FallbackFillId = 'test:sidebar:fallback';

interface FillProps {
  /**
   * A label rendered by the fill, to assert its props.
   */
  label?: string;
}

const ClaimedFill: FC<FillProps> = ({ label = 'none' }) => (
  <div data-testid="claimed">{label}</div>
);

const FallbackFill: FC<FillProps> = ({ label = 'none' }) => (
  <div data-testid="fallback">{label}</div>
);

/**
 * Renders the slot within a pane of the test view area.
 */
function renderSlot(fallback?: Parameters<typeof Slot>[0]['fallback']) {
  return render(
    <Views.PaneProvider viewAreaId={VIEW_AREA_ID} pane="main">
      <Slot id="sidebar" fallback={fallback} />
    </Views.PaneProvider>,
  );
}

/**
 * Creates a session in the test view area, claiming the sidebar slot
 * when a fill id is given.
 */
function createSession(fillId?: string, props?: Record<string, unknown>) {
  ViewSessions.create(VIEW_AREA_ID);

  const session = ViewSessions.getActive(VIEW_AREA_ID)!;

  if (fillId) {
    ViewSessions.claimSlot(VIEW_AREA_ID, session.id, 'sidebar', {
      fill: fillId,
      props,
    });
  }
}

describe('Slot', () => {
  beforeEach(() => {
    Views.registerFill('sidebar', {
      id: ClaimedFillId,
      component: ClaimedFill,
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

  it('renders the claimed fill with the claim props', () => {
    createSession(ClaimedFillId, { label: 'claimed props' });

    renderSlot(FallbackFillId);

    expect(screen.getByTestId('claimed').textContent).toBe('claimed props');
    expect(screen.queryByTestId('fallback')).toBeNull();
  });

  it('falls back when the session claims nothing', () => {
    createSession();

    renderSlot(FallbackFillId);

    expect(screen.getByTestId('fallback')).toBeDefined();
  });

  it('falls back when the claimed fill is not registered', () => {
    createSession('test:sidebar:unregistered');

    renderSlot(FallbackFillId);

    expect(screen.getByTestId('fallback')).toBeDefined();
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

    ViewSessions.claimSlot(
      Views.constants.DefaultAreaId,
      session.id,
      'sidebar',
      {
        fill: ClaimedFillId,
      },
    );

    render(<Slot id="sidebar" fallback={FallbackFillId} />);

    expect(screen.getByTestId('claimed')).toBeDefined();
  });
});
