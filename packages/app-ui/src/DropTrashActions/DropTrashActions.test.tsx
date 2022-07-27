import React from 'react';
import {
  act,
  fireEvent,
  render,
  cleanup as cleanupRender,
} from '@minddrop/test-utils';
import { i18n } from '@minddrop/i18n';
import { Drops, DROPS_TEST_DATA } from '@minddrop/drops';
import { Topics, TOPICS_TEST_DATA } from '@minddrop/topics';
import { Selection } from '@minddrop/selection';
import { DropTrashActions } from './DropTrashActions';
import { setup, cleanup, core } from '../test-utils';

const { drop1, drop2 } = DROPS_TEST_DATA;
const { tSailing } = TOPICS_TEST_DATA;

describe('DropTrashActions', () => {
  beforeEach(() => {
    setup();

    // Delete the test drops
    Drops.delete(core, drop1.id);
    Drops.delete(core, drop2.id);
    // Remove the drops from 'Sailing' topic
    Topics.removeDrops(core, tSailing.id, [drop1.id, drop2.id]);
  });

  afterEach(() => {
    cleanup();
    cleanupRender();
    // Clear the selection
    Selection.clear(core);
  });

  describe('delete permanently', () => {
    it('permanently deletes selected drops', () => {
      const { getByLabelText } = render(<DropTrashActions dropId={drop1.id} />);

      act(() => {
        // Select a couple of drops
        Selection.select(core, [Selection.item(drop1), Selection.item(drop2)]);
      });

      // Get the delete permanently button label text
      const label = i18n.t('deletePermanently');

      act(() => {
        // Click the delete permanently button
        fireEvent.click(getByLabelText(label));
      });

      // Drops should no longer exist
      expect(Drops.store.get(drop1.id)).toBeUndefined();
      expect(Drops.store.get(drop2.id)).toBeUndefined();
    });

    it('exclusively selects the drop if not selected', () => {
      const { getByLabelText } = render(<DropTrashActions dropId={drop1.id} />);

      act(() => {
        // Select drop2
        Selection.select(core, [Selection.item(drop2)]);
      });

      // Get the delete permanently button label text
      const label = i18n.t('deletePermanently');

      act(() => {
        // Click the delete permanently button
        fireEvent.click(getByLabelText(label));
      });

      // Should delete drop1
      expect(Drops.store.get(drop1.id)).toBeUndefined();
      // Should not delete drop2
      expect(Drops.store.get(drop2.id)).toBeDefined();
    });

    it('clears selected drops', () => {
      const { getByLabelText } = render(<DropTrashActions dropId={drop1.id} />);

      act(() => {
        // Select a couple of drops
        Selection.select(core, [Selection.item(drop1), Selection.item(drop2)]);
      });

      // Get the delete permanently button label text
      const label = i18n.t('deletePermanently');

      act(() => {
        // Click the delete permanently button
        fireEvent.click(getByLabelText(label));
      });

      // Should clear selected drops
      expect(Selection.get()).toEqual([]);
    });
  });

  describe('restore', () => {
    it('restores selected drops to the selected topic', () => {
      const { getByLabelText, getByText } = render(
        <DropTrashActions dropId={drop1.id} />,
      );

      act(() => {
        // Select a couple of drops
        Selection.select(core, [Selection.item(drop1), Selection.item(drop2)]);
      });

      // Get the restore button label text
      const label = i18n.t('restore');

      act(() => {
        // Click the restore button
        fireEvent.click(getByLabelText(label));
      });

      act(() => {
        // Click the 'Sailing' topic
        fireEvent.click(getByText(tSailing.title));
      });

      // Get an updated drop
      const drop = Drops.get(drop1.id);
      // Get the updated parent topic
      const topic = Topics.get(tSailing.id);

      // Drops should no longer be deleted
      expect(drop.deleted).toBeUndefined();
      // 'Sailing' topic should contain the drops
      expect(topic.drops).toContain(drop1.id);
      expect(topic.drops).toContain(drop2.id);
    });

    it('exclusively selects the drop if not selected', () => {
      const { getByLabelText, getByText } = render(
        <DropTrashActions dropId={drop1.id} />,
      );

      act(() => {
        // Select drop2
        Selection.select(core, [Selection.item(drop2)]);
      });

      // Get the restore button label text
      const label = i18n.t('restore');

      act(() => {
        // Click the restore button
        fireEvent.click(getByLabelText(label));
      });

      act(() => {
        // Click the 'Sailing' topic
        fireEvent.click(getByText(tSailing.title));
      });

      // drop1 should no longer be deleted
      expect(Drops.get(drop1.id).deleted).toBeUndefined();
      // drop2 should still be deleted
      expect(Drops.get(drop2.id).deleted).toBe(true);
    });

    it('clears selected drops', () => {
      const { getByLabelText, getByText } = render(
        <DropTrashActions dropId={drop1.id} />,
      );

      act(() => {
        // Select a couple of drops
        Selection.select(core, [Selection.item(drop1), Selection.item(drop2)]);
      });

      // Get the restore button label text
      const label = i18n.t('restore');

      act(() => {
        // Click the restore button
        fireEvent.click(getByLabelText(label));
      });

      act(() => {
        // Click the 'Sailing' topic
        fireEvent.click(getByText(tSailing.title));
      });

      // Should clear selected drops
      expect(Selection.get()).toEqual([]);
    });

    it('calls `onDropdownOpenChange` when opened/closed', () => {
      const onDropdownOpenChange = jest.fn();

      // Render with an onDropdownOpenChange callback
      const { getByLabelText, getByText } = render(
        <DropTrashActions
          dropId={drop1.id}
          onDropdownOpenChange={onDropdownOpenChange}
        />,
      );

      // Get the restore button label text
      const label = i18n.t('restore');

      act(() => {
        // Click the restore button
        fireEvent.click(getByLabelText(label));
      });

      // Should have called `onDropdownOpenChange`
      expect(onDropdownOpenChange).toHaveBeenCalledWith(true);

      // Clear the callback mock
      onDropdownOpenChange.mockClear();

      act(() => {
        // Click the 'Sailing' topic
        fireEvent.click(getByText(tSailing.title));
      });

      // Should have called `onDropdownOpenChange` again
      expect(onDropdownOpenChange).toHaveBeenCalledWith(false);
    });
  });
});
