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

  describe('keywords', () => {
    // Returns the labels of the entries a query matches, in ranked order
    const search = (query: string) =>
      filterBlockMenuItems(getBlockMenuItems(), query).map(
        (menuItem) => menuItem.label,
      );

    it('finds a heading level by its shorthand', () => {
      expect(search('h3')[0]).toBe('editor.elements.heading-3.name');
    });

    it('finds the paragraph entry, which is labelled Text', () => {
      expect(search('para')).toContain('editor.elements.paragraph.name');
    });

    it('finds a construct by the name markdown gives it', () => {
      expect(search('thematic')).toContain(
        'editor.elements.thematic-break.name',
      );
      expect(search('blockquote')).toContain('editor.elements.blockquote.name');
    });

    it('finds a construct by the name HTML gives it', () => {
      expect(search('ul')).toContain('editor.elements.list-item.name');
      expect(search('ol')).toContain('editor.elements.ordered-list-item.name');
    });

    it('finds a construct by a term it is known by elsewhere', () => {
      expect(search('equation')).toContain('editor.elements.math.name');
      expect(search('snippet')).toContain('editor.elements.code.name');
    });

    it('offers both the block and inline form of a construct', () => {
      // Typing '/math' should offer the choice rather than assuming one
      expect(search('math')).toEqual(
        expect.arrayContaining([
          'editor.elements.math.name',
          'editor.elements.inline-math.name',
        ]),
      );
    });

    it('finds the to-do entry by the names a task goes by', () => {
      ['todo', 'to-do', 'task', 'check', 'checkbox', 'tick'].forEach(
        (query) => {
          expect(search(query)).toContain(
            'editor.elements.task-list-item.name',
          );
        },
      );
    });

    it('still ranks a label match above a keyword match', () => {
      // 'Quote' is the quote entry's label and only a keyword of the others
      expect(search('quote')[0]).toBe('editor.elements.blockquote.name');
    });
  });
});
