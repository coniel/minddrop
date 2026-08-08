import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Descendant } from 'slate';
import { HistoryEditor } from 'slate-history';
import { Editable, ReactEditor, RenderElementProps, Slate } from 'slate-react';
import { useDebouncedCallback } from 'use-debounce';
import { Ast, Element } from '@minddrop/ast';
import { isUntitledTitle } from '@minddrop/utils';
import { EditorBlockElementConfigsStore } from '../BlockElementTypeConfigsStore';
import { BlockMenu } from '../BlockMenu';
import { EditorInlineElementConfigsStore } from '../InlineElementTypeConfigsStore';
import { MarkConfigsStore } from '../MarkConfigsStore';
import { defaultMarkConfigs } from '../default-mark-configs';
import { insertTrailingParagraph } from '../insertTrailingParagraph';
import { BlockElementProps } from '../types';
import { useBlockMenu } from '../useBlockMenu';
import { createEditor, createRenderElement } from '../utils';
import { withBlockReset } from '../withBlockReset';
import { withBlockShortcuts } from '../withBlockShortcuts';
import { withMarkHotkeys } from '../withMarkHotkeys';
import { withMarks } from '../withMarks';
import { withReturnBehaviour } from '../withReturnBehaviour';
import {
  TITLE_ELEMENT_TYPE,
  TitleContext,
  TitleElement,
  TitleElementComponent,
  useEditorTitle,
  withTitle,
} from '../withTitle';
import './RichTextEditor.css';

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

  /**
   * When present (an empty string counts), the editor renders an
   * enforced title element as its first block node, seeded with
   * this value. The title node is stripped from the values passed
   * to `onChange` and `onChangeDebounced`.
   *
   * Default untitled titles (the localised untitled label, alone
   * or with an increment number) render as an empty title with
   * the untitled title as the placeholder.
   */
  title?: string;

  /**
   * Placeholder shown when the title is empty. Defaults to the
   * localised untitled label. Ignored while the title is a
   * default untitled title, which is itself shown as the
   * placeholder.
   */
  titlePlaceholder?: string;

  /**
   * Optional inline styles applied to the title element.
   */
  titleStyle?: React.CSSProperties;

  /**
   * Callback fired when a title edit is committed, i.e. when the
   * cursor leaves the title with a valid changed value.
   */
  onTitleChange?: (title: string) => void;

  /**
   * Callback used to validate the title on every change. Returns
   * a translated error message when the title is invalid. While
   * invalid, the error is shown in a tooltip anchored to the
   * title; leaving the title while invalid reverts it to the
   * last committed value.
   */
  validateTitle?: (title: string) => string | undefined;
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
  title,
  titlePlaceholder,
  titleStyle,
  onTitleChange,
  validateTitle,
}) => {
  const editor = useMemo(() => createEditor(), []);
  const editorRef = useRef(editor);

  // Whether the title feature is enabled, captured on mount since
  // the Slate document is uncontrolled and cannot gain or lose the
  // title node across renders.
  const hasTitle = useRef(title !== undefined).current;

  // Whether the provided title is a default untitled title
  const titleIsUntitled = title !== undefined && isUntitledTitle(title);

  // The title text rendered in the title node. Untitled titles
  // render empty so a name can be typed straight away.
  const displayTitle = titleIsUntitled ? '' : title;

  // Seed the document with the title element as its first node
  const seededInitialValue = useMemo(() => {
    if (!hasTitle) {
      return initialValue;
    }

    return [
      Ast.generateElement<TitleElement>(TITLE_ELEMENT_TYPE, {
        children: [{ text: displayTitle ?? '' }],
      }),
      ...initialValue,
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [editorWithMarks, renderLeaf] = useMemo(
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

  // Apply the title plugin outermost so its overrides run before
  // the other plugins' ones.
  const editorWithPlugins = useMemo(
    () => (hasTitle ? withTitle(editorWithMarks) : editorWithMarks),
    [editorWithMarks, hasTitle],
  );

  const { titleError, handleEditorChange, handleEditorBlur } = useEditorTitle(
    editorWithPlugins,
    hasTitle,
    { title, onTitleChange, validateTitle },
  );
  const {
    blockMenuProps,
    handleKeyDown: handleBlockMenuKeyDown,
    handleChange: handleBlockMenuChange,
  } = useBlockMenu(editorWithPlugins);

  // Untitled titles are shown as the placeholder instead of as content
  const resolvedTitlePlaceholder = titleIsUntitled ? title : titlePlaceholder;

  // Title validation, placeholder, and styling state provided to
  // the title element component
  const titleContextValue = useMemo(
    () => ({
      titleError,
      titlePlaceholder: resolvedTitlePlaceholder,
      titleStyle,
    }),
    [titleError, resolvedTitlePlaceholder, titleStyle],
  );

  const handleDebouncedChange = useDebouncedCallback(
    (value: Element[]) => (onChangeDebounced ? onChangeDebounced(value) : null),
    1000,
    { leading: false, maxWait: 5000 },
  );
  const handleChange = useCallback(
    (value: Descendant[]) => {
      // Run title validation and commit detection
      handleEditorChange();

      // Keep the block menu query in sync with the editor
      handleBlockMenuChange();

      // Strip the title node so consumers only receive the content
      const content = hasTitle
        ? (value as Element[]).slice(1)
        : (value as Element[]);

      if (onChange) {
        onChange(content);
      }

      if (onChangeDebounced) {
        handleDebouncedChange(content);
      }
    },
    [
      onChange,
      onChangeDebounced,
      handleDebouncedChange,
      handleEditorChange,
      handleBlockMenuChange,
      hasTitle,
    ],
  );

  // Create a renderElement function using the registered
  // element type configuration objects.
  const renderElement = useMemo(() => {
    const renderRegisteredElement = createRenderElement([
      ...EditorBlockElementConfigsStore.getAll(),
      ...EditorInlineElementConfigsStore.getAll(),
    ]);

    if (!hasTitle) {
      return renderRegisteredElement;
    }

    // Render the internal title element component for title elements
    return function renderElementWithTitle(props: RenderElementProps) {
      if (props.element.type === TITLE_ELEMENT_TYPE) {
        return (
          <TitleElementComponent
            {...(props as BlockElementProps<TitleElement>)}
          />
        );
      }

      return renderRegisteredElement(props);
    };
  }, [hasTitle]);

  const markHotkeys = useMemo(
    () => withMarkHotkeys(editor, defaultMarkConfigs),
    [editor],
  );

  // Compose mark hotkeys with stopPropagation so that keyboard
  // events don't bubble to parent handlers
  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      event.stopPropagation();

      // The block menu consumes its trigger character. Read-only
      // editors cannot have blocks inserted into them.
      if (!readOnly && handleBlockMenuKeyDown(event)) {
        return;
      }

      markHotkeys(event);
    },
    [markHotkeys, handleBlockMenuKeyDown, readOnly],
  );

  // Clicking the empty space below the content places the cursor
  // in a trailing empty element, creating a paragraph if needed.
  // Runs on click rather than mouse down so that the browser has
  // already moved focus into this editor, which it does natively
  // and without disturbing the previously focused editor.
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      // Don't interfere with handlers outside of the editor
      event.stopPropagation();

      // Read-only editors are not editable
      if (readOnly) {
        return;
      }

      const lastBlock = event.currentTarget.lastElementChild;

      // Nothing to click below when the editor has no content
      if (!lastBlock) {
        return;
      }

      // Ignore clicks which land on the content itself
      if (event.clientY <= lastBlock.getBoundingClientRect().bottom) {
        return;
      }

      insertTrailingParagraph(editorWithPlugins);
    },
    [editorWithPlugins, readOnly],
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

  // Compose the title blur handling with the consumer's onBlur
  const handleBlur = useCallback(
    (event: React.FocusEvent<HTMLDivElement>) => {
      // Commit or revert an in-progress title edit
      handleEditorBlur();

      if (onBlur) {
        onBlur(event);
      }
    },
    [handleEditorBlur, onBlur],
  );

  return (
    <Slate
      editor={editorWithPlugins}
      initialValue={seededInitialValue}
      onChange={handleChange}
    >
      <TitleContext.Provider value={titleContextValue}>
        <Editable
          autoFocus={false}
          readOnly={readOnly}
          className="editor"
          style={style}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          onKeyDown={onKeyDown}
          onClick={handleClick}
          onFocus={onFocus}
          onBlur={handleBlur}
        />

        {/* Block insertion menu */}
        <BlockMenu {...blockMenuProps} />
      </TitleContext.Provider>
    </Slate>
  );
};
