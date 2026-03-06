import { useCallback, useState } from 'react';
import {
  Designs,
  ImageElement,
  getPlaceholderMediaDirPath,
} from '@minddrop/designs';
import { Fs } from '@minddrop/file-system';
import { FilePropertySupportedFileExtensions } from '@minddrop/properties';
import { updateDesignElement } from '../../DesignStudioStore';
import { PlaceholderImageDialog } from '../../style-editors/PlaceholderImageField/PlaceholderImageDialog';
import { FlatImageElement } from '../../types';
import { ImageDesignElement } from './ImageDesignElement';

export interface ImageStudioDesignElementProps {
  /**
   * The image element to render in the studio.
   */
  element: FlatImageElement;
}

/**
 * Renders an image element in the design studio.
 * Wraps ImageDesignElement with interactive placeholder
 * image selection via double-click.
 */
export const ImageStudioDesignElement: React.FC<
  ImageStudioDesignElementProps
> = ({ element }) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  // Handles selecting an image from the dialog
  const handleImageSelect = useCallback(
    (fileName: string) => {
      updateDesignElement<ImageElement>(element.id, {
        placeholderImage: fileName,
      });
    },
    [element.id],
  );

  // Handles selecting a new image via the OS file picker
  const handleSelectNewImage = useCallback(async () => {
    const filePath = await Fs.openFilePicker({
      accept: FilePropertySupportedFileExtensions.image,
    });

    if (!filePath) {
      return;
    }

    const fileName = await Designs.addPlaceholderMedia(filePath as string);
    updateDesignElement<ImageElement>(element.id, {
      placeholderImage: fileName,
    });
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
    const imageExtensions = FilePropertySupportedFileExtensions.image;
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

  return (
    <div
      onDoubleClick={handleDoubleClick}
      style={{
        cursor: 'pointer',
        // Fill the flex-allocated space so the img's
        // max-height: 100% has a definite value to resolve against
        flex: 1,
        minHeight: 0,
        overflow: 'hidden',
      }}
    >
      <ImageDesignElement element={element} />
      <PlaceholderImageDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSelect={handleImageSelect}
      />
    </div>
  );
};
