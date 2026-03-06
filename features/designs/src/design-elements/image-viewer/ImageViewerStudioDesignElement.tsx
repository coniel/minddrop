import { useCallback, useMemo, useState } from 'react';
import {
  Designs,
  ImageViewerElement,
  getPlaceholderMediaDirPath,
} from '@minddrop/designs';
import { Fs } from '@minddrop/file-system';
import { FilePropertySupportedFileExtensions } from '@minddrop/properties';
import { updateDesignElement } from '../../DesignStudioStore';
import { PlaceholderImageDialog } from '../../style-editors/PlaceholderImageField/PlaceholderImageDialog';
import { FlatImageViewerElement } from '../../types';
import { ImageViewerDesignElement } from './ImageViewerDesignElement';

export interface ImageViewerStudioDesignElementProps {
  /**
   * The image viewer element to render in the studio.
   */
  element: FlatImageViewerElement;

  /**
   * Props to spread on the outermost DOM element for
   * drag-and-drop and click-to-select behaviour.
   */
  rootProps: Record<string, unknown>;
}

/**
 * Renders an image viewer element in the design studio.
 * Wraps ImageViewerDesignElement with interactive placeholder
 * image selection via double-click.
 */
export const ImageViewerStudioDesignElement: React.FC<
  ImageViewerStudioDesignElementProps
> = ({ element, rootProps }) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  // Handles selecting an image from the dialog
  const handleImageSelect = useCallback(
    (fileName: string) => {
      updateDesignElement<ImageViewerElement>(element.id, {
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
    updateDesignElement<ImageViewerElement>(element.id, {
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

  // Merge double-click handler into rootProps
  const mergedRootProps = useMemo(
    () => ({ ...rootProps, onDoubleClick: handleDoubleClick }),
    [rootProps, handleDoubleClick],
  );

  return (
    <>
      <ImageViewerDesignElement element={element} rootProps={mergedRootProps} />
      <PlaceholderImageDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSelect={handleImageSelect}
      />
    </>
  );
};
