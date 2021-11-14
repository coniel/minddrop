import React from 'react';
import { render, cleanup, screen } from '@minddrop/test-utils';
import { Menu } from './Menu';

describe('<Menu />', () => {
  afterEach(cleanup);

  it('renders the className', () => {
    render(<Menu className="my-class">content</Menu>);

    expect(screen.getByText('content')).toHaveClass('my-class');
  });
});
