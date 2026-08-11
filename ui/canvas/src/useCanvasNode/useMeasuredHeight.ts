import { useEffect, useState } from 'react';

/**
 * Tracks an element's rendered height, which auto-height nodes
 * follow.
 *
 * @param elementRef - Ref to the measured element.
 * @returns The element's height, 0 until it is measured.
 */
export function useMeasuredHeight(
  elementRef: React.RefObject<HTMLElement | null>,
): number {
  const [measuredHeight, setMeasuredHeight] = useState(0);

  useEffect(() => {
    const element = elementRef.current;

    if (!element) {
      return;
    }

    const measure = () => {
      setMeasuredHeight(element.offsetHeight);
    };

    // Initial measure before the first observer callback
    measure();

    const observer = new ResizeObserver(measure);

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [elementRef]);

  return measuredHeight;
}
