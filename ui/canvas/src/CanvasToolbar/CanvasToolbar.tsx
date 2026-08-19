import { useCallback } from 'react';
import { TranslationKey } from '@minddrop/i18n';
import {
  ActionMenuRadioItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownMenuRadioGroup,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuSwitchItem,
  DropdownMenuTrigger,
  FloatingToolbar,
  ToolbarButton,
  ToolbarIconButton,
  ToolbarSeparator,
} from '@minddrop/ui-primitives';
import { CanvasGrid } from '../types';
import { useCanvas } from '../useCanvas';
import { useCanvasStore } from '../useCanvasStore';
import './CanvasToolbar.css';

/** Preset zoom levels shown in the dropdown menu. */
const ZOOM_PRESETS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3];

/** The grid pattern options shown in the settings menu. */
const GRID_OPTIONS: { value: CanvasGrid; label: TranslationKey }[] = [
  { value: 'none', label: 'canvas.grid.none' },
  { value: 'dots', label: 'canvas.grid.dots' },
  { value: 'lines', label: 'canvas.grid.lines' },
];

export interface CanvasToolbarProps {
  /**
   * Called when the fit view button is pressed. Defaults to
   * fitting all registered nodes into the viewport.
   */
  onFit?: () => void;

  /**
   * Optional additional class name for the toolbar container.
   */
  className?: string;

  /**
   * Consumer toolbars rendered left of the zoom controls.
   */
  children?: React.ReactNode;
}

/**
 * Renders the current canvas instance's controls: a zoom toolbar
 * (zoom in/out buttons, a zoom level dropdown, reset zoom and fit
 * view buttons) and a settings toolbar beside it. Floats at the
 * top right of the nearest positioned ancestor. Must be rendered
 * within a CanvasProvider.
 */
export const CanvasToolbar: React.FC<CanvasToolbarProps> = ({
  onFit,
  className,
  children,
}) => {
  const zoom = useCanvasStore((state) => state.zoom);
  const minZoom = useCanvasStore((state) => state.minZoom);
  const maxZoom = useCanvasStore((state) => state.maxZoom);
  const grid = useCanvasStore((state) => state.grid);
  const snapToGrid = useCanvasStore((state) => state.snapToGrid);
  const snapToObjects = useCanvasStore((state) => state.snapToObjects);
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

  // Return the zoom level to 100%, centered on the viewport
  const handleResetZoom = useCallback(() => {
    handleSetZoom(1);
  }, [handleSetZoom]);

  // Switch the background grid pattern, narrowing the submenu's
  // stringly typed value back onto the grid union
  const handleGridChange = useCallback(
    (value: string) => {
      if (value === 'none' || value === 'dots' || value === 'lines') {
        canvas.setGrid(value);
      }
    },
    [canvas],
  );

  // Turn snapping node interactions to the grid on or off
  const handleSnapToGridChange = useCallback(
    (enabled: boolean) => {
      canvas.setSnapToGrid(enabled);
    },
    [canvas],
  );

  // Turn snapping node interactions to other nodes on or off
  const handleSnapToObjectsChange = useCallback(
    (enabled: boolean) => {
      canvas.setSnapToObjects(enabled);
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
    <div className={`ui-canvas-toolbar${className ? ` ${className}` : ''}`}>
      {/* Consumer toolbars sit left of the zoom controls */}
      {children}

      {/* Zoom controls */}
      <FloatingToolbar size="md" visible className="ui-canvas-toolbar-zoom">
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
              className="ui-canvas-toolbar-zoom-button"
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

        {/* Reset zoom button */}
        <ToolbarIconButton
          icon="rotate-ccw"
          label="canvas.resetZoom"
          tooltip={{ title: 'canvas.resetZoom', keyboardShortcut: ['0'] }}
          variant="subtle"
          size="sm"
          onClick={handleResetZoom}
          disabled={zoom === 1}
        />

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
      </FloatingToolbar>

      {/* Canvas settings */}
      <FloatingToolbar size="md" visible className="ui-canvas-toolbar-settings">
        <DropdownMenuRoot>
          <DropdownMenuTrigger>
            <ToolbarIconButton
              icon="settings-2"
              label="canvas.settings"
              tooltip={{ title: 'canvas.settings' }}
              variant="subtle"
              size="sm"
            />
          </DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuPositioner side="bottom" align="end">
              <DropdownMenuContent minWidth={200}>
                {/* Snap to grid toggle */}
                <DropdownMenuSwitchItem
                  label="canvas.snapToGrid"
                  checked={snapToGrid}
                  onCheckedChange={handleSnapToGridChange}
                />

                {/* Snap to objects toggle */}
                <DropdownMenuSwitchItem
                  label="canvas.snapToObjects"
                  checked={snapToObjects}
                  onCheckedChange={handleSnapToObjectsChange}
                />

                <DropdownMenuSeparator />

                {/* Background grid pattern */}
                <DropdownMenuGroup>
                  <DropdownMenuLabel label="canvas.grid.label" />
                  <DropdownMenuRadioGroup
                    value={grid}
                    onValueChange={handleGridChange}
                  >
                    {GRID_OPTIONS.map((option) => (
                      <ActionMenuRadioItem
                        key={option.value}
                        value={option.value}
                        label={option.label}
                      />
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenuPositioner>
          </DropdownMenuPortal>
        </DropdownMenuRoot>
      </FloatingToolbar>
    </div>
  );
};
