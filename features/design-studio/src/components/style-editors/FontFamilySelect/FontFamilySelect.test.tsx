import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { render, screen, userEvent } from '@minddrop/test-utils';
import { DesignStudioStore } from '../../../DesignStudioStore';
import { cleanup, setup, textElement1 } from '../../../test-utils';
import { FontFamilySelect } from './FontFamilySelect';

describe('<FontFamilySelect />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('updates the element font family', async () => {
    render(<FontFamilySelect elementId={textElement1.id} />);

    await userEvent.click(screen.getByRole('combobox'));

    await userEvent.click(
      screen.getByText('designs.typography.font-family.serif'),
    );

    expect(
      DesignStudioStore.getState().elements[textElement1.id].style,
    ).toMatchObject({
      'font-family': 'serif',
    });
  });
});
