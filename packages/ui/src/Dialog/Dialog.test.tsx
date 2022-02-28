import React from 'react';
import { render, cleanup, screen } from '@minddrop/test-utils';
import { Dialog } from './Dialog';

describe('<Dialog />', () => {
  afterEach(cleanup);

  it('renders the className', () => {
    render(<Dialog className="my-class">content</Dialog>);

    expect(screen.getByText('content')).toHaveClass('my-class');
  });
});
