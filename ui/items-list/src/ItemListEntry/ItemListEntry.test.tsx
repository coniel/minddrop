import { describe, afterEach, it, expect } from 'vitest';
import { render, cleanup } from '@minddrop/test-utils';
import { ItemListEntry } from './ItemListEntry';

describe('<ItemListEntry />', () => {
  afterEach(cleanup);

  it('renders the className', () => {
    const { getByText } = render(<ItemListEntry className="my-class">content</ItemListEntry>);

    expect(getByText('content')).toHaveClass('my-class');
  });
});
