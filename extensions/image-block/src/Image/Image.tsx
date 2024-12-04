import { BlockVariantProps, useApi } from '@minddrop/extension';
import './Image.css';

export const ImageCard: React.FC<BlockVariantProps> = (props) => {
  if (props.block.file) {
    return <HasImageFile {...props} />;
  }

  return <div>No image file</div>;
};

const HasImageFile: React.FC<BlockVariantProps> = ({
  block,
  selected,
  toggleSelected,
  onDragStart,
}) => {
  const {
    Fs: { useImageSrc, concatPath },
    Ui: { BlockContainer },
    Utils,
  } = useApi();
  const parentDir = Utils.useParentDir();
  const src = useImageSrc(concatPath(parentDir, block.file!));

  if (!src) {
    return null;
  }

  return (
    <BlockContainer
      draggable
      className="image-block-renderer"
      selected={selected}
      onDragStart={onDragStart}
      onClick={toggleSelected}
    >
      <img src={src} alt="" style={{ maxWidth: '100%', maxHeight: '100%' }} />
      <div className="drag-handle" />
    </BlockContainer>
  );
};
