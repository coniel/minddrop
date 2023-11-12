import { describe, afterEach, it, expect, vi, beforeAll } from 'vitest';
import { setPageContentIconColor } from './setPageContentIconColor';
import { PAGES_TEST_DATA, Pages } from '@minddrop/pages';
import { UserIconType } from '@minddrop/icons';
import { cleanup } from '../../test-utils';

const { page1 } = PAGES_TEST_DATA;

describe('setPageContentIconColor', () => {
  beforeAll(() => {
    vi.spyOn(Pages, 'setIcon').mockResolvedValue();
  });

  afterEach(cleanup);

  it('sets the icon color if the page has a content-icon', async () => {
    // Set the icon color on a page with a content-icon
    // as its icon.
    await setPageContentIconColor(page1, 'cyan');

    // Should set the new icon color
    expect(Pages.setIcon).toHaveBeenCalledWith(page1.path, {
      ...page1.icon,
      color: 'cyan',
    });
  });

  it('does nothing if the page does not have a content-icon', async () => {
    // Set the icon color on a page with a default icon
    // as its icon.
    await setPageContentIconColor(
      { ...page1, icon: { type: UserIconType.Default } },
      'cyan',
    );

    // Should do nothing
    expect(Pages.setIcon).not.toHaveBeenCalled();
  });
});
