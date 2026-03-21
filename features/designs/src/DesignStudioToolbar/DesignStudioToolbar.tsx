import { useCallback } from 'react';
import { useTranslation } from '@minddrop/i18n';
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
import { DesignStudioStore, useDesignStudioStore } from '../DesignStudioStore';
import './DesignStudioToolbar.css';
import {
  getViewportCenter,
  resetView,
  zoomIn,
  zoomOut,
} from '../viewportActions';

/** Preset zoom levels shown in the dropdown menu. */
const ZOOM_PRESETS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3];

/**
 * Renders the design studio toolbar with zoom controls.
 */
export const DesignStudioToolbar: React.FC = () => {
  const { t } = useTranslation();
  const zoom = useDesignStudioStore((state) => state.zoom);

  // Zoom in by one step, centered on the viewport
  const handleZoomIn = useCallback(() => {
    zoomIn();
  }, []);

  // Zoom out by one step, centered on the viewport
  const handleZoomOut = useCallback(() => {
    zoomOut();
  }, []);

  // Set zoom to a specific preset level, centered on the viewport
  const handleSetZoom = useCallback((level: number) => {
    DesignStudioStore.getState().setZoom(level, getViewportCenter());
  }, []);

  // Reset zoom to 100% and center the canvas in the viewport
  const handleResetView = useCallback(() => {
    resetView();
  }, []);

  return (
    <Toolbar className="design-studio-toolbar">
      {/* Zoom out button */}
      <ToolbarIconButton
        icon="minus"
        label="designStudio.zoomOut"
        tooltip={{ title: t('designStudio.zoomOut'), keyboardShortcut: ['−'] }}
        variant="subtle"
        size="sm"
        onClick={handleZoomOut}
        disabled={zoom <= 0.1}
      />

      {/* Zoom level dropdown */}
      <DropdownMenuRoot>
        <DropdownMenuTrigger>
          <ToolbarButton
            size="sm"
            variant="subtle"
            className="design-studio-toolbar-zoom-button"
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
                  label={`${Math.round(level * 100)}%`}
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
        label="designStudio.zoomIn"
        tooltip={{ title: t('designStudio.zoomIn'), keyboardShortcut: ['+'] }}
        variant="subtle"
        size="sm"
        onClick={handleZoomIn}
        disabled={zoom >= 3}
      />

      <ToolbarSeparator />

      {/* Reset view button */}
      <ToolbarIconButton
        icon="scan"
        label="designStudio.resetView"
        tooltip={{
          title: t('designStudio.resetView'),
          keyboardShortcut: ['H'],
        }}
        variant="subtle"
        size="sm"
        onClick={handleResetView}
      />
    </Toolbar>
  );
};
