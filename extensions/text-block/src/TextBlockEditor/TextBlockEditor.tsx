import { useCallback, useMemo, useState } from 'react';
import { Ast, BlockElement } from '@minddrop/ast';
import { RichTextEditor } from '@minddrop/editor';
import { BlockVariantProps, useApi } from '@minddrop/extension';
import './TextBlockEditor.css';

export const TextBlockEditor: React.FC<BlockVariantProps> = ({
  block,
  selected,
  draggable: draggableProp,
  updateBlock,
  toggleSelected,
  onDragStart,
}) => {
  const {
    Selection,
    Ui: { BlockContainer },
  } = useApi();

  // Used to disable dragging when editor is focused
  const [draggable, setDraggable] = useState(draggableProp);

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
    setDraggable(draggableProp);
  }, [draggableProp]);

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
        autoFocus={isDateInPastSecond(block.created)}
      />
      <div className="drag-handle" onClick={toggleSelected} />
    </BlockContainer>
  );
};

function isDateInPastSecond(date: Date): boolean {
  const now = new Date();
  const oneSecondAgo = new Date(now.getTime() - 1000);

  // Check if the date is in the past second range
  return date > oneSecondAgo && date <= now;
}
