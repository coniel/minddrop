import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { render, screen, userEvent } from '@minddrop/test-utils';
import { DesignStudioStore } from '../../../DesignStudioStore';
import { cleanup, setup, textElement1 } from '../../../test-utils';
import { UnderlineToggle } from './UnderlineToggle';

describe('<UnderlineToggle />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('updates the element underline style', async () => {
    render(<UnderlineToggle elementId={textElement1.id} />);

    await userEvent.click(screen.getByRole('button'));

    expect(
      DesignStudioStore.getState().elements[textElement1.id].style,
    ).toMatchObject({
      underline: true,
    });
  });
});
