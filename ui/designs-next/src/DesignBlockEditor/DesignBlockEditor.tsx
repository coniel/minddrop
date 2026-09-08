import { useRef, useState } from 'react';
import {
  ApplyElementDragOptions,
  DesignElement,
  DesignElementConfigs,
  DesignElementTypeTransferData,
  Designs,
  ElementDragMode,
} from '@minddrop/designs-next';
import { Selection } from '@minddrop/selection';
import { getTransferData, useDeleteKey } from '@minddrop/utils';
import { DesignElementInsertMenu } from '../DesignElementInsertMenu';
import { resolveElementClass } from '../utils';
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

// The drag data types the surface accepts drops of
const AcceptedDropTypes = [Designs.constants.ElementTypesDataKey];

/**
 * Renders the block editor surface: the design's unit grid with a
 * draggable block per element. Moving snaps the element's edges onto
 * the snap grid, resizing snaps the drag delta, and grid lines draw
 * at the snap resolution. Element types dropped onto the surface are
 * inserted at the drop point, and clicking an empty grid square
 * offers the element types in a menu, inserting the picked one with
 * its top left corner on that square.
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
  const dragRef = useRef<DragState | null>(null);
  const surfaceDragRef = useRef<SurfaceDragState | null>(null);
  const [draggedElementId, setDraggedElementId] = useState<string | null>(null);
  const [dropping, setDropping] = useState(false);
  const [insertPoint, setInsertPoint] = useState<GridPoint | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<GridPoint | null>(null);

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

  // Converts a screen position into the surface's own coordinate
  // space, for the events which carry no offset within the surface.
  function resolveSurfaceOffset(clientX: number, clientY: number) {
    const rect = rootRef.current?.getBoundingClientRect();
    const unitScreenSize = measureUnitScreenSize();

    return {
      offsetX: ((clientX - (rect?.left ?? 0)) / unitScreenSize) * unitSize,
      offsetY: ((clientY - (rect?.top ?? 0)) / unitScreenSize) * unitSize,
    };
  }

  // Inserts elements of the given types with their top left corners
  // on the given grid square, kept inside the design and growing it
  // when it can. The last inserted element is selected.
  function insertElements(types: string[], point: GridPoint) {
    // The height the surface can grow to for the inserted elements
    const maxRows = onRowsChange ? Designs.constants.MaxRows : rows;

    const inserted = types.map((type) => {
      const element = Designs.createElement(type, point);

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
    onSelectionChange(elementId);
    onDragStart?.();
  }

  // Applies the drag delta to the dragged element
  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;

    if (!drag) {
      return;
    }

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

  // Accepts element type drags over the surface, showing the grid
  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    if (!Selection.dragContainsType(event, AcceptedDropTypes)) {
      return;
    }

    event.preventDefault();
    setDropping(true);
  }

  function handleDragLeave() {
    setDropping(false);
  }

  // Inserts the dropped element types at the drop point
  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    setDropping(false);

    if (!Selection.dragContainsType(event, AcceptedDropTypes)) {
      return;
    }

    event.preventDefault();

    const dropped =
      getTransferData<Record<string, DesignElementTypeTransferData[]>>(event)[
        Designs.constants.ElementTypesDataKey
      ] ?? [];

    if (dropped.length === 0) {
      return;
    }

    // Drops land on whichever block is under the pointer, so the
    // drop point comes from the screen position rather than from an
    // offset within the surface.
    const { offsetX, offsetY } = resolveSurfaceOffset(
      event.clientX,
      event.clientY,
    );

    insertElements(
      dropped.map(({ type }) => type),
      resolveGridPoint(offsetX, offsetY),
    );
  }

  // Opens the insert menu on the clicked grid square, clearing the
  // selection as it opens. Ignores clicks bubbling up from elements.
  function handleBackgroundClick(event: React.MouseEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) {
      return;
    }

    onSelectionChange(null);

    // A click made while the menu is open only dismisses it, so
    // moving the insert point takes a second click.
    if (insertPoint) {
      setInsertPoint(null);

      return;
    }

    setInsertPoint(
      resolveGridPoint(event.nativeEvent.offsetX, event.nativeEvent.offsetY),
    );
  }

  // Tracks the grid square under the pointer, ignoring moves
  // bubbling up from elements and pausing during drags.
  function handleGridPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (
      event.target !== event.currentTarget ||
      dragRef.current ||
      surfaceDragRef.current
    ) {
      setHoveredPoint(null);

      return;
    }

    const point = resolveGridPoint(
      event.nativeEvent.offsetX,
      event.nativeEvent.offsetY,
    );

    // Keep the current point while the pointer stays on its square,
    // so only crossing into another square re-renders.
    setHoveredPoint((current) =>
      current?.column === point.column && current.row === point.row
        ? current
        : point,
    );
  }

  function handleGridPointerLeave() {
    setHoveredPoint(null);
  }

  // Closes the insert menu, dropping the insert point with it
  function handleInsertMenuOpenChange(open: boolean) {
    if (!open) {
      setInsertPoint(null);
    }
  }

  // Inserts the picked element type on the marked grid square
  function handleInsertSelect(type: string) {
    if (!insertPoint) {
      return;
    }

    insertElements([type], insertPoint);
    setInsertPoint(null);
  }

  return (
    <div
      ref={rootRef}
      role="presentation"
      className="design-block-editor"
      style={{
        width: columns * unitSize,
        height: rows * unitSize,
        // Draw grid lines at the snap resolution
        backgroundSize: `${snap * unitSize}px ${snap * unitSize}px`,
      }}
      onClick={handleBackgroundClick}
      onPointerMove={handleGridPointerMove}
      onPointerLeave={handleGridPointerLeave}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
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
        </div>
      ))}
      {hoveredPoint && !insertPoint && (
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
      {insertPoint && (
        <>
          <div
            ref={insertMarkerRef}
            className="design-block-editor-insert-point"
            style={{
              left: insertPoint.column * unitSize,
              top: insertPoint.row * unitSize,
              width: snap * unitSize,
              height: snap * unitSize,
            }}
          />
          <DesignElementInsertMenu
            anchor={insertMarkerRef}
            open
            onOpenChange={handleInsertMenuOpenChange}
            onSelect={handleInsertSelect}
          />
        </>
      )}
      {(draggedElementId !== null || dropping) && (
        <div
          className="design-block-editor-grid-overlay"
          style={{
            // Draw the overlay grid at the snap resolution
            backgroundSize: `${snap * unitSize}px ${snap * unitSize}px`,
          }}
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
