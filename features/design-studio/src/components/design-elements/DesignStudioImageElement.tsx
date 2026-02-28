import { ImageIcon } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from '@minddrop/i18n';
import {
  Designs,
  createImageCssStyle,
  getPlaceholderMediaDirPath,
} from '@minddrop/designs';
import { Fs } from '@minddrop/file-system';
import { updateDesignElement } from '../../DesignStudioStore';
import { FlatImageElement } from '../../types';
import { PlaceholderImageDialog } from '../style-editors/ImageElementStyleEditor/PlaceholderImageDialog';

export interface DesignStudioImageElementProps {
  element: FlatImageElement;
}

export const DesignStudioImageElement: React.FC<
  DesignStudioImageElementProps
> = ({ element }) => {
  const { t } = useTranslation();
  const cssStyle = createImageCssStyle(element.style);
  const [dialogOpen, setDialogOpen] = useState(false);

  const imagePath = useMemo(
    () =>
      element.placeholderImage
        ? Fs.concatPath(getPlaceholderMediaDirPath(), element.placeholderImage)
        : null,
    [element.placeholderImage],
  );

  const imageSrc = Fs.useImageSrc(imagePath);

  // Handles selecting an image from the dialog
  const handleImageSelect = useCallback(
    (fileName: string) => {
      updateDesignElement(element.id, { placeholderImage: fileName });
    },
    [element.id],
  );

  // Handles selecting a new image via the OS file picker
  const handleSelectNewImage = useCallback(async () => {
    const filePath = await Fs.openFilePicker({
      accept: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'],
    });

    if (!filePath) {
      return;
    }

    const fileName = await Designs.addPlaceholderMedia(filePath as string);
    updateDesignElement(element.id, { placeholderImage: fileName });
  }, [element.id]);

  // Opens the dialog if existing images exist, otherwise opens the file picker
  const handleDoubleClick = useCallback(async () => {
    const dirPath = getPlaceholderMediaDirPath();
    const dirExists = await Fs.exists(dirPath);

    if (!dirExists) {
      handleSelectNewImage();

      return;
    }

    const entries = await Fs.readDir(dirPath);
    const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'];
    const hasImages = entries.some((entry) => {
      if (!entry.name) {
        return false;
      }

      const extension = entry.name.split('.').pop()?.toLowerCase();

      return extension && imageExtensions.includes(extension);
    });

    if (hasImages) {
      setDialogOpen(true);
    } else {
      handleSelectNewImage();
    }
  }, [handleSelectNewImage]);

  if (imageSrc) {
    return (
      <>
        <img
          src={imageSrc}
          alt=""
          onDoubleClick={handleDoubleClick}
          style={{
            ...cssStyle,
            maxWidth: '100%',
            display: 'block',
            minHeight: cssStyle.height || 80,
            minWidth: 80,
            cursor: 'pointer',
          }}
        />
        <PlaceholderImageDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSelect={handleImageSelect}
        />
      </>
    );
  }

  return (
    <>
      <div
        onDoubleClick={handleDoubleClick}
        style={{
          ...cssStyle,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--space-2)',
          aspectRatio: '16 / 9',
          backgroundColor: 'var(--neutral-400)',
          cursor: 'pointer',
        }}
      >
        <ImageIcon
          size={24}
          style={{ color: 'var(--contrast-500)', flexShrink: 0 }}
        />
        <span
          style={{
            color: 'var(--contrast-500)',
            fontSize: 'var(--text-xs)',
            textAlign: 'center',
          }}
        >
          {t('designs.image.placeholder.hint')}
        </span>
      </div>
      <PlaceholderImageDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSelect={handleImageSelect}
      />
    </>
  );
};
