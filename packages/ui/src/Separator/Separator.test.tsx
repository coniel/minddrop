import React from 'react';
import { render, cleanup, screen } from '@minddrop/test-utils';
import { Separator } from './Separator';

describe('<Separator />', () => {
  afterEach(cleanup);

  it('renders the className', () => {
    render(<Separator className="my-class" />);

    expect(screen.getByRole('separator')).toHaveClass('my-class');
  });

  it('supports margins', () => {
    render(<Separator margin="small" />);

    expect(screen.getByRole('separator')).toHaveClass('margin-small');
  });
});
