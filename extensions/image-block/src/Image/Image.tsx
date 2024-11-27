import { BlockRendererProps, SelectionItem, useApi } from '@minddrop/extension';
import { useEffect, useMemo, useState } from 'react';
import './Image.css';

export const ImageCard: React.FC<BlockRendererProps> = ({
  block,
  onDelete,
}) => {
  const {
    Fs,
    Utils,
    Selection,
    Ui: { BlockContainer },
  } = useApi();
  const parentDir = Utils.useParentDir();
  // Path to the parent document
  const parentPath = Utils.useParentDir();
  // Path to the current block considering the parent path
  // and block ID as a subpath.
  const path = `${parentPath}#${block.id}`;
  const [imageAvailable, setImageAvailable] = useState(true);

  const src = useMemo(
    () =>
      block.file ? Fs.convertFileSrc(Fs.concatPath(parentDir, block.file)) : '',
    [block.file, parentDir, Fs],
  );
  const selectionItem: SelectionItem = useMemo(
    () => ({
      id: path,
      getPlainTextContent: () => block.file || '',
      onDelete: () => onDelete(block),
    }),
    [path, block, onDelete],
  );
  // Make the block selectable
  const { selected, onClick } = Selection.useSelectable(selectionItem);
  // Make the block draggable
  const { onDragStart } = Selection.useDraggable(selectionItem);

  // When adding a new image, it occasionally takes a moment
  // for the image to be available. This effect checks if the
  // image is available. If not, it will try again after a
  // timeout.
  useEffect(() => {
    var tester = new Image();

    function imageFound() {
      setImageAvailable(true);

      tester.removeEventListener('load', imageFound);
      tester.removeEventListener('error', imageNotFound);
    }

    function imageNotFound() {
      setImageAvailable(false);

      setTimeout(() => {
        setImageAvailable(true);
        tester.removeEventListener('load', imageFound);
        tester.removeEventListener('error', imageNotFound);
      });
    }

    tester.addEventListener('load', imageFound);
    tester.addEventListener('error', imageNotFound);

    if (src) {
      tester.src = src;
    }

    return () => {
      tester.removeEventListener('load', imageFound);
      tester.removeEventListener('error', imageNotFound);
    };
  }, [src]);

  if (!src) {
    return null;
  }

  if (!imageAvailable) {
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
