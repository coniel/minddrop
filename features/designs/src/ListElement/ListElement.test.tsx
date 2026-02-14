import { describe, afterEach, it, expect } from 'vitest';
import { render, cleanup } from '@minddrop/test-utils';
import { ListElement } from './ListElement';

describe('<ListElement />', () => {
  afterEach(cleanup);

  it('renders the className', () => {
    const { getByText } = render(<ListElement className="my-class">content</ListElement>);

    expect(getByText('content')).toHaveClass('my-class');
  });
});
