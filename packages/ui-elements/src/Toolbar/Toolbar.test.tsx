import { describe, afterEach, it, expect } from 'vitest';
import { render, cleanup, screen } from '@minddrop/test-utils';
import { Toolbar } from './Toolbar';

describe('<Toolbar />', () => {
  afterEach(cleanup);

  it('renders the className', () => {
    render(<Toolbar className="my-class">content</Toolbar>);

    expect(screen.getByText('content').className).toContain('my-class');
  });
});
