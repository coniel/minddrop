import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@minddrop/test-utils';
import { ChipMenuItem } from './ChipMenuItem';

describe('<ChipMenuItem />', () => {
  afterEach(cleanup);

  it('renders the label as a chip in the given colour', () => {
    render(<ChipMenuItem stringLabel="Item" color="blue" />);

    expect(screen.getByText('Item').closest('.chip')).toHaveClass(
      'chip-color-blue',
    );
  });
});
