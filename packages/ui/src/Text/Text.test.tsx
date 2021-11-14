import React from 'react';
import { render, cleanup, screen } from '@minddrop/test-utils';
import { Text } from './Text';

describe('<Text />', () => {
  afterEach(cleanup);

  it('renders the className', () => {
    render(<Text className="my-class">content</Text>);

    expect(screen.getByText('content')).toHaveClass('my-class');
  });

  it('renders children', () => {
    render(<Text>content</Text>);

    expect(screen.getByText('content')).toHaveTextContent('content');
  });

  it('supports colors', () => {
    render(<Text color="light">content</Text>);

    expect(screen.getByText('content')).toHaveClass('color-light');
  });

  it('supports sizes', () => {
    render(<Text size="large">content</Text>);

    expect(screen.getByText('content')).toHaveClass('size-large');
  });

  it('supports weights', () => {
    render(<Text weight="light">content</Text>);

    expect(screen.getByText('content')).toHaveClass('weight-light');
  });

  it('supports custom components', () => {
    render(<Text as="button">content</Text>);

    expect(screen.getByRole('button')).toHaveTextContent('content');
  });
});
