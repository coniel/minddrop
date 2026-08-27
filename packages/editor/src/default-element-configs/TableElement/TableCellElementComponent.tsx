import React, { useContext, useRef } from 'react';
import { Path } from 'slate';
import { ReactEditor, useSlateStatic } from 'slate-react';
import { TableCellElement, TableColumnAlignment } from '@minddrop/ast';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  IconButton,
} from '@minddrop/ui-primitives';
import { insertTableColumn } from '../../tables/insertTableColumn';
import { removeTableColumn } from '../../tables/removeTableColumn';
import { setTableColumnAlignment } from '../../tables/setTableColumnAlignment';
import { BlockElementProps } from '../../types';
import { TableAlignContext } from './TableAlignContext';

/**
 * Renders a table cell, aligned as its column declares. Header cells carry
 * the column menu.
 */
export const TableCellElementComponent: React.FC<
  BlockElementProps<TableCellElement>
> = ({ children, attributes, element }) => {
  const editor = useSlateStatic();
  const align = useContext(TableAlignContext);

  // Where the cell sits within its table
  const path = ReactEditor.findPath(editor, element);
  const columnIndex = path[path.length - 1];
  const rowIndex = path[path.length - 2];
  const tablePath = path.slice(0, -2);

  // The alignment the cell's column declares
  const alignment = align[columnIndex] ?? null;

  return (
    <td
      {...attributes}
      className="table-cell-element"
      data-header={rowIndex === 0 || undefined}
      style={alignment ? { textAlign: alignment } : undefined}
    >
      {children}

      {/* Column controls live on the header cells */}
      {rowIndex === 0 && (
        <span className="table-cell-column-menu" contentEditable={false}>
          <TableColumnMenu
            tablePath={tablePath}
            columnIndex={columnIndex}
            alignment={alignment}
          />
        </span>
      )}
    </td>
  );
};

interface TableColumnMenuProps {
  /**
   * The path of the table the column belongs to.
   */
  tablePath: Path;

  /**
   * The index of the column.
   */
  columnIndex: number;

  /**
   * The column's alignment.
   */
  alignment: TableColumnAlignment;
}

/**
 * Renders the menu holding a table column's actions: alignment, insertion
 * and removal.
 */
const TableColumnMenu: React.FC<TableColumnMenuProps> = ({
  tablePath,
  columnIndex,
  alignment,
}) => {
  // Whether an action ran, in which case the editor takes the focus once
  // the menu has fully closed. Focusing any earlier loses out to the
  // menu's own focus handling during its close.
  const focusOnCloseRef = useRef(false);
  const editor = useSlateStatic();

  const handleAlignmentChange = (value: unknown) => {
    setTableColumnAlignment(editor, tablePath, columnIndex, toAlignment(value));
  };

  const handleInsertLeft = () => {
    focusOnCloseRef.current = true;

    insertTableColumn(editor, tablePath, columnIndex);
  };

  const handleInsertRight = () => {
    focusOnCloseRef.current = true;

    insertTableColumn(editor, tablePath, columnIndex + 1);
  };

  const handleDelete = () => {
    focusOnCloseRef.current = true;

    removeTableColumn(editor, tablePath, columnIndex);
  };

  const handleOpenChangeComplete = (open: boolean) => {
    // Only a completed close after an action passes the focus on. Plain
    // dismissals leave it wherever the dismissal put it.
    if (open || !focusOnCloseRef.current) {
      return;
    }

    focusOnCloseRef.current = false;

    // The action already placed the selection, so focusing shows it
    ReactEditor.focus(editor);
  };

  return (
    <DropdownMenu
      onOpenChangeComplete={handleOpenChangeComplete}
      // The close must not move focus itself, which would race the
      // hand-over to the editor above
      finalFocus={false}
      trigger={
        <IconButton
          label="editor.table.columnOptions"
          icon="ellipsis"
          size="sm"
        />
      }
    >
      <DropdownMenuRadioGroup
        value={alignment ?? 'none'}
        onValueChange={handleAlignmentChange}
      >
        <DropdownMenuRadioItem
          value="none"
          label="editor.table.alignNone"
          icon="x"
        />
        <DropdownMenuRadioItem
          value="left"
          label="editor.table.alignLeft"
          icon="align-left"
        />
        <DropdownMenuRadioItem
          value="center"
          label="editor.table.alignCenter"
          icon="align-center"
        />
        <DropdownMenuRadioItem
          value="right"
          label="editor.table.alignRight"
          icon="align-right"
        />
      </DropdownMenuRadioGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        label="editor.table.insertColumnLeft"
        icon="arrow-left-to-line"
        onSelect={handleInsertLeft}
      />
      <DropdownMenuItem
        label="editor.table.insertColumnRight"
        icon="arrow-right-to-line"
        onSelect={handleInsertRight}
      />
      <DropdownMenuSeparator />
      <DropdownMenuItem
        label="editor.table.deleteColumn"
        icon="trash-2"
        onSelect={handleDelete}
      />
    </DropdownMenu>
  );
};

/**
 * Returns the column alignment a menu value names.
 *
 * @param value - The menu value.
 * @returns The column alignment.
 */
function toAlignment(value: unknown): TableColumnAlignment {
  if (value === 'left' || value === 'center' || value === 'right') {
    return value;
  }

  return null;
}
