import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Descendant } from 'slate';
import { HistoryEditor } from 'slate-history';
import { Editable, ReactEditor, Slate } from 'slate-react';
import { useDebouncedCallback } from 'use-debounce';
import { Element } from '@minddrop/ast';
import { EditorBlockElementConfigsStore } from '../BlockElementTypeConfigsStore';
import { EditorInlineElementConfigsStore } from '../InlineElementTypeConfigsStore';
import { MarkConfigsStore } from '../MarkConfigsStore';
import { defaultMarkConfigs } from '../default-mark-configs';
import { createEditor, createRenderElement } from '../utils';
import { withBlockReset } from '../withBlockReset';
import { withBlockShortcuts } from '../withBlockShortcuts';
import { withMarkHotkeys } from '../withMarkHotkeys';
import { withMarks } from '../withMarks';
import { withReturnBehaviour } from '../withReturnBehaviour';
import './RichTextEditor.css';

/**
 * Prevents click and keyboard events from bubbling out of
 * the editor so that ancestor handlers don't interfere with
 * editing interactions.
 */
function stopEditorPropagation(event: React.SyntheticEvent): void {
  event.stopPropagation();
}

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

  /**
   * Optional inline styles applied to the editable area.
   */
  style?: React.CSSProperties;

  /**
   * When true, the editor is read-only and cannot be edited.
   */
  readOnly?: boolean;
}

export const RichTextEditor: React.FC<EditorProps> = ({
  initialValue,
  onChange,
  onChangeDebounced,
  onFocus,
  onBlur,
  autoFocus,
  style,
  readOnly = false,
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
        MarkConfigsStore.getAllArray(),
      ),
    [editor],
  );

  const markHotkeys = useMemo(
    () => withMarkHotkeys(editor, defaultMarkConfigs),
    [editor],
  );

  // Compose mark hotkeys with stopPropagation so that keyboard
  // events don't bubble to parent handlers
  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      event.stopPropagation();
      markHotkeys(event);
    },
    [markHotkeys],
  );

  useEffect(() => {
    if (autoFocus) {
      ReactEditor.focus(editorRef.current);
    }
  }, [autoFocus]);

  // Handle native undo/redo beforeinput events. On macOS with
  // Electrobun, the application menu's undo/redo roles intercept
  // Cmd+Z before it reaches the webview as a keydown. Instead,
  // WKWebView fires a beforeinput with inputType 'historyUndo'/
  // 'historyRedo', but slate-react has no case for these in its
  // beforeinput handler. Intercept them here and route to Slate's
  // history plugin.
  useEffect(() => {
    const editorElement = ReactEditor.toDOMNode(
      editorRef.current,
      editorRef.current,
    );

    function handleBeforeInput(event: Event) {
      const inputEvent = event as InputEvent;

      if (inputEvent.inputType === 'historyUndo') {
        inputEvent.preventDefault();
        inputEvent.stopImmediatePropagation();
        HistoryEditor.undo(editorRef.current as unknown as HistoryEditor);
      } else if (inputEvent.inputType === 'historyRedo') {
        inputEvent.preventDefault();
        inputEvent.stopImmediatePropagation();
        HistoryEditor.redo(editorRef.current as unknown as HistoryEditor);
      }
    }

    editorElement.addEventListener('beforeinput', handleBeforeInput, true);

    return () => {
      editorElement.removeEventListener('beforeinput', handleBeforeInput, true);
    };
  }, []);

  return (
    <Slate
      editor={editorWithPlugins}
      initialValue={initialValue}
      onChange={handleChange}
    >
      <Editable
        autoFocus={false}
        readOnly={readOnly}
        className="editor"
        style={style}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        onKeyDown={onKeyDown}
        onClick={stopEditorPropagation}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </Slate>
  );
};
