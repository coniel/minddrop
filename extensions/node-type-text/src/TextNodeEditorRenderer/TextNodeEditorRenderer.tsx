import { useCallback, useMemo } from 'react';
import { Ast, BlockElement } from '@minddrop/ast';
import { Block } from '@minddrop/blocks';
import { RichTextEditor } from '@minddrop/editor';
import { TextNodeRendererProps } from '@minddrop/extension';

export const TextNodeRenderer: React.FC<TextNodeRendererProps> = ({
  node,
  onChange,
}) => {
  const initialContent = useMemo<BlockElement[]>(
    () => Ast.fromMarkdown(node.text),
    [],
  );

  const onEditorChange = useCallback(
    (value: BlockElement[]) => {
      onChange({ ...node, text: Ast.toMarkdown(value) });
    },
    [onChange, node],
  );

  return (
    <Block className="text-node">
      <RichTextEditor
        key={node.id}
        initialValue={initialContent}
        onChangeDebounced={onEditorChange}
      />
    </Block>
  );
};
