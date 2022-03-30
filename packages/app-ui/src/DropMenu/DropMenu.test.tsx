import React from 'react';
import { Drops, DROPS_TEST_DATA } from '@minddrop/drops';
import { i18n } from '@minddrop/i18n';
import { act, fireEvent, render } from '@minddrop/test-utils';
import { Topics, TOPICS_TEST_DATA } from '@minddrop/topics';
import { DropdownMenu, DropdownMenuContent } from '@minddrop/ui';
import { App } from '@minddrop/app';
import { contains } from '@minddrop/utils';
import { cleanup, core, setup } from '../test-utils';
import { DropMenu, DropMenuProps } from './DropMenu';

const { tSailing, tUntitled, tNoDrops } = TOPICS_TEST_DATA;
const { textDrop1, textDrop2 } = DROPS_TEST_DATA;

describe('<DropMenu />', () => {
  beforeEach(() => {
    setup();
    Topics.addDrops(core, tUntitled.id, [textDrop1.id, textDrop2.id]);
  });

  afterEach(cleanup);

  function init(props: Partial<DropMenuProps> = {}) {
    const utils = render(
      <DropdownMenu defaultOpen>
        <DropdownMenuContent>
          <DropMenu
            menuType="dropdown"
            dropId={textDrop1.id}
            topicId={tUntitled.id}
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
    it('omits the Edit item when options.onSelectEdit is not present', () => {
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
        App.selectDrops(core, [textDrop1.id, textDrop2.id]);
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
      const updated1 = Drops.get(textDrop1.id);
      const updated2 = Drops.get(textDrop2.id);
      // Both should be red
      expect(updated1.color).toBe('red');
      expect(updated2.color).toBe('red');
    });

    it('removes the color on selected drops when `Default` is selected', () => {
      const { getByItemLabel } = init({ onSelectEdit: () => null });

      // Select both drops
      act(() => {
        App.selectDrops(core, [textDrop1.id, textDrop2.id]);
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
      const updated1 = Drops.get(textDrop1.id);
      const updated2 = Drops.get(textDrop2.id);
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
        App.selectDrops(core, [textDrop1.id, textDrop2.id]);
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
      expect(topic.drops.includes(textDrop1.id)).toBe(true);
      expect(topic.drops.includes(textDrop2.id)).toBe(true);
    });
  });

  describe('Move to', () => {
    it('moves selected drops to the selected topic', () => {
      const { getByItemLabel, getByText } = init({ onSelectEdit: () => null });

      // Select both drops
      act(() => {
        App.selectDrops(core, [textDrop1.id, textDrop2.id]);
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
      expect(topic.drops.includes(textDrop1.id)).toBe(true);
      expect(topic.drops.includes(textDrop2.id)).toBe(true);

      // Get the original parent topic
      const originalTopic = Topics.get(tUntitled.id);
      // Should no longer contain the drop
      expect(originalTopic.drops.includes(textDrop1.id)).toBe(false);
      expect(originalTopic.drops.includes(textDrop2.id)).toBe(false);
      // Drops should be unselected
      expect(App.getSelectedDrops()).toEqual({});
    });
  });

  describe('Duplicate', () => {
    it('duplicates the selected drops within the topic', () => {
      const { getByItemLabel } = init({ onSelectEdit: () => null });

      // Select both drops
      act(() => {
        App.selectDrops(core, [textDrop1.id, textDrop2.id]);
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
        [textDrop1.id, textDrop2.id].includes(duplicatedFrom),
      );
      // Should have 2 duplicates
      expect(duplicateDrops.length).toBe(2);
    });
  });

  describe('Archive', () => {
    it('archives the selected drops in the topic', () => {
      const { getByItemLabel } = init({ onSelectEdit: () => null });

      // Select both drops
      act(() => {
        App.selectDrops(core, [textDrop1.id, textDrop2.id]);
      });

      // Click 'Archive' item
      act(() => {
        fireEvent.click(getByItemLabel('archive'));
      });

      // Get the updated topic
      const topic = Topics.get(tUntitled.id);
      // Both drops should be archived
      expect(
        contains(topic.archivedDrops, [textDrop1.id, textDrop2.id]),
      ).toBeTruthy();
      // Drops should be unselected
      expect(App.getSelectedDrops()).toEqual({});
    });
  });

  describe('Archive/Archive everywhere', () => {
    it("uses 'Archive' if the drop only has a single parent", () => {
      const { getByItemLabel } = init();

      // Select both drops
      act(() => {
        App.selectDrops(core, [textDrop1.id, textDrop2.id]);
      });

      // Click on the 'Archive' item
      act(() => {
        fireEvent.click(getByItemLabel('archive'));
      });

      // Get the updated topic
      const topic = Topics.get(tUntitled.id);
      // Both should be archived
      expect(topic.archivedDrops.includes(textDrop1.id)).toBe(true);
      expect(topic.archivedDrops.includes(textDrop2.id)).toBe(true);
      // Drops should be unselected
      expect(App.getSelectedDrops()).toEqual({});
    });

    it("uses 'Archive' by default if drop has multiple parents", () => {
      // Add the drop to a couple of topics
      Topics.addDrops(core, tUntitled.id, [textDrop1.id]);
      Topics.addDrops(core, tNoDrops.id, [textDrop1.id]);

      // Render the menu
      const { getByItemLabel, queryByItemLabel } = init({
        topicId: tUntitled.id,
      });

      // Should render the 'Archive' item
      getByItemLabel('archive');
      // Should not render 'Archive everywhere' item
      expect(queryByItemLabel('archiveEverywhere')).toBeNull();

      // Select a the drop
      act(() => {
        App.selectDrops(core, [textDrop1.id]);
      });

      // Click on the 'Archive' item
      act(() => {
        fireEvent.click(getByItemLabel('archive'));
      });

      // Get the updated topic
      const topic = Topics.get(tUntitled.id);

      // Drop should be archived
      expect(topic.archivedDrops.includes(textDrop1.id)).toBeTruthy();
      // Drop should be unselected
      expect(App.getSelectedDrops()).toEqual({});
    });

    it("uses 'Archive everywhere' if drop has multiple parents and Shift key it pressed", () => {
      // Add the drop to a couple of topics
      Topics.addDrops(core, tUntitled.id, [textDrop1.id]);
      Topics.addDrops(core, tNoDrops.id, [textDrop1.id]);

      // Render the menu
      const { getByItemLabel, queryByItemLabel } = init({
        topicId: tUntitled.id,
      });

      act(() => {
        fireEvent.keyDown(window, { key: 'Shift' });
      });

      // Should render the 'Archive everywhere' item
      getByItemLabel('archiveEverywhere');
      // Should not render 'Archive' item
      expect(queryByItemLabel('archive')).toBeNull();

      // Select a the drop
      act(() => {
        App.selectDrops(core, [textDrop1.id]);
      });

      // Click on the 'Archive everywhere' item
      act(() => {
        fireEvent.click(getByItemLabel('archiveEverywhere'));
      });

      // Get the updated topics
      const topic1 = Topics.get(tUntitled.id);
      const topic2 = Topics.get(tNoDrops.id);
      // Drop should be archived
      expect(topic1.archivedDrops.includes(textDrop1.id)).toBeTruthy();
      expect(topic2.archivedDrops.includes(textDrop1.id)).toBeTruthy();
      // Drop should be unselected
      expect(App.getSelectedDrops()).toEqual({});
    });
  });

  describe('Delete/Delete everywhere', () => {
    it("uses 'Delete' if the drop only has a single parent", () => {
      const { getByItemLabel } = init({ onSelectEdit: () => null });

      // Select both drops
      act(() => {
        App.selectDrops(core, [textDrop1.id, textDrop2.id]);
      });

      // Click on the 'Delete' item
      act(() => {
        fireEvent.click(getByItemLabel('delete'));
      });

      // Get the updated drops
      const deleted1 = Drops.get(textDrop1.id);
      const deleted2 = Drops.get(textDrop2.id);
      // Both should be deleted
      expect(deleted1.deleted).toBe(true);
      expect(deleted2.deleted).toBe(true);
      // Drops should be unselected
      expect(App.getSelectedDrops()).toEqual({});
    });

    it("uses 'Delete' by default if drop has multiple parents", () => {
      // Add the drop to a couple of topics
      Topics.addDrops(core, tUntitled.id, [textDrop1.id]);
      Topics.addDrops(core, tNoDrops.id, [textDrop1.id]);

      // Render the menu
      const { getByItemLabel, queryByItemLabel } = init({
        topicId: tUntitled.id,
      });

      // Should render the 'Delete' item
      getByItemLabel('delete');
      // Should not render 'Delete everywhere' item
      expect(queryByItemLabel('deleteEverywhere')).toBeNull();

      // Select a the drop
      act(() => {
        App.selectDrops(core, [textDrop1.id]);
      });

      // Click on the 'Delete' item
      act(() => {
        fireEvent.click(getByItemLabel('delete'));
      });

      // Get the updated drop
      const drop = Drops.get(textDrop1.id);
      // Get the updated topic
      const topic = Topics.get(tUntitled.id);

      // Drop should be removed from the topic
      expect(topic.drops.includes(textDrop1.id)).toBeFalsy();
      // Drop should not be deleted
      expect(drop.deleted).toBeFalsy();
      // Drop should be unselected
      expect(App.getSelectedDrops()).toEqual({});
    });

    it("uses 'Delete everywhere' if drop has multiple parents and Shift key it pressed", () => {
      // Add the drop to a couple of topics
      Topics.addDrops(core, tUntitled.id, [textDrop1.id]);
      Topics.addDrops(core, tNoDrops.id, [textDrop1.id]);

      // Render the menu
      const { getByItemLabel, queryByItemLabel } = init({
        topicId: tUntitled.id,
      });

      act(() => {
        fireEvent.keyDown(window, { key: 'Shift' });
      });

      // Should render the 'Dekete everywhere' item
      getByItemLabel('deleteEverywhere');
      // Should not render 'Delete' item
      expect(queryByItemLabel('delete')).toBeNull();

      // Select a the drop
      act(() => {
        App.selectDrops(core, [textDrop1.id]);
      });

      // Click on the 'Delete everywhere' item
      act(() => {
        fireEvent.click(getByItemLabel('deleteEverywhere'));
      });

      // Get the updated drop
      const drop = Drops.get(textDrop1.id);
      // Drop should be deleted
      expect(drop.deleted).toBeTruthy();
      // Drop should be unselected
      expect(App.getSelectedDrops()).toEqual({});
    });
  });
});