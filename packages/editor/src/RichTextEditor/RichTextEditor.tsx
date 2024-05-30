import React, { useMemo } from 'react';
import { Editable, Slate } from 'slate-react';
import { createEditor, createRenderElement } from '../utils';
import { withMarks } from '../withMarks';
import { withMarkHotkeys } from '../withMarkHotkeys';
import { defaultMarkConfigs } from '../default-mark-configs';
import { ElementConfigsStore } from '../ElementConfigsStore';
import { MarkConfigsStore } from '../MarkConfigsStore';
import './RichTextEditor.css';
import { BlockElement } from '../types';
import { Descendant } from 'slate';
import { withBlockShortcuts } from '../withBlockShortcuts';
import { withBlockReset } from '../withBlockReset';
import { withReturnBehaviour } from '../withReturnBehaviour';
import { withInlineMenus } from '../withInlineMenu';

let query = '';
let close: (removeQuery: boolean) => void;

export interface EditorProps {
  /**
   * The initial value of the editor.
   */
  initialValue: BlockElement[];

  /**
   * Callback fired when the editor value changes.
   */
  onChange?: (value: Descendant[]) => void;

  /**
   * Callback fired when the editor is focused.
   */
  onFocus?: React.FocusEventHandler<HTMLDivElement>;

  /**
   * Callback fired when the editor is blured.
   */
  onBlur?: React.FocusEventHandler<HTMLDivElement>;
}

export const RichTextEditor: React.FC<EditorProps> = ({
  initialValue,
  onChange,
  onFocus,
  onBlur,
}) => {
  const editor = useMemo(() => createEditor(), []);

  const elementConfigsMap = ElementConfigsStore.useAllItems();
  const elementConfigs = Object.values(elementConfigsMap);

  // Create a renderElement function using the registered
  // element type configuration objects.
  const renderElement = useMemo(
    () => createRenderElement(elementConfigs),
    [elementConfigs],
  );

  const [editorWithPlugins, renderLeaf] = useMemo(
    () =>
      withMarks(
        withBlockReset(
          withBlockShortcuts(withReturnBehaviour(editor), elementConfigs),
          'paragraph',
        ),
        Object.values(MarkConfigsStore.getAll()),
      ),
    [editor, elementConfigs],
  );

  const onKeyDown = useMemo(
    () => withMarkHotkeys(editor, defaultMarkConfigs),
    [editor],
  );

  return (
    <Slate
      editor={editorWithPlugins}
      initialValue={initialValue}
      onChange={onChange}
    >
      <Editable
        className="editor"
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </Slate>
  );
};
