import { useCallback, useMemo } from 'react';
import { Ast, BlockElement } from '@minddrop/ast';
import { RichTextEditor } from '@minddrop/editor';
import { TextNode } from '../../types';

interface TextNodeRendererProps {
  /**
   * The node to render.
   */
  node: TextNode;

  /**
   * Callback to call when the node changes.
   */
  onChange: (node: TextNode) => void;
}

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
    <div className="text-node">
      <RichTextEditor
        key={node.id}
        initialValue={initialContent}
        onChangeDebounced={onEditorChange}
      />
    </div>
  );
};
