import { useCallback, useMemo } from 'react';
import { Ast, BlockElement } from '@minddrop/ast';
import { RichTextEditor } from '@minddrop/editor';
import { BlockVariantProps } from '@minddrop/extension';

export const TextBlockEditor: React.FC<BlockVariantProps> = ({
  block,
  updateBlock,
}) => {
  const initialContent = useMemo<BlockElement[]>(
    () => Ast.fromMarkdown(block.text || ''),
    [],
  );

  const onEditorChange = useCallback(
    (value: BlockElement[]) => {
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

function isDateInPastSecond(date: Date): boolean {
  const now = new Date();
  const oneSecondAgo = new Date(now.getTime() - 1000);

  // Check if the date is in the past second range
  return date > oneSecondAgo && date <= now;
}
