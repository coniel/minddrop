import { useEffect, useRef, useState } from 'react';
import {
  ApplyElementDragOptions,
  DesignElement,
  DesignElementConfigs,
  Designs,
  ElementDragMode,
} from '@minddrop/designs-next';
import { usePopupDismissPress } from '@minddrop/ui-primitives';
import { useDeleteKey, useModKeyHeld } from '@minddrop/utils';
import { DesignElementInsertMenu } from '../DesignElementInsertMenu';
import { resolveElementClass } from '../utils';
import { SizeLabel } from './SizeLabel';
import './DesignBlockEditor.css';

export interface DesignBlockEditorProps {
  /**
   * The elements being edited.
   */
  elements: DesignElement[];

  /**
   * The design's width in grid units.
   */
  columns: number;

  /**
   * The design's height in grid units.
   */
  rows: number;

  /**
   * The snap resolution in grid units.
   */
  snap: number;

  /**
   * The rendered pixel size of a grid unit, acting as the editor's
   * display scale.
   */
  unitSize: number;

  /**
   * The ID of the selected element, or null when nothing is
   * selected.
   */
  selectedId: string | null;

  /**
   * Callback fired with the updated elements as a drag moves or
   * resizes an element.
   */
  onElementsChange: (elements: DesignElement[]) => void;

  /**
   * Callback fired when the selection changes.
   */
  onSelectionChange: (elementId: string | null) => void;

  /**
   * Callback fired with the new row count as the surface's bottom
   * edge is dragged. When omitted, the surface height is not
   * adjustable.
   */
  onRowsChange?: (rows: number) => void;

  /**
   * Callback fired when an element or surface drag begins.
   */
  onDragStart?: () => void;

  /**
   * Callback fired when an element or surface drag ends.
   */
  onDragEnd?: () => void;
}

interface DragState {
  /**
   * The interaction being performed.
   */
  mode: ElementDragMode;

  /**
   * The ID of the element being dragged.
   */
  elementId: string;

  /**
   * Pointer position at drag start.
   */
  startX: number;
  startY: number;

  /**
   * Snapshot of the element at drag start, used as the base for
   * applying the drag delta.
   */
  original: DesignElement;

  /**
   * Screen pixels per grid unit at drag start, converting pointer
   * deltas within a scaled viewport.
   */
  unitScreenSize: number;
}

interface SurfaceDragState {
  /**
   * Pointer position at drag start.
   */
  startY: number;

  /**
   * The design's row count at drag start.
   */
  startRows: number;

  /**
   * Screen pixels per grid unit at drag start, converting pointer
   * deltas within a scaled viewport.
   */
  unitScreenSize: number;
}

interface GridPoint {
  /**
   * The column of the grid square in grid units.
   */
  column: number;

  /**
   * The row of the grid square in grid units.
   */
  row: number;
}

interface GridArea extends GridPoint {
  /**
   * The area's width in grid units.
   */
  columnSpan: number;

  /**
   * The area's height in grid units.
   */
  rowSpan: number;
}

// The resize handles rendered on every block, keyed by drag mode.
// Corners come last so they sit on top where they overlap edges.
const ResizeHandles: ElementDragMode[] = [
  'resize-left',
  'resize-right',
  'resize-top',
  'resize-bottom',
  'resize-top-left',
  'resize-top-right',
  'resize-bottom-left',
  'resize-bottom-right',
];

// How long a press is held before it counts as a drag and brings
// the grid over the blocks, in milliseconds. Keeps a press which
// only selects a block from flashing the grid over the design.
const DragEngageDelay = 160;

/**
 * Renders the block editor surface: the design's unit grid with a
 * draggable block per element. Moving snaps the element's edges onto
 * the snap grid, resizing snaps the drag delta, and grid lines draw
 * at the snap resolution. Marking out an area of the grid offers the
 * element types in a menu, inserting the picked one on that area.
 * An area spanning more than a single square reads out its size in
 * snap units, as does a block being resized. A press which marks a
 * single square inserts the element at its type's default size
 * instead. A right click anchors the area
 * instead of holding a button down, stretching it on pointer moves
 * alone until a click commits it. Holding the mod key brings the grid
 * in front of the blocks, opening the squares they cover to the same
 * insert.
 */
export const DesignBlockEditor: React.FC<DesignBlockEditorProps> = ({
  elements,
  columns,
  rows,
  snap,
  unitSize,
  selectedId,
  onElementsChange,
  onSelectionChange,
  onRowsChange,
  onDragStart,
  onDragEnd,
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const insertMarkerRef = useRef<HTMLDivElement>(null);
  const gridOverlayRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const surfaceDragRef = useRef<SurfaceDragState | null>(null);
  const insertDragRef = useRef<GridPoint | null>(null);
  const insertPendingRef = useRef(false);
  const [draggedElementId, setDraggedElementId] = useState<string | null>(null);
  const [resizedElementId, setResizedElementId] = useState<string | null>(null);
  const [dragEngaged, setDragEngaged] = useState(false);
  const [insertArea, setInsertArea] = useState<GridArea | null>(null);
  const [insertAnchor, setInsertAnchor] = useState<GridPoint | null>(null);
  const [insertMenuOpen, setInsertMenuOpen] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState<GridPoint | null>(null);
  const modKeyHeld = useModKeyHeld(true);
  const wasDismissingPopup = usePopupDismissPress();

  // The grid comes in front of the blocks while the mod key is held,
  // so the squares they cover can be inserted on, and while an area
  // is anchored, whose stretching would otherwise stop at the first
  // block the pointer crossed: a block under the pointer takes the
  // move, and no button is down to capture the pointer with.
  const gridInFront = modKeyHeld || insertAnchor !== null;

  // Whether the grid is drawn over the blocks, which an engaged
  // drag, an accepted drop and the held mod key each call for.
  const gridOverBlocks = dragEngaged || gridInFront;

  // Whether the marked area's size is read out on it. A single
  // square is left unread: the insert leaves the element at its
  // type's default size rather than taking the marked size.
  const readOutInsertSize =
    insertArea !== null &&
    (insertArea.columnSpan > snap || insertArea.rowSpan > snap);

  // Engage a press as a drag once it has been held, so a press which
  // only selects a block never brings the grid up. A press which
  // moves the block engages it on the move instead.
  useEffect(() => {
    if (draggedElementId === null) {
      setDragEngaged(false);

      return;
    }

    const timeout = window.setTimeout(
      () => setDragEngaged(true),
      DragEngageDelay,
    );

    return () => window.clearTimeout(timeout);
  }, [draggedElementId]);

  // Drop the hovered square as the grid goes back behind the blocks,
  // which leaves no pointer event to clear it.
  useEffect(() => {
    if (!gridInFront) {
      setHoveredPoint(null);
    }
  }, [gridInFront]);

  // Drop an anchored area on Escape, the way out of an anchor which
  // does not insert. Every other way out commits it.
  useEffect(() => {
    if (!insertAnchor) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape') {
        return;
      }

      setInsertAnchor(null);
      setInsertArea(null);
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [insertAnchor]);

  // Measures the screen pixels per grid unit, which a scaled
  // viewport (e.g. a zoomed canvas) sets apart from the unit size.
  // Falls back to the unit size while the surface has no layout.
  function measureUnitScreenSize(): number {
    const width = rootRef.current?.getBoundingClientRect().width;

    return width ? width / columns : unitSize;
  }

  // Resolves the grid square a position within the surface lands in,
  // taking the position in the surface's own coordinate space, the
  // one the grid lines and blocks are laid out in. Rounds down
  // rather than to the nearest grid line, so the whole square under
  // the pointer belongs to it.
  //
  // A grid line draws at its square's start but reads as the closing
  // edge of the square before it, so the position is pulled back by
  // the line's width, putting a position on a line on the square
  // above or to the left of the one the line opens.
  function resolveGridPoint(offsetX: number, offsetY: number): GridPoint {
    // The line's width in the surface's coordinate space. Lines draw
    // one screen pixel wide, so a zoomed canvas thins them.
    const lineWidth = unitSize / measureUnitScreenSize();

    return {
      column: resolveGridUnits(offsetX - lineWidth, unitSize, snap),
      row: resolveGridUnits(offsetY - lineWidth, unitSize, snap),
    };
  }

  // The area spanning two grid squares, the corners of a drag, held
  // inside the design. Dragging past the bottom edge grows into the
  // rows the surface can grow to.
  function resolveGridArea(start: GridPoint, end: GridPoint): GridArea {
    const column = Math.min(start.column, end.column);
    const row = Math.min(start.row, end.row);
    const maxRows = onRowsChange ? Designs.constants.MaxRows : rows;

    return {
      column,
      row,
      // The squares at both ends are inside the area, so the span
      // covers one more square than the distance between them.
      columnSpan: Math.min(
        Math.abs(end.column - start.column) + snap,
        columns - column,
      ),
      rowSpan: Math.min(Math.abs(end.row - start.row) + snap, maxRows - row),
    };
  }

  // Inserts elements of the given types on the given grid area, kept
  // inside the design and growing it when it can. An area larger than
  // a single square sizes the elements to it, while one square leaves
  // them at their type's default size. The last one is selected.
  function insertElements(types: string[], area: GridArea) {
    // The height the surface can grow to for the inserted elements
    const maxRows = onRowsChange ? Designs.constants.MaxRows : rows;
    const sized = area.columnSpan > snap || area.rowSpan > snap;

    const inserted = types.map((type) => {
      const element = Designs.createElement(type, area);

      // Take the dragged out area's size
      if (sized) {
        element.columnSpan = area.columnSpan;
        element.rowSpan = area.rowSpan;
      }

      // Keep the element inside the design
      element.column = clamp(element.column, 0, columns - element.columnSpan);
      element.row = clamp(element.row, 0, maxRows - element.rowSpan);

      return element;
    });

    onElementsChange([...elements, ...inserted]);

    // Grow the surface to fit the elements
    const contentBottom = inserted.reduce(
      (bottom, element) => Math.max(bottom, element.row + element.rowSpan),
      0,
    );

    if (contentBottom > rows) {
      onRowsChange?.(contentBottom);
    }

    onSelectionChange(inserted[inserted.length - 1].id);
  }

  // Remove the selected element on Delete or Backspace
  useDeleteKey(() => {
    onElementsChange(elements.filter((element) => element.id !== selectedId));
    onSelectionChange(null);
  }, selectedId !== null);

  // Begins a move or resize drag on an element, selecting it
  function handleElementPointerDown(
    event: React.PointerEvent<HTMLDivElement>,
    elementId: string,
    mode: ElementDragMode,
  ) {
    const element = elements.find((current) => current.id === elementId);

    if (!element) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    // Capture so moves keep arriving while the pointer leaves the element
    event.currentTarget.setPointerCapture(event.pointerId);

    dragRef.current = {
      mode,
      elementId,
      startX: event.clientX,
      startY: event.clientY,
      original: element,
      unitScreenSize: measureUnitScreenSize(),
    };
    // Track the dragged element so the grid overlay can layer the
    // other blocks beneath the grid while positioning.
    setDraggedElementId(elementId);

    // Read the block's size out on it while it is being resized
    if (mode !== 'move') {
      setResizedElementId(elementId);
    }

    onSelectionChange(elementId);
    onDragStart?.();
  }

  // Applies the drag delta to the dragged element
  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;

    if (!drag) {
      return;
    }

    // A press which moves the block is a drag, without waiting out
    // the hold which engages a still one.
    setDragEngaged(true);

    // The element type's block behaviour constraints
    const config = DesignElementConfigs.get(drag.original.type, false);

    // Let bottom-edge resizes extend past the layout when it can grow
    const growable = drag.mode.includes('bottom') && Boolean(onRowsChange);

    // Unsnapped delta in grid units, quantized per mode by the drag
    // application.
    const options: ApplyElementDragOptions = {
      mode: drag.mode,
      deltaColumns: (event.clientX - drag.startX) / drag.unitScreenSize,
      deltaRows: (event.clientY - drag.startY) / drag.unitScreenSize,
      columns,
      rows: growable ? Designs.constants.MaxRows : rows,
      snap,
      // Floor the resize at the element type's intrinsic minimum
      minRowSpan: config?.resolveMinRowSpan?.(drag.original),
      // Step vertical resizes by the element type's line height
      rowSpanStep: config?.resolveRowSpanStep?.(drag.original),
    };

    // Apply the drag to the element
    const dragged = Designs.applyElementDrag(drag.original, options);

    onElementsChange(
      elements.map((element) =>
        element.id === drag.elementId ? dragged : element,
      ),
    );

    // Grow the layout with the element's bottom edge as it passes the
    // layout's bottom. The layout never shrinks back during the drag.
    if (growable && dragged.row + dragged.rowSpan > rows) {
      onRowsChange?.(dragged.row + dragged.rowSpan);
    }
  }

  // Ends the active drag
  function handlePointerUp() {
    if (!dragRef.current) {
      return;
    }

    dragRef.current = null;
    setDraggedElementId(null);
    setResizedElementId(null);
    onDragEnd?.();
  }

  // Begins a surface height drag
  function handleSurfacePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    // Capture so moves keep arriving while the pointer leaves the handle
    event.currentTarget.setPointerCapture(event.pointerId);

    surfaceDragRef.current = {
      startY: event.clientY,
      startRows: rows,
      unitScreenSize: measureUnitScreenSize(),
    };
    onDragStart?.();
  }

  // Applies the height drag, snapping the bottom edge onto the snap
  // grid and flooring it at the lowest element's bottom edge.
  function handleSurfacePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const drag = surfaceDragRef.current;

    if (!drag || !onRowsChange) {
      return;
    }

    // The lowest element bottom edge, keeping every element inside
    // the design.
    const contentBottom = elements.reduce(
      (bottom, element) => Math.max(bottom, element.row + element.rowSpan),
      0,
    );

    // Snap the dragged edge onto the snap grid
    const deltaRows = (event.clientY - drag.startY) / drag.unitScreenSize;
    const snapped = Designs.snapToMultiple(drag.startRows + deltaRows, snap);

    onRowsChange(
      Math.min(
        Math.max(snapped, contentBottom, Designs.constants.MinRows),
        Designs.constants.MaxRows,
      ),
    );
  }

  // Ends the surface height drag
  function handleSurfacePointerUp() {
    if (!surfaceDragRef.current) {
      return;
    }

    surfaceDragRef.current = null;
    onDragEnd?.();
  }

  // Whether an event landed on the grid rather than on a block. The
  // overlay held in front of the blocks covers the surface exactly,
  // so a position on it is a position on the surface.
  function isGridTarget(event: React.SyntheticEvent): boolean {
    return (
      event.target === event.currentTarget ||
      event.target === gridOverlayRef.current
    );
  }

  // Begins marking out the area to insert on, clearing the
  // selection with it. Presses bubbling up from elements are theirs,
  // and one made while the menu is open only dismisses it, so moving
  // the area takes a second press.
  function handleGridPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    // Only the primary button marks out an area, the secondary one
    // anchors one instead.
    if (!isGridTarget(event) || event.button !== 0) {
      return;
    }

    // A press which closed a menu or popover has done its job,
    // leaving the selection and marking no area.
    if (wasDismissingPopup()) {
      return;
    }

    onSelectionChange(null);

    if (insertMenuOpen) {
      closeInsertMenu();

      return;
    }

    // An anchored area is committed by the press's click rather than
    // replaced by a fresh drag.
    if (insertAnchor) {
      return;
    }

    // Capture so moves keep arriving while the pointer leaves the
    // surface, which a drag towards the design's edge does.
    event.currentTarget.setPointerCapture(event.pointerId);

    const start = resolveGridPoint(
      event.nativeEvent.offsetX,
      event.nativeEvent.offsetY,
    );

    insertDragRef.current = start;
    insertPendingRef.current = false;
    setInsertArea(resolveGridArea(start, start));
  }

  // Tracks the grid square under the pointer, growing the marked
  // area while one is being dragged out. Moves bubbling up from
  // elements and those made during a block drag mark nothing.
  function handleGridPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!isGridTarget(event) || dragRef.current || surfaceDragRef.current) {
      setHoveredPoint(null);

      return;
    }

    const point = resolveGridPoint(
      event.nativeEvent.offsetX,
      event.nativeEvent.offsetY,
    );

    // Stretch the marked area to the pointer, from the press which
    // is dragging it out or from the anchor it was dropped on. An
    // anchor needs no button held.
    const origin = insertDragRef.current ?? insertAnchor;

    if (origin) {
      setInsertArea(resolveGridArea(origin, point));

      return;
    }

    // Keep the current point while the pointer stays on its square,
    // so only crossing into another square re-renders.
    setHoveredPoint((current) =>
      current?.column === point.column && current.row === point.row
        ? current
        : point,
    );
  }

  // Ends the area drag, leaving the menu to the click which follows
  function handleGridPointerUp() {
    if (!insertDragRef.current) {
      return;
    }

    insertDragRef.current = null;
    insertPendingRef.current = true;
  }

  // Opens the insert menu on the marked area. Waits for the click
  // rather than opening on the release, since the click which
  // follows a release would land outside the popover and dismiss it.
  function handleGridClick() {
    // A click commits the area an anchor has been stretching
    if (insertAnchor) {
      setInsertAnchor(null);
      setInsertMenuOpen(true);

      return;
    }

    if (!insertPendingRef.current) {
      return;
    }

    insertPendingRef.current = false;
    setInsertMenuOpen(true);
  }

  // Anchors the insert area on the right clicked square, so it can
  // be stretched by moving the pointer alone and committed with a
  // click, rather than by holding the button down.
  function handleGridContextMenu(event: React.MouseEvent<HTMLDivElement>) {
    if (!isGridTarget(event)) {
      return;
    }

    event.preventDefault();

    const anchor = resolveGridPoint(
      event.nativeEvent.offsetX,
      event.nativeEvent.offsetY,
    );

    onSelectionChange(null);
    setInsertMenuOpen(false);
    setInsertAnchor(anchor);
    setInsertArea(resolveGridArea(anchor, anchor));
  }

  function handleGridPointerLeave() {
    setHoveredPoint(null);
  }

  // Closes the insert menu, dropping the marked area with it, so an
  // area dismissed without a pick leaves nothing behind.
  function closeInsertMenu() {
    setInsertMenuOpen(false);
    setInsertArea(null);
    setInsertAnchor(null);
  }

  function handleInsertMenuOpenChange(open: boolean) {
    if (!open) {
      closeInsertMenu();
    }
  }

  // Inserts the picked element type on the marked area
  function handleInsertSelect(type: string) {
    if (!insertArea) {
      return;
    }

    insertElements([type], insertArea);
    closeInsertMenu();
  }

  return (
    <div
      ref={rootRef}
      role="presentation"
      className={resolveSurfaceClass(gridOverBlocks, gridInFront)}
      style={{
        width: columns * unitSize,
        height: rows * unitSize,
        // Draw grid lines at the snap resolution
        backgroundSize: `${snap * unitSize}px ${snap * unitSize}px`,
      }}
      onPointerDown={handleGridPointerDown}
      onPointerMove={handleGridPointerMove}
      onPointerUp={handleGridPointerUp}
      onPointerLeave={handleGridPointerLeave}
      onClick={handleGridClick}
      onContextMenu={handleGridContextMenu}
    >
      {elements.map((element) => (
        <div
          key={element.id}
          data-element-id={element.id}
          className={resolveElementClass(
            element.id,
            selectedId,
            draggedElementId,
          )}
          style={{
            left: element.column * unitSize,
            top: element.row * unitSize,
            width: element.columnSpan * unitSize,
            height: element.rowSpan * unitSize,
          }}
          onPointerDown={(event) =>
            handleElementPointerDown(event, element.id, 'move')
          }
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          {ResizeHandles.map((mode) => (
            <div
              key={mode}
              className={`design-block-editor-handle design-block-editor-handle-${mode}`}
              onPointerDown={(event) =>
                handleElementPointerDown(event, element.id, mode)
              }
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
            />
          ))}

          {element.id === resizedElementId && (
            <SizeLabel
              columnSpan={element.columnSpan}
              rowSpan={element.rowSpan}
              snap={snap}
              unitSize={unitSize}
            />
          )}
        </div>
      ))}
      {hoveredPoint && !insertArea && (
        <div
          className="design-block-editor-hovered-square"
          style={{
            left: hoveredPoint.column * unitSize,
            top: hoveredPoint.row * unitSize,
            width: snap * unitSize,
            height: snap * unitSize,
          }}
        />
      )}
      {insertArea && (
        <div
          ref={insertMarkerRef}
          className="design-block-editor-insert-point"
          style={{
            left: insertArea.column * unitSize,
            top: insertArea.row * unitSize,
            width: insertArea.columnSpan * unitSize,
            height: insertArea.rowSpan * unitSize,
          }}
        >
          {readOutInsertSize && (
            <SizeLabel
              columnSpan={insertArea.columnSpan}
              rowSpan={insertArea.rowSpan}
              snap={snap}
              unitSize={unitSize}
            />
          )}
        </div>
      )}
      {insertMenuOpen && (
        <DesignElementInsertMenu
          anchor={insertMarkerRef}
          open
          onOpenChange={handleInsertMenuOpenChange}
          onSelect={handleInsertSelect}
        />
      )}
      {gridOverBlocks && (
        <div
          className="design-block-editor-grid-overlay"
          style={{
            // Draw the overlay grid at the snap resolution
            backgroundSize: `${snap * unitSize}px ${snap * unitSize}px`,
          }}
          ref={gridOverlayRef}
        />
      )}
      {onRowsChange && (
        <div
          className="design-block-editor-surface-handle"
          onPointerDown={handleSurfacePointerDown}
          onPointerMove={handleSurfacePointerMove}
          onPointerUp={handleSurfacePointerUp}
        />
      )}
    </div>
  );
};

/**
 * Resolves the editor surface's class names.
 *
 * @param gridOverBlocks - Whether the grid overlay is drawn over the blocks.
 * @param gridInFront - Whether the grid is held in front of the blocks.
 * @returns The surface's class name string.
 */
function resolveSurfaceClass(
  gridOverBlocks: boolean,
  gridInFront: boolean,
): string {
  const classes = ['design-block-editor'];

  // Recede the blocks beneath the grid
  if (gridOverBlocks) {
    classes.push('design-block-editor-grid-over-blocks');
  }

  // Hand the grid the pointer, opening the covered squares
  if (gridInFront) {
    classes.push('design-block-editor-grid-in-front');
  }

  return classes.join(' ');
}

/**
 * Resolves the grid square a position within the surface falls on,
 * floored at the surface's first square.
 *
 * @param offset - The position in the surface's coordinate space.
 * @param unitSize - The rendered pixel size of a grid unit.
 * @param snap - The snap resolution in grid units.
 * @returns The square's position in grid units.
 */
function resolveGridUnits(
  offset: number,
  unitSize: number,
  snap: number,
): number {
  return Math.max(Designs.floorToMultiple(offset / unitSize, snap), 0);
}

/**
 * Clamps a value into a range.
 *
 * @param value - The value to clamp.
 * @param min - The lower bound.
 * @param max - The upper bound.
 * @returns The clamped value.
 */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max));
}
