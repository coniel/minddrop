import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@minddrop/test-utils';
import { usePressedState } from './usePressedState';

describe('usePressedState', () => {
  afterEach(cleanup);

  it('is not pressed until pointed down on', () => {
    render(<Pressable />);

    expect(getTarget().dataset.pressed).toBe('false');
  });

  it('presses on pointer down', () => {
    render(<Pressable />);

    fireEvent.pointerDown(getTarget());

    expect(getTarget().dataset.pressed).toBe('true');
  });

  it('releases on pointer up anywhere', () => {
    render(<Pressable />);

    fireEvent.pointerDown(getTarget());

    // The release lands wherever the pointer happens to be
    fireEvent.pointerUp(document);

    expect(getTarget().dataset.pressed).toBe('false');
  });

  it('releases when a drag ends, which swallows the pointer up', () => {
    render(<Pressable />);

    fireEvent.pointerDown(getTarget());
    fireEvent.dragEnd(document);

    expect(getTarget().dataset.pressed).toBe('false');
  });

  it('releases when a drop lands', () => {
    render(<Pressable />);

    fireEvent.pointerDown(getTarget());
    fireEvent.drop(document);

    expect(getTarget().dataset.pressed).toBe('false');
  });

  it('releases when the press is cancelled', () => {
    render(<Pressable />);

    fireEvent.pointerDown(getTarget());
    fireEvent.pointerCancel(document);

    expect(getTarget().dataset.pressed).toBe('false');
  });
});

/**
 * Returns the pressable element under test.
 */
function getTarget(): HTMLElement {
  return screen.getByTestId('pressable');
}

/**
 * Renders an element tracking its own pressed state.
 */
const Pressable: React.FC = () => {
  const { pressedProps } = usePressedState();

  return <div data-testid="pressable" {...pressedProps} />;
};
