import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { render, screen, userEvent } from '@minddrop/test-utils';
import { DesignStudioStore } from '../../../DesignStudioStore';
import { cleanup, element_text_1, setup } from '../../../test-utils';
import { TextAlignToggle } from './TextAlignToggle';

describe('<TextAlignToggle />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('updates the element text-align style', async () => {
    render(<TextAlignToggle elementId={element_text_1.id} />);

    await userEvent.click(
      screen.getByLabelText('designs.typography.text-align.center'),
    );

    expect(
      DesignStudioStore.getState().elements[element_text_1.id].style,
    ).toMatchObject({
      'text-align': 'center',
    });
  });
});
