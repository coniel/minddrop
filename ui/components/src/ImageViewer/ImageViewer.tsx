import { CSSProperties, useEffect, useRef } from 'react';
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
import { useContainedImage } from './useContainedImage';
import { useImageViewerDrag } from './useImageViewerDrag';
import { ZOOM_PRESETS, useImageViewerZoom } from './useImageViewerZoom';
import './ImageViewer.css';

export interface ImageViewerProps {
  /**
   * The image source URL to display.
   */
  src: string;

  /**
   * Additional CSS styles applied to the container.
   */
  style?: CSSProperties;

  /**
   * Additional CSS class name applied to the container.
   */
  className?: string;

  /**
   * When true, disables all interactive controls (zoom, pan,
   * toolbar) and shows a message on hover indicating that
   * controls are disabled.
   */
  preview?: boolean;
}

/**
 * Renders an interactive image viewer with zoom/pan controls.
 * The image initially appears "contained" (fully visible and
 * centered) at zoom=1. Users can scroll to zoom toward their
 * cursor, drag to pan, and use the floating toolbar to control
 * the zoom level.
 */
export const ImageViewer: React.FC<ImageViewerProps> = ({
  src,
  style,
  className,
  preview = false,
}) => {
  const { t } = useTranslation();
  const toolbarRef = useRef<HTMLDivElement>(null);

  // Contained image fitting (base scale, centering, resize tracking)
  const {
    containerRef,
    baseScale,
    handleImageLoad,
    getCenteredPan,
    getEffectivePan,
    clampPan,
    ready,
  } = useContainedImage();

  // Zoom state and controls
  const {
    zoom,
    actualZoom,
    pan,
    setPan,
    zoomIn,
    zoomOut,
    setZoom,
    reset,
    handleWheel,
    handleDoubleClick,
    isMinZoom,
    isMaxZoom,
    isHoveredRef,
  } = useImageViewerZoom({
    containerRef,
    baseScale,
    getCenteredPan,
    getEffectivePan,
    clampPan,
  });

  // Drag-to-pan interaction
  const { isDragging, handleMouseDown } = useImageViewerDrag(
    pan,
    setPan,
    zoom,
    clampPan,
  );

  // Reset zoom and pan when the image source changes
  const previousSrcRef = useRef(src);

  useEffect(() => {
    if (src !== previousSrcRef.current) {
      previousSrcRef.current = src;
      reset();
    }
  }, [src, reset]);

  // Compute final transform values
  const effectivePan = getEffectivePan(zoom, pan);
  const effectiveScale = baseScale * zoom;

  // Force the browser to recomposite the backdrop-filter when
  // the image behind the toolbar moves due to zoom/pan changes.
  // Without this, the browser caches the backdrop and it goes stale.
  useEffect(() => {
    const inner = toolbarRef.current?.firstElementChild as HTMLElement | null;

    if (!inner) {
      return;
    }

    const innerStyle = inner.style as CSSStyleDeclaration &
      Record<string, string>;

    innerStyle.backdropFilter = 'none';
    innerStyle.webkitBackdropFilter = 'none';

    const frame = requestAnimationFrame(() => {
      innerStyle.backdropFilter = '';
      innerStyle.webkitBackdropFilter = '';
    });

    return () => cancelAnimationFrame(frame);
  }, [zoom, pan]);

  const viewer = (
    <div
      ref={containerRef}
      className={`image-viewer-container${className ? ` ${className}` : ''}`}
      style={{
        ...(preview ? undefined : style),
        position: 'relative',
        overflow: 'hidden',
      }}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
      }}
    >
      {/* Image with zoom/pan transform */}
      <img
        src={src}
        alt=""
        className="image-viewer-image"
        draggable={false}
        onLoad={handleImageLoad}
        style={{
          transform: `translate(${effectivePan.x}px, ${effectivePan.y}px) scale(${effectiveScale})`,
          transformOrigin: '0 0',
          visibility: ready ? 'visible' : 'hidden',
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
      />

      {/* Floating zoom toolbar */}
      <div
        ref={toolbarRef}
        className="image-viewer-toolbar-container"
        onDoubleClick={(event) => event.stopPropagation()}
      >
        <Toolbar className="image-viewer-toolbar">
          {/* Zoom out */}
          <ToolbarIconButton
            icon="minus"
            label="designStudio.zoomOut"
            tooltip={{ title: t('designStudio.zoomOut') }}
            variant="subtle"
            size="sm"
            onClick={zoomOut}
            disabled={isMinZoom}
          />

          {/* Zoom level drop-up menu */}
          <DropdownMenuRoot>
            <DropdownMenuTrigger>
              <ToolbarButton
                size="sm"
                variant="subtle"
                className="image-viewer-zoom-button"
              >
                {Math.round(actualZoom * 100)}%
              </ToolbarButton>
            </DropdownMenuTrigger>
            <DropdownMenuPortal>
              <DropdownMenuPositioner side="top" align="center">
                <DropdownMenuContent minWidth={80}>
                  {ZOOM_PRESETS.map((level) => (
                    <DropdownMenuItem
                      key={level}
                      label={`${Math.round(level * 100)}%`}
                      onClick={() => setZoom(level)}
                    />
                  ))}
                </DropdownMenuContent>
              </DropdownMenuPositioner>
            </DropdownMenuPortal>
          </DropdownMenuRoot>

          {/* Zoom in */}
          <ToolbarIconButton
            icon="plus"
            label="designStudio.zoomIn"
            tooltip={{ title: t('designStudio.zoomIn') }}
            variant="subtle"
            size="sm"
            onClick={zoomIn}
            disabled={isMaxZoom}
          />

          <ToolbarSeparator />

          {/* Reset view */}
          <ToolbarIconButton
            icon="scan"
            label="designStudio.resetView"
            tooltip={{ title: t('designStudio.resetView') }}
            variant="subtle"
            size="sm"
            onClick={reset}
          />
        </Toolbar>
      </div>
    </div>
  );

  // In preview mode, wrap with an overlay that blocks all
  // interaction and shows a message on hover
  if (preview) {
    return (
      <div className="image-viewer-preview-wrapper" style={style}>
        {viewer}

        {/* Transparent overlay blocking clicks/scrolls */}
        <div className="image-viewer-preview-overlay">
          <div className="image-viewer-preview-message">
            {t('imageViewer.previewMessage')}
          </div>
        </div>
      </div>
    );
  }

  return viewer;
};
