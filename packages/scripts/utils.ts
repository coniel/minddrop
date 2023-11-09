import { ElementNode, RootNode, Node } from 'svg-parser';

export interface MinifiedNode {
  t: string;
  p: Record<string, string>;
}

export function filter(nodes: Node[] | ElementNode[]) {
  return nodes.filter(
    (node) =>
      node.type === 'element' &&
      !['defs', 'title'].includes(node.tagName) &&
      !(node.tagName === 'rect' && node.properties?.height === 24) &&
      !(
        node.tagName === 'polyline' &&
        (node.properties?.points as string).includes('24')
      ),
  ) as ElementNode[];
}

export function filterChildren(node: ElementNode | RootNode) {
  return {
    ...node,
    children: filter(node.children as Node[]),
  } as ElementNode;
}

export function unwrap(node: ElementNode | RootNode) {
  if (
    node.type === 'root' ||
    node.tagName === 'svg' ||
    (node.tagName === 'g' && node.children.length === 1)
  ) {
    return unwrap(filterChildren(node.children[0] as ElementNode));
  }

  return filterChildren(node);
}

export function minifyElement(element: ElementNode): MinifiedNode {
  delete element.properties?.class;

  return {
    t: element.tagName as string,
    p: element.properties as Record<string, string>,
  };
}
