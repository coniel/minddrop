import React from 'react';
import { render, cleanup, screen } from '@minddrop/test-utils';
import { Toolbar } from './Toolbar';

describe('<Toolbar />', () => {
  afterEach(cleanup);

  it('renders the className', () => {
    render(<Toolbar className="my-class">content</Toolbar>);

    expect(screen.getByText('content')).toHaveClass('my-class');
  });
});
