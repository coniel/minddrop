import { describe, afterEach, it, expect } from 'vitest';
import { render, cleanup } from '@minddrop/test-utils';
import { DesignStudio } from './DesignStudio';

describe('<DesignStudio />', () => {
  afterEach(cleanup);

  it('renders the className', () => {
    const { getByText } = render(<DesignStudio className="my-class">content</DesignStudio>);

    expect(getByText('content')).toHaveClass('my-class');
  });
});
