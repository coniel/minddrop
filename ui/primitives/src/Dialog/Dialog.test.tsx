import { describe, afterEach, it, expect } from 'vitest';
import { render, cleanup } from '@minddrop/test-utils';
import { Dialog } from './Dialog';

describe('<Dialog />', () => {
  afterEach(cleanup);

  it('renders the className', () => {
    const { getByText } = render(<Dialog className="my-class">content</Dialog>);

    expect(getByText('content')).toHaveClass('my-class');
  });
});
