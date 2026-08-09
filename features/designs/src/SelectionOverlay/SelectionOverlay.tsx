import { useCallback, useEffect, useRef, useState } from 'react';
import { useDesignStudioStore } from '../DesignStudioStore';
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
 */
export const SelectionOverlay: React.FC<SelectionOverlayProps> = ({
  transformLayerRef,
}) => {
  const highlightedElementId = useDesignStudioStore(
    (state) => state.highlightedElementId,
  );
  const activeLayoutId = useDesignStudioStore((state) => state.activeLayoutId);
  const [rect, setRect] = useState<OverlayRect | null>(null);
  // Stores the rAF handle so the tracking loop can be cancelled on unmount
  const animationFrameRef = useRef(0);

  // Measure the target element's position relative to the
  // transform layer, accounting for the current zoom level
  const measure = useCallback(() => {
    const layer = transformLayerRef.current;

    if (!layer || !highlightedElementId) {
      setRect(null);

      return;
    }

    // Scope the query to the active layout's frame so shared
    // element IDs (e.g. 'root') don't match other layouts
    const elementSelector = activeLayoutId
      ? `[data-layout-id="${activeLayoutId}"] [data-element-id="${highlightedElementId}"]`
      : `[data-element-id="${highlightedElementId}"]`;

    const target = layer.querySelector(elementSelector) as HTMLElement | null;

    if (!target) {
      setRect(null);

      return;
    }

    const layerBounds = layer.getBoundingClientRect();
    const targetBounds = target.getBoundingClientRect();

    // The layer's rendered scale: its on-screen width divided by
    // its layout width. Works both inside the zoomed canvas and
    // in un-transformed containers.
    const zoom = layerBounds.width / layer.offsetWidth || 1;

    setRect({
      left: (targetBounds.left - layerBounds.left) / zoom,
      top: (targetBounds.top - layerBounds.top) / zoom,
      width: targetBounds.width / zoom,
      height: targetBounds.height / zoom,
    });
  }, [highlightedElementId, activeLayoutId, transformLayerRef]);

  // Continuously track position via requestAnimationFrame
  // while a highlight is active
  useEffect(() => {
    if (!highlightedElementId) {
      setRect(null);

      return;
    }

    const loop = () => {
      measure();
      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [highlightedElementId, measure]);

  if (!rect) {
    return null;
  }

  return (
    <div
      className="selection-overlay"
      style={{
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      }}
    />
  );
};
