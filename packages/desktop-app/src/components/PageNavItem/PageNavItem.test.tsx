import { describe, afterEach, it, expect } from 'vitest';
import { render, cleanup, fireEvent } from '@minddrop/test-utils';
import { PAGES_TEST_DATA } from '@minddrop/pages';
import { PageNavItem } from './PageNavItem';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { AppUiState } from '../../AppUiState';

const { page1 } = PAGES_TEST_DATA;

initializeMockFileSystem();

describe('<PageNavItem />', () => {
  afterEach(cleanup);

  it('renders', () => {
    render(<PageNavItem page={page1} />);
  });

  it('sets the page as active when clicked', () => {
    const { getByText } = render(<PageNavItem page={page1} />);

    // Click the page nav item
    fireEvent.click(getByText(page1.title));

    // Should make the page active
    expect(AppUiState.get('path')).toBe(page1.path);
  });
});
