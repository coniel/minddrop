import { useState } from 'react';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@minddrop/test-utils';
import { INPUT_MODE_ATTRIBUTE } from '../constants';
import { useNavigableList } from './useNavigableList';

// The list items used by the tests
const ITEMS = ['One', 'Two', 'Three'];

describe('useNavigableList', () => {
  beforeAll(() => {
    // happy-dom does not implement scrollIntoView, which the hook
    // calls on the highlighted item
    if (!Element.prototype.scrollIntoView) {
      Element.prototype.scrollIntoView = () => {};
    }
  });

  afterEach(() => {
    // Reset the input modality stamped by keyboard-mode tests
    document.documentElement.removeAttribute(INPUT_MODE_ATTRIBUTE);

    cleanup();
  });

  it('highlights the initial index', () => {
    render(<NavigableList items={ITEMS} />);

    expect(item('One')).toHaveAttribute('data-highlighted');
  });

  it('moves the highlight down with ArrowDown, wrapping at the end', () => {
    render(<NavigableList items={ITEMS} />);

    // Step down through the remaining items
    fireEvent.keyDown(input(), { key: 'ArrowDown' });

    expect(item('Two')).toHaveAttribute('data-highlighted');

    fireEvent.keyDown(input(), { key: 'ArrowDown' });

    expect(item('Three')).toHaveAttribute('data-highlighted');

    // Stepping past the last item wraps to the first
    fireEvent.keyDown(input(), { key: 'ArrowDown' });

    expect(item('One')).toHaveAttribute('data-highlighted');
  });

  it('moves the highlight up with ArrowUp, wrapping to the last', () => {
    render(<NavigableList items={ITEMS} />);

    // Stepping above the first item wraps to the last
    fireEvent.keyDown(input(), { key: 'ArrowUp' });

    expect(item('Three')).toHaveAttribute('data-highlighted');

    fireEvent.keyDown(input(), { key: 'ArrowUp' });

    expect(item('Two')).toHaveAttribute('data-highlighted');
  });

  it('cycles with Tab and Shift+Tab', () => {
    render(<NavigableList items={ITEMS} />);

    // Tab steps down
    fireEvent.keyDown(input(), { key: 'Tab' });

    expect(item('Two')).toHaveAttribute('data-highlighted');

    // Shift+Tab steps back up
    fireEvent.keyDown(input(), { key: 'Tab', shiftKey: true });

    expect(item('One')).toHaveAttribute('data-highlighted');
  });

  it('selects the highlighted item with Enter', () => {
    render(<NavigableList items={ITEMS} />);

    fireEvent.keyDown(input(), { key: 'ArrowDown' });
    fireEvent.keyDown(input(), { key: 'Enter' });

    expect(selection()).toHaveTextContent('Two');
  });

  it('passes the shift state through to selection', () => {
    render(<NavigableList items={ITEMS} />);

    fireEvent.keyDown(input(), { key: 'Enter', shiftKey: true });

    expect(selection()).toHaveTextContent('One (shift)');
  });

  it('ignores Enter when nothing is highlighted', () => {
    render(<NavigableList items={ITEMS} initialIndex={-1} />);

    fireEvent.keyDown(input(), { key: 'Enter' });

    expect(selection()).toHaveTextContent('none');
  });

  it('forwards Escape to the consumer', () => {
    render(<NavigableList items={ITEMS} />);

    fireEvent.keyDown(input(), { key: 'Escape' });

    expect(screen.getByTestId('escaped')).toHaveTextContent('yes');
  });

  it('ignores keys when disabled', () => {
    render(<NavigableList items={ITEMS} enabled={false} />);

    fireEvent.keyDown(input(), { key: 'ArrowDown' });
    fireEvent.keyDown(input(), { key: 'Enter' });

    expect(item('One')).toHaveAttribute('data-highlighted');
    expect(selection()).toHaveTextContent('none');
  });

  it('highlights the hovered item', () => {
    render(<NavigableList items={ITEMS} />);

    fireEvent.mouseMove(item('Three'));

    expect(item('Three')).toHaveAttribute('data-highlighted');
  });

  it('clears the highlight when the pointer leaves an item', () => {
    render(<NavigableList items={ITEMS} />);

    fireEvent.mouseMove(item('Two'));
    fireEvent.mouseLeave(item('Two'));

    expect(item('One')).not.toHaveAttribute('data-highlighted');
    expect(item('Two')).not.toHaveAttribute('data-highlighted');
    expect(item('Three')).not.toHaveAttribute('data-highlighted');
  });

  it('ignores mouse movement while navigating by keyboard', () => {
    render(<NavigableList items={ITEMS} />);

    // Items shifting under a stationary cursor fire mouse events,
    // which must not steal the keyboard-owned highlight
    document.documentElement.setAttribute(INPUT_MODE_ATTRIBUTE, 'keyboard');

    fireEvent.mouseMove(item('Three'));

    expect(item('One')).toHaveAttribute('data-highlighted');

    fireEvent.mouseLeave(item('Three'));

    expect(item('One')).toHaveAttribute('data-highlighted');
  });

  it('selects an item on click', () => {
    render(<NavigableList items={ITEMS} />);

    fireEvent.click(item('Three'));

    expect(selection()).toHaveTextContent('Three');
  });

  it('resets the highlight when the item count changes', () => {
    const { rerender } = render(<NavigableList items={ITEMS} />);

    fireEvent.keyDown(input(), { key: 'ArrowDown' });

    expect(item('Two')).toHaveAttribute('data-highlighted');

    // Removing an item resets the highlight to the initial index
    rerender(<NavigableList items={['One', 'Two']} />);

    expect(item('One')).toHaveAttribute('data-highlighted');
  });
});

/**
 * Returns the harness input element.
 */
function input(): HTMLElement {
  return screen.getByRole('textbox');
}

/**
 * Returns the list item with the given text.
 */
function item(text: string): HTMLElement {
  return screen.getByText(text);
}

/**
 * Returns the element showing the last selection.
 */
function selection(): HTMLElement {
  return screen.getByTestId('selected');
}

interface NavigableListProps {
  items: string[];
  enabled?: boolean;
  initialIndex?: number;
}

/**
 * Renders an input paired with a navigable list, exposing the last
 * selection and escape press as text for assertions.
 */
const NavigableList: React.FC<NavigableListProps> = ({
  items,
  enabled,
  initialIndex,
}) => {
  const [selected, setSelected] = useState('none');
  const [escaped, setEscaped] = useState(false);

  const { getInputProps, getItemProps } = useNavigableList({
    itemCount: items.length,
    onSelect: (index, shiftKey) =>
      setSelected(shiftKey ? `${items[index]} (shift)` : items[index]),
    onEscape: () => setEscaped(true),
    enabled,
    initialIndex,
  });

  return (
    <div>
      <input {...getInputProps()} />
      <output data-testid="selected">{selected}</output>
      <output data-testid="escaped">{escaped ? 'yes' : 'no'}</output>
      <ul>
        {items.map((itemText, index) => {
          const { highlighted, ...itemProps } = getItemProps(index);

          return (
            <li
              key={itemText}
              data-highlighted={highlighted || undefined}
              {...itemProps}
            >
              {itemText}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
