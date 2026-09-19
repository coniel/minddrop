import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, setup } from '@minddrop/drag-and-drop/test-utils';
import { createDomRect, fireEvent, render, screen } from '@minddrop/test-utils';
import { SortableList } from './SortableList';

// The rows the items are laid out at, one above the other
const ITEM_RECTS = [
  createDomRect(0, 0, 100, 40),
  createDomRect(0, 50, 100, 40),
];

/**
 * Renders a vertical list of two items, each a button which records
 * its clicks.
 *
 * @returns The IDs of the items clicked, in order.
 */
function renderList(): string[] {
  const clicks: string[] = [];

  render(
    <SortableList
      items={['a', 'b']}
      onSort={() => {}}
      renderItem={(id, props) => (
        <button
          ref={props.ref}
          className={props.className}
          style={props.style}
          data-testid={id}
          onClick={() => clicks.push(id)}
          {...props.handleProps}
        >
          {id}
        </button>
      )}
    />,
  );

  // Lay the items out one above the other and size the container to
  // hold them.
  ['a', 'b'].forEach((id, index) => {
    vi.spyOn(screen.getByTestId(id), 'getBoundingClientRect').mockReturnValue(
      ITEM_RECTS[index],
    );
  });
  vi.spyOn(
    screen.getByTestId('a').parentElement as HTMLElement,
    'getBoundingClientRect',
  ).mockReturnValue(createDomRect(0, 0, 100, 90));

  return clicks;
}

describe('<SortableList />', () => {
  beforeEach(() => {
    setup();

    // Stub the pointer capture the environment lacks
    Object.assign(HTMLElement.prototype, {
      setPointerCapture: () => {},
      releasePointerCapture: () => {},
    });
  });

  afterEach(cleanup);

  it('lets the click through after a press which did not move', () => {
    const clicks = renderList();

    fireEvent.pointerDown(screen.getByTestId('a'), { button: 0, clientY: 20 });
    fireEvent.pointerUp(window);
    fireEvent.click(screen.getByTestId('a'));

    expect(clicks).toEqual(['a']);
  });

  it('swallows the click after a drag which returned to its start', () => {
    const clicks = renderList();

    fireEvent.pointerDown(screen.getByTestId('a'), { button: 0, clientY: 20 });
    fireEvent.pointerMove(window, { clientY: 60 });
    fireEvent.pointerMove(window, { clientY: 20 });
    fireEvent.pointerUp(window);
    fireEvent.click(screen.getByTestId('a'));

    expect(clicks).toEqual([]);
  });
});
