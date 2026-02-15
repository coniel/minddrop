import { afterEach, describe, expect, it, vi } from 'vitest';
import { DesignFixtures } from '@minddrop/designs';
import { cleanup, render, screen, userEvent } from '@minddrop/test-utils';
import { ElementStyleEditor } from './ElementStyleEditor';

const { textElement1 } = DesignFixtures;

describe('<ElementStyleEditor />', () => {
  afterEach(cleanup);

  it('calls onClose when the close button is clicked', async () => {
    const onClose = vi.fn();

    render(<ElementStyleEditor onClose={onClose} element={textElement1} />);

    await userEvent.click(screen.getByLabelText('actions.back'));

    expect(onClose).toHaveBeenCalled();
  });
});
