import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, userEvent } from '@minddrop/test-utils';
import { initializeInputModalityTracking } from '../initializeInputModalityTracking';
import { Combobox } from './Combobox';

// The combobox options used by the tests
const items = Array.from({ length: 5 }, (_, index) => ({
  label: `Item ${index + 1}`,
  value: `item-${index + 1}`,
}));

describe('<Combobox />', () => {
  // Stamps the input mode onto the document element
  let cleanupModalityTracking: VoidFunction;

  beforeEach(() => {
    cleanupModalityTracking = initializeInputModalityTracking();
  });

  afterEach(() => {
    cleanupModalityTracking();
    cleanup();
  });

  it('ignores hover while navigating by keyboard', async () => {
    const user = userEvent.setup();
    const { getByRole, getAllByRole } = render(<Combobox items={items} />);

    // Open the popup
    await user.click(getByRole('combobox'));

    // Highlight the second item by keyboard
    await user.keyboard('{ArrowDown}{ArrowDown}');

    const options = getAllByRole('option');

    expect(options[1]).toHaveAttribute('data-highlighted');

    // Fire the mouse move a scroll under a stationary cursor
    // produces over another item
    fireEvent.mouseMove(options[3]);

    // The keyboard highlight is left in place
    expect(options[1]).toHaveAttribute('data-highlighted');
    expect(options[3]).not.toHaveAttribute('data-highlighted');
  });

  it('highlights the hovered item when pointing at it', async () => {
    const user = userEvent.setup();
    const { getByRole, getAllByRole } = render(<Combobox items={items} />);

    // Open the popup
    await user.click(getByRole('combobox'));

    const options = getAllByRole('option');

    // Point at the fourth item
    fireEvent.pointerMove(document, { clientX: 10, clientY: 10 });
    fireEvent.pointerMove(document, { clientX: 20, clientY: 20 });
    fireEvent.mouseMove(options[3]);

    expect(options[3]).toHaveAttribute('data-highlighted');
  });
});
