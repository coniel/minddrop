import React from 'react';
import { render, cleanup, screen } from '@minddrop/test-utils';
import { IconRenderer } from './IconRenderer';

describe('<IconRenderer />', () => {
  afterEach(cleanup);

  it('renders icons from the icon set given a valid name', () => {
    render(<IconRenderer iconName="settings" />);

    screen.getByTestId('icon');
  });

  it('renders as children given a node', () => {
    render(<IconRenderer icon={<span>icon</span>} />);

    screen.getByText('icon');
  });
});
