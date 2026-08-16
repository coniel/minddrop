import { useCallback, useMemo } from 'react';
import { Ast, Element } from '@minddrop/ast';
import { EditorProps, RichTextEditor } from '@minddrop/editor';
import { Events, OpenReferenceEvent } from '@minddrop/events';
import { entryReferenceSource } from '../entryReferenceSource';

/**
 * Title related props (`title`, `titlePlaceholder`, `titleStyle`,
 * `onTitleChange`, `validateTitle`) are passed through to the
 * underlying editor. The title is not part of the Markdown value.
 */
export interface MarkdownEditorProps
  extends Omit<EditorProps, 'initialValue' | 'onChange'> {
  /**
   * The initial value of the editor.
   */
  initialValue?: string;

  /**
   * Callback fired when the value of the editor changes.
   *
   * @param value The new value of the editor in Markdown format.
   */
  onChange?: (value: string) => void;

  /**
   * Debounced callback fired when the value of the editor changes.
   *
   * @param value The new value of the editor in Markdown format.
   */
  onDebouncedChange?: (value: string) => void;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  initialValue,
  onChange,
  onDebouncedChange,
  references = entryReferenceSource,
  onOpenWikilink = openReference,
  ...other
}) => {
  const value = useMemo(
    () => Ast.fromMarkdown(initialValue ?? ''),
    [initialValue],
  );

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

  return (
    <RichTextEditor
      initialValue={value}
      onChange={handleChange}
      onChangeDebounced={handleDebouncedChange}
      references={references}
      onOpenWikilink={onOpenWikilink}
      {...other}
    />
  );
};

/**
 * Announces that a reference is to be opened, leaving it to whichever package
 * recognises it to do so. The editor deals in references rather than in the
 * things they name, so it has nothing more specific to say.
 *
 * @param reference - What the link points at, as it was written.
 */
function openReference(reference: string): void {
  Events.dispatch(OpenReferenceEvent, { reference });
}
