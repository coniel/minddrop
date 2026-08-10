import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { Layout, LayoutType } from '@minddrop/designs';
import { CanvasNodeFrame, useCanvasNode } from '@minddrop/ui-canvas';
import { TextInput } from '@minddrop/ui-primitives';
import { DesignPreviewProvider } from '../DesignElements';
import {
  DesignStudioStore,
  renameLayout,
  updateLayoutFrame,
  useDesignStudioStore,
} from '../DesignStudioStore';
import { LayoutIdProvider } from '../LayoutIdContext';
import { designStudioCanvasStore } from '../designStudioCanvas';
import './LayoutFrame.css';

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
  // Standalone mode: the frame's self-managed position + size
  const [standaloneFrame, setStandaloneFrame] = useState<CanvasNodeFrame>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

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

  // The controlled frame fed to the node hook: the layout's
  // persisted frame in studio mode, the local frame otherwise
  const controlledFrame: CanvasNodeFrame = layout?.frame
    ? {
        x: layout.frame.x,
        y: layout.frame.y,
        width: layout.frame.width,
        height: layout.frame.height ?? 0,
      }
    : standaloneFrame;

  // Store the frame when a drag or resize interaction ends
  const handleFrameChange = useCallback(
    (newFrame: CanvasNodeFrame) => {
      // Standalone mode: keep the frame locally
      if (!layout) {
        setStandaloneFrame(newFrame);

        return;
      }

      // Persist the frame, omitting height for auto-height types
      updateLayoutFrame(layout.id, {
        x: newFrame.x,
        y: newFrame.y,
        width: newFrame.width,
        ...(autoHeight ? {} : { height: newFrame.height }),
      });
    },
    [layout, autoHeight],
  );

  const {
    frame,
    nodeRef,
    getDragHandleProps,
    getResizeHandleProps,
    wasDragged,
  } = useCanvasNode({
    id: layoutId || 'standalone',
    x: controlledFrame.x,
    y: controlledFrame.y,
    width: controlledFrame.width,
    height: autoHeight ? undefined : controlledFrame.height,
    bounded: !layoutId,
    // The studio drives its own element selection
    selectable: false,
    onFrameChange: handleFrameChange,
  });

  // Standalone mode: set initial layout (size + position) based
  // on the layout type
  useLayoutEffect(() => {
    if (layoutId) {
      return;
    }

    const workspace = nodeRef.current?.parentElement;

    if (!workspace) {
      return;
    }

    const frameLayout = getFrameLayout(
      resolvedLayoutType,
      workspace.offsetWidth,
      workspace.offsetHeight,
    );

    setStandaloneFrame({
      width: frameLayout.width,
      height: frameLayout.height,
      x: frameLayout.x,
      y: Math.max(0, frameLayout.y),
    });
  }, [layoutId, resolvedLayoutType, autoHeight, nodeRef]);

  // Select the root element when clicking the drag handle
  // without actually dragging the frame, activating this
  // frame's layout in studio mode
  const handleDragHandleClick = useCallback(() => {
    if (wasDragged()) {
      return;
    }

    DesignStudioStore.selectElement('root', layoutId);
  }, [wasDragged, layoutId]);

  // Center the viewport on the frame on double-click (studio mode)
  const handleDoubleClick = useCallback(() => {
    if (layoutId) {
      designStudioCanvasStore.centerOnNode(layoutId);
    }
  }, [layoutId]);

  // Pressing a hover zone (resize/drag areas) only clears the
  // canvas highlight, selection stays on the current element
  const handleHoverZoneMouseDown = useCallback(() => {
    DesignStudioStore.clearHighlight();
  }, []);

  // Studio mode: the framed layout no longer exists
  if (layoutId && !layout) {
    return null;
  }

  return (
    <div
      ref={nodeRef}
      className={`layout-frame${className ? ` ${className}` : ''}`}
      data-layout-id={layoutId}
      style={{
        transform: `translate(${frame.x}px, ${frame.y}px)`,
        width: frame.width,
      }}
      onDoubleClick={handleDoubleClick}
    >
      {/* Corner handles (only for page type) */}
      {!autoHeight && (
        <>
          <div
            className="layout-frame-hover-zone layout-frame-hover-zone-top-left"
            onMouseDown={handleHoverZoneMouseDown}
          />
          <div
            className="layout-frame-hover-zone layout-frame-hover-zone-top-left-vertical"
            onMouseDown={handleHoverZoneMouseDown}
          />
          <CornerHandle
            className="layout-frame-resize-handle-top-left"
            path="M 25 0 A 25 25 0 0 0 0 25"
            onMouseDown={getResizeHandleProps('top-left').onMouseDown}
          />
          <div
            className="layout-frame-hover-zone layout-frame-hover-zone-top-right"
            onMouseDown={handleHoverZoneMouseDown}
          />
          <div
            className="layout-frame-hover-zone layout-frame-hover-zone-top-right-vertical"
            onMouseDown={handleHoverZoneMouseDown}
          />
          <CornerHandle
            className="layout-frame-resize-handle-top-right"
            path="M 0 0 A 25 25 0 0 1 25 25"
            onMouseDown={getResizeHandleProps('top-right').onMouseDown}
          />
          <div
            className="layout-frame-hover-zone layout-frame-hover-zone-bottom-left"
            onMouseDown={handleHoverZoneMouseDown}
          />
          <div
            className="layout-frame-hover-zone layout-frame-hover-zone-bottom-left-vertical"
            onMouseDown={handleHoverZoneMouseDown}
          />
          <CornerHandle
            className="layout-frame-resize-handle-bottom-left"
            path="M 25 25 A 25 25 0 0 1 0 0"
            onMouseDown={getResizeHandleProps('bottom-left').onMouseDown}
          />
          <div
            className="layout-frame-hover-zone layout-frame-hover-zone-bottom-right"
            onMouseDown={handleHoverZoneMouseDown}
          />
          <div
            className="layout-frame-hover-zone layout-frame-hover-zone-bottom-right-vertical"
            onMouseDown={handleHoverZoneMouseDown}
          />
          <CornerHandle
            className="layout-frame-resize-handle-bottom-right"
            path="M 0 25 A 25 25 0 0 0 25 0"
            onMouseDown={getResizeHandleProps('bottom-right').onMouseDown}
          />
        </>
      )}

      {/* Layout name input (studio mode only) */}
      {layout && <LayoutNameInput layout={layout} />}

      {/* Drag handle hover zone + handle bar */}
      <div
        className="layout-frame-hover-zone layout-frame-hover-zone-top"
        onMouseDown={handleHoverZoneMouseDown}
      />
      <div
        className="layout-frame-drag-handle"
        {...getDragHandleProps()}
        onClick={handleDragHandleClick}
      />

      {/* Content wrapper */}
      <div
        className="layout-frame-content"
        style={autoHeight ? undefined : { height: frame.height }}
      >
        <LayoutIdProvider value={layoutId ?? null}>
          <DesignPreviewProvider value>{children}</DesignPreviewProvider>
        </LayoutIdProvider>
      </div>

      {/* Left/right edge handles (always visible for all types) */}
      <div
        className="layout-frame-hover-zone layout-frame-hover-zone-left"
        onMouseDown={handleHoverZoneMouseDown}
      />
      <div
        className="layout-frame-resize-handle layout-frame-resize-handle-left"
        onMouseDown={getResizeHandleProps('left').onMouseDown}
      />
      <div
        className="layout-frame-hover-zone layout-frame-hover-zone-right"
        onMouseDown={handleHoverZoneMouseDown}
      />
      <div
        className="layout-frame-resize-handle layout-frame-resize-handle-right"
        onMouseDown={getResizeHandleProps('right').onMouseDown}
      />

      {/* Bottom edge handle (only for page type) */}
      {!autoHeight && (
        <>
          <div
            className="layout-frame-hover-zone layout-frame-hover-zone-bottom"
            onMouseDown={handleHoverZoneMouseDown}
          />
          <div
            className="layout-frame-resize-handle layout-frame-resize-handle-bottom"
            onMouseDown={getResizeHandleProps('bottom').onMouseDown}
          />
        </>
      )}
    </div>
  );
};

interface LayoutNameInputProps {
  /**
   * The layout being named.
   */
  layout: Layout;
}

/**
 * Renders the layout name input above the frame. Commits the
 * name on blur or Enter, reverting empty values.
 */
const LayoutNameInput: React.FC<LayoutNameInputProps> = ({ layout }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(layout.name);

  // Sync the input when the layout is renamed externally
  useEffect(() => {
    setName(layout.name);
  }, [layout.id, layout.name]);

  const handleBlur = useCallback(() => {
    const trimmedName = name.trim();

    if (trimmedName && trimmedName !== layout.name) {
      renameLayout(layout.id, trimmedName);
    } else {
      setName(layout.name);
    }
  }, [name, layout.id, layout.name]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        inputRef.current?.blur();
      }
    },
    [],
  );

  return (
    <div className="layout-frame-name">
      <TextInput
        ref={inputRef}
        variant="subtle"
        size="sm"
        value={name}
        onValueChange={setName}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};
