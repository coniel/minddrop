import { useMemo, useCallback } from 'react';
import { BlockVariantProps, useApi } from '@minddrop/extension';
import './BookmarkCardHorizontal.css';
import { LocalImage } from '../Image';

export const BookmarkCardHorizontal: React.FC<BlockVariantProps> = ({
  block,
  deleteBlock,
}) => {
  const {
    Utils,
    Selection,
    Ui: { BlockContainer },
  } = useApi();
  // Make the node selectable
  const { selected, onClick } = Selection.useSelectable({
    id: block.id,
    getUriList: () => (block.url ? [block.url] : []),
    onDelete: deleteBlock,
  });
  // Make the node draggable
  const { onDragStart } = Selection.useDraggable({ id: block.id });

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
            {block.icon && (
              <LocalImage
                className="favicon"
                file={block.icon}
                blockId={block.id}
              />
            )}
            <div className="domain">{domain}</div>
          </div>
        </div>
        {block.image && (
          <div className="image-container">
            <LocalImage
              className="image"
              file={block.image}
              blockId={block.id}
            />
          </div>
        )}
      </a>
      <div className="drag-handle" onClick={onClick} />
    </BlockContainer>
  );
};
