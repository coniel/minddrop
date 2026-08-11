import { CanvasSelection, CanvasStore } from '../types';
import { CanvasSelectionDeleteOptions } from './Canvas';

/**
 * Applies a canvas keyboard shortcut: clearing and deleting the
 * selection, selecting every node, and the zoom and fit
 * shortcuts. Space panning is handled by the Canvas itself, since
 * it is a modifier for its pointer interactions rather than a
 * shortcut.
 *
 * @param event - The keyboard event.
 * @param store - The canvas instance's store.
 * @param onSelectionDelete - Called when the selection is deleted.
 */
export function applyCanvasShortcut(
  event: KeyboardEvent | React.KeyboardEvent,
  store: CanvasStore,
  onSelectionDelete?: (
    selection: CanvasSelection,
    options: CanvasSelectionDeleteOptions,
  ) => void,
): void {
  // Escape clears the selection
  if (event.key === 'Escape') {
    store.clearSelection();

    return;
  }

  // Delete removes the selection through the consumer, which
  // owns whatever the selected IDs stand for
  if (event.key === 'Delete' || event.key === 'Backspace') {
    const selection = store.getSelection();

    if (!selection || !onSelectionDelete) {
      return;
    }

    // Stopped as well as prevented, so an app-level delete
    // shortcut does not act on the same press
    event.preventDefault();
    event.stopPropagation();

    onSelectionDelete(selection, { shiftKey: event.shiftKey });

    return;
  }

  // Cmd/Ctrl + A selects every node on the canvas
  if (event.key === 'a' && (event.metaKey || event.ctrlKey)) {
    // Leave the shortcut to the app when the canvas does not
    // support selection
    if (!store.getSelectable()) {
      return;
    }

    event.preventDefault();
    store.selectNodes(Object.keys(store.getNodes()));

    return;
  }

  // + or = to zoom in
  if (event.key === '+' || event.key === '=') {
    event.preventDefault();
    store.zoomIn();

    return;
  }

  // - to zoom out
  if (event.key === '-') {
    event.preventDefault();
    store.zoomOut();

    return;
  }

  // 0 to zoom to 100%
  if (event.key === '0') {
    event.preventDefault();

    const viewportSize = store.getViewportSize();

    store.setZoom(1, {
      x: viewportSize.width / 2,
      y: viewportSize.height / 2,
    });

    return;
  }

  // H for home (fit all nodes in view)
  if (event.key === 'h' || event.key === 'H') {
    event.preventDefault();
    store.fitToView();
  }
}
