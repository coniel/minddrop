import { ElementRenderersStore } from '../ElementRenderersStore';
import { DesignElementComponent } from '../types';

/**
 * Retrieves the renderer component registered for an element type.
 *
 * @param type - The element type to retrieve the renderer for.
 * @returns The renderer component, or null if none is registered.
 */
export function getElementRenderer(
  type: string,
): DesignElementComponent | null {
  return ElementRenderersStore.get(type) ?? null;
}
