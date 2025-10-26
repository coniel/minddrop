import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@minddrop/test-utils';
import { Menu } from './Menu';

describe('<Menu />', () => {
  afterEach(cleanup);

  it('renders the className', () => {
    render(<Menu className="my-class">content</Menu>);

    expect(screen.getByText('content').className).toContain('my-class');
  });
});
