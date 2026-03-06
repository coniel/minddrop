import { useCallback, useEffect, useRef, useState } from 'react';
import { DesignStudioStore, useDesignStudioStore } from '../DesignStudioStore';
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

    const target = layer.querySelector(
      `[data-element-id="${highlightedElementId}"]`,
    ) as HTMLElement | null;

    if (!target) {
      setRect(null);

      return;
    }

    const zoom = DesignStudioStore.getState().zoom;
    const layerBounds = layer.getBoundingClientRect();
    const targetBounds = target.getBoundingClientRect();

    setRect({
      left: (targetBounds.left - layerBounds.left) / zoom,
      top: (targetBounds.top - layerBounds.top) / zoom,
      width: targetBounds.width / zoom,
      height: targetBounds.height / zoom,
    });
  }, [highlightedElementId, transformLayerRef]);

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
