import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { render, screen, userEvent } from '@minddrop/test-utils';
import { DesignStudioStore } from '../../DesignStudioStore';
import { cleanup, setup, textElement1 } from '../../test-utils';
import { TextAlignToggle } from './TextAlignToggle';

describe('<TextAlignToggle />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('updates the element text-align style', async () => {
    render(<TextAlignToggle elementId={textElement1.id} />);

    await userEvent.click(
      screen.getByLabelText('designs.typography.text-align.center'),
    );

    expect(
      DesignStudioStore.getState().elements[textElement1.id].style,
    ).toMatchObject({
      'text-align': 'center',
    });
  });
});
