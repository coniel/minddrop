import { describe, afterEach, it, expect } from 'vitest';
import { render, cleanup } from '@minddrop/test-utils';
import { CardElement } from './CardElement';

describe('<CardElement />', () => {
  afterEach(cleanup);

  it('renders the className', () => {
    const { getByText } = render(<CardElement className="my-class">content</CardElement>);

    expect(getByText('content')).toHaveClass('my-class');
  });
});
