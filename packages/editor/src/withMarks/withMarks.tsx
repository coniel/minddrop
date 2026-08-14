import {
  Node,
  Path,
  Range,
  Editor as SlateEditor,
  Text,
  Transforms,
} from 'slate';
import { RenderLeafProps } from 'slate-react';
import { Element } from '@minddrop/ast';
import { Editor, InlineShortcut, MarkConfig, MarkShortcut } from '../types';
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
          const syntaxKey = `${markConfig.key}Syntax`;

          // Toggle the mark on
          editor.toggleMark(markConfig.key, configShortcut.value);

          // Record the delimiter which was actually typed, so that the
          // mark is written back with the spelling the user chose rather
          // than the serializer's default. The delimiter only means
          // anything while the mark it belongs to is applied.
          if (SlateEditor.marks(editor)?.[markConfig.key]) {
            editor.addMark(
              syntaxKey,
              resolveTriggerSyntax(configShortcut.trigger),
            );
          } else {
            editor.removeMark(syntaxKey);
          }

          if (editor.selection && !Range.isCollapsed(editor.selection)) {
            // If a wrapping shortcut was used, collapse
            // the selection to the trailing edge.
            Transforms.collapse(editor, { edge: 'focus' });

            // Toggle the mark off
            editor.toggleMark(markConfig.key, configShortcut.value);
            editor.removeMark(syntaxKey);
          }
        },
      },
    ],
    [] as InlineShortcut[],
  );
}

/**
 * Returns the delimiter a shortcut's trigger types, which is the opening
 * delimiter for a wrapping trigger and the trigger itself otherwise.
 *
 * @param trigger - The shortcut's trigger.
 * @returns The delimiter.
 */
function resolveTriggerSyntax(trigger: MarkShortcut['trigger']): string {
  if (typeof trigger === 'string') {
    return trigger;
  }

  return trigger.start;
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
): [Editor, (props: RenderLeafProps) => React.ReactElement] {
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
