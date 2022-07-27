import React from 'react';
import { Drops, DROPS_TEST_DATA } from '@minddrop/drops';
import { i18n } from '@minddrop/i18n';
import { act, fireEvent, render } from '@minddrop/test-utils';
import { Topics, TOPICS_TEST_DATA } from '@minddrop/topics';
import { DropdownMenu, DropdownMenuContent } from '@minddrop/ui';
import { contains } from '@minddrop/utils';
import { Selection } from '@minddrop/selection';
import { cleanup, core, setup } from '../test-utils';
import { DropMenu, DropMenuProps } from './DropMenu';

const { tSailing, tUntitled, tNoDrops } = TOPICS_TEST_DATA;
const { drop1, drop2 } = DROPS_TEST_DATA;

describe('<DropMenu />', () => {
  beforeEach(() => {
    setup();
    Topics.addDrops(core, tUntitled.id, [drop1.id, drop2.id]);
  });

  afterEach(cleanup);

  function init(props: Partial<DropMenuProps> = {}) {
    const utils = render(
      <DropdownMenu defaultOpen>
        <DropdownMenuContent>
          <DropMenu
            menuType="dropdown"
            dropId={drop1.id}
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

      act(() => {
        // Select both drops
        Selection.select(core, [Selection.item(drop1), Selection.item(drop2)]);
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
      const updated1 = Drops.get(drop1.id);
      const updated2 = Drops.get(drop2.id);
      // Both should be red
      expect(updated1.color).toBe('red');
      expect(updated2.color).toBe('red');
    });

    it('removes the color on selected drops when `Default` is selected', () => {
      const { getByItemLabel } = init({ onSelectEdit: () => null });

      act(() => {
        // Select both drops
        Selection.select(core, [Selection.item(drop1), Selection.item(drop2)]);
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
      const updated1 = Drops.get(drop1.id);
      const updated2 = Drops.get(drop2.id);
      // Color should be removed
      expect(updated1.color).not.toBeDefined();
      expect(updated2.color).not.toBeDefined();
    });
  });

  describe('Add to', () => {
    it('adds selected drops to the selected topic', () => {
      const { getByItemLabel, getByText } = init({ onSelectEdit: () => null });

      act(() => {
        // Select both drops
        Selection.select(core, [Selection.item(drop1), Selection.item(drop2)]);
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
      expect(topic.drops.includes(drop1.id)).toBe(true);
      expect(topic.drops.includes(drop2.id)).toBe(true);
    });
  });

  describe('Move to', () => {
    it('moves selected drops to the selected topic', () => {
      const { getByItemLabel, getByText } = init({ onSelectEdit: () => null });

      act(() => {
        // Select both drops
        Selection.select(core, [Selection.item(drop1), Selection.item(drop2)]);
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
      expect(topic.drops.includes(drop1.id)).toBe(true);
      expect(topic.drops.includes(drop2.id)).toBe(true);

      // Get the original parent topic
      const originalTopic = Topics.get(tUntitled.id);
      // Should no longer contain the drop
      expect(originalTopic.drops.includes(drop1.id)).toBe(false);
      expect(originalTopic.drops.includes(drop2.id)).toBe(false);
      // Drops should be unselected
      expect(Selection.get()).toEqual([]);
    });
  });

  describe('Duplicate', () => {
    it('duplicates the selected drops within the topic', () => {
      const { getByItemLabel } = init({ onSelectEdit: () => null });

      act(() => {
        // Select both drops
        Selection.select(core, [Selection.item(drop1), Selection.item(drop2)]);
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
        [drop1.id, drop2.id].includes(duplicatedFrom),
      );
      // Should have 2 duplicates
      expect(duplicateDrops.length).toBe(2);
    });
  });

  describe('Archive', () => {
    it('archives the selected drops in the topic', () => {
      const { getByItemLabel } = init({ onSelectEdit: () => null });

      act(() => {
        // Select both drops
        Selection.select(core, [Selection.item(drop1), Selection.item(drop2)]);
      });

      // Click 'Archive' item
      act(() => {
        fireEvent.click(getByItemLabel('archive'));
      });

      // Get the updated topic
      const topic = Topics.get(tUntitled.id);
      // Both drops should be archived
      expect(contains(topic.archivedDrops, [drop1.id, drop2.id])).toBeTruthy();
      // Drops should be unselected
      expect(Selection.get()).toEqual([]);
    });
  });

  describe('Archive/Archive everywhere', () => {
    it("uses 'Archive' if the drop only has a single parent", () => {
      const { getByItemLabel } = init();

      act(() => {
        // Select both drops
        Selection.select(core, [Selection.item(drop1), Selection.item(drop2)]);
      });

      // Click on the 'Archive' item
      act(() => {
        fireEvent.click(getByItemLabel('archive'));
      });

      // Get the updated topic
      const topic = Topics.get(tUntitled.id);
      // Both should be archived
      expect(topic.archivedDrops.includes(drop1.id)).toBe(true);
      expect(topic.archivedDrops.includes(drop2.id)).toBe(true);
      // Drops should be unselected
      expect(Selection.get()).toEqual([]);
    });

    it("uses 'Archive' by default if drop has multiple parents", () => {
      // Add the drop to a couple of topics
      Topics.addDrops(core, tUntitled.id, [drop1.id]);
      Topics.addDrops(core, tNoDrops.id, [drop1.id]);

      // Render the menu
      const { getByItemLabel, queryByItemLabel } = init({
        topicId: tUntitled.id,
      });

      // Should render the 'Archive' item
      getByItemLabel('archive');
      // Should not render 'Archive everywhere' item
      expect(queryByItemLabel('archiveEverywhere')).toBeNull();

      act(() => {
        // Select the drop
        Selection.select(core, [Selection.item(drop1)]);
      });

      // Click on the 'Archive' item
      act(() => {
        fireEvent.click(getByItemLabel('archive'));
      });

      // Get the updated topic
      const topic = Topics.get(tUntitled.id);

      // Drop should be archived
      expect(topic.archivedDrops.includes(drop1.id)).toBeTruthy();
      // Drop should be unselected
      expect(Selection.get()).toEqual([]);
    });

    it("uses 'Archive everywhere' if drop has multiple parents and Shift key it pressed", () => {
      // Add the drop to a couple of topics
      Topics.addDrops(core, tUntitled.id, [drop1.id]);
      Topics.addDrops(core, tNoDrops.id, [drop1.id]);

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

      act(() => {
        // Select the drop
        Selection.select(core, [Selection.item(drop1)]);
      });

      // Click on the 'Archive everywhere' item
      act(() => {
        fireEvent.click(getByItemLabel('archiveEverywhere'));
      });

      // Get the updated topics
      const topic1 = Topics.get(tUntitled.id);
      const topic2 = Topics.get(tNoDrops.id);
      // Drop should be archived
      expect(topic1.archivedDrops.includes(drop1.id)).toBeTruthy();
      expect(topic2.archivedDrops.includes(drop1.id)).toBeTruthy();
      // Drop should be unselected
      expect(Selection.get()).toEqual([]);
    });
  });

  describe('Delete/Delete everywhere', () => {
    it("uses 'Delete' if the drop only has a single parent", () => {
      const { getByItemLabel } = init({ onSelectEdit: () => null });

      act(() => {
        // Select both drops
        Selection.select(core, [Selection.item(drop1), Selection.item(drop2)]);
      });

      // Click on the 'Delete' item
      act(() => {
        fireEvent.click(getByItemLabel('delete'));
      });

      // Get the updated drops
      const deleted1 = Drops.get(drop1.id);
      const deleted2 = Drops.get(drop2.id);
      // Both should be deleted
      expect(deleted1.deleted).toBe(true);
      expect(deleted2.deleted).toBe(true);
      // Drops should be unselected
      expect(Selection.get()).toEqual([]);
    });

    it("uses 'Delete' by default if drop has multiple parents", () => {
      // Add the drop to a couple of topics
      Topics.addDrops(core, tUntitled.id, [drop1.id]);
      Topics.addDrops(core, tNoDrops.id, [drop1.id]);

      // Render the menu
      const { getByItemLabel, queryByItemLabel } = init({
        topicId: tUntitled.id,
      });

      // Should render the 'Delete' item
      getByItemLabel('delete');
      // Should not render 'Delete everywhere' item
      expect(queryByItemLabel('deleteEverywhere')).toBeNull();

      act(() => {
        // Select the drop
        Selection.select(core, [Selection.item(drop1)]);
      });

      // Click on the 'Delete' item
      act(() => {
        fireEvent.click(getByItemLabel('delete'));
      });

      // Get the updated drop
      const drop = Drops.get(drop1.id);
      // Get the updated topic
      const topic = Topics.get(tUntitled.id);

      // Drop should be removed from the topic
      expect(topic.drops.includes(drop1.id)).toBeFalsy();
      // Drop should not be deleted
      expect(drop.deleted).toBeFalsy();
      // Drop should be unselected
      expect(Selection.get()).toEqual([]);
    });

    it("uses 'Delete everywhere' if drop has multiple parents and Shift key it pressed", () => {
      // Add the drop to a couple of topics
      Topics.addDrops(core, tUntitled.id, [drop1.id]);
      Topics.addDrops(core, tNoDrops.id, [drop1.id]);

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

      act(() => {
        // Select the drop
        Selection.select(core, [Selection.item(drop1)]);
      });

      // Click on the 'Delete everywhere' item
      act(() => {
        fireEvent.click(getByItemLabel('deleteEverywhere'));
      });

      // Get the updated drop
      const drop = Drops.get(drop1.id);
      // Drop should be deleted
      expect(drop.deleted).toBeTruthy();
      // Drop should be unselected
      expect(Selection.get()).toEqual([]);
    });
  });
});
