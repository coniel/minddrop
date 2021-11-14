import React from 'react';
import { render, cleanup, screen } from '@minddrop/test-utils';
import { Drop } from './Drop';

describe('<Drop />', () => {
  afterEach(cleanup);

  it('renders the className', () => {
    render(<Drop className="my-class">content</Drop>);

    expect(screen.getByText('content')).toHaveClass('my-class');
  });

  it('supports colors', () => {
    render(<Drop color="red">content</Drop>);

    expect(screen.getByText('content')).toHaveClass('color-red');
  });
});
