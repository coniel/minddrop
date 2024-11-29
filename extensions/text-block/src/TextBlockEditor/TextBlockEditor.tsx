import { useCallback, useMemo, useState } from 'react';
import { Ast, BlockElement } from '@minddrop/ast';
import { RichTextEditor } from '@minddrop/editor';
import { BlockVariantProps, useApi } from '@minddrop/extension';
import './TextBlockEditor.css';

export const TextBlockEditor: React.FC<BlockVariantProps> = ({
  block,
  updateBlock,
  deleteBlock,
}) => {
  const {
    Utils,
    Selection,
    Ui: { BlockContainer },
  } = useApi();

  // Path to the parent document
  const parentPath = Utils.useParentDir();
  // Path to the current block considering the parent path
  // and block ID as a subpath.
  const path = `${parentPath}#${block.id}`;
  // Make the block selectable
  const { selected, onClick } = Selection.useSelectable({
    id: path,
    getPlainTextContent: () => block.text || '',
    onDelete: deleteBlock,
  });
  // Make the block draggable
  const { onDragStart } = Selection.useDraggable({ id: path });
  // Used to disable dragging when editor is focused
  const [draggable, setDraggable] = useState(true);

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

  const enableDrag = useCallback(() => {
    setDraggable(true);
  }, []);

  const disableDrag = useCallback(() => {
    setDraggable(false);
    Selection.clear();
  }, [Selection]);

  return (
    <BlockContainer
      className="text-block-editor"
      draggable={draggable}
      selected={selected}
      onDragStart={onDragStart}
    >
      <RichTextEditor
        key={block.id}
        initialValue={initialContent}
        onChangeDebounced={onEditorChange}
        onFocus={disableDrag}
        onBlur={enableDrag}
      />
      <div className="drag-handle" onClick={onClick} />
    </BlockContainer>
  );
};
