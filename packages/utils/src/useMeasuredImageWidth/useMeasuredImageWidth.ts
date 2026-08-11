import { useLayoutEffect, useRef, useState } from 'react';
import { bracketImageWidth } from '../bracketImageWidth';

// How long a resize must settle before the new width is requested
const RESIZE_SETTLE_MS = 500;

export interface MeasuredImageWidth {
  /**
   * The bracketed width to request the image at, in device pixels,
   * or undefined when the original image should be used.
   */
  width: number | undefined;

  /**
   * Whether the element has been measured yet. Images should not be
   * requested before it has, as doing so fetches a full resolution
   * image which the measured one immediately replaces.
   */
  isMeasured: boolean;
}

/**
 * Tracks the width at which an element renders an image, bracketed
 * into the size the image should be requested at.
 *
 * The requested width only ever grows, so that shrinking an element
 * does not discard an already loaded image. Resizes settle before
 * being applied, so that dragging an element to a new size does not
 * request every size it passes through.
 *
 * @param elementRef - Ref to the element the image is rendered in.
 * @returns The bracketed image width and whether the element has been measured.
 */
export function useMeasuredImageWidth(
  elementRef: React.RefObject<HTMLElement | null>,
): MeasuredImageWidth {
  const appliedWidthRef = useRef<number>(undefined);
  const settleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [devicePixelWidth, setDevicePixelWidth] = useState<number>();

  // Measured before paint so that the image can be requested at its
  // display width without a full resolution image being painted first
  useLayoutEffect(() => {
    const element = elementRef.current;

    if (!element) {
      return;
    }

    const apply = (measuredDevicePixelWidth: number) => {
      // Keep the largest width applied so far, so that the image is
      // not refetched each time the element shrinks
      if (
        appliedWidthRef.current !== undefined &&
        appliedWidthRef.current >= measuredDevicePixelWidth
      ) {
        return;
      }

      appliedWidthRef.current = measuredDevicePixelWidth;
      setDevicePixelWidth(measuredDevicePixelWidth);
    };

    const measure = () => {
      const measuredWidth = getRenderedWidth(element);

      // Elements can measure 0 while laying out, in which case there
      // is nothing to bracket yet
      if (!measuredWidth) {
        return;
      }

      // Account for the pixel density of the display the element is on
      const measuredDevicePixelWidth = measuredWidth * window.devicePixelRatio;

      // The first measurement applies immediately, as there is no
      // image loaded yet to hold the element over
      if (appliedWidthRef.current === undefined) {
        apply(measuredDevicePixelWidth);

        return;
      }

      // Later measurements wait for the resize to settle, restarting
      // the wait on each one
      if (settleTimeoutRef.current) {
        clearTimeout(settleTimeoutRef.current);
      }

      settleTimeoutRef.current = setTimeout(() => {
        apply(measuredDevicePixelWidth);
      }, RESIZE_SETTLE_MS);
    };

    // Initial measure before the first observer callback
    measure();

    const observer = new ResizeObserver(measure);

    observer.observe(element);

    // Intrinsically sized elements are measured through their parent,
    // which resizes without resizing them
    if (element.parentElement) {
      observer.observe(element.parentElement);
    }

    return () => {
      observer.disconnect();

      if (settleTimeoutRef.current) {
        clearTimeout(settleTimeoutRef.current);
      }
    };
  }, [elementRef]);

  // Above the resize cap the bracket resolves to undefined, meaning
  // the original image is used
  return {
    width:
      devicePixelWidth === undefined
        ? undefined
        : (bracketImageWidth(devicePixelWidth) ?? undefined),
    isMeasured: devicePixelWidth !== undefined,
  };
}

/**
 * Returns the width an element renders an image at, falling back to
 * its parent for elements sized by their own intrinsic dimensions,
 * which have no width of their own until the image loads.
 */
function getRenderedWidth(element: HTMLElement): number {
  const { width } = element.getBoundingClientRect();

  if (width) {
    return width;
  }

  return element.parentElement?.getBoundingClientRect().width ?? 0;
}
