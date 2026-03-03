import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface Point {
  x: number;
  y: number;
}

/**
 * Minimum number of pixels of the image that must remain
 * visible inside the container when panning.
 */
const PAN_EDGE_MARGIN = 50;

interface ContainedImageResult {
  /**
   * Ref to attach to the container element.
   */
  containerRef: React.RefObject<HTMLDivElement | null>;

  /**
   * Base scale factor that makes the image fully fit
   * (contain) within the container.
   */
  baseScale: number;

  /**
   * Handler for the image's onLoad event to capture
   * natural dimensions.
   */
  handleImageLoad: (event: React.SyntheticEvent<HTMLImageElement>) => void;

  /**
   * Returns the pan offset needed to center the image at
   * the given zoom level.
   */
  getCenteredPan: (zoom: number) => Point;

  /**
   * Computes the effective pan (user pan + centering offset)
   * for the given zoom and user pan values.
   */
  getEffectivePan: (zoom: number, pan: Point) => Point;

  /**
   * Clamps a user pan value so the image always remains
   * partially visible within the container.
   */
  clampPan: (zoom: number, pan: Point) => Point;
}

/**
 * Manages the "contain" fit calculation for an image inside
 * a container. Computes a base scale so the image fits fully
 * within the container at zoom=1, and provides centering
 * helpers for zoom/pan transforms.
 */
export function useContainedImage(): ContainedImageResult {
  const containerRef = useRef<HTMLDivElement>(null);
  const [baseScale, setBaseScale] = useState(1);
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });

  // Recalculate base scale when the image or container dimensions change
  const recalculate = useCallback(() => {
    const container = containerRef.current;

    if (!container || naturalSize.width === 0 || naturalSize.height === 0) {
      return;
    }

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // Scale that makes the image fully fit (contain) the container
    const scale = Math.min(
      containerWidth / naturalSize.width,
      containerHeight / naturalSize.height,
    );

    setBaseScale(scale);
  }, [naturalSize]);

  // Recalculate when natural size is known
  useEffect(() => {
    recalculate();
  }, [recalculate]);

  // Observe container size changes to update the base scale
  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const observer = new ResizeObserver(() => {
      recalculate();
    });

    observer.observe(container);

    return () => observer.disconnect();
  }, [recalculate]);

  // Record natural dimensions when the image loads
  const handleImageLoad = useCallback(
    (event: React.SyntheticEvent<HTMLImageElement>) => {
      const img = event.currentTarget;

      setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
    },
    [],
  );

  // Returns the centering offset for a given zoom level
  const getCenteredPan = useCallback(
    (zoom: number): Point => {
      const container = containerRef.current;

      if (!container) {
        return { x: 0, y: 0 };
      }

      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      const scaledWidth = naturalSize.width * baseScale * zoom;
      const scaledHeight = naturalSize.height * baseScale * zoom;

      return {
        x: (containerWidth - scaledWidth) / 2,
        y: (containerHeight - scaledHeight) / 2,
      };
    },
    [baseScale, naturalSize],
  );

  // Combines user pan with centering offset
  const getEffectivePan = useCallback(
    (zoom: number, pan: Point): Point => {
      const centered = getCenteredPan(zoom);

      return {
        x: centered.x + pan.x,
        y: centered.y + pan.y,
      };
    },
    [getCenteredPan],
  );

  // Clamps user pan so the image always stays partially visible.
  // Ensures at least PAN_EDGE_MARGIN pixels of the image overlap
  // the container on each axis.
  const clampPan = useCallback(
    (zoom: number, userPan: Point): Point => {
      const container = containerRef.current;

      if (!container || naturalSize.width === 0) {
        return userPan;
      }

      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      const scaledWidth = naturalSize.width * baseScale * zoom;
      const scaledHeight = naturalSize.height * baseScale * zoom;
      const centered = getCenteredPan(zoom);

      // Margin is the smaller of the fixed margin and the scaled dimension
      const marginX = Math.min(PAN_EDGE_MARGIN, scaledWidth);
      const marginY = Math.min(PAN_EDGE_MARGIN, scaledHeight);

      // Effective pan bounds: image right edge >= marginX from container left,
      // image left edge <= containerWidth - marginX from container left
      const minEffectiveX = marginX - scaledWidth;
      const maxEffectiveX = containerWidth - marginX;
      const minEffectiveY = marginY - scaledHeight;
      const maxEffectiveY = containerHeight - marginY;

      // Convert to user pan bounds by subtracting the centering offset
      return {
        x: Math.min(
          maxEffectiveX - centered.x,
          Math.max(minEffectiveX - centered.x, userPan.x),
        ),
        y: Math.min(
          maxEffectiveY - centered.y,
          Math.max(minEffectiveY - centered.y, userPan.y),
        ),
      };
    },
    [baseScale, naturalSize, getCenteredPan],
  );

  return useMemo(
    () => ({
      containerRef,
      baseScale,
      handleImageLoad,
      getCenteredPan,
      getEffectivePan,
      clampPan,
    }),
    [baseScale, handleImageLoad, getCenteredPan, getEffectivePan, clampPan],
  );
}
