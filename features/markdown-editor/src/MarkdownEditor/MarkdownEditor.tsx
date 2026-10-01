import { useCallback, useMemo, useRef } from 'react';
import { Ast, Element } from '@minddrop/ast';
import { Editor, EditorProps, RichTextEditor } from '@minddrop/editor';
import { Views } from '@minddrop/views';
import { entryReferenceSource } from '../entryReferenceSource';
import { openReference } from '../openReference';
import { registerPaneEditor } from '../registerPaneEditor';
import { unregisterPaneEditor } from '../unregisterPaneEditor';
import { updateFocusedPaneEditor } from '../updateFocusedPaneEditor';
import './MarkdownEditor.css';

/**
 * Title related props (`title`, `titlePlaceholder`, `titleStyle`,
 * `onTitleChange`, `validateTitle`) are passed through to the
 * underlying editor. The title is not part of the Markdown value.
 */
export interface MarkdownEditorProps
  extends Omit<EditorProps, 'initialValue' | 'onChange' | 'editorRef'> {
  /**
   * The initial value of the editor.
   */
  initialValue?: string;

  /**
   * Callback fired when the value of the editor changes.
   *
   * @param value - The new value of the editor in Markdown format.
   */
  onChange?: (value: string) => void;

  /**
   * Debounced callback fired when the value of the editor changes.
   *
   * @param value - The new value of the editor in Markdown format.
   */
  onDebouncedChange?: (value: string) => void;
}

/**
 * Renders a rich text editor whose value is Markdown.
 */
export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  initialValue,
  onChange,
  onDebouncedChange,
  references = entryReferenceSource,
  onOpenWikilink,
  ...other
}) => {
  // The editor instance, once the editor hands it over
  const editorRef = useRef<Editor | null>(null);
  // Parse the initial Markdown
  const value = useMemo(
    () => Ast.fromMarkdown(initialValue ?? ''),
    [initialValue],
  );
  // The pane the editor renders in
  const pane = Views.useViewPane();

  // Resolve the key of the pane the editor renders in, null outside a
  // pane.
  const paneKey = pane
    ? Views.resolvePaneKey(pane.viewAreaId, pane.pane)
    : null;

  // Report the value as Markdown
  const handleChange = useCallback(
    (newValue: Element[]) => {
      onChange?.(Ast.toMarkdown(newValue));
    },
    [onChange],
  );

  const handleDebouncedChange = useCallback(
    (newValue: Element[]) => {
      onDebouncedChange?.(Ast.toMarkdown(newValue));
    },
    [onDebouncedChange],
  );

  // Track the editor as rendered in its pane for as long as the
  // editor hands over an instance.
  const handleEditorRef = useCallback(
    (editor: Editor | null) => {
      // Stop tracking the previous instance
      if (editorRef.current && paneKey) {
        unregisterPaneEditor(paneKey, editorRef.current);
      }

      // Keep the instance
      editorRef.current = editor;

      // Track the new instance
      if (editor && paneKey) {
        registerPaneEditor(paneKey, editor);
      }
    },
    [paneKey],
  );

  // Mark the editor as the pane's last focused one
  const handleFocus = useCallback(() => {
    if (editorRef.current && paneKey) {
      updateFocusedPaneEditor(paneKey, editorRef.current);
    }
  }, [paneKey]);

  // Open a pressed wikilink
  const handleOpenWikilink = useCallback(
    (reference: string, fragment?: string) => {
      // Hand the link to the given handler, if any
      if (onOpenWikilink) {
        onOpenWikilink(reference, fragment);

        return;
      }

      // Open the reference from the editor's pane
      openReference(reference, fragment, pane);
    },
    [onOpenWikilink, pane],
  );

  return (
    <div className="markdown-editor" onFocusCapture={handleFocus}>
      <RichTextEditor
        initialValue={value}
        onChange={handleChange}
        onChangeDebounced={handleDebouncedChange}
        references={references}
        onOpenWikilink={handleOpenWikilink}
        editorRef={handleEditorRef}
        {...other}
      />
    </div>
  );
};
