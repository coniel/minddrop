import React, { useMemo } from 'react';
import { useRichTextElementTypeConfigs } from '@minddrop/rich-text';
import { Editable, Slate } from 'slate-react';
import { useEditorSession } from '../useEditorSession';
import { useEditorInitialValue } from '../useEditorInitialValue';
import { createRenderElement } from '../utils';
import { useDebouncedUpdates } from '../useDebouncedUpdates';
import { useExternalUpdates } from '../useExternalUpdates';
import './RichTextEditor.css';
import { withBlockShortcuts } from '../withBlockShortcuts';
import { withBlockReset } from '../withBlockReset';

export interface RichTextEditorProps {
  /**
   * The ID of the rich text document to edit.
   */
  documentId: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  documentId,
}) => {
  // Create a session based editor instance
  const [editor, sessionId] = useEditorSession(documentId);
  // Create the editor's initial value
  const initialValue = useEditorInitialValue(documentId);
  // Get the configuration objects of all registered rich
  // text element types.
  const configs = useRichTextElementTypeConfigs();
  // Update the document and its elements as it is edited
  useDebouncedUpdates(documentId, sessionId);
  // Reset the editor content when changed externaly
  useExternalUpdates(editor, documentId, sessionId);
  // Create a renderElement function using the registered
  // element type configuration objects.
  const renderElement = useMemo(
    () => createRenderElement(configs),
    [configs.length],
  );
  // Add plugins to editor
  const editorWithPlugins = useMemo(
    () => withBlockReset(withBlockShortcuts(editor, configs)),
    [editor, configs.length],
  );

  return (
    // The editor does nothing `onChange` because updates are handled
    // by the `useEditorSession` hook.
    <Slate editor={editorWithPlugins} value={initialValue}>
      <Editable className="editor" renderElement={renderElement} />
    </Slate>
  );
};
