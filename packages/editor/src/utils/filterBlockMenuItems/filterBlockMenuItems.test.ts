import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { initializeI18n } from '@minddrop/i18n';
import { cleanup } from '../../test-utils';
import { getBlockMenuItems } from '../getBlockMenuItems';
import { filterBlockMenuItems } from './filterBlockMenuItems';

describe('filterBlockMenuItems', () => {
  // Entries are matched against their translated labels
  beforeAll(() => initializeI18n());

  afterEach(cleanup);

  it('returns all entries when the query is empty', () => {
    const menuItems = getBlockMenuItems();

    expect(filterBlockMenuItems(menuItems, '')).toEqual(menuItems);
  });

  it('matches entries by their translated label', () => {
    const menuItems = getBlockMenuItems();

    // Should match both heading entries and nothing else
    expect(filterBlockMenuItems(menuItems, 'heading')).toEqual(
      menuItems.filter((menuItem) => menuItem.type === 'heading'),
    );
  });

  it('returns no entries when nothing matches', () => {
    const menuItems = getBlockMenuItems();

    expect(filterBlockMenuItems(menuItems, 'nomatch')).toEqual([]);
  });
});
