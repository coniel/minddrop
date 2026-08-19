import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@minddrop/test-utils';
import { resetHoveredItem, useHoveredItem } from './useHoveredItem';

// Where the pointer rests through a drag and the drop that follows
const RESTING = { clientX: 40, clientY: 60 };

describe('useHoveredItem', () => {
  afterEach(() => {
    cleanup();
    resetHoveredItem();
  });

  it('is not hovered until the pointer enters', () => {
    render(<Rows />);

    expect(hoveredIds()).toEqual([]);
  });

  it('hovers the item the pointer enters', () => {
    render(<Rows />);

    fireEvent.pointerEnter(screen.getByTestId('one'));

    expect(hoveredIds()).toEqual(['one']);
  });

  it('unhovers on leave', () => {
    render(<Rows />);

    fireEvent.pointerEnter(screen.getByTestId('one'));
    fireEvent.pointerLeave(screen.getByTestId('one'));

    expect(hoveredIds()).toEqual([]);
  });

  it('never leaves two items hovered at once', () => {
    render(<Rows />);

    // The pointer moves on without the first row being told it was
    // left, which is what a native drag does
    fireEvent.pointerEnter(screen.getByTestId('one'));
    fireEvent.pointerEnter(screen.getByTestId('two'));

    expect(hoveredIds()).toEqual(['two']);
  });

  it('ignores a leave which arrives after another item took hover', () => {
    render(<Rows />);

    fireEvent.pointerEnter(screen.getByTestId('one'));
    fireEvent.pointerEnter(screen.getByTestId('two'));

    // The first row's leave lands late, and must not unhover its
    // successor
    fireEvent.pointerLeave(screen.getByTestId('one'));

    expect(hoveredIds()).toEqual(['two']);
  });

  it('releases hover when a drag takes the pointer', () => {
    render(<Rows />);

    fireEvent.pointerEnter(screen.getByTestId('one'));
    fireEvent.dragStart(document);

    expect(hoveredIds()).toEqual([]);
  });

  it('withholds hover from whatever the drop slides under the pointer', () => {
    render(<Rows />);

    fireEvent.dragStart(document);

    // The reflow announces the row which slid underneath as entered,
    // though the pointer has not moved
    fireEvent.pointerEnter(screen.getByTestId('two'));

    expect(hoveredIds()).toEqual([]);
  });

  it('keeps hover withheld while the panel settles under the pointer', () => {
    render(<Rows />);

    fireEvent.dragStart(document);

    // Settling content fires a move at the position the pointer
    // already occupies
    fireEvent.pointerMove(document, RESTING);
    fireEvent.pointerMove(document, RESTING);
    fireEvent.pointerEnter(screen.getByTestId('two'));

    expect(hoveredIds()).toEqual([]);
  });

  it('takes hover again once the pointer is moved deliberately', () => {
    render(<Rows />);

    fireEvent.dragStart(document);
    fireEvent.pointerMove(document, RESTING);
    fireEvent.pointerMove(document, { clientX: 44, clientY: 90 });
    fireEvent.pointerEnter(screen.getByTestId('two'));

    expect(hoveredIds()).toEqual(['two']);
  });
});

/**
 * Returns the test IDs of the rows currently hovered.
 */
function hoveredIds(): string[] {
  return Array.from(document.querySelectorAll('[data-hovered="true"]')).map(
    (element) => element.getAttribute('data-testid') ?? '',
  );
}

/**
 * Renders two rows tracking their hovered state.
 */
const Rows: React.FC = () => (
  <>
    <Row id="one" />
    <Row id="two" />
  </>
);

/**
 * Renders a single row tracking its hovered state.
 */
const Row: React.FC<{ id: string }> = ({ id }) => {
  const { hoveredProps } = useHoveredItem(id);

  return <div data-testid={id} {...hoveredProps} />;
};
