import { ContainerElement, DesignElement } from '@minddrop/designs';
import { FlatDesignElement } from '../../types';

/**
 * Reconstructs an element map into a design element tree.
 *
 * @param elements - The element map to reconstruct.
 * @returns The reconstructed design element tree.
 */
export function reconstructTree(
  elements: Record<string, FlatDesignElement>,
): DesignElement {
  function buildNode(id: string): DesignElement {
    const element = elements[id] as DesignElement;

    // Remove the parent property from the element
    if ('parent' in element) {
      delete element.parent;
    }

    // If the element has children, recursively replace the IDs with
    // the actual elements.
    if ('children' in elements[id]) {
      (element as ContainerElement).children = elements[id].children.map(
        (child) => buildNode(child),
      );
    }

    return element as DesignElement;
  }

  return buildNode('root');
}
