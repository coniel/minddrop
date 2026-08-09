import { useCallback } from 'react';
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  Toolbar,
  ToolbarButton,
  ToolbarIconButton,
  ToolbarSeparator,
} from '@minddrop/ui-primitives';
import { useCanvas } from '../useCanvas';
import { useCanvasStore } from '../useCanvasStore';
import './CanvasZoomToolbar.css';

/** Preset zoom levels shown in the dropdown menu. */
const ZOOM_PRESETS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3];

export interface CanvasZoomToolbarProps {
  /**
   * Called when the fit view button is pressed. Defaults to
   * fitting all registered nodes into the viewport.
   */
  onFit?: () => void;

  /**
   * Optional additional class name for the toolbar element.
   */
  className?: string;
}

/**
 * Renders zoom controls for the current canvas instance: zoom
 * in/out buttons, a zoom level dropdown and a fit view button.
 * Must be rendered within a CanvasProvider.
 */
export const CanvasZoomToolbar: React.FC<CanvasZoomToolbarProps> = ({
  onFit,
  className,
}) => {
  const zoom = useCanvasStore((state) => state.zoom);
  const minZoom = useCanvasStore((state) => state.minZoom);
  const maxZoom = useCanvasStore((state) => state.maxZoom);
  const canvas = useCanvas();

  // Zoom in by one step, centered on the viewport
  const handleZoomIn = useCallback(() => {
    canvas.zoomIn();
  }, [canvas]);

  // Zoom out by one step, centered on the viewport
  const handleZoomOut = useCallback(() => {
    canvas.zoomOut();
  }, [canvas]);

  // Set zoom to a specific preset level, centered on the viewport
  const handleSetZoom = useCallback(
    (level: number) => {
      const viewportSize = canvas.getViewportSize();

      canvas.setZoom(level, {
        x: viewportSize.width / 2,
        y: viewportSize.height / 2,
      });
    },
    [canvas],
  );

  // Fit the canvas content into the viewport
  const handleFit = useCallback(() => {
    if (onFit) {
      onFit();
    } else {
      canvas.fitToView();
    }
  }, [onFit, canvas]);

  return (
    <Toolbar
      className={`ui-canvas-zoom-toolbar${className ? ` ${className}` : ''}`}
    >
      {/* Zoom out button */}
      <ToolbarIconButton
        icon="minus"
        label="canvas.zoomOut"
        tooltip={{ title: 'canvas.zoomOut', keyboardShortcut: ['−'] }}
        variant="subtle"
        size="sm"
        onClick={handleZoomOut}
        disabled={zoom <= minZoom}
      />

      {/* Zoom level dropdown */}
      <DropdownMenuRoot>
        <DropdownMenuTrigger>
          <ToolbarButton
            size="sm"
            variant="subtle"
            className="ui-canvas-zoom-toolbar-zoom-button"
          >
            {Math.round(zoom * 100)}%
          </ToolbarButton>
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuPositioner side="bottom" align="start">
            <DropdownMenuContent minWidth={80}>
              {ZOOM_PRESETS.map((level) => (
                <DropdownMenuItem
                  key={level}
                  stringLabel={`${Math.round(level * 100)}%`}
                  onSelect={() => handleSetZoom(level)}
                />
              ))}
            </DropdownMenuContent>
          </DropdownMenuPositioner>
        </DropdownMenuPortal>
      </DropdownMenuRoot>

      {/* Zoom in button */}
      <ToolbarIconButton
        icon="plus"
        label="canvas.zoomIn"
        tooltip={{ title: 'canvas.zoomIn', keyboardShortcut: ['+'] }}
        variant="subtle"
        size="sm"
        onClick={handleZoomIn}
        disabled={zoom >= maxZoom}
      />

      <ToolbarSeparator />

      {/* Fit view button */}
      <ToolbarIconButton
        icon="scan"
        label="canvas.fitView"
        tooltip={{
          title: 'canvas.fitView',
          keyboardShortcut: ['H'],
        }}
        variant="subtle"
        size="sm"
        onClick={handleFit}
      />
    </Toolbar>
  );
};
