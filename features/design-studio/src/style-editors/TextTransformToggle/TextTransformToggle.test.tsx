import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { render, screen, userEvent } from '@minddrop/test-utils';
import { DesignStudioStore } from '../../DesignStudioStore';
import { cleanup, setup, textElement1 } from '../../test-utils';
import { TextTransformToggle } from './TextTransformToggle';

describe('<TextTransformToggle />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('updates the element text-transform style', async () => {
    render(<TextTransformToggle elementId={textElement1.id} />);

    await userEvent.click(
      screen.getByLabelText('designs.typography.text-transform.uppercase'),
    );

    expect(
      DesignStudioStore.getState().elements[textElement1.id].style,
    ).toMatchObject({
      'text-transform': 'uppercase',
    });
  });
});
