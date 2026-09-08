import { useEffect, useRef } from 'react';
import {
  Canvas,
  CanvasProvider,
  CanvasToolbar,
  useCanvas,
  useCanvasNode,
  useFitOnNodesReady,
} from '@minddrop/ui-canvas';
import { joinClasses } from '@minddrop/ui-primitives';
import './DesignCanvasPane.css';

export interface DesignCanvasPaneProps {
  /**
   * Reference to the pane element.
   */
  ref?: React.Ref<HTMLElement>;

  /**
   * Class name applied to the pane.
   */
  className?: string;

  /**
   * The layout's width in canvas pixels.
   */
  layoutWidth: number;

  /**
   * The layout's height in canvas pixels. Omitted for layouts whose
   * height follows their content.
   */
  layoutHeight?: number;

  /**
   * Whether the view refits to the layout whenever its size changes.
   */
  fitOnResize?: boolean;

  /**
   * Toolbars floating at the pane's top right, left of the canvas
   * zoom controls.
   */
  controls?: React.ReactNode;

  /**
   * Callback fired when the canvas background around the layout is
   * pressed.
   */
  onBackgroundPress?: () => void;

  /**
   * Toolbars floating at the canvas' left edge.
   */
  sideControls?: React.ReactNode;

  /**
   * The layout content.
   */
  children: React.ReactNode;
}

// Zoom bounds of the pane's canvas
const MinZoom = 0.5;
const MaxZoom = 2;

// The ID of the layout's node on the pane's canvas
const LayoutNodeId = 'design';

/**
 * Renders a zoomable canvas pane holding a single layout at the
 * canvas origin, with the canvas zoom controls floating at its top
 * right and the pane's side controls at its left edge.
 */
export const DesignCanvasPane: React.FC<DesignCanvasPaneProps> = ({
  ref,
  className,
  layoutWidth,
  layoutHeight,
  fitOnResize = false,
  controls,
  onBackgroundPress,
  sideControls,
  children,
}) => (
  <CanvasProvider minZoom={MinZoom} maxZoom={MaxZoom} selectable={false}>
    <section ref={ref} className={joinClasses('design-canvas-pane', className)}>
      <Canvas
        lasso={false}
        shortcutScope="focus"
        onBackgroundMouseDown={() => onBackgroundPress?.()}
      >
        <DesignCanvasLayout
          width={layoutWidth}
          height={layoutHeight}
          fitOnResize={fitOnResize}
        >
          {children}
        </DesignCanvasLayout>
      </Canvas>

      {/* Canvas controls, with the pane's controls to their left */}
      <CanvasToolbar snapping={false}>{controls}</CanvasToolbar>

      {sideControls && (
        <div className="design-canvas-pane-side-controls">{sideControls}</div>
      )}
    </section>
  </CanvasProvider>
);

interface DesignCanvasLayoutProps {
  /**
   * The layout's width in canvas pixels.
   */
  width: number;

  /**
   * The layout's height in canvas pixels. Omitted for layouts whose
   * height follows their content.
   */
  height?: number;

  /**
   * Whether the view refits to the layout whenever its size changes.
   */
  fitOnResize: boolean;

  /**
   * The layout content.
   */
  children: React.ReactNode;
}

/**
 * Renders the layout at the canvas origin, registered as a static
 * node so the view fits to it on load.
 */
const DesignCanvasLayout: React.FC<DesignCanvasLayoutProps> = ({
  width,
  height,
  fitOnResize,
  children,
}) => {
  const mountedRef = useRef(false);
  const canvas = useCanvas();

  // Register the layout as a static node at the origin
  const { nodeRef, frame } = useCanvasNode({
    id: LayoutNodeId,
    x: 0,
    y: 0,
    width,
    height,
    selectable: false,
  });

  // Fit the view to the layout once it has registered
  useFitOnNodesReady([LayoutNodeId]);

  // Refit the view to the layout as its size changes, leaving the
  // initial layout to the fit on load.
  useEffect(() => {
    if (!fitOnResize) {
      return;
    }

    if (!mountedRef.current) {
      mountedRef.current = true;

      return;
    }

    canvas.fitToView();
  }, [fitOnResize, canvas, frame.width, frame.height]);

  return (
    <div ref={nodeRef} className="design-canvas-pane-layout">
      {children}
    </div>
  );
};
