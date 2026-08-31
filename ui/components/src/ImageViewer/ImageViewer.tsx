import {
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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
import { joinClassNames } from '@minddrop/utils';
import { ImageSize, useContainedImage } from './useContainedImage';
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
   * Additional CSS class name applied to the image itself. Kept
   * separate from `className` so that filters applied to the image
   * do not also affect the floating toolbar.
   */
  imageClassName?: string;

  /**
   * When true, disables all interactive controls (zoom, pan,
   * toolbar) and shows a message on hover indicating that
   * controls are disabled.
   */
  preview?: boolean;

  /**
   * The image's dimensions, if known before it loads. Lets the
   * viewer lay the image out immediately rather than waiting for
   * it to arrive.
   */
  naturalSize?: ImageSize | null;

  /**
   * Colour filling the image's space until it has loaded.
   */
  placeholderColor?: string;
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
  imageClassName,
  preview = false,
  naturalSize: knownSize,
  placeholderColor,
}) => {
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Contained image fitting (base scale, centering, resize tracking)
  const {
    containerRef,
    baseScale,
    handleImageLoad,
    getCenteredPan,
    getEffectivePan,
    clampPan,
    naturalSize,
    ready,
  } = useContainedImage(knownSize);

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
      setIsLoaded(false);
      reset();
    }
  }, [src, reset]);

  // Record the image's dimensions and drop the placeholder
  const handleLoad = useCallback(
    (event: React.SyntheticEvent<HTMLImageElement>) => {
      handleImageLoad(event);
      setIsLoaded(true);
    },
    [handleImageLoad],
  );

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

  // In preview mode, disable all interactive handlers
  const containerHandlers = useMemo(
    () =>
      preview
        ? {}
        : {
            onWheel: handleWheel,
            onMouseDown: handleMouseDown,
            onDoubleClick: handleDoubleClick,
            onMouseEnter: () => {
              isHoveredRef.current = true;
            },
            onMouseLeave: () => {
              isHoveredRef.current = false;
            },
          },
    [preview, handleWheel, handleMouseDown, handleDoubleClick, isHoveredRef],
  );

  return (
    <div
      ref={containerRef}
      className={joinClassNames('image-viewer-container', className)}
      style={{
        ...style,
        position: 'relative',
        overflow: 'hidden',
      }}
      {...containerHandlers}
    >
      {/** Fills the image's space with its own average colour until
       it arrives, so that opening a viewer does not flash the
       empty container **/}
      {placeholderColor && ready && !isLoaded && (
        <div
          className={joinClassNames('image-viewer-placeholder', imageClassName)}
          style={{
            width: naturalSize.width,
            height: naturalSize.height,
            backgroundColor: placeholderColor,
            transform: `translate(${effectivePan.x}px, ${effectivePan.y}px) scale(${effectiveScale})`,
            transformOrigin: '0 0',
          }}
        />
      )}

      {/* Image with zoom/pan transform */}
      <img
        src={src}
        alt=""
        className={joinClassNames('image-viewer-image', imageClassName)}
        draggable={false}
        onLoad={handleLoad}
        style={{
          transform: `translate(${effectivePan.x}px, ${effectivePan.y}px) scale(${effectiveScale})`,
          transformOrigin: '0 0',
          visibility: ready ? 'visible' : 'hidden',
          cursor: resolveImageCursor(preview, isDragging),
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
            label="canvas.zoomOut"
            tooltip={{ title: 'canvas.zoomOut' }}
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
                      stringLabel={`${Math.round(level * 100)}%`}
                      onSelect={() => setZoom(level)}
                    />
                  ))}
                </DropdownMenuContent>
              </DropdownMenuPositioner>
            </DropdownMenuPortal>
          </DropdownMenuRoot>

          {/* Zoom in */}
          <ToolbarIconButton
            icon="plus"
            label="canvas.zoomIn"
            tooltip={{ title: 'canvas.zoomIn' }}
            variant="subtle"
            size="sm"
            onClick={zoomIn}
            disabled={isMaxZoom}
          />

          <ToolbarSeparator />

          {/* Reset view */}
          <ToolbarIconButton
            icon="scan"
            label="canvas.resetView"
            tooltip={{ title: 'canvas.resetView' }}
            variant="subtle"
            size="sm"
            onClick={reset}
          />
        </Toolbar>
      </div>
    </div>
  );
};

/**
 * Returns the cursor for the image element based on the viewer state.
 *
 * @param preview - Whether the viewer is in preview mode.
 * @param isDragging - Whether the image is being panned.
 * @returns The CSS cursor value, or undefined to leave the default.
 */
function resolveImageCursor(
  preview: boolean,
  isDragging: boolean,
): 'grabbing' | 'grab' | undefined {
  // Preview mode leaves the default cursor
  if (preview) {
    return undefined;
  }

  // Show the grabbing cursor while panning
  if (isDragging) {
    return 'grabbing';
  }

  return 'grab';
}
