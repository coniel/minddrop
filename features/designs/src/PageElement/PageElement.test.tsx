import { describe, afterEach, it, expect } from 'vitest';
import { render, cleanup } from '@minddrop/test-utils';
import { PageElement } from './PageElement';

describe('<PageElement />', () => {
  afterEach(cleanup);

  it('renders the className', () => {
    const { getByText } = render(<PageElement className="my-class">content</PageElement>);

    expect(getByText('content')).toHaveClass('my-class');
  });
});
