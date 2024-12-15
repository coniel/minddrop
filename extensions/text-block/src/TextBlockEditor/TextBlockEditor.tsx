import { useCallback, useMemo, useRef } from 'react';
import { Ast, Element } from '@minddrop/ast';
import { RichTextEditor } from '@minddrop/editor';
import { BlockVariantProps } from '@minddrop/extension';

export const TextBlockEditor: React.FC<BlockVariantProps> = ({
  block,
  updateBlock,
}) => {
  const initialContentRef = useRef<Element[] | null>(null);

  const initialContent = useMemo<Element[]>(() => {
    // Only parse the initial content once
    if (!initialContentRef.current) {
      initialContentRef.current = Ast.fromMarkdown(block.text || '');
    }

    return initialContentRef.current;
  }, [block.text]);

  const onEditorChange = useCallback(
    (value: Element[]) => {
      updateBlock({
        ...block,
        text: Ast.toMarkdown(value),
      });
    },
    [updateBlock, block],
  );

  return (
    <RichTextEditor
      key={block.id}
      initialValue={initialContent}
      onChangeDebounced={onEditorChange}
      autoFocus={isDateInPastSecond(block.created)}
    />
  );
};

// Checks if the date is in the past second range
function isDateInPastSecond(date: Date): boolean {
  const now = new Date();
  const oneSecondAgo = new Date(now.getTime() - 1000);

  return date > oneSecondAgo && date <= now;
}
