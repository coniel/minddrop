import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@minddrop/test-utils';
import { useHoverMenu } from './useHoverMenu';

// Long enough for the close delay to elapse
const PastCloseDelay = 200;

/**
 * Renders a trigger and the popup it opens, both marked as one
 * menu, with the menu's state shown alongside them.
 */
const TestMenu: React.FC = () => {
  const { open, setOpen, hoverProps } = useHoverMenu();

  return (
    <div>
      <button type="button" onClick={() => setOpen(true)} {...hoverProps}>
        trigger
      </button>
      {open && <div {...hoverProps}>popup</div>}
      <span>elsewhere</span>
      <span>{open ? 'open' : 'closed'}</span>
    </div>
  );
};

/**
 * Renders the menu and opens it.
 */
function renderMenu() {
  render(<TestMenu />);

  fireEvent.click(screen.getByText('trigger'));
}

describe('useHoverMenu', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    cleanup();
  });

  it('closes once the pointer leaves the menu', () => {
    renderMenu();

    fireEvent.pointerLeave(screen.getByText('trigger'), {
      relatedTarget: screen.getByText('elsewhere'),
    });

    act(() => {
      vi.advanceTimersByTime(PastCloseDelay);
    });

    expect(screen.getByText('closed')).toBeInTheDocument();
  });

  it('stays open while the pointer crosses to the popup', () => {
    renderMenu();

    fireEvent.pointerLeave(screen.getByText('trigger'), {
      relatedTarget: screen.getByText('popup'),
    });

    act(() => {
      vi.advanceTimersByTime(PastCloseDelay);
    });

    expect(screen.getByText('open')).toBeInTheDocument();
  });

  it('stays open for a pointer which comes back', () => {
    renderMenu();

    fireEvent.pointerLeave(screen.getByText('trigger'), {
      relatedTarget: screen.getByText('elsewhere'),
    });
    fireEvent.pointerEnter(screen.getByText('trigger'));

    act(() => {
      vi.advanceTimersByTime(PastCloseDelay);
    });

    expect(screen.getByText('open')).toBeInTheDocument();
  });
});
