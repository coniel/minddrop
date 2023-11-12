import { UserIcon, UserIconType } from '@minddrop/icons';
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import { getPage } from '../getPage';
import { setup, cleanup, page1 } from '../test-utils';
import { PagesStore } from '../PagesStore';
import * as WRITE_PAGE_METADATA from '../writePageMetadata';
import { writePageMetadata } from '../writePageMetadata';
import { setPageIcon } from './setPageIcon';

const icon: UserIcon = {
  type: UserIconType.ContentIcon,
  icon: 'cat',
  color: 'blue',
};

describe('setWorkpaceIcon', () => {
  beforeEach(() => {
    setup();

    vi.spyOn(WRITE_PAGE_METADATA, 'writePageMetadata').mockResolvedValue();

    // Load a test page into the store
    PagesStore.getState().add(page1);
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

    // Should write the metadata to file
    expect(writePageMetadata).toHaveBeenCalledWith(page1.path);
  });
});
