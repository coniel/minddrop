import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Editable, ReactEditor, Slate } from 'slate-react';
import { useDebouncedCallback } from 'use-debounce';
import { Element } from '@minddrop/ast';
import { createEditor, createRenderElement } from '../utils';
import { withMarks } from '../withMarks';
import { withMarkHotkeys } from '../withMarkHotkeys';
import { defaultMarkConfigs } from '../default-mark-configs';
import { MarkConfigsStore } from '../MarkConfigsStore';
import { Descendant } from 'slate';
import { withBlockShortcuts } from '../withBlockShortcuts';
import { withBlockReset } from '../withBlockReset';
import { withReturnBehaviour } from '../withReturnBehaviour';
import './RichTextEditor.css';
import { EditorBlockElementConfigsStore } from '../BlockElementTypeConfigsStore';
import { EditorInlineElementConfigsStore } from '../InlineElementTypeConfigsStore';

export interface EditorProps {
  /**
   * The initial value of the editor.
   */
  initialValue: Element[];

  /**
   * Callback fired when the editor value changes.
   */
  onChange?: (value: Element[]) => void;

  /**
   * Callback fired when the editor value changes, debounced
   * to wait for 1 second of inactivity before firing, up to
   * a maximum of 5 seconds.
   */
  onChangeDebounced?: (value: Element[]) => void;

  /**
   * Callback fired when the editor is focused.
   */
  onFocus?: React.FocusEventHandler<HTMLDivElement>;

  /**
   * Callback fired when the editor is blured.
   */
  onBlur?: React.FocusEventHandler<HTMLDivElement>;

  /**
   * If true, the editor will be focused on mount.
   */
  autoFocus?: boolean;
}

export const RichTextEditor: React.FC<EditorProps> = ({
  initialValue,
  onChange,
  onChangeDebounced,
  onFocus,
  onBlur,
  autoFocus,
}) => {
  const editor = useMemo(() => createEditor(), []);
  const editorRef = useRef(editor);
  const handleDebouncedChange = useDebouncedCallback(
    (value: Element[]) => (onChangeDebounced ? onChangeDebounced(value) : null),
    1000,
    { leading: false, maxWait: 5000 },
  );
  const handleChange = useCallback(
    (value: Descendant[]) => {
      if (onChange) {
        onChange(value as Element[]);
      }

      if (onChangeDebounced) {
        handleDebouncedChange(value as Element[]);
      }
    },
    [onChange, onChangeDebounced, handleDebouncedChange],
  );

  // Create a renderElement function using the registered
  // element type configuration objects.
  const renderElement = useMemo(
    () =>
      createRenderElement([
        ...EditorBlockElementConfigsStore.getAll(),
        ...EditorInlineElementConfigsStore.getAll(),
      ]),
    [],
  );

  const [editorWithPlugins, renderLeaf] = useMemo(
    () =>
      withMarks(
        withBlockReset(
          withBlockShortcuts(
            withReturnBehaviour(editor),
            EditorBlockElementConfigsStore.getAll(),
          ),
          'paragraph',
        ),
        Object.values(MarkConfigsStore.getAll()),
      ),
    [editor],
  );

  const onKeyDown = useMemo(
    () => withMarkHotkeys(editor, defaultMarkConfigs),
    [editor],
  );

  useEffect(() => {
    if (autoFocus) {
      ReactEditor.focus(editorRef.current);
    }
  }, [autoFocus]);

  return (
    <Slate
      editor={editorWithPlugins}
      initialValue={initialValue}
      onChange={handleChange}
    >
      <Editable
        autoFocus={false}
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
