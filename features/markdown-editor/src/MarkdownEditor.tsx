import { useCallback, useMemo } from 'react';
import { Ast, Element } from '@minddrop/ast';
import { EditorProps, RichTextEditor } from '@minddrop/editor';

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
      {...other}
    />
  );
};
