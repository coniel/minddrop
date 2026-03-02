import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { DatabaseEntries, Databases } from '@minddrop/databases';
import { WindowSizeSlot, getWindowSizeSlot } from '@minddrop/utils';
import { DatabaseEntryRenderer } from '../DatabaseEntryRenderer';
import {
  DialogSize,
  EntryDialogSizeConfig,
  dialogSizeKey,
} from './EntryDialogSizeConfig';
import './DatabaseEntryDialog.css';

type ResizeEdge =
  | 'left'
  | 'right'
  | 'top'
  | 'bottom'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

interface ResizeState {
  edge: ResizeEdge;
  startX: number;
  startY: number;
  originWidth: number;
  originHeight: number;
}

// Minimum canvas dimensions
const MIN_WIDTH = 200;
const MIN_HEIGHT = 100;

interface CornerHandleProps {
  path: string;
  onMouseDown: (event: React.MouseEvent) => void;
  className: string;
}

/**
 * SVG arc corner handle for resizing the canvas diagonally.
 */
const CornerHandle: React.FC<CornerHandleProps> = ({
  path,
  onMouseDown,
  className,
}) => (
  <div
    className={`entry-dialog-resize-handle ${className}`}
    onMouseDown={onMouseDown}
  >
    <svg width="25" height="25" overflow="visible">
      <path
        d={path}
        fill="none"
        stroke="var(--neutral-400)"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  </div>
);

export interface DatabaseEntryDialogProps {
  /**
   * Whether the dialog is open.
   */
  open: boolean;

  /**
   * Callback fired when the open state changes.
   */
  onOpenChange: (open: boolean) => void;

  /**
   * The ID of the database entry to render.
   */
  entryId: string;
}

/**
 * Renders a database entry in a dialog overlay with a resizable
 * canvas. The canvas is always centered and resizes are mirrored
 * from the center.
 */
export const DatabaseEntryDialog: React.FC<DatabaseEntryDialogProps> = ({
  open,
  onOpenChange,
  entryId,
}) => {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const resizeState = useRef<ResizeState | null>(null);

  // Keep a ref to the current size so handleMouseUp can read
  // it without needing size in its dependency array
  const sizeRef = useRef(size);
  sizeRef.current = size;

  // The user's intended size and the viewport at the time it
  // was set, used to compute display size on window resize
  const baseSizeRef = useRef<{
    width: number;
    height: number;
    viewportWidth: number;
    viewportHeight: number;
  } | null>(null);

  // Track the current window size slot to detect crossings
  const slotRef = useRef<WindowSizeSlot | null>(null);

  // Get the entry so we can resolve the page design ID
  const entry = DatabaseEntries.use(entryId);

  // Resolve the page design ID for the entry's database
  const databaseId = entry?.database ?? null;
  const designId = useMemo(() => {
    if (!databaseId) {
      return null;
    }

    try {
      return Databases.getDefaultDesign(databaseId, 'page').id;
    } catch {
      return null;
    }
  }, [databaseId]);

  // Restore a saved size or fall back to the default
  useLayoutEffect(() => {
    if (!open) {
      return;
    }

    const slot = getWindowSizeSlot();

    slotRef.current = slot;

    let width: number;
    let height: number;

    // Attempt to restore a persisted size for this design + slot
    if (designId) {
      const key = dialogSizeKey(designId, slot);
      const saved = EntryDialogSizeConfig.get(key) as DialogSize | undefined;

      if (saved) {
        // Clamp the saved size to 90% of the current viewport
        width = Math.min(saved.width, Math.round(window.innerWidth * 0.9));
        height = Math.min(saved.height, Math.round(window.innerHeight * 0.9));
      } else {
        // Fall back to default
        width = Math.min(1200, Math.round(window.innerWidth * 0.9));
        height = Math.min(900, Math.round(window.innerHeight * 0.9));
      }
    } else {
      // No design ID yet, use default
      width = Math.min(1200, Math.round(window.innerWidth * 0.9));
      height = Math.min(900, Math.round(window.innerHeight * 0.9));
    }

    // Record the base size for window resize calculations
    baseSizeRef.current = {
      width,
      height,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
    };

    setSize({ width, height });
  }, [open, designId]);

  // Close the dialog when clicking the backdrop
  const handleBackdropClick = useCallback(
    (event: React.MouseEvent) => {
      if (event.target === backdropRef.current) {
        onOpenChange(false);
      }
    },
    [onOpenChange],
  );

  // Close the dialog when pressing Escape
  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onOpenChange(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onOpenChange]);

  // Start a resize operation on mousedown
  const handleResizeMouseDown = useCallback(
    (event: React.MouseEvent, edge: ResizeEdge) => {
      event.stopPropagation();

      resizeState.current = {
        edge,
        startX: event.clientX,
        startY: event.clientY,
        originWidth: size.width,
        originHeight: size.height,
      };
    },
    [size],
  );

  // Handle mouse movement during resize (always mirrored from center)
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!resizeState.current) {
      return;
    }

    const { edge, startX, startY, originWidth, originHeight } =
      resizeState.current;
    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;

    // Maximum dimensions (full viewport)
    const maxWidth = window.innerWidth;
    const maxHeight = window.innerHeight;

    switch (edge) {
      case 'right': {
        // Mirrored: both sides expand equally
        const newWidth = Math.min(
          Math.max(MIN_WIDTH, originWidth + deltaX * 2),
          maxWidth,
        );

        setSize((current) => ({ ...current, width: newWidth }));

        break;
      }

      case 'left': {
        // Mirrored: both sides expand equally (inverse direction)
        const newWidth = Math.min(
          Math.max(MIN_WIDTH, originWidth - deltaX * 2),
          maxWidth,
        );

        setSize((current) => ({ ...current, width: newWidth }));

        break;
      }

      case 'top': {
        // Mirrored: top and bottom expand equally (inverse direction)
        const newHeight = Math.min(
          Math.max(MIN_HEIGHT, originHeight - deltaY * 2),
          maxHeight,
        );

        setSize((current) => ({ ...current, height: newHeight }));

        break;
      }

      case 'bottom': {
        // Mirrored: top and bottom expand equally
        const newHeight = Math.min(
          Math.max(MIN_HEIGHT, originHeight + deltaY * 2),
          maxHeight,
        );

        setSize((current) => ({ ...current, height: newHeight }));

        break;
      }

      case 'top-left': {
        const newWidth = Math.min(
          Math.max(MIN_WIDTH, originWidth - deltaX * 2),
          maxWidth,
        );
        const newHeight = Math.min(
          Math.max(MIN_HEIGHT, originHeight - deltaY * 2),
          maxHeight,
        );

        setSize({ width: newWidth, height: newHeight });

        break;
      }

      case 'top-right': {
        const newWidth = Math.min(
          Math.max(MIN_WIDTH, originWidth + deltaX * 2),
          maxWidth,
        );
        const newHeight = Math.min(
          Math.max(MIN_HEIGHT, originHeight - deltaY * 2),
          maxHeight,
        );

        setSize({ width: newWidth, height: newHeight });

        break;
      }

      case 'bottom-left': {
        const newWidth = Math.min(
          Math.max(MIN_WIDTH, originWidth - deltaX * 2),
          maxWidth,
        );
        const newHeight = Math.min(
          Math.max(MIN_HEIGHT, originHeight + deltaY * 2),
          maxHeight,
        );

        setSize({ width: newWidth, height: newHeight });

        break;
      }

      case 'bottom-right': {
        const newWidth = Math.min(
          Math.max(MIN_WIDTH, originWidth + deltaX * 2),
          maxWidth,
        );
        const newHeight = Math.min(
          Math.max(MIN_HEIGHT, originHeight + deltaY * 2),
          maxHeight,
        );

        setSize({ width: newWidth, height: newHeight });

        break;
      }
    }
  }, []);

  // End resize on mouseup and persist the final size
  const handleMouseUp = useCallback(() => {
    // Only persist if a resize was in progress and we have a design ID
    if (resizeState.current && designId) {
      const key = dialogSizeKey(designId, getWindowSizeSlot());

      EntryDialogSizeConfig.set(key, sizeRef.current);

      // Update the base size to reflect the user's new intent
      baseSizeRef.current = {
        ...sizeRef.current,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
      };
    }

    resizeState.current = null;
  }, [designId]);

  // Attach global mouse listeners for resize
  useEffect(() => {
    if (!open) {
      return;
    }

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [open, handleMouseMove, handleMouseUp]);

  // Adapt dialog size when the window is resized
  useEffect(() => {
    if (!open) {
      return;
    }

    const handleWindowResize = () => {
      const newSlot = getWindowSizeSlot();
      const newViewportWidth = window.innerWidth;
      const newViewportHeight = window.innerHeight;

      // If the slot changed, load the saved size for the new slot
      if (slotRef.current && newSlot !== slotRef.current) {
        slotRef.current = newSlot;

        let width: number;
        let height: number;

        // Try to load a saved size for the new slot
        if (designId) {
          const key = dialogSizeKey(designId, newSlot);
          const saved = EntryDialogSizeConfig.get(key) as
            | DialogSize
            | undefined;

          if (saved) {
            width = Math.min(saved.width, Math.round(newViewportWidth * 0.9));
            height = Math.min(
              saved.height,
              Math.round(newViewportHeight * 0.9),
            );
          } else {
            width = Math.min(1200, Math.round(newViewportWidth * 0.9));
            height = Math.min(900, Math.round(newViewportHeight * 0.9));
          }
        } else {
          width = Math.min(1200, Math.round(newViewportWidth * 0.9));
          height = Math.min(900, Math.round(newViewportHeight * 0.9));
        }

        // Update the base size to the loaded preset
        baseSizeRef.current = {
          width,
          height,
          viewportWidth: newViewportWidth,
          viewportHeight: newViewportHeight,
        };

        setSize({ width, height });

        return;
      }

      // Same slot — apply margin clamping based on the user's
      // intended size
      if (!baseSizeRef.current) {
        return;
      }

      const base = baseSizeRef.current;

      // Compute the user's margin as a fraction of the viewport
      // when the base size was set
      const baseMarginX = (base.viewportWidth - base.width) / 2;
      const baseMarginFractionX = baseMarginX / base.viewportWidth;

      let displayWidth: number;

      if (baseMarginFractionX < 0.1) {
        // User was close to the edge — maintain fixed px margin
        displayWidth = newViewportWidth - 2 * baseMarginX;
      } else {
        // User had plenty of margin — enforce 10% minimum
        displayWidth = Math.min(base.width, newViewportWidth * 0.8);
      }

      const baseMarginY = (base.viewportHeight - base.height) / 2;
      const baseMarginFractionY = baseMarginY / base.viewportHeight;

      let displayHeight: number;

      if (baseMarginFractionY < 0.1) {
        // User was close to the edge — maintain fixed px margin
        displayHeight = newViewportHeight - 2 * baseMarginY;
      } else {
        // User had plenty of margin — enforce 10% minimum
        displayHeight = Math.min(base.height, newViewportHeight * 0.8);
      }

      // Clamp to minimum dimensions
      displayWidth = Math.max(MIN_WIDTH, displayWidth);
      displayHeight = Math.max(MIN_HEIGHT, displayHeight);

      setSize({
        width: Math.round(displayWidth),
        height: Math.round(displayHeight),
      });
    };

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [open, designId]);

  if (!open) {
    return null;
  }

  return (
    <div
      ref={backdropRef}
      className="entry-dialog-backdrop"
      onClick={handleBackdropClick}
    >
      <div
        ref={canvasRef}
        className="entry-dialog-canvas"
        style={{ width: size.width, height: size.height }}
      >
        {/* Corner resize handles */}
        <div className="entry-dialog-hover-zone entry-dialog-hover-zone-top-left" />
        <div className="entry-dialog-hover-zone entry-dialog-hover-zone-top-left-vertical" />
        <CornerHandle
          className="entry-dialog-resize-handle-top-left"
          path="M 25 0 A 25 25 0 0 0 0 25"
          onMouseDown={(event) => handleResizeMouseDown(event, 'top-left')}
        />
        <div className="entry-dialog-hover-zone entry-dialog-hover-zone-top-right" />
        <div className="entry-dialog-hover-zone entry-dialog-hover-zone-top-right-vertical" />
        <CornerHandle
          className="entry-dialog-resize-handle-top-right"
          path="M 0 0 A 25 25 0 0 1 25 25"
          onMouseDown={(event) => handleResizeMouseDown(event, 'top-right')}
        />
        <div className="entry-dialog-hover-zone entry-dialog-hover-zone-bottom-left" />
        <div className="entry-dialog-hover-zone entry-dialog-hover-zone-bottom-left-vertical" />
        <CornerHandle
          className="entry-dialog-resize-handle-bottom-left"
          path="M 25 25 A 25 25 0 0 1 0 0"
          onMouseDown={(event) => handleResizeMouseDown(event, 'bottom-left')}
        />
        <div className="entry-dialog-hover-zone entry-dialog-hover-zone-bottom-right" />
        <div className="entry-dialog-hover-zone entry-dialog-hover-zone-bottom-right-vertical" />
        <CornerHandle
          className="entry-dialog-resize-handle-bottom-right"
          path="M 0 25 A 25 25 0 0 0 25 0"
          onMouseDown={(event) => handleResizeMouseDown(event, 'bottom-right')}
        />

        {/* Content wrapper */}
        <div className="entry-dialog-content">
          <EntryDialogContent entryId={entryId} />
        </div>

        {/* Left/right edge handles */}
        <div className="entry-dialog-hover-zone entry-dialog-hover-zone-left" />
        <div
          className="entry-dialog-resize-handle entry-dialog-resize-handle-left"
          onMouseDown={(event) => handleResizeMouseDown(event, 'left')}
        />
        <div className="entry-dialog-hover-zone entry-dialog-hover-zone-right" />
        <div
          className="entry-dialog-resize-handle entry-dialog-resize-handle-right"
          onMouseDown={(event) => handleResizeMouseDown(event, 'right')}
        />

        {/* Top edge handle */}
        <div className="entry-dialog-hover-zone entry-dialog-hover-zone-top" />
        <div
          className="entry-dialog-resize-handle entry-dialog-resize-handle-top"
          onMouseDown={(event) => handleResizeMouseDown(event, 'top')}
        />

        {/* Bottom edge handle */}
        <div className="entry-dialog-hover-zone entry-dialog-hover-zone-bottom" />
        <div
          className="entry-dialog-resize-handle entry-dialog-resize-handle-bottom"
          onMouseDown={(event) => handleResizeMouseDown(event, 'bottom')}
        />
      </div>
    </div>
  );
};

/**
 * Renders the entry content using the entry's page design.
 */
const EntryDialogContent: React.FC<{ entryId: string }> = ({ entryId }) => {
  // Get the entry data
  const entry = DatabaseEntries.use(entryId);

  if (!entry) {
    return null;
  }

  return <DatabaseEntryRenderer entryId={entryId} designType="page" />;
};
