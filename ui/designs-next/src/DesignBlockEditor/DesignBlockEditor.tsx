import { useRef, useState } from 'react';
import {
  ApplyElementDragOptions,
  DesignElement,
  ElementDragMode,
  ElementWidthMode,
  applyElementDrag,
  getElementType,
  isElementPinOverridden,
  snapToMultiple,
} from '@minddrop/designs-next';
import { BlockEditorElementMenu } from '../BlockEditorElementMenu';
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

/**
 * Renders the block editor surface: the design's unit grid with a
 * draggable block per element. Moving snaps the element's edges onto
 * the snap grid, resizing snaps the drag delta, and grid lines draw
 * at the snap resolution.
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
}) => {
  const dragRef = useRef<DragState | null>(null);
  const surfaceDragRef = useRef<SurfaceDragState | null>(null);
  const [dragging, setDragging] = useState(false);

  const selectedElement = elements.find((element) => element.id === selectedId);

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
    };
    // Hide the element menu while dragging so it never obscures the
    // layout being adjusted.
    setDragging(true);
    onSelectionChange(elementId);
  }

  // Applies the drag delta to the dragged element
  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;

    if (!drag) {
      return;
    }

    // The element type's block behaviour constraints
    const config = getElementType(drag.original.type, false);

    // Let bottom-edge resizes extend past the card when it can grow
    const growable = drag.mode.includes('bottom') && Boolean(onRowsChange);

    // Unsnapped delta in grid units, quantized per mode by the drag
    // application.
    const options: ApplyElementDragOptions = {
      mode: drag.mode,
      deltaColumns: (event.clientX - drag.startX) / unitSize,
      deltaRows: (event.clientY - drag.startY) / unitSize,
      columns,
      rows: growable ? MaxSurfaceRows : rows,
      snap,
      // Floor the resize at the element type's intrinsic minimum
      minRowSpan: config?.resolveMinRowSpan?.(drag.original),
      // Step vertical resizes by the element type's line height
      rowSpanStep: config?.resolveRowSpanStep?.(drag.original),
    };

    // Apply the drag to the element
    const dragged = applyElementDrag(drag.original, options);

    onElementsChange(
      elements.map((element) =>
        element.id === drag.elementId ? dragged : element,
      ),
    );

    // Grow the card with the element's bottom edge as it passes the
    // card's bottom. The card never shrinks back during the drag.
    if (growable && dragged.row + dragged.rowSpan > rows) {
      onRowsChange?.(dragged.row + dragged.rowSpan);
    }
  }

  // Ends the active drag
  function handlePointerUp() {
    dragRef.current = null;
    setDragging(false);
  }

  // Begins a surface height drag
  function handleSurfacePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    // Capture so moves keep arriving while the pointer leaves the handle
    event.currentTarget.setPointerCapture(event.pointerId);

    surfaceDragRef.current = { startY: event.clientY, startRows: rows };
    setDragging(true);
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
    const deltaRows = (event.clientY - drag.startY) / unitSize;
    const snapped = snapToMultiple(drag.startRows + deltaRows, snap);

    onRowsChange(
      Math.min(
        Math.max(snapped, contentBottom, MinSurfaceRows),
        MaxSurfaceRows,
      ),
    );
  }

  // Ends the surface height drag
  function handleSurfacePointerUp() {
    surfaceDragRef.current = null;
    setDragging(false);
  }

  // Clears the selection when clicking the empty surface, ignoring
  // clicks bubbling up from elements.
  function handleBackgroundClick(event: React.MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      onSelectionChange(null);
    }
  }

  // Applies a change to the selected element
  function updateSelectedElement(
    data: Partial<Pick<DesignElement, 'widthMode' | 'naturalHeight'>>,
  ) {
    onElementsChange(
      elements.map((element) =>
        element.id === selectedId ? { ...element, ...data } : element,
      ),
    );
  }

  // Changes the selected element's width mode
  function handleWidthModeChange(widthMode: ElementWidthMode) {
    updateSelectedElement({ widthMode });
  }

  // Toggles whether the selected element grows to its content's height
  function handleNaturalHeightChange(naturalHeight: boolean) {
    updateSelectedElement({ naturalHeight });
  }

  return (
    <div
      role="presentation"
      className="design-block-editor"
      style={{
        width: columns * unitSize,
        height: rows * unitSize,
        // Draw grid lines at the snap resolution
        backgroundSize: `${snap * unitSize}px ${snap * unitSize}px`,
      }}
      onClick={handleBackgroundClick}
    >
      {elements.map((element) => (
        <div
          key={element.id}
          data-element-id={element.id}
          className={
            element.id === selectedId
              ? 'design-block-editor-element design-block-editor-element-selected'
              : 'design-block-editor-element'
          }
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
      {selectedElement && !dragging && (
        <div
          className="design-block-editor-menu"
          style={resolveMenuPosition(selectedElement, unitSize)}
        >
          <BlockEditorElementMenu
            element={selectedElement}
            pinOverridden={isElementPinOverridden(selectedElement, elements)}
            onWidthModeChange={handleWidthModeChange}
            onNaturalHeightChange={handleNaturalHeightChange}
          />
        </div>
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

// Bounds for the surface height drag, in grid units
const MinSurfaceRows = 8;
const MaxSurfaceRows = 200;

// Vertical clearance the menu needs above a block, in pixels
const MenuClearance = 48;

// Gap between a block's edge and the menu, in pixels
const MenuGap = 4;

/**
 * Resolves the menu's position above the selected block, flipping
 * below it when the block sits too close to the top edge.
 *
 * @param element - The selected element.
 * @param unitSize - The rendered pixel size of a grid unit.
 * @returns The menu wrapper's position styles.
 */
function resolveMenuPosition(
  element: DesignElement,
  unitSize: number,
): React.CSSProperties {
  const left = element.column * unitSize;
  const top = element.row * unitSize;

  // Check if the menu fits above the block. If not, place it below.
  if (top < MenuClearance) {
    return {
      left,
      top: (element.row + element.rowSpan) * unitSize + MenuGap,
    };
  }

  // Anchor the menu's bottom edge just above the block
  return { left, top: top - MenuGap, transform: 'translateY(-100%)' };
}
