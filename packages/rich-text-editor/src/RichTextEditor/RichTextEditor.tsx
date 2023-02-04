import React, { useMemo } from 'react';
import { useRichTextElementTypeConfigs } from '@minddrop/rich-text';
import { Editable, Slate } from 'slate-react';
import { useEditorSession } from '../useEditorSession';
import { useEditorInitialValue } from '../useEditorInitialValue';
import { createRenderElement } from '../utils';
import { useExternalUpdates } from '../useExternalUpdates';
import { withBlockShortcuts } from '../withBlockShortcuts';
import { withBlockReset } from '../withBlockReset';
import { useCore } from '@minddrop/core';
import './RichTextEditor.css';

export interface RichTextEditorProps {
  /**
   * The ID of the rich text document to edit.
   */
  documentId: string;

  /**
   * Callback fired when the editor is focused.
   */
  onFocus: React.FocusEventHandler<HTMLDivElement>;

  /**
   * Callback fired when the editor is blured.
   */
  onBlur: React.FocusEventHandler<HTMLDivElement>;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  documentId,
  onFocus,
  onBlur,
}) => {
  const core = useCore('rich-text-editor');
  // Create a session based editor instance
  const [editor, sessionId] = useEditorSession(documentId);
  // Create the editor's initial value
  const initialValue = useEditorInitialValue(documentId);
  // Get the configuration objects of all registered rich
  // text element types.
  const configs = useRichTextElementTypeConfigs();
  // Reset the editor content when changed externaly
  useExternalUpdates(editor, sessionId);
  // Create a renderElement function using the registered
  // element type configuration objects.
  const renderElement = useMemo(
    () => createRenderElement(configs),
    [configs.length],
  );
  // Add plugins to editor
  const editorWithPlugins = useMemo(
    () => withBlockReset(core, withBlockShortcuts(core, editor, configs)),
    [editor, configs.length],
  );

  return (
    // The editor does nothing `onChange` because updates are handled
    // by the `useEditorSession` hook.
    <Slate editor={editorWithPlugins} value={initialValue}>
      <Editable
        className="editor"
        renderElement={renderElement}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </Slate>
  );
};
