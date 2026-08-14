import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Descendant, Path, Editor as SlateEditor } from 'slate';
import { HistoryEditor } from 'slate-history';
import { Editable, ReactEditor, RenderElementProps, Slate } from 'slate-react';
import { useDebouncedCallback } from 'use-debounce';
import { Ast, Element } from '@minddrop/ast';
import { Selection } from '@minddrop/selection';
import { isUntitledTitle } from '@minddrop/utils';
import { BlockActionsMenu, BlockActionsMenuProps } from '../BlockActionsMenu';
import { BlockDropIndicator } from '../BlockDropIndicator';
import { BlockGutter, BlockInsertPosition } from '../BlockGutter';
import { BlockMenu } from '../BlockMenu';
import { BlockSelectionContext } from '../BlockSelectionContext';
import { EditorElementConfigs } from '../EditorElementConfigs';
import { MarkConfigs } from '../MarkConfigs';
import { Transforms } from '../Transforms';
import { clearBlockSelection } from '../clearBlockSelection';
import { deleteBlocks } from '../deleteBlocks';
import { duplicateBlocks } from '../duplicateBlocks';
import { insertTrailingParagraph } from '../insertTrailingParagraph';
import { selectAutoFocusTarget } from '../selectAutoFocusTarget';
import { turnBlocksInto } from '../turnBlocksInto';
import { BlockElementProps } from '../types';
import { useBlockDrag } from '../useBlockDrag';
import { useBlockMenu } from '../useBlockMenu';
import { useBlockSelection } from '../useBlockSelection';
import { HoveredBlock, useHoveredBlock } from '../useHoveredBlock';
import { useSelectedBlockIds } from '../useSelectedBlockIds';
import { createEditor, createRenderElement, getSelectedBlocks } from '../utils';
import { assignBlockIds, withBlockIds } from '../withBlockIds';
import { withBlockReset } from '../withBlockReset';
import { withBlockSelection } from '../withBlockSelection';
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
   * If true, the editor will be focused on mount, with the caret
   * placed at the end of the content, or in the title when there
   * is no content.
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
  const containerRef = useRef<HTMLDivElement>(null);
  const blockGutterRef = useRef<HTMLDivElement>(null);
  const blockHandleRef = useRef<HTMLButtonElement>(null);

  // The block the actions menu is open for. The controls are held
  // against it while the menu is open, which they have to outlive:
  // they hold the menu's anchor, and are otherwise dropped as soon
  // as the pointer moves onto the menu.
  //
  // Held until the menu has fully closed rather than until it
  // begins closing, the popup positioning itself against the anchor
  // through its closing animation. The menu's visibility is state
  // of its own.
  const [menuBlock, setMenuBlock] = useState<HoveredBlock | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Whether the title feature is enabled, captured on mount since
  // the Slate document is uncontrolled and cannot gain or lose the
  // title node across renders.
  const hasTitle = useRef(title !== undefined).current;

  // Whether the provided title is a default untitled title
  const titleIsUntitled = title !== undefined && isUntitledTitle(title);

  // The title text rendered in the title node. Untitled titles
  // render empty so a name can be typed straight away.
  const displayTitle = titleIsUntitled ? '' : title;

  // Seed the document with the title element as its first node,
  // giving every block an ID before the first render.
  const seededInitialValue = useMemo(() => {
    if (!hasTitle) {
      return assignBlockIds(initialValue);
    }

    return assignBlockIds([
      Ast.generateElement<TitleElement>(TITLE_ELEMENT_TYPE, {
        children: [{ text: displayTitle ?? '' }],
      }),
      ...initialValue,
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [editorWithMarks, renderLeaf] = useMemo(
    () =>
      withMarks(
        withBlockSelection(
          withBlockIds(
            withBlockReset(
              withBlockShortcuts(withReturnBehaviour(editor), [
                ...EditorElementConfigs,
              ]),
              'paragraph',
            ),
          ),
        ),
        MarkConfigs,
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
  const { handleKeyDown: handleBlockSelectionKeyDown, selectBlock } =
    useBlockSelection(editorWithPlugins, !readOnly);
  const { hoveredBlock, clearHoveredBlock } = useHoveredBlock(
    editorWithPlugins,
    containerRef,
    blockGutterRef,
    !readOnly,
  );

  // The editor's blocks which are in the app's selection, provided
  // to the blocks so that they render as selected
  const selectedBlockIds = useSelectedBlockIds(editorWithPlugins);

  const {
    dropIndicator,
    isDragging,
    handleDragStart: handleBlockDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
  } = useBlockDrag(editorWithPlugins, containerRef, hoveredBlock, !readOnly);

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
    const renderRegisteredElement = createRenderElement(EditorElementConfigs);

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
    () => withMarkHotkeys(editor, MarkConfigs),
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

      // Runs after the block menu, which takes Escape for itself
      // while it is open
      if (handleBlockSelectionKeyDown(event)) {
        return;
      }

      markHotkeys(event);
    },
    [
      markHotkeys,
      handleBlockMenuKeyDown,
      handleBlockSelectionKeyDown,
      readOnly,
    ],
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

  // Inserts an empty paragraph next to the hovered block, ready to
  // be typed into.
  const handleInsertBlock = useCallback(
    (position: BlockInsertPosition) => {
      // The button is only rendered while a block is hovered
      if (!hoveredBlock) {
        return;
      }

      // The button keeps the cursor but not the DOM focus, which
      // typing into the inserted block needs. Focus is taken before
      // the insertion because Slate defers it while the editor has
      // operations pending.
      ReactEditor.focus(editorWithPlugins);

      // Inserting at the hovered block's own path pushes it down,
      // leaving the new block above it.
      const path =
        position === 'above' ? hoveredBlock.path : Path.next(hoveredBlock.path);

      Transforms.insertNodes(
        editorWithPlugins,
        Ast.generateElement('paragraph'),
        { at: path },
      );

      // Place the cursor in the inserted block
      Transforms.select(
        editorWithPlugins,
        SlateEditor.start(editorWithPlugins, path),
      );

      // The controls point at the block which was hovered, which
      // has now moved, and the attention is on the new block.
      clearHoveredBlock();
    },
    [editorWithPlugins, hoveredBlock, clearHoveredBlock],
  );

  // Selects the hovered block, or extends the current block
  // selection to it.
  const handleSelectBlock = useCallback(
    (extend: boolean) => {
      // The handle is only rendered while a block is hovered
      if (!hoveredBlock) {
        return;
      }

      // The selection is only rendered while the editor holds the
      // DOM focus, which the button does not take
      ReactEditor.focus(editorWithPlugins);

      selectBlock(hoveredBlock.path, extend);

      // Extending a selection is not a moment to be covering the
      // blocks being extended over with a menu
      if (!extend) {
        setMenuBlock(hoveredBlock);
        setMenuOpen(true);
      }
    },
    [editorWithPlugins, hoveredBlock, selectBlock],
  );

  // Acts on the blocks the menu was opened for, which are those
  // selected when it opened.
  const menuBlockPaths = useCallback(
    () => getSelectedBlocks(editorWithPlugins).map(([, path]) => path),
    [editorWithPlugins],
  );

  const handleTurnInto = useCallback(
    (type: string, data?: Partial<Element>) => {
      // The menu holds the DOM focus, which the editor needs back
      // for its selection to paint attached to the blocks. Focus is
      // taken before the conversion because Slate defers it while
      // the editor has operations pending.
      ReactEditor.focus(editorWithPlugins);

      turnBlocksInto(editorWithPlugins, menuBlockPaths(), type, data);
    },
    [editorWithPlugins, menuBlockPaths],
  );

  const handleCopyBlocks = useCallback(() => {
    // Return the DOM focus to the editor, whose selection the copy
    // acts on
    ReactEditor.focus(editorWithPlugins);

    // Copied through the app's selection, which the blocks are part
    // of, so that they arrive as markdown
    Selection.copy();
  }, [editorWithPlugins]);

  const handleDuplicateBlocks = useCallback(() => {
    // Return the DOM focus to the editor before the operations, as
    // in handleTurnInto
    ReactEditor.focus(editorWithPlugins);

    duplicateBlocks(editorWithPlugins, menuBlockPaths());
  }, [editorWithPlugins, menuBlockPaths]);

  const handleDeleteBlocks = useCallback(() => {
    // Return the DOM focus to the editor before the operations, as
    // in handleTurnInto
    ReactEditor.focus(editorWithPlugins);

    deleteBlocks(editorWithPlugins, menuBlockPaths());
  }, [editorWithPlugins, menuBlockPaths]);

  const handleMenuOpenChange = useCallback<
    BlockActionsMenuProps['onOpenChange']
  >(
    (open, eventDetails) => {
      // Only closing needs handling
      if (open) {
        return;
      }

      // The menu is opened through its `open` prop rather than by
      // one of its own triggers, so no opening click ever reaches
      // it. Without one it takes itself to be hover-opened, and
      // closes when the pointer leaves the popup. The menu only
      // ever opens from a click, so hover closes are vetoed.
      if (eventDetails.reason === 'trigger-hover') {
        eventDetails.cancel();

        return;
      }

      setMenuOpen(false);

      // Dismissing the menu returns the DOM focus to the editor,
      // except when it was dismissed by clicking elsewhere, where
      // the focus belongs to whatever was clicked. The action
      // handlers take focus themselves.
      if (eventDetails.reason === 'escape-key') {
        ReactEditor.focus(editorWithPlugins);
      }
    },
    [editorWithPlugins],
  );

  // Dropping the block the menu was opened for lets the controls
  // follow the pointer again. Dropped only once the close has fully
  // settled: the block anchors the closing popup, and unmounting
  // the anchor mid-animation throws the popup to the viewport's
  // origin for its final frames.
  const handleMenuOpenChangeComplete = useCallback<
    BlockActionsMenuProps['onOpenChangeComplete']
  >((open) => {
    // Only a completed close drops the block
    if (!open) {
      setMenuBlock(null);
    }
  }, []);

  // Ends a drag started from the controls, dropping the hovered
  // block along with it. The block has moved, so the controls would
  // otherwise come back against where it used to be, until the
  // pointer next moves.
  const handleBlockDragEnd = useCallback(
    (event: React.DragEvent) => {
      handleDragEnd(event);
      clearHoveredBlock();
    },
    [handleDragEnd, clearHoveredBlock],
  );

  // Focus the editor on mount with the caret at the end of the
  // content, or in the title when there is no content, selecting
  // before focusing so the focus restores the placed selection
  // rather than defaulting to the start
  useEffect(() => {
    if (autoFocus) {
      selectAutoFocusTarget(editorRef.current);
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

  // Pressing outside the editor deselects its blocks, as it does a
  // text selection. Listened for on the document because the press
  // can land anywhere on the page.
  useEffect(() => {
    // Nothing is selected, so there is nothing to dismiss
    if (!selectedBlockIds.size) {
      return;
    }

    // While the actions menu is open, an outside press is the
    // menu's to handle: it closes the menu and leaves the selection
    // in place, stepping down like repeated Escape presses do.
    if (menuBlock) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;

      if (!target) {
        return;
      }

      // Presses in the editor place the cursor, which steps the
      // selection down itself
      if (containerRef.current?.contains(target)) {
        return;
      }

      // The controls act on the selection, so pressing them keeps it
      if (blockGutterRef.current?.contains(target)) {
        return;
      }

      clearBlockSelection(editorWithPlugins);
    };

    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [selectedBlockIds, menuBlock, editorWithPlugins]);

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
        <BlockSelectionContext.Provider value={selectedBlockIds}>
          <div ref={containerRef} className="editor-container">
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
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            />

            {/* Marks where dragged blocks would drop */}
            <BlockDropIndicator position={dropIndicator} />

            {/* Controls acting on the hovered block */}
            <BlockGutter
              block={menuBlock ?? hoveredBlock}
              controlsRef={blockGutterRef}
              handleRef={blockHandleRef}
              onInsert={handleInsertBlock}
              onSelect={handleSelectBlock}
              onDragStart={handleBlockDragStart}
              onDragEnd={handleBlockDragEnd}
              hidden={isDragging}
            />
          </div>

          {/* Actions acting on the selected blocks */}
          <BlockActionsMenu
            open={menuOpen}
            onOpenChange={handleMenuOpenChange}
            onOpenChangeComplete={handleMenuOpenChangeComplete}
            anchorRef={blockHandleRef}
            onTurnInto={handleTurnInto}
            onCopy={handleCopyBlocks}
            onDuplicate={handleDuplicateBlocks}
            onDelete={handleDeleteBlocks}
          />

          {/* Block insertion menu */}
          <BlockMenu {...blockMenuProps} />
        </BlockSelectionContext.Provider>
      </TitleContext.Provider>
    </Slate>
  );
};
