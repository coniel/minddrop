import { describe, afterEach, it, expect } from 'vitest';
import { render, cleanup, screen } from '@minddrop/test-utils';
import { Text } from './Text';

describe('<Text />', () => {
  afterEach(cleanup);

  it('renders the className', () => {
    render(<Text className="my-class">content</Text>);

    expect(screen.getByText('content').className).toContain('my-class');
  });

  it('renders children', () => {
    render(<Text>content</Text>);

    expect(screen.getByText('content').textContent).toBe('content');
  });

  it('supports colors', () => {
    render(<Text color="light">content</Text>);

    expect(screen.getByText('content').className).toContain('color-light');
  });

  it('supports sizes', () => {
    render(<Text size="large">content</Text>);

    expect(screen.getByText('content').className).toContain('size-large');
  });

  it('supports weights', () => {
    render(<Text weight="light">content</Text>);

    expect(screen.getByText('content').className).toContain('weight-light');
  });

  it('supports custom components', () => {
    render(<Text as="button">content</Text>);

    expect(screen.getByRole('button').textContent).toBe('content');
  });
});
