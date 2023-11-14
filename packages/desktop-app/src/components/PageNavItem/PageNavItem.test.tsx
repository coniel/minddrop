import { describe, afterEach, it, expect } from 'vitest';
import { render, cleanup } from '@minddrop/test-utils';
import { PAGES_TEST_DATA } from '@minddrop/pages';
import { PageNavItem } from './PageNavItem';

const { page1 } = PAGES_TEST_DATA;

describe('<PageNavItem />', () => {
  afterEach(cleanup);

  it('renders', () => {
    render(<PageNavItem page={page1} />);
  });
});
