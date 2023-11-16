import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { UserIcon, UserIconType } from '@minddrop/icons';
import { getPage } from '../getPage';
import { setup, cleanup, page1 } from '../test-utils';
import { PagesStore } from '../PagesStore';
import { setPageIcon } from './setPageIcon';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { getPageMetadata } from '../utils';

const icon: UserIcon = {
  type: UserIconType.ContentIcon,
  icon: 'cat',
  color: 'blue',
};

const MockFs = initializeMockFileSystem([
  // Page file
  page1.path,
]);

describe('setWorkpaceIcon', () => {
  beforeEach(() => {
    setup();

    // Load a test page into the store
    PagesStore.getState().add(page1);

    // Reset mock file system
    MockFs.reset();
  });

  afterEach(cleanup);

  it('updates the page in the store', async () => {
    // Set the icon on a page
    await setPageIcon(page1.path, icon);

    // Should update the page in the store
    expect(getPage(page1.path)?.icon).toEqual(icon);
  });

  it('writes the changes to the page config file', async () => {
    // Set the icon on a page
    await setPageIcon(page1.path, icon);

    // Get page metadata from file
    const metadata = getPageMetadata(MockFs.readTextFile(page1.path));

    // Metadata should contain the new icon
    expect(metadata.icon).toEqual(icon);
  });
});
