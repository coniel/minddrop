import React from 'react';
import { Editor as SlateEditor, Range, Transforms } from 'slate';
import { RenderLeafProps } from 'slate-react';
import { Editor, RTMarkConfig } from '../types';
import { withInlineShortcuts } from '../withInlineShortcuts';

/**
 * Creates a `renderLeaf` callback which handles rich text mark related
 * behaviour such as rendering, shortcuts, and hotkeys.
 *
 * @param editor - An editor instance.
 * @param markConfigs - The rich text mark configs to apply to the editor.
 * @returns The editor instance with the behaviour applied and the editable
 * `renderLeaf` callback.
 */
export function withRichTextMarks(
  editor: Editor,
  markConfigs: RTMarkConfig[],
): [Editor, (props: RenderLeafProps) => JSX.Element] {
  const renderLeaf = (props: RenderLeafProps) => {
    // Map the mark configs by their key
    const configs: Record<string, RTMarkConfig> = markConfigs.reduce(
      (map, config) => ({ ...map, [config.key]: config }),
      {},
    );

    let { children } = props;

    // Loop through the mark configs, checking if any of
    // the keys are applied to the leaf.
    Object.keys(configs).forEach((key) => {
      if (props.leaf[key]) {
        // Get the matched config's component
        const Component = configs[key].component;

        // Wrap children in the component
        children = <Component {...props}>{children}</Component>;
      }
    });

    return <span {...props.attributes}>{children}</span>;
  };

  const shortcutActions = markConfigs
    .filter((config) => !!config.shortcuts)
    .reduce(
      (value, config) => [
        ...value,
        {
          triggers: config.shortcuts,
          action: (editor: Editor) => {
            // Check if the mark is already applied
            if (SlateEditor.marks(editor)[config.key]) {
              // Remove the mark
              SlateEditor.removeMark(editor, config.key);
            } else {
              // Add the mark
              SlateEditor.addMark(editor, config.key, true);
            }

            if (!Range.isCollapsed(editor.selection)) {
              // If a wrapping shortcut was used, collapse
              // the selection to the trailing edge.
              Transforms.collapse(editor, { edge: 'focus' });
            }
          },
        },
      ],
      [],
    );

  return [withInlineShortcuts(editor, shortcutActions), renderLeaf];
}
