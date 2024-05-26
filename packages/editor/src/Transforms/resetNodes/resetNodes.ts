import { Node, Point, Editor, Transforms } from 'slate';

// This fuction is based off of https://github.com/ianstormtaylor/slate/pull/4540#issuecomment-951903419

/**
 * Resets the value of the editor, removing current nodes and
 * inserting the provided nodes if present.
 *
 * Selection can be restored by providing the `at` option.
 */
export function resetNodes(
  editor: Editor,
  options: {
    nodes?: Node | Node[];
    at?: Location;
  } = {},
): void {
  const children = [...editor.children];

  for (let i = 0; i < children.length; i++) {
    const node = children[i];
    editor.apply({ type: 'remove_node', path: [0], node });
  }

  if (options.nodes) {
    const nodes = Node.isNode(options.nodes) ? [options.nodes] : options.nodes;

    for (let i = 0; i < nodes.length; i++) {
      editor.apply({ type: 'insert_node', path: [i], node: nodes[i] });
    }
  }

  const point =
    options.at && Point.isPoint(options.at)
      ? options.at
      : Editor.end(editor, []);

  if (point && Editor.hasPath(editor, point.path)) {
    Transforms.select(editor, point);
  }
}
