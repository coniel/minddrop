import { useLayoutEffect, useState } from 'react';

/**
 * Tracks an element's layout width, updating as it resizes. Takes
 * the element rather than a ref to it, so that a remounted element
 * is measured afresh (e.g. one held in state through a callback ref).
 *
 * @param element - The element to measure, null while there is none.
 * @returns The element's width in CSS pixels, 0 until it has been measured.
 */
export function useElementWidth(element: HTMLElement | null): number {
  const [width, setWidth] = useState(0);

  // Measure before paint, so that content sized from the width does
  // not paint at a stale size first.
  useLayoutEffect(() => {
    if (!element) {
      return;
    }

    const measure = () => {
      setWidth(element.offsetWidth);
    };

    // Initial measure before the first observer callback
    measure();

    const observer = new ResizeObserver(measure);

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [element]);

  return width;
}
