import { useRef } from 'react';
import {
  ApplyElementDragOptions,
  DesignElement,
  ElementDragMode,
  ElementWidthMode,
  applyElementDrag,
  isElementPinOverridden,
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
}) => {
  const dragRef = useRef<DragState | null>(null);

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
    onSelectionChange(elementId);
  }

  // Applies the drag delta to the dragged element
  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;

    if (!drag) {
      return;
    }

    // Unsnapped delta in grid units, quantized per mode by the drag
    // application.
    const options: ApplyElementDragOptions = {
      mode: drag.mode,
      deltaColumns: (event.clientX - drag.startX) / unitSize,
      deltaRows: (event.clientY - drag.startY) / unitSize,
      columns,
      rows,
      snap,
    };

    onElementsChange(
      elements.map((element) =>
        element.id === drag.elementId
          ? applyElementDrag(drag.original, options)
          : element,
      ),
    );
  }

  // Ends the active drag
  function handlePointerUp() {
    dragRef.current = null;
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
      {selectedElement && (
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
    </div>
  );
};

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
