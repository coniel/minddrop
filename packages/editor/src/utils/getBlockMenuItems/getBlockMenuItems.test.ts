import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, setup } from '../../test-utils';
import { getBlockMenuItems } from './getBlockMenuItems';

describe('getBlockMenuItems', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns an entry for each of an element type menu item', () => {
    const menuItems = getBlockMenuItems();

    // Should include both of the heading type's entries
    expect(
      menuItems.filter((menuItem) => menuItem.type === 'heading'),
    ).toHaveLength(2);
  });

  it('omits element types without menu items', () => {
    const menuItems = getBlockMenuItems();

    // Should not include the to-do type, which has no entries
    expect(menuItems.some((menuItem) => menuItem.type === 'to-do')).toBe(false);
  });

  it('includes the entry label, icon, and data', () => {
    const menuItems = getBlockMenuItems();

    // Should have mapped the config's menu item onto the entry
    expect(menuItems).toContainEqual({
      type: 'heading',
      label: 'editor.elements.heading-2.name',
      icon: 'heading-2',
      data: { level: 2 },
    });
  });
});
