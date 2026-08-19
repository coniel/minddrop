import { useCallback } from 'react';
import { Layout } from '@minddrop/designs';
import { CanvasNodeFrame, useCanvas, useCanvasNode } from '@minddrop/ui-canvas';
import { Text } from '@minddrop/ui-primitives';
import { DesignPreviewProvider } from '../DesignElements';
import { useDesignStudio, useDesignStudioStore } from '../DesignStudioStore';
import { LayoutIdProvider } from '../LayoutIdContext';
import { LayoutTypeProvider } from '../LayoutTypeContext';
import './LayoutFrame.css';

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
 * Page/space types show all handles including corners and bottom edge.
 * Without a layout ID the frame renders statically, filling its
 * parent (used to embed a layout outside the studio canvas).
 */
export const LayoutFrame: React.FC<LayoutFrameProps> = ({
  layoutId,
  children,
  className,
}) => {
  // The layout being framed, from the design open in the studio
  const layout = useDesignStudioStore((state) =>
    layoutId
      ? state.design?.layouts.find(
          (designLayout) => designLayout.id === layoutId,
        ) || null
      : null,
  );

  // Standalone mode: render the content statically, filling the
  // parent element
  if (!layoutId) {
    return (
      <div
        className={`designs-layout-frame designs-layout-frame-standalone${className ? ` ${className}` : ''}`}
      >
        <div className="designs-layout-frame-content">
          <LayoutIdProvider value={null}>
            <DesignPreviewProvider value>{children}</DesignPreviewProvider>
          </LayoutIdProvider>
        </div>
      </div>
    );
  }

  // Studio mode: the framed layout no longer exists
  if (!layout) {
    return null;
  }

  return (
    <StudioLayoutFrame layout={layout} className={className}>
      {children}
    </StudioLayoutFrame>
  );
};

interface StudioLayoutFrameProps {
  /**
   * The layout being framed.
   */
  layout: Layout;

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
 * Renders a draggable/resizable canvas frame for a layout open in
 * the studio, persisting frame changes when an interaction ends.
 */
const StudioLayoutFrame: React.FC<StudioLayoutFrameProps> = ({
  layout,
  children,
  className,
}) => {
  const studio = useDesignStudio();
  const canvas = useCanvas();

  // Card/list auto-size height, hiding corner + bottom handles
  const autoHeight = layout.type === 'card' || layout.type === 'list';

  // Persist the frame when a drag or resize interaction ends,
  // omitting height for auto-height types
  const handleFrameChange = useCallback(
    (newFrame: CanvasNodeFrame) => {
      studio.updateLayoutFrame(layout.id, {
        x: newFrame.x,
        y: newFrame.y,
        width: newFrame.width,
        ...(autoHeight ? {} : { height: newFrame.height }),
      });
    },
    [studio, layout.id, autoHeight],
  );

  const {
    frame,
    nodeRef,
    getDragHandleProps,
    getResizeHandleProps,
    wasDragged,
  } = useCanvasNode({
    id: layout.id,
    x: layout.frame.x,
    y: layout.frame.y,
    width: layout.frame.width,
    height: autoHeight ? undefined : layout.frame.height,
    bounded: false,
    // The studio drives its own element selection
    selectable: false,
    onFrameChange: handleFrameChange,
  });

  // Select the root element when clicking the drag handle
  // without actually dragging the frame, activating this
  // frame's layout
  const handleDragHandleClick = useCallback(() => {
    if (wasDragged()) {
      return;
    }

    studio.selectElement('root', layout.id);
  }, [studio, wasDragged, layout.id]);

  // Center the viewport on the frame on double-click
  const handleDoubleClick = useCallback(() => {
    canvas.centerOnNode(layout.id);
  }, [canvas, layout.id]);

  // Pressing a hover zone (resize/drag areas) only clears the
  // canvas highlight, selection stays on the current element
  const handleHoverZoneMouseDown = useCallback(() => {
    studio.clearHighlight();
  }, [studio]);

  return (
    <div
      ref={nodeRef}
      className={`designs-layout-frame designs-layout-frame-${layout.type}${className ? ` ${className}` : ''}`}
      data-layout-id={layout.id}
      style={{
        transform: `translate(${frame.x}px, ${frame.y}px)`,
        width: frame.width,
      }}
      onDoubleClick={handleDoubleClick}
    >
      {/* Corner handles (only for fixed-height types) */}
      {!autoHeight && (
        <>
          <div
            className="designs-layout-frame-hover-zone designs-layout-frame-hover-zone-top-left"
            onMouseDown={handleHoverZoneMouseDown}
          />
          <div
            className="designs-layout-frame-hover-zone designs-layout-frame-hover-zone-top-left-vertical"
            onMouseDown={handleHoverZoneMouseDown}
          />
          <CornerHandle
            className="designs-layout-frame-resize-handle-top-left"
            path="M 25 0 A 25 25 0 0 0 0 25"
            onMouseDown={getResizeHandleProps('top-left').onMouseDown}
          />
          <div
            className="designs-layout-frame-hover-zone designs-layout-frame-hover-zone-top-right"
            onMouseDown={handleHoverZoneMouseDown}
          />
          <div
            className="designs-layout-frame-hover-zone designs-layout-frame-hover-zone-top-right-vertical"
            onMouseDown={handleHoverZoneMouseDown}
          />
          <CornerHandle
            className="designs-layout-frame-resize-handle-top-right"
            path="M 0 0 A 25 25 0 0 1 25 25"
            onMouseDown={getResizeHandleProps('top-right').onMouseDown}
          />
          <div
            className="designs-layout-frame-hover-zone designs-layout-frame-hover-zone-bottom-left"
            onMouseDown={handleHoverZoneMouseDown}
          />
          <div
            className="designs-layout-frame-hover-zone designs-layout-frame-hover-zone-bottom-left-vertical"
            onMouseDown={handleHoverZoneMouseDown}
          />
          <CornerHandle
            className="designs-layout-frame-resize-handle-bottom-left"
            path="M 25 25 A 25 25 0 0 1 0 0"
            onMouseDown={getResizeHandleProps('bottom-left').onMouseDown}
          />
          <div
            className="designs-layout-frame-hover-zone designs-layout-frame-hover-zone-bottom-right"
            onMouseDown={handleHoverZoneMouseDown}
          />
          <div
            className="designs-layout-frame-hover-zone designs-layout-frame-hover-zone-bottom-right-vertical"
            onMouseDown={handleHoverZoneMouseDown}
          />
          <CornerHandle
            className="designs-layout-frame-resize-handle-bottom-right"
            path="M 0 25 A 25 25 0 0 0 25 0"
            onMouseDown={getResizeHandleProps('bottom-right').onMouseDown}
          />
        </>
      )}

      {/* Layout name */}
      <div className="designs-layout-frame-name">
        <Text size="sm" color="subtle" stringText={layout.name} />
      </div>

      {/* Drag handle hover zone + handle bar */}
      <div
        className="designs-layout-frame-hover-zone designs-layout-frame-hover-zone-top"
        onMouseDown={handleHoverZoneMouseDown}
      />
      <div
        className="designs-layout-frame-drag-handle"
        {...getDragHandleProps()}
        onClick={handleDragHandleClick}
      />

      {/* Content wrapper */}
      <div
        className="designs-layout-frame-content"
        style={autoHeight ? undefined : { height: frame.height }}
      >
        <LayoutIdProvider value={layout.id}>
          <LayoutTypeProvider value={layout.type}>
            <DesignPreviewProvider value>{children}</DesignPreviewProvider>
          </LayoutTypeProvider>
        </LayoutIdProvider>
      </div>

      {/* Left/right edge handles (always visible for all types) */}
      <div
        className="designs-layout-frame-hover-zone designs-layout-frame-hover-zone-left"
        onMouseDown={handleHoverZoneMouseDown}
      />
      <div
        className="designs-layout-frame-resize-handle designs-layout-frame-resize-handle-left"
        onMouseDown={getResizeHandleProps('left').onMouseDown}
      />
      <div
        className="designs-layout-frame-hover-zone designs-layout-frame-hover-zone-right"
        onMouseDown={handleHoverZoneMouseDown}
      />
      <div
        className="designs-layout-frame-resize-handle designs-layout-frame-resize-handle-right"
        onMouseDown={getResizeHandleProps('right').onMouseDown}
      />

      {/* Bottom edge handle (only for fixed-height types) */}
      {!autoHeight && (
        <>
          <div
            className="designs-layout-frame-hover-zone designs-layout-frame-hover-zone-bottom"
            onMouseDown={handleHoverZoneMouseDown}
          />
          <div
            className="designs-layout-frame-resize-handle designs-layout-frame-resize-handle-bottom"
            onMouseDown={getResizeHandleProps('bottom').onMouseDown}
          />
        </>
      )}
    </div>
  );
};

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
    className={`designs-layout-frame-resize-handle ${className}`}
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
