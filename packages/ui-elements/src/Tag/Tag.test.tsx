import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@minddrop/test-utils';
import { Tag } from './Tag';

describe('<Tag />', () => {
  afterEach(cleanup);

  it('renders the lbael', () => {
    render(<Tag label="label" />);

    screen.getByText('label');
  });

  it('supports colors', () => {
    render(<Tag label="label" color="red" />);

    expect(screen.getByText('label').className).toContain('color-red');
  });
});
