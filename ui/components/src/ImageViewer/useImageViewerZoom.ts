import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Minimum internal zoom level. At 0.5, the image is 50% of
 * its contained size (50% of the container in the fitted dimension).
 */
const MIN_ZOOM = 0.5;

/** Maximum actual pixel scale (1000%). */
const MAX_ACTUAL_SCALE = 10;

/** Zoom sensitivity for mouse scroll wheel. */
const WHEEL_ZOOM_FACTOR = 0.003;

/** Zoom sensitivity for trackpad pinch gestures (ctrlKey wheel events). */
const PINCH_ZOOM_FACTOR = 0.012;

/**
 * Time in ms after the last wheel event before we consider
 * the current scroll gesture to have ended.
 */
const GESTURE_TIMEOUT = 120;

/**
 * Preset zoom levels shown in the dropdown menu.
 * Values represent actual pixel scale (1 = 100% = 1:1 pixels).
 */
export const ZOOM_PRESETS = [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 5];

interface Point {
  x: number;
  y: number;
}

interface ImageViewerZoomOptions {
  /**
   * Ref to the container element (for cursor position calculations).
   */
  containerRef: React.RefObject<HTMLDivElement | null>;

  /**
   * Base scale factor from contained image fitting.
   * Used to convert between internal zoom and actual pixel scale.
   */
  baseScale: number;

  /**
   * Returns the centering offset for a given zoom level.
   */
  getCenteredPan: (zoom: number) => Point;

  /**
   * Returns the effective pan (user pan + centering) for
   * a given zoom and user pan.
   */
  getEffectivePan: (zoom: number, pan: Point) => Point;

  /**
   * Clamps a user pan so the image stays partially visible.
   */
  clampPan: (zoom: number, pan: Point) => Point;
}

interface ImageViewerZoomResult {
  /**
   * Current internal zoom level (1 = contained fit).
   */
  zoom: number;

  /**
   * Current actual pixel scale (baseScale * zoom).
   * 1 = 100% = 1:1 pixels.
   */
  actualZoom: number;

  /**
   * Current user pan offset in screen pixels.
   */
  pan: Point;

  /**
   * Zoom in by one adaptive step.
   */
  zoomIn: () => void;

  /**
   * Zoom out by one adaptive step.
   */
  zoomOut: () => void;

  /**
   * Set zoom to a specific actual pixel scale level.
   */
  setZoom: (actualLevel: number) => void;

  /**
   * Set the pan offset directly.
   */
  setPan: React.Dispatch<React.SetStateAction<Point>>;

  /**
   * Reset zoom to contained fit and pan to center.
   */
  reset: () => void;

  /**
   * Wheel event handler for focal-point zooming.
   */
  handleWheel: (event: React.WheelEvent) => void;

  /**
   * Double-click handler that zooms in 75% toward the cursor.
   */
  handleDoubleClick: (event: React.MouseEvent) => void;

  /**
   * Whether zoom is at the minimum allowed level.
   */
  isMinZoom: boolean;

  /**
   * Whether zoom is at the maximum allowed level.
   */
  isMaxZoom: boolean;

  /**
   * Whether the cursor is currently hovering over the container.
   */
  isHoveredRef: React.RefObject<boolean>;
}

/**
 * Returns the zoom step size based on the actual pixel scale.
 * Steps are defined in actual scale units for consistent behaviour
 * regardless of image/container size.
 */
function getActualZoomStep(actualScale: number): number {
  if (actualScale < 0.25) {
    return 0.05;
  }

  if (actualScale < 1) {
    return 0.1;
  }

  if (actualScale < 2) {
    return 0.25;
  }

  if (actualScale < 3) {
    return 0.5;
  }

  return 1;
}

/** Clamps an internal zoom value to the valid range. */
function clampZoom(value: number, baseScale: number): number {
  const maxZoom = MAX_ACTUAL_SCALE / baseScale;

  return Math.min(maxZoom, Math.max(MIN_ZOOM, value));
}

/**
 * Manages zoom state and controls for the image viewer.
 * Handles zoom in/out with adaptive stepping, scroll-to-zoom
 * with focal point, preset levels, and reset. Also listens
 * for the '0' key to reset when hovering.
 *
 * All user-facing zoom values (display, presets, setZoom) use
 * actual pixel scale where 1 = 100% = 1:1 native pixels.
 * Internally, zoom is relative to the contained fit (zoom=1
 * means the image fits fully within the container).
 */
export function useImageViewerZoom({
  containerRef,
  baseScale,
  getCenteredPan,
  getEffectivePan,
  clampPan,
}: ImageViewerZoomOptions): ImageViewerZoomResult {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 });
  const isHoveredRef = useRef(false);

  // Actual pixel scale for display and external API
  const actualZoom = baseScale * zoom;

  // Tracks whether the current scroll gesture is a trackpad pan.
  // Once any event in a gesture has deltaX !== 0, we latch into
  // pan mode until the gesture ends (no wheel events for GESTURE_TIMEOUT ms).
  const isTrackpadGestureRef = useRef(false);
  const gestureTimerRef = useRef<ReturnType<typeof setTimeout>>(null);

  // Shared animation state for all animated zoom transitions
  const isAnimatingRef = useRef(false);
  const animationFrameRef = useRef<number>(0);

  // Animates zoom and pan from current values to the given targets
  // over 200ms with ease-out cubic easing
  const animateTo = useCallback(
    (targetZoom: number, targetPan: Point) => {
      // Cancel any running animation
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      const startZoom = zoom;
      const startPan = { ...pan };
      const duration = 200;
      const startTime = performance.now();

      isAnimatingRef.current = true;

      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out cubic
        const eased = 1 - (1 - progress) ** 3;

        setZoom(startZoom + (targetZoom - startZoom) * eased);
        setPan({
          x: startPan.x + (targetPan.x - startPan.x) * eased,
          y: startPan.y + (targetPan.y - startPan.y) * eased,
        });

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate);
        } else {
          animationFrameRef.current = 0;
          isAnimatingRef.current = false;
        }
      };

      animationFrameRef.current = requestAnimationFrame(animate);
    },
    [zoom, pan],
  );

  // Computes the target pan for a center-based zoom (toolbar controls).
  // Zooms toward/from the container center.
  const getTargetPanForCenter = useCallback(
    (targetZoom: number): Point => {
      const container = containerRef.current;

      if (!container) {
        return { x: 0, y: 0 };
      }

      const centerX = container.clientWidth / 2;
      const centerY = container.clientHeight / 2;

      const currentEffective = getEffectivePan(zoom, pan);
      const ratio = targetZoom / zoom;
      const targetCentered = getCenteredPan(targetZoom);

      return clampPan(targetZoom, {
        x: centerX - (centerX - currentEffective.x) * ratio - targetCentered.x,
        y: centerY - (centerY - currentEffective.y) * ratio - targetCentered.y,
      });
    },
    [zoom, pan, containerRef, getCenteredPan, getEffectivePan, clampPan],
  );

  // Zoom in by one adaptive step based on actual pixel scale,
  // snapping to 100% actual if within 5%
  const zoomIn = useCallback(() => {
    const currentActual = baseScale * zoom;
    let targetActual = currentActual + getActualZoomStep(currentActual);

    // Snap to 100% actual pixels if within 5%
    if (Math.abs(targetActual - 1) <= 0.05) {
      targetActual = 1;
    }

    const targetZoom = clampZoom(targetActual / baseScale, baseScale);

    animateTo(targetZoom, getTargetPanForCenter(targetZoom));
  }, [zoom, baseScale, animateTo, getTargetPanForCenter]);

  // Zoom out by one adaptive step based on actual pixel scale,
  // snapping to 100% actual if within 5%
  const zoomOut = useCallback(() => {
    const currentActual = baseScale * zoom;
    const step = getActualZoomStep(currentActual - 0.001);
    let targetActual = currentActual - step;

    // Snap to 100% actual pixels if within 5%
    if (Math.abs(targetActual - 1) <= 0.05) {
      targetActual = 1;
    }

    const targetZoom = clampZoom(targetActual / baseScale, baseScale);

    animateTo(targetZoom, getTargetPanForCenter(targetZoom));
  }, [zoom, baseScale, animateTo, getTargetPanForCenter]);

  // Set zoom to a specific actual pixel scale level
  const setZoomLevel = useCallback(
    (actualLevel: number) => {
      const targetZoom = clampZoom(actualLevel / baseScale, baseScale);

      animateTo(targetZoom, getTargetPanForCenter(targetZoom));
    },
    [baseScale, animateTo, getTargetPanForCenter],
  );

  // Reset zoom and pan to defaults (contained fit + centered)
  const reset = useCallback(() => {
    animateTo(1, { x: 0, y: 0 });
  }, [animateTo]);

  // Lerp chase for centering pan when scrolling past min zoom.
  // Each scroll notch updates the target closer to center, and
  // the animation smoothly chases it.
  const centerTargetRef = useRef<Point>({ x: 0, y: 0 });
  const centerAnimationRef = useRef<number>(0);

  // Tracks the wheel zoom animation state. Pan is always computed
  // relative to the original start values to avoid cumulative drift.
  const wheelTargetZoomRef = useRef(1);
  const wheelStartZoomRef = useRef(1);
  const wheelStartEffectiveRef = useRef<Point>({ x: 0, y: 0 });
  const wheelCursorRef = useRef<Point>({ x: 0, y: 0 });
  const wheelAnimationRef = useRef<number>(0);

  // Double-click zooms in 75% toward the cursor with animation
  const handleDoubleClick = useCallback(
    (event: React.MouseEvent) => {
      const container = containerRef.current;

      if (!container || isAnimatingRef.current) {
        return;
      }

      const rect = container.getBoundingClientRect();

      // Cursor position relative to the container
      const cursorX = event.clientX - rect.left;
      const cursorY = event.clientY - rect.top;

      const targetZoom = clampZoom(zoom * 1.75, baseScale);
      const ratio = targetZoom / zoom;

      // Compute target pan so the cursor point stays stationary
      const currentEffective = getEffectivePan(zoom, pan);
      const targetCentered = getCenteredPan(targetZoom);
      const targetPan = clampPan(targetZoom, {
        x: cursorX - (cursorX - currentEffective.x) * ratio - targetCentered.x,
        y: cursorY - (cursorY - currentEffective.y) * ratio - targetCentered.y,
      });

      animateTo(targetZoom, targetPan);
    },
    [
      zoom,
      pan,
      baseScale,
      containerRef,
      getCenteredPan,
      getEffectivePan,
      clampPan,
      animateTo,
    ],
  );

  // Handles wheel events: pinch and mouse wheel zoom toward the
  // cursor, trackpad scroll pans the image
  const handleWheel = useCallback(
    (event: React.WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();

      // Reset the gesture end timer on every wheel event
      if (gestureTimerRef.current) {
        clearTimeout(gestureTimerRef.current);
      }

      gestureTimerRef.current = setTimeout(() => {
        isTrackpadGestureRef.current = false;
      }, GESTURE_TIMEOUT);

      // Latch into trackpad pan mode when any event has deltaX.
      // Stays latched until the gesture ends (timeout).
      if (event.deltaX !== 0) {
        isTrackpadGestureRef.current = true;
      }

      // Determine if this is a zoom or pan gesture.
      // Pinch gestures fire with ctrlKey. Mouse wheels produce
      // vertical-only deltas. Trackpad two-finger scrolls are
      // detected by deltaX presence (latched per gesture).
      const isPinch = event.ctrlKey;
      const isZoom =
        !isPinch && !isTrackpadGestureRef.current && !event.metaKey;

      // Pinch and mouse wheel zoom toward the cursor
      if (isPinch || isZoom) {
        // At min zoom and scrolling to zoom out further — move
        // pan target toward center, with a lerp chase animation
        if (zoom <= MIN_ZOOM + 0.001 && event.deltaY > 0) {
          const strength = Math.min(Math.abs(event.deltaY) * 0.005, 0.3);

          // Update the target closer to center based on scroll strength.
          // Use current pan as base if no animation is running yet.
          const base = centerAnimationRef.current
            ? centerTargetRef.current
            : pan;

          centerTargetRef.current = {
            x: base.x * (1 - strength),
            y: base.y * (1 - strength),
          };

          // Snap target to exact center when close enough
          if (
            Math.abs(centerTargetRef.current.x) < 0.5 &&
            Math.abs(centerTargetRef.current.y) < 0.5
          ) {
            centerTargetRef.current = { x: 0, y: 0 };
          }

          // Start a lerp chase if not already running
          if (!centerAnimationRef.current) {
            const lerpFactor = 0.2;

            const animate = () => {
              setPan((current) => {
                const target = centerTargetRef.current;
                const diffX = target.x - current.x;
                const diffY = target.y - current.y;

                // Stop when close enough to the target
                if (Math.abs(diffX) < 0.5 && Math.abs(diffY) < 0.5) {
                  centerAnimationRef.current = 0;

                  return target;
                }

                centerAnimationRef.current = requestAnimationFrame(animate);

                return {
                  x: current.x + diffX * lerpFactor,
                  y: current.y + diffY * lerpFactor,
                };
              });
            };

            centerAnimationRef.current = requestAnimationFrame(animate);
          }

          return;
        }

        const container = containerRef.current;

        if (!container) {
          return;
        }

        const rect = container.getBoundingClientRect();

        // Cursor position relative to the container
        const cursorX = event.clientX - rect.left;
        const cursorY = event.clientY - rect.top;

        // Pinch gestures apply immediately (high frequency, already smooth)
        if (isPinch) {
          const delta = -event.deltaY * PINCH_ZOOM_FACTOR;
          const newZoom = clampZoom(zoom * (1 + delta), baseScale);
          const ratio = newZoom / zoom;

          const currentEffective = getEffectivePan(zoom, pan);
          const newCentered = getCenteredPan(newZoom);
          const newPanX =
            cursorX - (cursorX - currentEffective.x) * ratio - newCentered.x;
          const newPanY =
            cursorY - (cursorY - currentEffective.y) * ratio - newCentered.y;

          setZoom(newZoom);
          setPan(clampPan(newZoom, { x: newPanX, y: newPanY }));

          return;
        }

        // Mouse wheel zoom: use a lerp chase toward the target.
        // Pan is always computed relative to the original start
        // values to avoid cumulative floating-point drift.
        const delta = -event.deltaY * WHEEL_ZOOM_FACTOR;
        const baseZoom = wheelAnimationRef.current
          ? wheelTargetZoomRef.current
          : zoom;

        wheelTargetZoomRef.current = clampZoom(
          baseZoom * (1 + delta),
          baseScale,
        );
        wheelCursorRef.current = { x: cursorX, y: cursorY };

        // Capture the start state when beginning a new animation
        if (!wheelAnimationRef.current) {
          wheelStartZoomRef.current = zoom;
          wheelStartEffectiveRef.current = getEffectivePan(zoom, pan);
        }

        // If an animation loop is already running, it will pick up
        // the new target automatically
        if (wheelAnimationRef.current) {
          return;
        }

        // Lerp factor per frame (~0.25 at 60fps gives smooth ~150ms settle)
        const lerpFactor = 0.25;

        const animate = () => {
          setZoom((currentZoom) => {
            const target = wheelTargetZoomRef.current;
            const diff = target - currentZoom;
            const cursor = wheelCursorRef.current;
            const startZoom = wheelStartZoomRef.current;
            const startEffective = wheelStartEffectiveRef.current;

            // Determine the interpolated zoom for this frame
            const done = Math.abs(diff) < 0.001;
            const newZoom = done ? target : currentZoom + diff * lerpFactor;

            // Compute pan relative to the original start values
            const ratio = newZoom / startZoom;
            const newCentered = getCenteredPan(newZoom);
            const newPan = clampPan(newZoom, {
              x:
                cursor.x -
                (cursor.x - startEffective.x) * ratio -
                newCentered.x,
              y:
                cursor.y -
                (cursor.y - startEffective.y) * ratio -
                newCentered.y,
            });

            setPan(newPan);

            if (done) {
              wheelAnimationRef.current = 0;
            } else {
              wheelAnimationRef.current = requestAnimationFrame(animate);
            }

            return newZoom;
          });
        };

        wheelAnimationRef.current = requestAnimationFrame(animate);

        return;
      }

      // Trackpad scroll pans the image
      setPan((current) =>
        clampPan(zoom, {
          x: current.x - event.deltaX * 2,
          y: current.y - event.deltaY * 2,
        }),
      );
    },
    [
      zoom,
      pan,
      baseScale,
      containerRef,
      getCenteredPan,
      getEffectivePan,
      clampPan,
    ],
  );

  // Listen for keyboard shortcuts when hovering over the container:
  // '+' / '=' to zoom in, '-' to zoom out, '0' to reset
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isHoveredRef.current) {
        return;
      }

      if (event.key === '0') {
        event.preventDefault();
        reset();
      } else if (event.key === '+' || event.key === '=') {
        event.preventDefault();
        zoomIn();
      } else if (event.key === '-') {
        event.preventDefault();
        zoomOut();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [reset, zoomIn, zoomOut]);

  return {
    zoom,
    actualZoom,
    pan,
    setPan,
    zoomIn,
    zoomOut,
    setZoom: setZoomLevel,
    reset,
    handleWheel,
    handleDoubleClick,
    isMinZoom: zoom <= MIN_ZOOM,
    isMaxZoom: actualZoom >= MAX_ACTUAL_SCALE,
    isHoveredRef,
  };
}
