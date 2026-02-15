import { DesignElement, RootDesignElement } from '@minddrop/designs';
import {
  FlatDesignElement,
  FlatLayoutDesignElement,
  FlatStaticDesignElement,
} from '../../types';

/**
 * Flattens a design element tree into a [id]: [element] map.
 *
 * @param tree - The design element tree to flatten.
 * @returns The flattened element map.
 */
export function flattenTree(
  tree: RootDesignElement,
): Record<string, FlatDesignElement> {
  const elements: Record<string, FlatDesignElement> = {};

  function traverse(node: DesignElement, parent?: string) {
    elements[node.id] = { ...node } as FlatStaticDesignElement;

    if (parent) {
      (elements[node.id] as FlatStaticDesignElement).parent = parent;
    }

    if ('children' in node) {
      (elements[node.id] as FlatLayoutDesignElement).children =
        node.children.map((child) => child.id);

      node.children.forEach((child) => traverse(child, node.id));
    }
  }

  traverse(tree);

  return elements;
}
