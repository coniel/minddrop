import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, userEvent } from '@minddrop/test-utils';
import { cleanup } from '../test-utils';
import { QueryNodeTypePicker } from './QueryNodeTypePicker';

describe('<QueryNodeTypePicker />', () => {
  afterEach(cleanup);

  it('picks the clicked node type', async () => {
    const user = userEvent.setup();
    const onPick = vi.fn();

    render(
      <QueryNodeTypePicker
        point={{ x: 0, y: 0 }}
        onPick={onPick}
        onClose={vi.fn()}
      />,
    );

    // Click the sort option
    await user.click(screen.getByText('Sort'));

    // The sort type is picked
    expect(onPick).toHaveBeenCalledWith('sort');
  });

  it('closes only when pressing outside of the picker', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <div>
        <div data-testid="outside" />
        <QueryNodeTypePicker
          point={{ x: 0, y: 0 }}
          onPick={vi.fn()}
          onClose={onClose}
        />
      </div>,
    );

    // Press an option within the picker
    await user.click(screen.getByText('Filter'));

    // Presses within the picker do not close it
    expect(onClose).not.toHaveBeenCalled();

    // Press outside the picker
    await user.click(screen.getByTestId('outside'));

    // The outside press dismisses the picker
    expect(onClose).toHaveBeenCalled();
  });
});
