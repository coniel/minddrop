import { describe, afterEach, it, expect } from 'vitest';
import { render, cleanup } from '@minddrop/test-utils';
import { Panel } from './Panel';

describe('<Panel />', () => {
  afterEach(cleanup);

  it('renders the className', () => {
    const { getByText } = render(<Panel className="my-class">content</Panel>);

    expect(getByText('content')).toHaveClass('my-class');
  });
});
