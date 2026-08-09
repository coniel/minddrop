import { createContext, useContext } from 'react';
import { CanvasStore } from './createCanvasStore';

export interface CanvasContextValue {
  /**
   * The canvas instance's viewport store.
   */
  store: CanvasStore;

  /**
   * Ref to the viewport element, attached by the Canvas component.
   */
  viewportRef: React.RefObject<HTMLDivElement | null>;

  /**
   * Ref to the transform layer element, attached by the Canvas
   * component. Overlays rendered inside the layer can use it to
   * measure elements relative to the canvas.
   */
  transformLayerRef: React.RefObject<HTMLDivElement | null>;
}

export const CanvasContext = createContext<CanvasContextValue | null>(null);

/**
 * Returns the current canvas context, throwing when used outside
 * of a CanvasProvider.
 */
export function useCanvasContext(): CanvasContextValue {
  const context = useContext(CanvasContext);

  if (!context) {
    throw new Error('Canvas hooks must be used within a CanvasProvider');
  }

  return context;
}

/**
 * Returns the current canvas context, or null when used outside
 * of a CanvasProvider.
 */
export function useOptionalCanvasContext(): CanvasContextValue | null {
  return useContext(CanvasContext);
}
