import {
  FileNodeRendererProps,
  SelectionItem,
  useApi,
} from '@minddrop/extension';
import { useEffect, useMemo, useState } from 'react';
import './ImageNodeRenderer.css';

export const ImageNodeRenderer: React.FC<FileNodeRendererProps> = ({
  node,
}) => {
  const {
    Fs,
    Utils,
    Selection,
    Ui: { Block },
  } = useApi();
  const parentDir = Utils.useParentDir();
  // Path to the parent document
  const parentPath = Utils.useParentDir();
  // Path to the current node considering the parent path
  // and node ID as a subpath.
  const path = `${parentPath}#${node.id}`;
  const [imageAvailable, setImageAvailable] = useState(true);

  const src = useMemo(
    () => Fs.convertFileSrc(Fs.concatPath(parentDir, node.file)),
    [node.file, parentDir, Fs],
  );
  const selectionItem: SelectionItem = useMemo(
    () => ({ id: path, getPlainTextContent: () => node.file }),
    [path, node.file],
  );
  // Make the node selectable
  const { selected, onClick } = Selection.useSelectable(selectionItem);
  // Make the node draggable
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
    <Block
      draggable
      className="image-node-renderer"
      selected={selected}
      onDragStart={onDragStart}
      onClick={onClick}
    >
      <img
        src={src}
        alt={node.file}
        style={{ maxWidth: '100%', maxHeight: '100%' }}
      />
      <div className="drag-handle" />
    </Block>
  );
};
