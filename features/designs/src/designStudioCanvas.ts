import { createCanvasStore } from '@minddrop/ui-canvas';

/**
 * The design studio's canvas viewport store. The studio is a
 * singleton full-screen view, so a module-level instance lets
 * non-React code (menus, store actions) control the viewport.
 */
export const designStudioCanvasStore = createCanvasStore({
  // The studio selects design elements rather than canvas nodes
  selectable: false,
});
