import { Node, Path, Range, Text, Transforms } from 'slate';
import { RenderLeafProps } from 'slate-react';
import { Element } from '@minddrop/ast';
import { Editor, InlineShortcut, MarkConfig } from '../types';
import { withInlineShortcuts } from '../withInlineShortcuts';

/**
 * Transforms a mark config's shortcuts into
 * InlineShortcut objects.
 *
 * @param markConfig - The MarkConfig to transform.
 * @returns An array of InlineSortuct objects.
 */
function markConfigToInlineShortcuts(markConfig: MarkConfig): InlineShortcut[] {
  if (!markConfig.shortcuts) {
    return [];
  }

  // Loop through the mark config's shortcuts, transforming
  // each one into an InlineShortcut.
  return markConfig.shortcuts.reduce(
    (configShortcutActions, configShortcut) => [
      ...configShortcutActions,
      {
        triggers: [configShortcut.trigger],
        action: (editor: Editor) => {
          // Toggle the mark on
          editor.toggleMark(markConfig.key, configShortcut.value);

          if (editor.selection && !Range.isCollapsed(editor.selection)) {
            // If a wrapping shortcut was used, collapse
            // the selection to the trailing edge.
            Transforms.collapse(editor, { edge: 'focus' });

            // Toggle the mark off
            editor.toggleMark(markConfig.key, configShortcut.value);
          }
        },
      },
    ],
    [] as InlineShortcut[],
  );
}

/**
 * Creates a `renderLeaf` callback which handles Mark related
 * behaviour such as rendering, shortcuts, and hotkeys.
 *
 * @param editor - An editor instance.
 * @param markConfigs - The MarkConfigs to apply to the editor.
 * @returns The editor instance with the behaviour applied and the editable
 * `renderLeaf` callback.
 */
export function withMarks(
  editor: Editor,
  markConfigs: MarkConfig[],
): [Editor, (props: RenderLeafProps) => JSX.Element] {
  const { apply } = editor;

  editor.apply = (operation) => {
    apply(operation);

    if (operation.type === 'split_node') {
      // Get the node which was split
      const splitNode = Node.get(editor, operation.path);

      if (Text.isText(splitNode)) {
        // Ignore split text nodes, their parent is updated by
        // the element split operation following this one.
        return;
      }

      // The path of the element created as a result of the split
      const newElementPath = Path.next(operation.path);

      // Get the element created as a result of the split
      const newElement = Node.get(editor, newElementPath) as Element;

      if (Node.string(newElement) === '') {
        Transforms.unsetNodes(
          editor,
          Object.keys(Node.get(editor, [...newElementPath, 0])).filter(
            (key) => key !== 'text',
          ),
          { at: [...newElementPath, 0] },
        );
      }
    }
  };

  const renderLeaf = (props: RenderLeafProps) => {
    // Map the mark configs by their key
    const configs: Record<string, MarkConfig> = markConfigs.reduce(
      (map, config) => ({ ...map, [config.key]: config }),
      {},
    );

    let { children } = props;

    // Loop through the mark configs, checking if any of
    // the keys are applied to the leaf.
    Object.keys(configs).forEach((key) => {
      if (props.leaf[key as keyof typeof props.leaf]) {
        // Get the matched config's component
        const Component = configs[key].component;

        // Wrap children in the component
        children = <Component {...props}>{children}</Component>;
      }
    });

    return <span {...props.attributes}>{children}</span>;
  };

  // Transform the mark shortcut configs into inline shortcuts
  const inlineShortcuts = markConfigs
    .filter((config) => !!config.shortcuts)
    .reduce(
      (previous, config) => [
        ...previous,
        ...markConfigToInlineShortcuts(config),
      ],
      [] as InlineShortcut[],
    );

  return [withInlineShortcuts(editor, inlineShortcuts), renderLeaf];
}
