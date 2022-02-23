import React from 'react';
import { Drop, Drops, DROPS_TEST_DATA } from '@minddrop/drops';
import { i18n } from '@minddrop/i18n';
import { act, fireEvent, render } from '@minddrop/test-utils';
import { Topics, TOPICS_TEST_DATA } from '@minddrop/topics';
import { cleanup, core, setup } from '../../test-utils';
import { DropMenu, DropMenuProps } from './DropMenu';
import { DropdownMenu, DropdownMenuContent } from '@minddrop/ui';
import { App } from '@minddrop/app';

const { tSailing, tUntitled } = TOPICS_TEST_DATA;
const { textDrop1 } = DROPS_TEST_DATA;

describe('<DropMenu />', () => {
  let drop: Drop;
  let drop2: Drop;

  beforeEach(() => {
    setup();
    drop = Drops.create(core, { type: textDrop1.type, color: 'brown' });
    drop2 = Drops.create(core, { type: textDrop1.type, color: 'orange' });
    Topics.addDrops(core, tUntitled.id, [drop.id, drop2.id]);
  });

  afterEach(cleanup);

  function init(props?: Partial<DropMenuProps>) {
    const utils = render(
      <DropdownMenu defaultOpen>
        <DropdownMenuContent>
          <DropMenu
            menuType="dropdown"
            drop={drop.id}
            topic={tUntitled.id}
            {...props}
          />
          ,
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    const getByItemLabel = (i18nKey: string) => {
      const label = i18n.t(i18nKey);

      return utils.getByText(label);
    };

    const queryByItemLabel = (i18nKey: string) => {
      const label = i18n.t(i18nKey);

      return utils.queryByText(label);
    };

    return { ...utils, queryByItemLabel, getByItemLabel };
  }

  describe('Edit', () => {
    it('omitts the Edit item when options.onSelectEdit is not present', () => {
      const { queryByItemLabel } = init();

      expect(queryByItemLabel('edit')).toBeNull();
    });

    it('adds the Edit item when options.onSelectEdit is present', () => {
      const { getByItemLabel } = init({ onSelectEdit: () => null });

      getByItemLabel('edit');
    });
  });

  describe('Color', () => {
    it('changes the color on selected drops', () => {
      const { getByItemLabel } = init({ onSelectEdit: () => null });

      // Select both drops
      act(() => {
        App.selectDrops(core, [drop.id, drop2.id]);
      });

      // Mouse over 'Color' item
      act(() => {
        fireEvent.click(getByItemLabel('color'));
      });

      // Click 'Red' color
      act(() => {
        fireEvent.click(getByItemLabel('colorRed'));
      });

      // Get the updated drops
      const updated1 = Drops.get(drop.id);
      const updated2 = Drops.get(drop2.id);
      // Both should be red
      expect(updated1.color).toBe('red');
      expect(updated2.color).toBe('red');
    });

    it('removes the color on selected drops when `Default` is selected', () => {
      const { getByItemLabel } = init({ onSelectEdit: () => null });

      // Select both drops
      act(() => {
        App.selectDrops(core, [drop.id, drop2.id]);
      });

      // Mouse over 'Color' item
      act(() => {
        fireEvent.click(getByItemLabel('color'));
      });

      // Click 'Red' color
      act(() => {
        fireEvent.click(getByItemLabel('colorDefault'));
      });

      // Get the updated drops
      const updated1 = Drops.get(drop.id);
      const updated2 = Drops.get(drop2.id);
      // Color should be removed
      expect(updated1.color).not.toBeDefined();
      expect(updated2.color).not.toBeDefined();
    });
  });

  describe('Add to', () => {
    it('adds selected drops to the selected topic', () => {
      const { getByItemLabel, getByText } = init({ onSelectEdit: () => null });

      // Select both drops
      act(() => {
        App.selectDrops(core, [drop.id, drop2.id]);
      });

      // Click 'Add to' item
      act(() => {
        fireEvent.click(getByItemLabel('addTo'));
      });

      // Click 'Sailing' topic
      act(() => {
        fireEvent.click(getByText(tSailing.title));
      });

      // Get 'Sailing' topic
      const topic = Topics.get(tSailing.id);
      // Should contain the drops
      expect(topic.drops.includes(drop.id)).toBe(true);
      expect(topic.drops.includes(drop2.id)).toBe(true);
    });
  });

  describe('Move to', () => {
    it('moves selected drops to the selected topic', () => {
      const { getByItemLabel, getByText } = init({ onSelectEdit: () => null });

      // Select both drops
      act(() => {
        App.selectDrops(core, [drop.id, drop2.id]);
      });

      // Click 'Move to' item
      act(() => {
        fireEvent.click(getByItemLabel('moveTo'));
      });

      // Click 'Sailing' topic
      act(() => {
        fireEvent.click(getByText(tSailing.title));
      });

      // Get 'Sailing' topic
      const topic = Topics.get(tSailing.id);
      // Should contain the drop
      expect(topic.drops.includes(drop.id)).toBe(true);
      expect(topic.drops.includes(drop2.id)).toBe(true);

      // Get the original parent topic
      const originalTopic = Topics.get(tUntitled.id);
      // Should no longer contain the drop
      expect(originalTopic.drops.includes(drop.id)).toBe(false);
      expect(originalTopic.drops.includes(drop2.id)).toBe(false);
      // Drops should be unselected
      expect(App.getSelectedDrops()).toEqual({});
    });
  });

  describe('Duplicate', () => {
    it('duplicates the selected drops within the topic', () => {
      const { getByItemLabel } = init({ onSelectEdit: () => null });

      // Select both drops
      act(() => {
        App.selectDrops(core, [drop.id, drop2.id]);
      });

      // Click 'Duplicate' item
      act(() => {
        fireEvent.click(getByItemLabel('duplicate'));
      });

      // Get the updated topic
      const topic = Topics.get(tUntitled.id);
      // Get the topic's drops
      const drops = Drops.get(topic.drops);
      // Get duplicated drops
      const duplicateDrops = Object.values(drops).filter(({ duplicatedFrom }) =>
        [drop.id, drop2.id].includes(duplicatedFrom),
      );
      // Should have 2 duplicates
      expect(duplicateDrops.length).toBe(2);
    });
  });

  describe('Archive', () => {
    it('archives the selected drops', () => {
      const { getByItemLabel } = init({ onSelectEdit: () => null });

      // Select both drops
      act(() => {
        App.selectDrops(core, [drop.id, drop2.id]);
      });

      // Click 'Archive' item
      act(() => {
        fireEvent.click(getByItemLabel('archive'));
      });

      // Get the updated drops
      const archived1 = Drops.get(drop.id);
      const archived2 = Drops.get(drop2.id);
      // Both should be archived
      expect(archived1.archived).toBe(true);
      expect(archived2.archived).toBe(true);
      // Drops should be unselected
      expect(App.getSelectedDrops()).toEqual({});
    });
  });

  describe('Delete', () => {
    it('deleted the selected drops', () => {
      const { getByItemLabel } = init({ onSelectEdit: () => null });

      // Select both drops
      act(() => {
        App.selectDrops(core, [drop.id, drop2.id]);
      });

      // Click 'Delete' item
      act(() => {
        fireEvent.click(getByItemLabel('delete'));
      });

      // Get the updated drops
      const deleted1 = Drops.get(drop.id);
      const deleted2 = Drops.get(drop2.id);
      // Both should be deleted
      expect(deleted1.deleted).toBe(true);
      expect(deleted2.deleted).toBe(true);
      // Drops should be unselected
      expect(App.getSelectedDrops()).toEqual({});
    });
  });
});
