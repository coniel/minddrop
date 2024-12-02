import { BlockVariantProps, SelectionItem, useApi } from '@minddrop/extension';
import { useMemo } from 'react';
import './Image.css';

export const ImageCard: React.FC<BlockVariantProps> = (props) => {
  if (props.block.file) {
    return <HasImageFile {...props} />;
  }

  return <div>No image file</div>;
};

const HasImageFile: React.FC<BlockVariantProps> = ({ block, deleteBlock }) => {
  const {
    Fs: { useImageSrc, concatPath },
    Selection,
    Ui: { BlockContainer },
    Utils,
  } = useApi();
  const parentDir = Utils.useParentDir();
  const src = useImageSrc(concatPath(parentDir, block.file!));

  const selectionItem: SelectionItem = useMemo(
    () => ({
      id: block.id,
      getPlainTextContent: () => block.file || '',
      onDelete: deleteBlock,
    }),
    [block.id, block.file, deleteBlock],
  );
  // Make the block selectable
  const { selected, onClick } = Selection.useSelectable(selectionItem);
  // Make the block draggable
  const { onDragStart } = Selection.useDraggable(selectionItem);

  if (!src) {
    return null;
  }

  return (
    <BlockContainer
      draggable
      className="image-block-renderer"
      selected={selected}
      onDragStart={onDragStart}
      onClick={onClick}
    >
      <img src={src} alt="" style={{ maxWidth: '100%', maxHeight: '100%' }} />
      <div className="drag-handle" />
    </BlockContainer>
  );
};
