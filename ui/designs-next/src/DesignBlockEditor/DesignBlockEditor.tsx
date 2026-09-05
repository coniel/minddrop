import { useEffect, useRef, useState } from 'react';
import {
  ApplyElementDragOptions,
  DesignElement,
  ElementDragMode,
  ElementHeightMode,
  ElementWidthMode,
  MaxDesignRows,
  MinDesignRows,
  applyElementDrag,
  applyElementSettings,
  getDesignElementConfig,
  isElementPinOverridden,
  isElementVerticalPinOverridden,
  snapToMultiple,
} from '@minddrop/designs-next';
import { useDeleteKey } from '@minddrop/utils';
import { BlockEditorElementMenu } from '../BlockEditorElementMenu';
import { resolveElementClass, resolveMenuPosition } from '../utils';
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

  /**
   * Whether the design is aspect-locked, offering element height
   * modes instead of the natural height toggle.
   */
  aspectLocked?: boolean;
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
  onDragStart,
  onDragEnd,
  aspectLocked = false,
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const surfaceDragRef = useRef<SurfaceDragState | null>(null);
  const [draggedElementId, setDraggedElementId] = useState<string | null>(null);
  const [surfaceDragging, setSurfaceDragging] = useState(false);

  const selectedElement = elements.find((element) => element.id === selectedId);

  // Any drag in progress hides the element menu
  const dragging = draggedElementId !== null || surfaceDragging;

  // Measures the screen pixels per grid unit, which a scaled
  // viewport (e.g. a zoomed canvas) sets apart from the unit size.
  // Falls back to the unit size while the surface has no layout.
  function measureUnitScreenSize(): number {
    const width = rootRef.current?.getBoundingClientRect().width;

    return width ? width / columns : unitSize;
  }

  // Clear the selection on clicks landing anywhere outside the editor
  useEffect(() => {
    if (selectedId === null) {
      return;
    }

    function handleDocumentClick(event: MouseEvent) {
      if (
        rootRef.current &&
        event.target instanceof Node &&
        !rootRef.current.contains(event.target)
      ) {
        onSelectionChange(null);
      }
    }

    document.addEventListener('click', handleDocumentClick);

    return () => document.removeEventListener('click', handleDocumentClick);
  }, [selectedId, onSelectionChange]);

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
    const config = getDesignElementConfig(drag.original.type, false);

    // Let bottom-edge resizes extend past the layout when it can grow
    const growable = drag.mode.includes('bottom') && Boolean(onRowsChange);

    // Unsnapped delta in grid units, quantized per mode by the drag
    // application.
    const options: ApplyElementDragOptions = {
      mode: drag.mode,
      deltaColumns: (event.clientX - drag.startX) / drag.unitScreenSize,
      deltaRows: (event.clientY - drag.startY) / drag.unitScreenSize,
      columns,
      rows: growable ? MaxDesignRows : rows,
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
    setSurfaceDragging(true);
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
    const snapped = snapToMultiple(drag.startRows + deltaRows, snap);

    onRowsChange(
      Math.min(Math.max(snapped, contentBottom, MinDesignRows), MaxDesignRows),
    );
  }

  // Ends the surface height drag
  function handleSurfacePointerUp() {
    if (!surfaceDragRef.current) {
      return;
    }

    surfaceDragRef.current = null;
    setSurfaceDragging(false);
    onDragEnd?.();
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
    data: Partial<
      Pick<DesignElement, 'widthMode' | 'heightMode' | 'naturalHeight'>
    >,
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

  // Changes the selected element's height mode
  function handleHeightModeChange(heightMode: ElementHeightMode) {
    updateSelectedElement({ heightMode });
  }

  // Toggles whether the selected element grows to its content's height
  function handleNaturalHeightChange(naturalHeight: boolean) {
    updateSelectedElement({ naturalHeight });
  }

  // Applies a settings change to the selected element, making room
  // below it when the change raises its intrinsic minimum height.
  function handleSettingsChange(settings: Record<string, unknown>) {
    if (!selectedElement) {
      return;
    }

    // The element type's height constraints
    const config = getDesignElementConfig(selectedElement.type, false);

    // The element with the settings applied
    const updated = { ...selectedElement, ...settings };

    // Apply the change, resolving the height constraints before and
    // after it so line-based elements keep their line count.
    const result = applyElementSettings(
      elements,
      selectedElement.id,
      settings,
      {
        rows,
        minRowSpan: config?.resolveMinRowSpan?.(updated),
        rowSpanStep: config?.resolveRowSpanStep?.(updated),
        previousRowSpanStep: config?.resolveRowSpanStep?.(selectedElement),
      },
    );

    // Emit the adjusted layout
    onElementsChange(result.elements);

    // Follow the shift with the surface height, floored at the
    // surface minimum. Aspect-locked designs keep their derived row
    // count instead.
    if (result.rows !== rows) {
      onRowsChange?.(Math.max(result.rows, MinDesignRows));
    }
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
      {draggedElementId !== null && (
        <div
          className="design-block-editor-grid-overlay"
          style={{
            // Draw the overlay grid at the snap resolution
            backgroundSize: `${snap * unitSize}px ${snap * unitSize}px`,
          }}
        />
      )}
      {selectedElement && !dragging && (
        <div
          className="design-block-editor-menu"
          style={resolveMenuPosition(selectedElement, unitSize)}
        >
          <BlockEditorElementMenu
            element={selectedElement}
            pinOverridden={isElementPinOverridden(selectedElement, elements)}
            aspectLocked={aspectLocked}
            verticalPinOverridden={isElementVerticalPinOverridden(
              selectedElement,
              elements,
            )}
            onWidthModeChange={handleWidthModeChange}
            onHeightModeChange={handleHeightModeChange}
            onNaturalHeightChange={handleNaturalHeightChange}
            onSettingsChange={handleSettingsChange}
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
