import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { Layout, LayoutType } from '@minddrop/designs';
import { DesignPreviewProvider } from '../DesignElements';
import {
  DesignStudioStore,
  updateLayoutFrame,
  useDesignStudioStore,
} from '../DesignStudioStore';
import { LayoutIdProvider } from '../LayoutIdContext';
import './LayoutFrame.css';

type ResizeEdge =
  | 'left'
  | 'right'
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
  originX: number;
  originY: number;
}

interface DragState {
  startX: number;
  startY: number;
  originX: number;
  originY: number;
}

// Minimum frame dimensions
const MIN_WIDTH = 200;
const MIN_HEIGHT = 100;

/**
 * Computes the initial frame layout (size + position) for a given
 * design type within the available workspace dimensions.
 */
function getFrameLayout(
  layoutType: LayoutType | undefined,
  workspaceWidth: number,
  workspaceHeight: number,
): { width: number; height: number; x: number; y: number } {
  switch (layoutType) {
    case 'card': {
      const width = 380;

      return {
        width,
        height: 0,
        x: Math.round((workspaceWidth - width) / 2),
        y: Math.round(workspaceHeight * 0.15),
      };
    }

    case 'list': {
      const width = 600;

      return {
        width,
        height: 0,
        x: Math.round((workspaceWidth - width) / 2),
        y: Math.round(workspaceHeight * 0.15),
      };
    }

    default: {
      const width = Math.round(workspaceWidth * 0.9);
      const height = Math.round(workspaceHeight * 0.92);

      return {
        width,
        height,
        x: Math.round((workspaceWidth - width) / 2),
        y: Math.round((workspaceHeight - height) / 2 - workspaceHeight * 0.02),
      };
    }
  }
}

interface CornerHandleProps {
  path: string;
  onMouseDown: (event: React.MouseEvent) => void;
  className: string;
}

/**
 * SVG arc corner handle for resizing the frame diagonally.
 */
const CornerHandle: React.FC<CornerHandleProps> = ({
  path,
  onMouseDown,
  className,
}) => (
  <div
    className={`layout-frame-resize-handle ${className}`}
    onMouseDown={onMouseDown}
  >
    <svg width="25" height="25" overflow="visible">
      <path
        d={path}
        fill="none"
        stroke="var(--border-default)"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  </div>
);

export interface LayoutFrameProps {
  /**
   * Studio mode: the ID of the layout to frame. Position and size
   * come from the layout's persisted frame in the design open in
   * the studio, and drag/resize changes are persisted when the
   * interaction ends. Frames live in canvas (un-zoomed) coordinates
   * and are not clamped to the workspace bounds.
   */
  layoutId?: string;

  /**
   * Standalone mode: determines initial size and which resize
   * handles are shown when no layout ID is provided. The frame
   * manages its own position + size state and stays clamped to
   * its parent workspace.
   */
  layoutType?: LayoutType;

  /**
   * The design tree content to render inside the frame.
   */
  children: React.ReactNode;

  /**
   * Optional additional class name for the frame wrapper.
   */
  className?: string;
}

/**
 * Resizable, draggable frame wrapper for layout previews. Renders
 * resize handles (corner SVG arcs + edge bars + hover zones) and a
 * drag handle bar.
 *
 * Card/list types auto-size height and only show horizontal handles.
 * Page type shows all handles including corners and bottom edge.
 */
export const LayoutFrame: React.FC<LayoutFrameProps> = ({
  layoutId,
  layoutType,
  children,
  className,
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 0, height: 0 });
  const frameRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<DragState | null>(null);
  const resizeState = useRef<ResizeState | null>(null);
  const didDrag = useRef(false);
  // Latest position/size for reading inside the mouseup handler
  const positionRef = useRef(position);
  const sizeRef = useRef(size);

  // Studio mode: the layout being framed, from the design open
  // in the studio
  const layout = useDesignStudioStore((state) =>
    layoutId
      ? state.design?.layouts.find(
          (designLayout) => designLayout.id === layoutId,
        ) || null
      : null,
  );

  const resolvedLayoutType = layout?.type || layoutType;

  // Card/list auto-size height — hide corner + bottom handles
  const autoHeight =
    resolvedLayoutType === 'card' || resolvedLayoutType === 'list';

  // Mirror position/size into refs for the mouseup handler
  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  useEffect(() => {
    sizeRef.current = size;
  }, [size]);

  /**
   * Clamps a position so the frame stays within its parent
   * workspace. Studio frames live in unbounded canvas coordinates
   * and are never clamped.
   */
  const clampPosition = useCallback(
    (x: number, y: number) => {
      if (layoutId) {
        return { x, y };
      }

      const workspace = frameRef.current?.parentElement;

      if (!workspace || !frameRef.current) {
        return { x, y };
      }

      const width = frameRef.current.offsetWidth;
      const height = frameRef.current.offsetHeight;

      return {
        x: Math.max(0, Math.min(workspace.offsetWidth - width, x)),
        y: Math.max(0, Math.min(workspace.offsetHeight - height, y)),
      };
    },
    [layoutId],
  );

  // Studio mode: sync position + size from the layout's persisted frame
  const persistedFrame = layout?.frame ?? null;

  useLayoutEffect(() => {
    if (!persistedFrame) {
      return;
    }

    setPosition({ x: persistedFrame.x, y: persistedFrame.y });
    setSize({
      width: persistedFrame.width,
      height: persistedFrame.height ?? 0,
    });
  }, [persistedFrame]);

  // Standalone mode: set initial layout (size + position) based
  // on the layout type
  useLayoutEffect(() => {
    if (layoutId) {
      return;
    }

    const workspace = frameRef.current?.parentElement;

    if (!workspace) {
      return;
    }

    const frameLayout = getFrameLayout(
      resolvedLayoutType,
      workspace.offsetWidth,
      workspace.offsetHeight,
    );

    setSize({ width: frameLayout.width, height: frameLayout.height });
    setPosition({ x: frameLayout.x, y: Math.max(0, frameLayout.y) });
  }, [layoutId, resolvedLayoutType, autoHeight]);

  // Start dragging when the drag handle is pressed
  const handleDragHandleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      didDrag.current = false;

      dragState.current = {
        startX: event.clientX,
        startY: event.clientY,
        originX: position.x,
        originY: position.y,
      };
    },
    [position],
  );

  // Select the root element when clicking the drag handle
  // without actually dragging the frame, activating this
  // frame's layout first in studio mode
  const handleDragHandleClick = useCallback(() => {
    if (didDrag.current) {
      return;
    }

    const store = DesignStudioStore.getState();

    if (layoutId && store.activeLayoutId !== layoutId) {
      store.setActiveLayout(layoutId);
    }

    store.selectElement('root');
  }, [layoutId]);

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
        originX: position.x,
        originY: position.y,
      };
    },
    [size, position],
  );

  // Track mouse movement during drag or resize
  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      // Studio frames live in the zoomed canvas coordinate space,
      // so screen-pixel mouse deltas are scaled down by the zoom
      const scale = layoutId ? DesignStudioStore.getState().zoom : 1;

      // Handle frame dragging
      if (dragState.current) {
        didDrag.current = true;
        const rawX =
          dragState.current.originX +
          (event.clientX - dragState.current.startX) / scale;
        const rawY =
          dragState.current.originY +
          (event.clientY - dragState.current.startY) / scale;

        setPosition(clampPosition(rawX, rawY));
      }

      // Handle frame resizing
      if (resizeState.current) {
        const {
          edge,
          startX,
          startY,
          originWidth,
          originHeight,
          originX,
          originY,
        } = resizeState.current;
        const deltaX = (event.clientX - startX) / scale;
        const deltaY = (event.clientY - startY) / scale;

        // Workspace-bounds clamps only apply to standalone frames;
        // studio frames resize freely in canvas coordinates
        const workspaceWidth = layoutId
          ? Infinity
          : (frameRef.current?.parentElement?.offsetWidth ?? Infinity);
        const workspaceHeight = layoutId
          ? Infinity
          : (frameRef.current?.parentElement?.offsetHeight ?? Infinity);
        const minPosition = layoutId ? -Infinity : 0;

        // Anchored edges: the opposite edge from the one being
        // dragged stays fixed.
        const rightEdge = originX + originWidth;
        const bottomEdge = originY + originHeight;

        // Shift key enables mirror resizing from center
        const mirror = event.shiftKey;
        const centerX = originX + originWidth / 2;
        const centerY = originY + originHeight / 2;

        // Mirror-resize width/height caps that keep the frame's
        // leading edge inside the workspace in standalone mode
        const maxMirrorWidth = layoutId ? Infinity : centerX * 2;
        const maxMirrorHeight = layoutId ? Infinity : centerY * 2;

        switch (edge) {
          case 'right': {
            const newWidth = Math.min(
              Math.max(MIN_WIDTH, originWidth + deltaX * (mirror ? 2 : 1)),
              mirror ? maxMirrorWidth : workspaceWidth - originX,
            );

            if (mirror) {
              const newX = centerX - newWidth / 2;

              setSize((current) => ({ ...current, width: newWidth }));
              setPosition((current) => ({ ...current, x: newX }));
            } else {
              setSize((current) => ({ ...current, width: newWidth }));
            }

            break;
          }

          case 'left': {
            if (mirror) {
              const newWidth = Math.min(
                Math.max(MIN_WIDTH, originWidth - deltaX * 2),
                (workspaceWidth - centerX) * 2,
              );
              const newX = centerX - newWidth / 2;

              setSize((current) => ({ ...current, width: newWidth }));
              setPosition((current) => ({ ...current, x: newX }));
            } else {
              const newX = Math.max(
                minPosition,
                Math.min(rightEdge - MIN_WIDTH, originX + deltaX),
              );

              setSize((current) => ({
                ...current,
                width: rightEdge - newX,
              }));
              setPosition((current) => ({ ...current, x: newX }));
            }

            break;
          }

          case 'bottom': {
            const newHeight = Math.min(
              Math.max(MIN_HEIGHT, originHeight + deltaY * (mirror ? 2 : 1)),
              mirror ? maxMirrorHeight : workspaceHeight - originY,
            );

            if (mirror) {
              const newY = centerY - newHeight / 2;

              setSize((current) => ({ ...current, height: newHeight }));
              setPosition((current) => ({ ...current, y: newY }));
            } else {
              setSize((current) => ({ ...current, height: newHeight }));
            }

            break;
          }

          case 'top-left': {
            if (mirror) {
              const newWidth = Math.min(
                Math.max(MIN_WIDTH, originWidth - deltaX * 2),
                (workspaceWidth - centerX) * 2,
              );
              const newHeight = Math.min(
                Math.max(MIN_HEIGHT, originHeight - deltaY * 2),
                (workspaceHeight - centerY) * 2,
              );

              setSize({ width: newWidth, height: newHeight });
              setPosition({
                x: centerX - newWidth / 2,
                y: centerY - newHeight / 2,
              });
            } else {
              const newX = Math.max(
                minPosition,
                Math.min(rightEdge - MIN_WIDTH, originX + deltaX),
              );
              const newY = Math.max(
                minPosition,
                Math.min(bottomEdge - MIN_HEIGHT, originY + deltaY),
              );

              setSize({
                width: rightEdge - newX,
                height: bottomEdge - newY,
              });
              setPosition({ x: newX, y: newY });
            }

            break;
          }

          case 'top-right': {
            if (mirror) {
              const newWidth = Math.min(
                Math.max(MIN_WIDTH, originWidth + deltaX * 2),
                maxMirrorWidth,
              );
              const newHeight = Math.min(
                Math.max(MIN_HEIGHT, originHeight - deltaY * 2),
                (workspaceHeight - centerY) * 2,
              );

              setSize({ width: newWidth, height: newHeight });
              setPosition({
                x: centerX - newWidth / 2,
                y: centerY - newHeight / 2,
              });
            } else {
              const newWidth = Math.min(
                Math.max(MIN_WIDTH, originWidth + deltaX),
                workspaceWidth - originX,
              );
              const newY = Math.max(
                minPosition,
                Math.min(bottomEdge - MIN_HEIGHT, originY + deltaY),
              );

              setSize({ width: newWidth, height: bottomEdge - newY });
              setPosition((current) => ({ ...current, y: newY }));
            }

            break;
          }

          case 'bottom-left': {
            if (mirror) {
              const newWidth = Math.min(
                Math.max(MIN_WIDTH, originWidth - deltaX * 2),
                (workspaceWidth - centerX) * 2,
              );
              const newHeight = Math.min(
                Math.max(MIN_HEIGHT, originHeight + deltaY * 2),
                maxMirrorHeight,
              );

              setSize({ width: newWidth, height: newHeight });
              setPosition({
                x: centerX - newWidth / 2,
                y: centerY - newHeight / 2,
              });
            } else {
              const newX = Math.max(
                minPosition,
                Math.min(rightEdge - MIN_WIDTH, originX + deltaX),
              );
              const newHeight = Math.min(
                Math.max(MIN_HEIGHT, originHeight + deltaY),
                workspaceHeight - originY,
              );

              setSize({ width: rightEdge - newX, height: newHeight });
              setPosition((current) => ({ ...current, x: newX }));
            }

            break;
          }

          case 'bottom-right': {
            if (mirror) {
              const newWidth = Math.min(
                Math.max(MIN_WIDTH, originWidth + deltaX * 2),
                maxMirrorWidth,
              );
              const newHeight = Math.min(
                Math.max(MIN_HEIGHT, originHeight + deltaY * 2),
                maxMirrorHeight,
              );

              setSize({ width: newWidth, height: newHeight });
              setPosition({
                x: centerX - newWidth / 2,
                y: centerY - newHeight / 2,
              });
            } else {
              const newWidth = Math.min(
                Math.max(MIN_WIDTH, originWidth + deltaX),
                workspaceWidth - originX,
              );
              const newHeight = Math.min(
                Math.max(MIN_HEIGHT, originHeight + deltaY),
                workspaceHeight - originY,
              );

              setSize({ width: newWidth, height: newHeight });
            }

            break;
          }
        }
      }
    },
    [clampPosition, layoutId],
  );

  // End drag or resize on mouseup, persisting the frame in
  // studio mode when it changed
  const handleMouseUp = useCallback(() => {
    const wasInteracting = dragState.current || resizeState.current;

    dragState.current = null;
    resizeState.current = null;

    if (!layout || !wasInteracting) {
      return;
    }

    const frame = {
      x: Math.round(positionRef.current.x),
      y: Math.round(positionRef.current.y),
      width: Math.round(sizeRef.current.width),
      ...(autoHeight ? {} : { height: Math.round(sizeRef.current.height) }),
    };

    if (!isSameFrame(frame, layout.frame)) {
      updateLayoutFrame(layout.id, frame);
    }
  }, [layout, autoHeight]);

  // Attach global mouse listeners for drag and resize
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // Studio mode: the framed layout no longer exists
  if (layoutId && !layout) {
    return null;
  }

  return (
    <div
      ref={frameRef}
      className={`layout-frame${className ? ` ${className}` : ''}`}
      data-layout-id={layoutId}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        width: size.width,
      }}
    >
      {/* Corner handles (only for page type) */}
      {!autoHeight && (
        <>
          <div className="layout-frame-hover-zone layout-frame-hover-zone-top-left" />
          <div className="layout-frame-hover-zone layout-frame-hover-zone-top-left-vertical" />
          <CornerHandle
            className="layout-frame-resize-handle-top-left"
            path="M 25 0 A 25 25 0 0 0 0 25"
            onMouseDown={(event) => handleResizeMouseDown(event, 'top-left')}
          />
          <div className="layout-frame-hover-zone layout-frame-hover-zone-top-right" />
          <div className="layout-frame-hover-zone layout-frame-hover-zone-top-right-vertical" />
          <CornerHandle
            className="layout-frame-resize-handle-top-right"
            path="M 0 0 A 25 25 0 0 1 25 25"
            onMouseDown={(event) => handleResizeMouseDown(event, 'top-right')}
          />
          <div className="layout-frame-hover-zone layout-frame-hover-zone-bottom-left" />
          <div className="layout-frame-hover-zone layout-frame-hover-zone-bottom-left-vertical" />
          <CornerHandle
            className="layout-frame-resize-handle-bottom-left"
            path="M 25 25 A 25 25 0 0 1 0 0"
            onMouseDown={(event) => handleResizeMouseDown(event, 'bottom-left')}
          />
          <div className="layout-frame-hover-zone layout-frame-hover-zone-bottom-right" />
          <div className="layout-frame-hover-zone layout-frame-hover-zone-bottom-right-vertical" />
          <CornerHandle
            className="layout-frame-resize-handle-bottom-right"
            path="M 0 25 A 25 25 0 0 0 25 0"
            onMouseDown={(event) =>
              handleResizeMouseDown(event, 'bottom-right')
            }
          />
        </>
      )}

      {/* Drag handle hover zone + handle bar */}
      <div className="layout-frame-hover-zone layout-frame-hover-zone-top" />
      <div
        className="layout-frame-drag-handle"
        onMouseDown={handleDragHandleMouseDown}
        onClick={handleDragHandleClick}
      />

      {/* Content wrapper */}
      <div
        className="layout-frame-content"
        style={autoHeight ? undefined : { height: size.height }}
      >
        <LayoutIdProvider value={layoutId ?? null}>
          <DesignPreviewProvider value>{children}</DesignPreviewProvider>
        </LayoutIdProvider>
      </div>

      {/* Left/right edge handles (always visible for all types) */}
      <div className="layout-frame-hover-zone layout-frame-hover-zone-left" />
      <div
        className="layout-frame-resize-handle layout-frame-resize-handle-left"
        onMouseDown={(event) => handleResizeMouseDown(event, 'left')}
      />
      <div className="layout-frame-hover-zone layout-frame-hover-zone-right" />
      <div
        className="layout-frame-resize-handle layout-frame-resize-handle-right"
        onMouseDown={(event) => handleResizeMouseDown(event, 'right')}
      />

      {/* Bottom edge handle (only for page type) */}
      {!autoHeight && (
        <>
          <div className="layout-frame-hover-zone layout-frame-hover-zone-bottom" />
          <div
            className="layout-frame-resize-handle layout-frame-resize-handle-bottom"
            onMouseDown={(event) => handleResizeMouseDown(event, 'bottom')}
          />
        </>
      )}
    </div>
  );
};

/**
 * Compares two layout frames by value.
 */
function isSameFrame(a: Layout['frame'], b: Layout['frame']): boolean {
  return (
    a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height
  );
}
