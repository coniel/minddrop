import { describe, afterEach, it, expect } from 'vitest';
import { render, cleanup } from '@minddrop/test-utils';
import { TextField } from './TextField';

describe('<TextField />', () => {
  afterEach(cleanup);

  it('renders the className', () => {
    const { getByText } = render(<TextField className="my-class">content</TextField>);

    expect(getByText('content')).toHaveClass('my-class');
  });
});
