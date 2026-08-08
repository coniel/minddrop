import { useMemo } from 'react';
import { Collections } from '@minddrop/collections';
import { DataViewTypeSettingsMenuProps, DataViews } from '@minddrop/data-views';
import { Databases } from '@minddrop/databases';
import { DatabaseLayoutSelectionMenu } from '@minddrop/ui-components';
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
  MenuGroup,
  MenuLabel,
} from '@minddrop/ui-primitives';
import { defaultBoardViewData } from '../constants';
import { BoardViewData, BoardViewOptions } from '../types';

/**
 * Renders the board view settings menu content with a card
 * layout picker per database and board level actions.
 */
export const BoardViewOptionsMenu: React.FC<
  DataViewTypeSettingsMenuProps<BoardViewOptions, BoardViewData>
> = ({ view, options, onUpdateOptions }) => {
  // Load the collection backing the view
  const collection = Collections.use(view.dataSource.id);

  // Derive the databases the collection's entries belong to
  const databaseIds = useMemo(() => {
    if (!collection) {
      return [];
    }

    return Databases.getFromEntries(collection.items).map(
      (database) => database.id,
    );
  }, [collection]);

  // Set the card layout override for the database the
  // selection belongs to
  function handleLayoutChange(layoutId: string, databaseId?: string) {
    if (!databaseId) {
      return;
    }

    onUpdateOptions({
      cardLayoutOverrides: {
        ...options.cardLayoutOverrides,
        [databaseId]: layoutId,
      },
    });
  }

  // Append an empty column to the end of the board
  function handleAddColumn() {
    const columns = view.data?.columns || defaultBoardViewData.columns;

    DataViews.update(view.id, { data: { columns: [...columns, []] } });
  }

  return (
    <>
      {/* Board actions */}
      <MenuGroup>
        <MenuLabel label="dataViews.board.label" />
        <DropdownMenuItem
          label="dataViews.board.addColumn"
          icon="plus"
          onSelect={handleAddColumn}
        />
      </MenuGroup>

      <DropdownMenuSeparator />

      {/* Card layout picker */}
      <DatabaseLayoutSelectionMenu
        databaseId={databaseIds}
        layoutType="card"
        value={options.cardLayoutOverrides || {}}
        onValueChange={handleLayoutChange}
      />
    </>
  );
};
