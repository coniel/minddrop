import { describe, afterEach, expect, it } from 'vitest';
import { render, cleanup } from '@minddrop/test-utils';
import { Block } from './Block';

describe('<Block />', () => {
  afterEach(cleanup);

  it('renders children', () => {
    const { getByText } = render(<Block className="my-class">content</Block>);

    getByText('content');
  });

  it('supports colors', () => {
    const { getByText } = render(<Block color="red">content</Block>);

    expect(getByText('content').className).toContain('color-red');
  });
});
