import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, userEvent } from '@minddrop/test-utils';
import { cleanup, setup, usedPropertyDesignElement } from '../test-utils';
import { ElementStyleEditor } from './ElementStyleEditor';

describe('<ElementStyleEditor />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('calls onClose when the close button is clicked', async () => {
    const onClose = vi.fn();

    render(
      <ElementStyleEditor
        onClose={onClose}
        elementId={usedPropertyDesignElement.id}
      />,
    );

    await userEvent.click(screen.getByLabelText('actions.back'));

    expect(onClose).toHaveBeenCalled();
  });
});
