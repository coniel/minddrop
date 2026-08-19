import { useCallback, useEffect, useRef, useState } from 'react';
import { useOptionalCanvasContext } from '@minddrop/ui-canvas';
import { useDesignStudio, useDesignStudioStore } from '../DesignStudioStore';
import './SelectionOverlay.css';

interface OverlayRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface SelectionOverlayProps {
  /**
   * Ref to the transform layer element used as the
   * coordinate origin for overlay positioning.
   */
  transformLayerRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Renders an absolutely positioned selection outline over the
 * highlighted design element. Positioned inside the viewport
 * transform layer so it scales with zoom/pan and is never
 * clipped by element overflow.
 *
 * Re-measures on the events that can move or resize the target:
 * studio store changes (element edits reflow content), canvas
 * store changes (live frame drags register node frames), target
 * and layer resizes, and window resizes.
 */
export const SelectionOverlay: React.FC<SelectionOverlayProps> = ({
  transformLayerRef,
}) => {
  const studio = useDesignStudio();
  const canvasContext = useOptionalCanvasContext();
  const highlightedElementId = useDesignStudioStore(
    (state) => state.highlightedElementId,
  );
  const activeLayoutId = useDesignStudioStore((state) => state.activeLayoutId);
  // Re-render (and re-measure) whenever elements change so the
  // observers re-attach to replaced DOM nodes
  const elementsByLayout = useDesignStudioStore(
    (state) => state.elementsByLayout,
  );
  const [rect, setRect] = useState<OverlayRect | null>(null);
  // Last measured rect, for skipping no-op state updates
  const rectRef = useRef<OverlayRect | null>(null);

  // Measure the target element's position relative to the
  // transform layer, accounting for the current zoom level
  const measure = useCallback(() => {
    const layer = transformLayerRef.current;

    // Update the rect only when it actually changed so repeated
    // measurements don't re-render
    const applyRect = (nextRect: OverlayRect | null) => {
      if (!rectsEqual(rectRef.current, nextRect)) {
        rectRef.current = nextRect;
        setRect(nextRect);
      }
    };

    if (!layer || !highlightedElementId) {
      applyRect(null);

      return;
    }

    // Scope the query to the active layout's frame so shared
    // element IDs (e.g. 'root') don't match other layouts
    const elementSelector = activeLayoutId
      ? `[data-layout-id="${activeLayoutId}"] [data-element-id="${highlightedElementId}"]`
      : `[data-element-id="${highlightedElementId}"]`;

    const target = layer.querySelector(elementSelector) as HTMLElement | null;

    if (!target) {
      applyRect(null);

      return;
    }

    const layerBounds = layer.getBoundingClientRect();
    const targetBounds = target.getBoundingClientRect();

    // The layer's rendered scale: its on-screen width divided by
    // its layout width. Works both inside the zoomed canvas and
    // in un-transformed containers.
    const zoom = layerBounds.width / layer.offsetWidth || 1;

    applyRect({
      left: (targetBounds.left - layerBounds.left) / zoom,
      top: (targetBounds.top - layerBounds.top) / zoom,
      width: targetBounds.width / zoom,
      height: targetBounds.height / zoom,
    });
  }, [highlightedElementId, activeLayoutId, transformLayerRef]);

  // Measure after every commit affecting the highlight or the
  // element tree
  useEffect(() => {
    measure();
  }, [measure, elementsByLayout]);

  // Re-measure when the studio or canvas stores change. Store
  // updates commit to the DOM asynchronously, so measurement is
  // deferred to the next frame (a one-shot, not a loop).
  useEffect(() => {
    if (!highlightedElementId) {
      return;
    }

    let frame = 0;

    const scheduleMeasure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };

    // Element edits reflow the layout content
    const unsubscribeStudio = studio.store.subscribe(scheduleMeasure);

    // Frame drags/resizes register live node frames on the canvas
    const unsubscribeCanvas =
      canvasContext?.store.useStore.subscribe(scheduleMeasure);

    return () => {
      cancelAnimationFrame(frame);
      unsubscribeStudio();
      unsubscribeCanvas?.();
    };
  }, [studio, canvasContext, highlightedElementId, measure]);

  // Observe target and layer sizes, re-attaching when the
  // highlight or the underlying DOM nodes change
  useEffect(() => {
    const layer = transformLayerRef.current;

    if (!layer || !highlightedElementId) {
      return;
    }

    const observer = new ResizeObserver(measure);

    // Content-driven target size changes (e.g. images loading)
    const elementSelector = activeLayoutId
      ? `[data-layout-id="${activeLayoutId}"] [data-element-id="${highlightedElementId}"]`
      : `[data-element-id="${highlightedElementId}"]`;
    const target = layer.querySelector(elementSelector);

    if (target) {
      observer.observe(target);
    }

    // Layer size changes alter the zoom compensation
    observer.observe(layer);

    return () => {
      observer.disconnect();
    };
  }, [
    highlightedElementId,
    activeLayoutId,
    transformLayerRef,
    measure,
    elementsByLayout,
  ]);

  // Window resizes reflow the viewport
  useEffect(() => {
    window.addEventListener('resize', measure);

    return () => {
      window.removeEventListener('resize', measure);
    };
  }, [measure]);

  if (!rect) {
    return null;
  }

  return (
    <div
      className="designs-selection-overlay"
      style={{
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      }}
    />
  );
};

/**
 * Compares two overlay rects for equality, treating null as a
 * distinct value.
 */
function rectsEqual(a: OverlayRect | null, b: OverlayRect | null): boolean {
  if (a === null || b === null) {
    return a === b;
  }

  return (
    a.top === b.top &&
    a.left === b.left &&
    a.width === b.width &&
    a.height === b.height
  );
}
