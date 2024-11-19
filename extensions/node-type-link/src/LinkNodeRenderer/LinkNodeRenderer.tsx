import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  LinkNodeMetadata,
  LinkNodeRendererProps,
  useApi,
} from '@minddrop/extension';
import { LocalImage } from './Image';
import './LinkNodeRenderer.css';

export const LinkNodeRenderer: React.FC<LinkNodeRendererProps> = ({
  node,
  onChange,
  onDelete,
}) => {
  const {
    Fs,
    Utils,
    Workspaces,
    Selection,
    Ui: { Block },
  } = useApi();
  // Path to the parent document
  const parentPath = Utils.useParentDir();
  // Path to the current node considering the parent path
  // and node ID as a subpath.
  const path = `${parentPath}#${node.id}`;
  const [imageStatus, setImageStatus] = useState<
    'hidden' | 'ready' | 'downloading'
  >('hidden');
  const [iconStatus, setIconStatus] = useState<
    'hidden' | 'ready' | 'downloading'
  >('hidden');
  // Make the node selectable
  const { selected, onClick } = Selection.useSelectable({
    id: path,
    getUriList: () => [node.url],
    onDelete: () => onDelete(node),
  });
  // Make the node draggable
  const { onDragStart } = Selection.useDraggable({ id: path });

  const workspace = useMemo(
    () => Workspaces.getParentWorkspace(parentPath),
    [parentPath, Workspaces],
  );

  const iconFilePath = useMemo(
    () =>
      workspace && node.metadata?.icon
        ? Workspaces.getCacheFilePath(
            workspace.path,
            node.id,
            `icon.${Fs.getFileExtension(node.metadata.icon).split('?')[0]}`,
          )
        : '',
    [workspace, node.metadata, Workspaces, Fs, node.id],
  );

  const imageFilePath = useMemo(
    () =>
      workspace && node.metadata?.image
        ? Workspaces.getCacheFilePath(
            workspace.path,
            node.id,
            `image.${Fs.getFileExtension(node.metadata.image).split('?')[0]}`,
          )
        : '',
    [workspace, node.metadata, Workspaces, Fs, node.id],
  );

  const domain = useMemo(() => {
    try {
      return new URL(node.url).hostname.replace('www.', '');
    } catch (error) {
      return '';
    }
  }, [node.url]);

  useEffect(() => {
    async function fetchMetadata() {
      const result = await Utils.getWebpageMetadata(node.url);

      const metadata: LinkNodeMetadata = {
        title: result.title || node.url,
      };

      if (result.description) {
        metadata.description = result.description;
      }

      if (result.image) {
        metadata.image = result.image;
      }

      if (result.icon) {
        metadata.icon = result.icon;
      }

      onChange({ ...node, metadata });
    }

    if (!node.metadata) {
      fetchMetadata();
    }
  }, []);

  useEffect(() => {
    async function loadImage() {
      const imageUrl = node.metadata?.image;

      if (imageUrl && imageStatus === 'hidden') {
        if (await Fs.exists(imageFilePath)) {
          setImageStatus('ready');

          return;
        }

        if (!workspace?.path) {
          return;
        }

        setImageStatus('downloading');

        const extension = Fs.getFileExtension(imageUrl).split('?')[0];
        const imageFileName = `image.${extension}`;

        try {
          Workspaces.downloadToCache(
            workspace.path,
            node.id,
            imageFileName,
            imageUrl,
          ).then(() => {
            setTimeout(() => {
              setImageStatus('ready');
            }, 200);
          });
        } catch (error) {
          console.error(error);
        }
      }
    }

    loadImage();
  }, [
    Fs,
    Workspaces,
    workspace?.path,
    node.metadata?.image,
    node.id,
    imageStatus,
    imageFilePath,
  ]);

  useEffect(() => {
    async function loadIcon() {
      const iconUrl = node.metadata?.icon;

      if (iconUrl && iconStatus === 'hidden') {
        if (await Fs.exists(iconFilePath)) {
          setImageStatus('ready');

          return;
        }

        if (!workspace?.path) {
          return;
        }

        setIconStatus('downloading');

        const extension = Fs.getFileExtension(iconUrl).split('?')[0];
        const iconFileName = `icon.${extension}`;

        try {
          Workspaces.downloadToCache(
            workspace.path,
            node.id,
            iconFileName,
            iconUrl,
          ).then(() => {
            setTimeout(() => {
              setIconStatus('ready');
            }, 200);
          });
        } catch (error) {
          console.error(error);
        }
      }
    }

    loadIcon();
  }, [
    Fs,
    Workspaces,
    workspace?.path,
    node.metadata?.icon,
    node.id,
    iconStatus,
    iconFilePath,
  ]);

  const openLink = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      event.preventDefault();
      Utils.open(node.url);
    },
    [Utils, node.url],
  );

  return (
    <Block
      draggable
      className="link-node-renderer"
      selected={selected}
      onDragStart={onDragStart}
    >
      <a href={node.url} onClick={openLink}>
        <div
          className={Utils.mapPropsToClasses(
            { hasImage: !!node.metadata?.image },
            'description-container',
          )}
        >
          <div className="title">{node.metadata?.title || node.url}</div>
          {node.metadata?.description && (
            <div className="description">{node.metadata.description}</div>
          )}
          <div className="domain-container">
            {iconStatus === 'ready' && (
              <LocalImage className="favicon" path={iconFilePath} />
            )}
            <div className="domain">{domain}</div>
          </div>
        </div>
        {imageStatus === 'ready' && (
          <div className="image-container">
            <LocalImage className="image" path={imageFilePath} />
          </div>
        )}
        {imageStatus === 'downloading' && (
          <div className="image-container">Downloading image...</div>
        )}
      </a>
      <div className="drag-handle" onClick={onClick} />
    </Block>
  );
};
