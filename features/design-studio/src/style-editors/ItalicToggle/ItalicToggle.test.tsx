import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { render, screen, userEvent } from '@minddrop/test-utils';
import { DesignStudioStore } from '../../DesignStudioStore';
import { cleanup, setup, textElement1 } from '../../test-utils';
import { ItalicToggle } from './ItalicToggle';

describe('<ItalicToggle />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('updates the element italic style', async () => {
    render(<ItalicToggle elementId={textElement1.id} />);

    await userEvent.click(screen.getByRole('button'));

    expect(
      DesignStudioStore.getState().elements[textElement1.id].style,
    ).toMatchObject({
      italic: true,
    });
  });
});
