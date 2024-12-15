import { useCallback, useMemo } from 'react';
import { BlockVariantProps, useApi } from '@minddrop/extension';
import { LocalImage } from '../Image';
import './BookmarkCardHorizontal.css';

export const BookmarkCardHorizontal: React.FC<BlockVariantProps> = ({
  block,
}) => {
  const { Utils } = useApi();

  const domain = useMemo(() => {
    try {
      return new URL(block.url || '').hostname.replace('www.', '');
    } catch (error) {
      console.error(error);

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
    <>
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
    </>
  );
};
