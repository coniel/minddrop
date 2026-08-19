import { CanvasStore, createCanvasStore } from '@minddrop/ui-canvas';

/**
 * Creates the canvas viewport store for a design studio instance.
 * Each studio host creates its own store alongside its studio
 * store so multiple editors can coexist. Canvas-level node
 * selection is disabled since the studio drives its own element
 * selection.
 */
export function createDesignStudioCanvasStore(): CanvasStore {
  return createCanvasStore({ selectable: false });
}
