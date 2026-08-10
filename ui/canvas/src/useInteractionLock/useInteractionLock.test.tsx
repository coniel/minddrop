import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@minddrop/test-utils';
import { useInteractionLock } from './useInteractionLock';
import { useIsInteracting } from './useIsInteracting';

// Holds the lock with the given cursor for as long as it is
// rendered
const TestLock: React.FC<{ cursor: string | null }> = ({ cursor }) => {
  useInteractionLock(cursor);

  return null;
};

// The cursor the lock is currently forcing, empty when it holds
// none
const lockedCursor = () =>
  document.body.style.getPropertyValue('--ui-canvas-interaction-cursor');

// Whether the lock is currently held
const locked = () => document.body.classList.contains('ui-canvas-interacting');

describe('useInteractionLock', () => {
  afterEach(cleanup);

  it('does not lock without a cursor', () => {
    render(<TestLock cursor={null} />);

    expect(locked()).toBe(false);
  });

  it('locks the body with the given cursor', () => {
    render(<TestLock cursor="grabbing" />);

    expect(locked()).toBe(true);
    expect(lockedCursor()).toBe('grabbing');
  });

  it('releases the lock when the interaction ends', () => {
    const { rerender } = render(<TestLock cursor="grabbing" />);

    rerender(<TestLock cursor={null} />);

    expect(locked()).toBe(false);
    expect(lockedCursor()).toBe('');
  });

  it('releases the lock on unmount', () => {
    const { unmount } = render(<TestLock cursor="grabbing" />);

    unmount();

    expect(locked()).toBe(false);
  });

  it('holds the lock until every interaction has ended', () => {
    const { unmount } = render(<TestLock cursor="grabbing" />);

    render(<TestLock cursor="crosshair" />);

    unmount();

    // The second interaction is still in progress
    expect(locked()).toBe(true);
  });
});

// Reports whether an interaction is in progress
const TestObserver: React.FC = () => (
  <div data-testid="observer">{useIsInteracting() ? 'yes' : 'no'}</div>
);

describe('useIsInteracting', () => {
  afterEach(cleanup);

  it('reports no interaction while the lock is free', () => {
    const { getByTestId } = render(<TestObserver />);

    expect(getByTestId('observer').textContent).toBe('no');
  });

  it('reports an interaction while the lock is held', () => {
    const { getByTestId, rerender } = render(
      <>
        <TestObserver />
      </>,
    );

    rerender(
      <>
        <TestObserver />
        <TestLock cursor="grabbing" />
      </>,
    );

    expect(getByTestId('observer').textContent).toBe('yes');
  });

  it('reports again once the interaction ends', () => {
    const { getByTestId, rerender } = render(
      <>
        <TestObserver />
        <TestLock cursor="grabbing" />
      </>,
    );

    rerender(
      <>
        <TestObserver />
      </>,
    );

    expect(getByTestId('observer').textContent).toBe('no');
  });
});
