import React from 'react';
import { Collections } from '@minddrop/collections';
import { DatabaseEntries } from '@minddrop/databases';
import { Events, OpenConfirmationDialogEvent } from '@minddrop/events';
import { useTranslation } from '@minddrop/i18n';
import {
  Text,
  ToolbarIconButton,
  ToolbarSeparator,
  ViewFloatingToolbar,
} from '@minddrop/ui-primitives';
import { useDatabaseEntryContext } from '../DatabaseEntryContext';
import './SelectedEntriesToolbar.css';

export interface SelectedEntriesToolbarProps {
  /**
   * The IDs of the selected entries.
   */
  entryIds: string[];

  /**
   * Callback fired when the selection is cleared, either by the
   * clear selection action or after an action consumed it.
   */
  onClearSelection: () => void;
}

/**
 * Renders a floating toolbar containing the actions applied to
 * the currently selected entries, including the actions specific
 * to the source the entries are rendered from. Renders nothing
 * when no entries are selected.
 *
 * Pinned to the bottom of the nearest positioned ancestor.
 */
export const SelectedEntriesToolbar: React.FC<SelectedEntriesToolbarProps> = ({
  entryIds,
  onClearSelection,
}) => {
  const { t } = useTranslation();
  const { source } = useDatabaseEntryContext();

  // The collection the entries are rendered from, when rendered
  // from a collection
  const collectionId = source?.type === 'collection' ? source.id : undefined;

  // Plural translation key for the selected entry count
  const countKey =
    entryIds.length === 1
      ? 'databases.entries.selection.count_one'
      : 'databases.entries.selection.count_other';

  // Remove the selected entries from the collection they are
  // rendered from
  async function handleRemoveFromCollection() {
    if (!collectionId) {
      return;
    }

    onClearSelection();

    await Collections.removeItems(collectionId, entryIds);
  }

  // Confirm before deleting the selected entries
  function handleDelete() {
    Events.dispatch(OpenConfirmationDialogEvent, {
      title: 'databases.entries.selection.deleteConfirmation.title',
      message: 'databases.entries.selection.deleteConfirmation.message',
      confirmLabel: 'databases.entries.selection.deleteConfirmation.confirm',
      onConfirm: deleteEntries,
    });
  }

  // Delete the selected entries, moving their files to the trash
  async function deleteEntries() {
    const deletedIds = entryIds;

    onClearSelection();

    await Promise.all(
      deletedIds.map((entryId) => DatabaseEntries.delete(entryId)),
    );

    // Drop the deleted entries from the collection they were
    // rendered from so that it does not reference deleted entries
    if (collectionId) {
      await Collections.removeItems(collectionId, deletedIds);
    }
  }

  // No entries are selected
  if (entryIds.length === 0) {
    return null;
  }

  return (
    <ViewFloatingToolbar
      visible
      position="absolute"
      className="selected-entries-toolbar"
    >
      {/* The number of selected entries */}
      <Text
        size="sm"
        color="muted"
        className="selected-entries-toolbar-count"
        stringText={t(countKey, { count: entryIds.length })}
      />

      <ToolbarSeparator />

      {/* Remove the entries from the collection they are rendered from */}
      {collectionId && (
        <ToolbarIconButton
          size="lg"
          icon="circle-minus"
          label="databases.entries.actions.removeFromCollection"
          tooltip={{
            title: 'databases.entries.actions.removeFromCollection',
            side: 'top',
          }}
          onClick={handleRemoveFromCollection}
        />
      )}

      <ToolbarIconButton
        size="lg"
        icon="trash-2"
        danger="on-hover"
        label="databases.entries.selection.delete"
        tooltip={{ title: 'databases.entries.selection.delete', side: 'top' }}
        onClick={handleDelete}
      />

      <ToolbarSeparator />

      <ToolbarIconButton
        size="lg"
        icon="x"
        label="databases.entries.selection.clear"
        tooltip={{ title: 'databases.entries.selection.clear', side: 'top' }}
        onClick={onClearSelection}
      />
    </ViewFloatingToolbar>
  );
};
