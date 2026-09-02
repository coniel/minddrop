import React from 'react';
import { TagsCombobox } from '@minddrop/ui-tags';
import { useTableEditContext } from '../TableEditContext';
import { TableColumn } from '../types';

interface TagsCellProps {
  /**
   * The entry's tag names.
   */
  value: string[];

  /**
   * The column configuration including the tag group limit.
   */
  column: TableColumn;
}

/**
 * Renders the active editing state of a tags cell: an open multi
 * value tag picker with create-on-type.
 */
export const TagsCell: React.FC<TagsCellProps> = ({ value, column }) => {
  const { activeCell, onCellChange, deactivate } = useTableEditContext();

  // Commit the picked tag names
  function handleChange(names: string[]): void {
    onCellChange(activeCell!.rowId, activeCell!.columnId, names);
  }

  // Return the cell to its display state when the picker closes
  function handleOpenChange(open: boolean): void {
    if (!open) {
      deactivate();
    }
  }

  return (
    <TagsCombobox
      open
      variant="subtle"
      size="md"
      group={column.group}
      value={value}
      onChange={handleChange}
      onOpenChange={handleOpenChange}
    />
  );
};

TagsCell.displayName = 'TagsCell';
