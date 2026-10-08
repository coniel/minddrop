import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@minddrop/test-utils';
import { PopoverRootChangeEventDetails } from '../../Popover';
import { useHoverMenu } from './useHoverMenu';

// Long enough for the close delay to elapse
const PastCloseDelay = 200;

/**
 * Builds the details of a popover close for the given reason.
 *
 * @param reason - The reason the popover closes for.
 * @returns The close's details.
 */
function closeDetails(reason: PopoverRootChangeEventDetails['reason']) {
  return { reason } as PopoverRootChangeEventDetails;
}

/**
 * Renders a hover menu with buttons driving it as a popover would.
 */
const TestMenu: React.FC = () => {
  const { open, setOpen, hoverMenu, hoverProps } = useHoverMenu();

  return (
    <div>
      <button type="button" onClick={() => setOpen(true)} {...hoverProps}>
        trigger
      </button>
      {open && (
        <div {...hoverProps}>
          popup
          <input aria-label="field" />
        </div>
      )}
      <button type="button" onClick={hoverMenu.lock}>
        lock
      </button>
      <button
        type="button"
        onClick={() => setOpen(false, closeDetails('trigger-hover'))}
      >
        hover close
      </button>
      <button
        type="button"
        onClick={() => setOpen(false, closeDetails('outside-press'))}
      >
        outside close
      </button>
      <span>elsewhere</span>
      <input aria-label="outside field" />
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

/**
 * Moves the pointer off the menu to somewhere outside it.
 */
function leaveMenu() {
  fireEvent.pointerLeave(screen.getByText('trigger'), {
    relatedTarget: screen.getByText('elsewhere'),
  });
}

/**
 * Focuses the field inside the popup.
 */
function focusField() {
  act(() => {
    screen.getByLabelText('field').focus();
  });
}

/**
 * Lets the close delay elapse.
 */
function waitForCloseDelay() {
  act(() => {
    vi.advanceTimersByTime(PastCloseDelay);
  });
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

    leaveMenu();
    waitForCloseDelay();

    expect(screen.getByText('closed')).toBeInTheDocument();
  });

  it('stays open while the pointer crosses to the popup', () => {
    renderMenu();

    fireEvent.pointerLeave(screen.getByText('trigger'), {
      relatedTarget: screen.getByText('popup'),
    });
    waitForCloseDelay();

    expect(screen.getByText('open')).toBeInTheDocument();
  });

  it('stays open for a pointer which comes back', () => {
    renderMenu();

    leaveMenu();
    fireEvent.pointerEnter(screen.getByText('trigger'));
    waitForCloseDelay();

    expect(screen.getByText('open')).toBeInTheDocument();
  });

  it('closes for the popover', () => {
    renderMenu();

    fireEvent.click(screen.getByText('hover close'));

    expect(screen.getByText('closed')).toBeInTheDocument();
  });

  it('stays open while locked, whatever the pointer does', () => {
    renderMenu();

    fireEvent.click(screen.getByText('lock'));
    leaveMenu();
    waitForCloseDelay();

    expect(screen.getByText('open')).toBeInTheDocument();
  });

  it('cancels a close already set off when locked', () => {
    renderMenu();

    leaveMenu();
    fireEvent.click(screen.getByText('lock'));
    waitForCloseDelay();

    expect(screen.getByText('open')).toBeInTheDocument();
  });

  it('ignores a hover close while locked', () => {
    renderMenu();

    fireEvent.click(screen.getByText('lock'));
    fireEvent.click(screen.getByText('hover close'));

    expect(screen.getByText('open')).toBeInTheDocument();
  });

  it('closes on a press outside while locked', () => {
    renderMenu();

    fireEvent.click(screen.getByText('lock'));
    fireEvent.click(screen.getByText('outside close'));

    expect(screen.getByText('closed')).toBeInTheDocument();
  });

  it('lifts the lock once the pointer comes back', () => {
    renderMenu();

    fireEvent.click(screen.getByText('lock'));
    fireEvent.pointerEnter(screen.getByText('trigger'));
    leaveMenu();
    waitForCloseDelay();

    expect(screen.getByText('closed')).toBeInTheDocument();
  });

  it('opens unlocked after closing while locked', () => {
    renderMenu();

    fireEvent.click(screen.getByText('lock'));
    fireEvent.click(screen.getByText('outside close'));
    fireEvent.click(screen.getByText('trigger'));
    leaveMenu();
    waitForCloseDelay();

    expect(screen.getByText('closed')).toBeInTheDocument();
  });

  it('stays open while a field inside it is focused', () => {
    renderMenu();

    focusField();
    leaveMenu();
    waitForCloseDelay();

    expect(screen.getByText('open')).toBeInTheDocument();
  });

  it('closes once the pointer leaves while a field outside it is focused', () => {
    renderMenu();

    act(() => {
      screen.getByLabelText('outside field').focus();
    });
    leaveMenu();
    waitForCloseDelay();

    expect(screen.getByText('closed')).toBeInTheDocument();
  });

  it('stays open when a field inside it is focused before the close delay ends', () => {
    renderMenu();

    leaveMenu();
    focusField();
    waitForCloseDelay();

    expect(screen.getByText('open')).toBeInTheDocument();
  });

  it('ignores a hover close while a field inside it is focused', () => {
    renderMenu();

    focusField();
    fireEvent.click(screen.getByText('hover close'));

    expect(screen.getByText('open')).toBeInTheDocument();
  });

  it('closes on a press outside while a field inside it is focused', () => {
    renderMenu();

    focusField();
    fireEvent.click(screen.getByText('outside close'));

    expect(screen.getByText('closed')).toBeInTheDocument();
  });
});
