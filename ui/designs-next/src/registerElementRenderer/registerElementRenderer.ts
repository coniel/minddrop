import { DesignElement } from '@minddrop/designs-next';
import { ElementRenderersStore } from '../ElementRenderersStore';
import { DesignElementComponent } from '../types';

/**
 * Registers a renderer component for an element type.
 *
 * @param type - The element type the component renders.
 * @param component - The component rendering the element.
 */
export function registerElementRenderer<TElement extends DesignElement>(
  type: string,
  component: DesignElementComponent<TElement>,
): void {
  // Renderers are stored against the base element shape. The registry
  // pairs each component with its own element type at registration,
  // so the narrowing is safe.
  ElementRenderersStore.set(type, component as DesignElementComponent);
}
