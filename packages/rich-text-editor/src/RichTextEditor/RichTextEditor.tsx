import React, { useMemo } from 'react';
import { Editable, Slate } from 'slate-react';
import { createEditor, createRenderElement } from '../utils';
import { withRichTextMarks } from '../withRichTextMarks';
import { withMarkHotkeys } from '../withMarkHotkeys';
import { defaultMarkConfigs } from '../default-mark-configs';
import { RichTextElementConfigsStore } from '../RichTextElementConfigsStore';
import { RichTextMarkConfigsStore } from '../RichTextMarkConfigsStore';
import './RichTextEditor.css';
import { RichTextBlockElement } from '../types';
import { Descendant } from 'slate';
import { withBlockShortcuts } from '../withBlockShortcuts';
import { withBlockReset } from '../withBlockReset';
import { withReturnBehaviour } from '../withReturnBehaviour';
import { withInlineMenus } from '../withInlineMenu';

let query = '';
let close: (removeQuery: boolean) => void;

export interface RichTextEditorProps {
  /**
   * The initial value of the editor.
   */
  initialValue: RichTextBlockElement[];

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

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  initialValue,
  onChange,
  onFocus,
  onBlur,
}) => {
  const editor = useMemo(() => createEditor(), []);

  const elementConfigsMap = RichTextElementConfigsStore.useAllItems();
  const elementConfigs = Object.values(elementConfigsMap);

  // Create a renderElement function using the registered
  // element type configuration objects.
  const renderElement = useMemo(
    () => createRenderElement(elementConfigs),
    [elementConfigs],
  );

  const [editorWithPlugins, renderLeaf] = useMemo(
    () =>
      withRichTextMarks(
        withBlockReset(
          withBlockShortcuts(withReturnBehaviour(editor), elementConfigs),
          'paragraph',
        ),
        Object.values(RichTextMarkConfigsStore.getAll()),
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
