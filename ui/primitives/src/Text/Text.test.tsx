import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@minddrop/test-utils';
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
    render(<Text color="muted">content</Text>);

    expect(screen.getByText('content').className).toContain('color-muted');
  });

  it('supports sizes', () => {
    render(<Text size="lg">content</Text>);

    expect(screen.getByText('content').className).toContain('size-lg');
  });

  it('supports weights', () => {
    render(<Text weight="bold">content</Text>);

    expect(screen.getByText('content').className).toContain('weight-bold');
  });

  it('supports custom components', () => {
    render(<Text as="button">content</Text>);

    expect(screen.getByRole('button').textContent).toBe('content');
  });
});
