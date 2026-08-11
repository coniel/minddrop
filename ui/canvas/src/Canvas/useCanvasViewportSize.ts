import { useEffect } from 'react';
import { useCanvasContext } from '../CanvasContext';

/**
 * Keeps the measured viewport size in the canvas store, which the
 * fit and centering math reads.
 */
export function useCanvasViewportSize(): void {
  const { store, viewportRef } = useCanvasContext();

  useEffect(() => {
    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    const measure = () => {
      store.setViewportSize({
        width: viewport.offsetWidth,
        height: viewport.offsetHeight,
      });
    };

    // Initial measure before the first observer callback
    measure();

    const observer = new ResizeObserver(measure);

    observer.observe(viewport);

    return () => {
      observer.disconnect();
    };
  }, [store, viewportRef]);
}
