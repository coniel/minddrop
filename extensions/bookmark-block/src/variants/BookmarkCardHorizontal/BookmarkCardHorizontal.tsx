import { useMemo, useCallback } from 'react';
import { BlockRendererProps, useApi } from '@minddrop/extension';
import './BookmarkCardHorizontal.css';

export const BookmarkCardHorizontal: React.FC<BlockRendererProps> = ({
  block,
  onDelete,
}) => {
  const {
    Utils,
    Selection,
    Ui: { BlockContainer },
  } = useApi();
  // Path to the parent document
  const parentPath = Utils.useParentDir();
  // Path to the current node considering the parent path
  // and node ID as a subpath.
  const path = `${parentPath}#${block.id}`;
  // Make the node selectable
  const { selected, onClick } = Selection.useSelectable({
    id: path,
    getUriList: () => (block.url ? [block.url] : []),
    onDelete: () => onDelete(block),
  });
  // Make the node draggable
  const { onDragStart } = Selection.useDraggable({ id: path });

  const domain = useMemo(() => {
    try {
      return new URL(block.url || '').hostname.replace('www.', '');
    } catch (error) {
      return '';
    }
  }, [block.url]);

  const openLink = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      event.preventDefault();

      if (block.url) {
        Utils.open(block.url);
      }
    },
    [Utils, block.url],
  );

  return (
    <BlockContainer
      draggable
      className="link-node-renderer"
      selected={selected}
      onDragStart={onDragStart}
    >
      <a href={block.url} onClick={openLink}>
        <div
          className={Utils.mapPropsToClasses(
            { hasImage: !!block.image },
            'description-container',
          )}
        >
          <div className="title">{block.title || block.url || ''}</div>
          {block.description && (
            <div className="description">{block.description}</div>
          )}
          <div className="domain-container">
            {/* {iconStatus === 'ready' && ( */}
            {/*   <LocalImage className="favicon" path={iconFilePath} /> */}
            {/* )} */}
            <div className="domain">{domain}</div>
          </div>
        </div>
        {/* {imageStatus === 'ready' && ( */}
        {/*   <div className="image-container"> */}
        {/*     <LocalImage className="image" path={imageFilePath} /> */}
        {/*   </div> */}
        {/* )} */}
        {/* {imageStatus === 'downloading' && ( */}
        {/*   <div className="image-container">Downloading image...</div> */}
        {/* )} */}
      </a>
      <div className="drag-handle" onClick={onClick} />
    </BlockContainer>
  );
};
