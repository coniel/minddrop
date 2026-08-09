import { useCanvasContext } from './CanvasContext';

/**
 * Returns the ref to the canvas transform layer element. Overlays
 * rendered inside the layer can use it to measure elements
 * relative to the canvas. Must be used within a CanvasProvider.
 */
export function useCanvasTransformLayer(): React.RefObject<HTMLDivElement | null> {
  return useCanvasContext().transformLayerRef;
}
