import React, { useEffect, useRef, useState } from 'react';
import { ReactEditor, useSlateStatic } from 'slate-react';
import { TableElement } from '@minddrop/ast';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
  IconButton,
  ScrollArea,
} from '@minddrop/ui-primitives';
import { insertTableColumn } from '../../tables/insertTableColumn';
import { insertTableRow } from '../../tables/insertTableRow';
import { removeTableRow } from '../../tables/removeTableRow';
import { BlockElementProps } from '../../types';
import { TableAlignContext } from './TableAlignContext';
import './TableElementComponent.css';

interface HoveredRow {
  /**
   * The row's index within the table.
   */
  index: number;

  /**
   * The row's vertical centre relative to the control rail.
   */
  center: number;
}

/**
 * Renders a table as a grid of rows and cells, with controls beside it for
 * adding a row or a column and a menu of actions for the hovered row.
 */
export const TableElementComponent: React.FC<
  BlockElementProps<TableElement>
> = ({ children, attributes, element }) => {
  const editor = useSlateStatic();
  const railRef = useRef<HTMLDivElement>(null);

  // The row the pointer is level with, tracked by pointer position rather
  // than row hover so that the area beside the table triggers it too
  const [hoveredRow, setHoveredRow] = useState<HoveredRow | null>(null);

  // Whether the row menu is open or still closing, which pins the hovered
  // row in place: dropping the row unmounts the menu, which must live to
  // the end of its close to hand the focus on
  const [rowMenuActive, setRowMenuActive] = useState(false);

  // Typing hides the controls until the pointer moves again, as it does
  // the block hover controls
  const [controlsHidden, setControlsHidden] = useState(false);

  const handleAddColumn = () => {
    const path = ReactEditor.findPath(editor, element);

    // The button holds the DOM focus, which the editor needs back for the
    // cursor to land in the new column
    ReactEditor.focus(editor);

    insertTableColumn(editor, path, element.align.length);
  };

  // Tracked through pointer events rather than mouse events, since typing
  // makes the browser re-dispatch synthetic mouse moves for the content
  // shifting under a resting cursor, which would undo the hiding below
  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    // Moving the pointer brings hidden controls back
    if (controlsHidden) {
      setControlsHidden(false);
    }

    // The menu anchors to the row's controls, which must not move or
    // disappear while it is open or closing
    if (rowMenuActive || !railRef.current) {
      return;
    }

    const next = resolveHoveredRow(event, railRef.current);

    // Keep the current object while nothing changed, avoiding a re-render
    // on every pointer move
    setHoveredRow((current) => (isSameRow(current, next) ? current : next));
  };

  // Typing anywhere in the editor hides the controls, as it does the block
  // hover controls. Listened for natively on the editor element because
  // the editor stops key events propagating any further through React.
  useEffect(() => {
    const editorElement = ReactEditor.toDOMNode(editor, editor);

    const handleKeyDown = () => {
      setControlsHidden(true);
      setHoveredRow(null);
    };

    editorElement.addEventListener('keydown', handleKeyDown);

    return () => {
      editorElement.removeEventListener('keydown', handleKeyDown);
    };
  }, [editor]);

  const handlePointerLeave = () => {
    // The menu keeps its row until it has fully closed
    if (rowMenuActive) {
      return;
    }

    setHoveredRow(null);
  };

  const handleRowMenuOpenChange = (open: boolean) => {
    // Closing is handled once it completes, keeping the menu mounted
    // through its close
    if (open) {
      setRowMenuActive(true);
    }
  };

  const handleRowMenuOpenChangeComplete = (open: boolean) => {
    // Only a completed close releases the row. The menu's action may have
    // moved or removed it, so the controls are dropped until the pointer
    // settles on a row again.
    if (!open) {
      setRowMenuActive(false);
      setHoveredRow(null);
    }
  };

  return (
    <div
      className="table-element"
      {...attributes}
      data-controls-hidden={controlsHidden || undefined}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className="table-element-body">
        {/* A table wider than the editor scrolls rather than overflowing it */}
        <ScrollArea className="table-element-scroll">
          <table className="table-element-grid">
            <tbody>
              <TableAlignContext.Provider value={element.align}>
                {children}
              </TableAlignContext.Provider>
            </tbody>
          </table>
        </ScrollArea>

        {/* Controls beside the table, outside its scrollable area */}
        <div
          className="table-element-rail"
          contentEditable={false}
          ref={railRef}
        >
          {/* Actions for the row the pointer is level with */}
          {hoveredRow && (
            <span
              className="table-element-row-menu"
              style={{ top: hoveredRow.center }}
            >
              <TableRowMenu
                element={element}
                rowIndex={hoveredRow.index}
                onOpenChange={handleRowMenuOpenChange}
                onOpenChangeComplete={handleRowMenuOpenChangeComplete}
              />
            </span>
          )}

          {/* Appends a column, in line with the header row */}
          <span className="table-element-add-column">
            <IconButton
              label="editor.table.addColumn"
              icon="plus"
              size="sm"
              onClick={handleAddColumn}
            />
          </span>
        </div>
      </div>
    </div>
  );
};

interface TableRowMenuProps {
  /**
   * The table the row belongs to.
   */
  element: TableElement;

  /**
   * The index of the row.
   */
  rowIndex: number;

  /**
   * Called when the menu opens or closes.
   */
  onOpenChange: (open: boolean) => void;

  /**
   * Called when the menu has fully opened or closed.
   */
  onOpenChangeComplete: (open: boolean) => void;
}

/**
 * Renders the menu holding a table row's actions: insertion and removal.
 */
const TableRowMenu: React.FC<TableRowMenuProps> = ({
  element,
  rowIndex,
  onOpenChange,
  onOpenChangeComplete,
}) => {
  // Whether an action ran, in which case the editor takes the focus once
  // the menu has fully closed. Focusing any earlier loses out to the
  // menu's own focus handling during its close.
  const focusOnCloseRef = useRef(false);
  const editor = useSlateStatic();

  const handleInsertAbove = () => {
    focusOnCloseRef.current = true;

    insertTableRow(editor, ReactEditor.findPath(editor, element), rowIndex);
  };

  const handleInsertBelow = () => {
    focusOnCloseRef.current = true;

    insertTableRow(editor, ReactEditor.findPath(editor, element), rowIndex + 1);
  };

  const handleDelete = () => {
    focusOnCloseRef.current = true;

    removeTableRow(editor, ReactEditor.findPath(editor, element), rowIndex);
  };

  const handleOpenChangeComplete = (open: boolean) => {
    // A completed close after an action passes the focus on. Plain
    // dismissals leave it wherever the dismissal put it.
    if (!open && focusOnCloseRef.current) {
      focusOnCloseRef.current = false;

      // The action already placed the selection, so focusing shows it
      ReactEditor.focus(editor);
    }

    // Notified last: the close releases the hovered row, unmounting this
    // menu
    onOpenChangeComplete(open);
  };

  return (
    <DropdownMenu
      onOpenChange={onOpenChange}
      onOpenChangeComplete={handleOpenChangeComplete}
      // The close must not move focus itself, which would race the
      // hand-over to the editor above
      finalFocus={false}
      trigger={
        <IconButton
          label="editor.table.rowOptions"
          icon="ellipsis-vertical"
          size="sm"
        />
      }
    >
      <DropdownMenuItem
        label="editor.table.insertRowAbove"
        icon="arrow-up-to-line"
        onSelect={handleInsertAbove}
      />
      <DropdownMenuItem
        label="editor.table.insertRowBelow"
        icon="arrow-down-to-line"
        onSelect={handleInsertBelow}
      />
      <DropdownMenuSeparator />
      <DropdownMenuItem
        label="editor.table.deleteRow"
        icon="trash-2"
        onSelect={handleDelete}
      />
    </DropdownMenu>
  );
};

/**
 * Returns the row the pointer is level with, positioned relative to the
 * control rail.
 *
 * @param event - The pointer event.
 * @param rail - The control rail element.
 * @returns The hovered row, or null when the pointer is level with none.
 */
function resolveHoveredRow(
  event: React.PointerEvent<HTMLDivElement>,
  rail: HTMLDivElement,
): HoveredRow | null {
  const rows = event.currentTarget.querySelectorAll('tr');
  const railRect = rail.getBoundingClientRect();

  // Find the row whose vertical span the pointer is level with. The
  // header row has no menu, its slot being the column append's.
  for (let index = 1; index < rows.length; index += 1) {
    const rect = rows[index].getBoundingClientRect();

    if (event.clientY >= rect.top && event.clientY <= rect.bottom) {
      return { index, center: rect.top + rect.height / 2 - railRect.top };
    }
  }

  return null;
}

/**
 * Checks whether two hovered rows are the same row at the same position.
 *
 * @param row - A hovered row.
 * @param other - Another hovered row.
 * @returns Whether the rows match.
 */
function isSameRow(row: HoveredRow | null, other: HoveredRow | null): boolean {
  if (!row || !other) {
    return row === other;
  }

  return row.index === other.index && row.center === other.center;
}
