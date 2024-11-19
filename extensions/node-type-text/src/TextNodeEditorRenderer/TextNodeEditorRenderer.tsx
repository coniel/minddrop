import { useCallback, useMemo, useState } from 'react';
import { Ast, BlockElement } from '@minddrop/ast';
import { RichTextEditor } from '@minddrop/editor';
import { TextNodeRendererProps, useApi } from '@minddrop/extension';
import './TextNodeEditorRenderer.css';

export const TextNodeRenderer: React.FC<TextNodeRendererProps> = ({
  node,
  onChange,
  onDelete,
}) => {
  const {
    Utils,
    Selection,
    Ui: { Block },
  } = useApi();

  // Path to the parent document
  const parentPath = Utils.useParentDir();
  // Path to the current node considering the parent path
  // and node ID as a subpath.
  const path = `${parentPath}#${node.id}`;
  // Make the node selectable
  const { selected, onClick } = Selection.useSelectable({
    id: path,
    getPlainTextContent: () => node.text,
    onDelete: () => onDelete(node),
  });
  // Make the node draggable
  const { onDragStart } = Selection.useDraggable({ id: path });
  // Used to disable dragging when editor is focused
  const [draggable, setDraggable] = useState(true);

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

  const enableDrag = useCallback(() => {
    setDraggable(true);
  }, []);

  const disableDrag = useCallback(() => {
    setDraggable(false);
    Selection.clear();
  }, [Selection]);

  return (
    <Block
      className="text-node-editor-renderer"
      draggable={draggable}
      selected={selected}
      onDragStart={onDragStart}
    >
      <RichTextEditor
        key={node.id}
        initialValue={initialContent}
        onChangeDebounced={onEditorChange}
        onFocus={disableDrag}
        onBlur={enableDrag}
      />
      <div className="drag-handle" onClick={onClick} />
    </Block>
  );
};
