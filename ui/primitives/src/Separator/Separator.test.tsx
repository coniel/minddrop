import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@minddrop/test-utils';
import { Separator } from './Separator';

describe('<Separator />', () => {
  afterEach(cleanup);

  it('renders the className', () => {
    render(<Separator className="my-class" />);

    expect(screen.getByRole('separator').className).toContain('my-class');
  });

  it('supports margins', () => {
    render(<Separator margin="small" />);

    expect(screen.getByRole('separator').className).toContain('margin-small');
  });
});
