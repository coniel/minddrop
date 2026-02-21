import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { render, screen, userEvent } from '@minddrop/test-utils';
import { DesignStudioStore } from '../../../DesignStudioStore';
import { cleanup, element_text_1, setup } from '../../../test-utils';
import { TextTransformToggle } from './TextTransformToggle';

describe('<TextTransformToggle />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('updates the element text-transform style', async () => {
    render(<TextTransformToggle elementId={element_text_1.id} />);

    await userEvent.click(
      screen.getByLabelText('designs.typography.text-transform.uppercase'),
    );

    expect(
      DesignStudioStore.getState().elements[element_text_1.id].style,
    ).toMatchObject({
      'text-transform': 'uppercase',
    });
  });
});
