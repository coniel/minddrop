import { useCallback, useMemo } from 'react';
import { Ast, BlockElement } from '@minddrop/ast';
import { Block } from '@minddrop/blocks';
import { RichTextEditor } from '@minddrop/editor';
import { TextNodeRendererProps, useApi } from '@minddrop/extension';
import './TextNodeEditorRenderer.css';

export const TextNodeRenderer: React.FC<TextNodeRendererProps> = ({
  node,
  onChange,
}) => {
  const { Utils, Selection } = useApi();

  const parentPath = Utils.useParentDir();
  const id = `${parentPath}#${node.id}`;
  const { selected, onClick } = Selection.useSelectable({
    id,
    getPlainTextContent: () => node.text,
  });

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
    <Block className="text-node-editor-renderer" selected={selected}>
      <RichTextEditor
        key={node.id}
        initialValue={initialContent}
        onChangeDebounced={onEditorChange}
      />
      <div className="drag-handle" onMouseDown={onClick} />
    </Block>
  );
};
