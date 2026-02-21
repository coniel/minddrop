import {
  ContainerElement,
  DesignElement,
  RootElement,
} from '@minddrop/designs';
import { FlatDesignElement } from '../../types';

/**
 * Reconstructs an element map into a design element tree.
 *
 * @param elements - The element map to reconstruct.
 * @returns The reconstructed design element tree.
 */
export function reconstructTree(
  elements: Record<string, FlatDesignElement>,
): RootElement {
  const clonedElements: Record<string, FlatDesignElement> = JSON.parse(
    JSON.stringify(elements),
  );

  function buildNode(id: string): DesignElement {
    const element = clonedElements[id] as DesignElement;

    // Remove the parent property from the element
    if ('parent' in element) {
      delete element.parent;
    }

    // If the element has children, recursively replace the IDs with
    // the actual elements.
    if ('children' in clonedElements[id]) {
      (element as ContainerElement).children = clonedElements[id].children.map(
        (child) => buildNode(child),
      );
    }

    return element as DesignElement;
  }

  return buildNode('root') as RootElement;
}
