import { describe, afterEach, it, expect } from 'vitest';
import { render, cleanup, screen } from '@minddrop/test-utils';
import { MenuLabel } from './MenuLabel';

describe('<MenuLabel />', () => {
  afterEach(cleanup);

  it('renders the className', () => {
    render(<MenuLabel className="my-class">content</MenuLabel>);

    expect(screen.getByText('content').className).toContain('my-class');
  });

  it('renders the label', () => {
    render(<MenuLabel>Edit</MenuLabel>);

    screen.getByText('Edit');
  });
});
