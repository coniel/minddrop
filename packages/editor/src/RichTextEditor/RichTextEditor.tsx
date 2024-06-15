import React, { useCallback, useMemo } from 'react';
import { Editable, Slate } from 'slate-react';
import { useDebouncedCallback } from 'use-debounce';
import { BlockElement } from '@minddrop/ast';
import {
  createEditor,
  createRenderElement,
  getBlockElementConfigs,
} from '../utils';
import { withMarks } from '../withMarks';
import { withMarkHotkeys } from '../withMarkHotkeys';
import { defaultMarkConfigs } from '../default-mark-configs';
import { ElementConfigsStore } from '../ElementConfigsStore';
import { MarkConfigsStore } from '../MarkConfigsStore';
import { Descendant } from 'slate';
import { withBlockShortcuts } from '../withBlockShortcuts';
import { withBlockReset } from '../withBlockReset';
import { withReturnBehaviour } from '../withReturnBehaviour';
import './RichTextEditor.css';

export interface EditorProps {
  /**
   * The initial value of the editor.
   */
  initialValue: BlockElement[];

  /**
   * Callback fired when the editor value changes.
   */
  onChange?: (value: BlockElement[]) => void;

  /**
   * Callback fired when the editor value changes, debounced
   * to wait for 1 second of inactivity before firing, up to
   * a maximum of 5 seconds.
   */
  onChangeDebounced?: (value: BlockElement[]) => void;

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
  onChangeDebounced,
  onFocus,
  onBlur,
}) => {
  const editor = useMemo(() => createEditor(), []);
  const handleDebouncedChange = useDebouncedCallback(
    (value: BlockElement[]) =>
      onChangeDebounced ? onChangeDebounced(value) : null,
    1000,
    { leading: false, maxWait: 5000 },
  );
  const handleChange = useCallback(
    (value: Descendant[]) => {
      if (onChange) {
        onChange(value as BlockElement[]);
      }

      if (onChangeDebounced) {
        handleDebouncedChange(value as BlockElement[]);
      }
    },
    [onChange, onChangeDebounced, handleDebouncedChange],
  );

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
          withBlockShortcuts(
            withReturnBehaviour(editor),
            getBlockElementConfigs(elementConfigs),
          ),
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
      onChange={handleChange}
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
