import { afterEach, describe, expect, it } from 'vitest';
import { cleanup } from '../../test-utils';
import { getBlockMenuItems } from './getBlockMenuItems';

describe('getBlockMenuItems', () => {
  afterEach(cleanup);

  it('returns an entry for each of an element type menu item', () => {
    const menuItems = getBlockMenuItems();

    // Should include each of the heading type's entries
    expect(
      menuItems.filter((menuItem) => menuItem.type === 'heading'),
    ).toHaveLength(6);
  });

  it('omits element types without menu items', () => {
    const menuItems = getBlockMenuItems();

    // Should not include the HTML type, which is not insertable
    expect(menuItems.some((menuItem) => menuItem.type === 'html')).toBe(false);
  });

  it('includes the entry label, keywords, icon, and data', () => {
    const menuItems = getBlockMenuItems();

    // Should have mapped the config's menu item onto the entry
    expect(menuItems).toContainEqual({
      type: 'heading',
      label: 'editor.elements.heading-2.name',
      keywords: 'editor.elements.heading-2.keywords',
      icon: 'heading-2',
      data: { level: 2 },
    });
  });

  it('includes the entries which draw containers', () => {
    const menuItems = getBlockMenuItems();

    expect(
      menuItems.some(
        (menuItem) => menuItem.label === 'editor.elements.blockquote.name',
      ),
    ).toBe(true);
  });
});

describe('container entries', () => {
  afterEach(cleanup);

  it('gives the to-do entry an unticked task item', () => {
    const task = getBlockMenuItems().find(
      (menuItem) => menuItem.label === 'editor.elements.task-list-item.name',
    );

    // A task item is a list item carrying a checked state, which is what
    // makes it render a checkbox and write back as one
    expect(task?.frame?.()).toMatchObject({
      kind: 'list-item',
      ordered: false,
      marker: '-',
      checked: false,
    });
  });

  it('builds a container of its own on every use', () => {
    const quote = getBlockMenuItems().find(
      (menuItem) => menuItem.label === 'editor.elements.blockquote.name',
    );

    const frame = quote?.frame?.();
    const otherFrame = quote?.frame?.();

    expect(frame).toMatchObject({ kind: 'blockquote' });
    // Each use is its own container rather than the same one twice
    expect(frame?.id).not.toBe(otherFrame?.id);
  });
});
