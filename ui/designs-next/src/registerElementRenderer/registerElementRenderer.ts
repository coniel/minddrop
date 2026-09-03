import { ElementRenderersStore } from '../ElementRenderersStore';
import { DesignElementComponent } from '../types';

/**
 * Registers a renderer component for an element type.
 *
 * @param type - The element type the component renders.
 * @param component - The component rendering the element.
 */
export function registerElementRenderer(
  type: string,
  component: DesignElementComponent,
): void {
  ElementRenderersStore.set(type, component);
}
