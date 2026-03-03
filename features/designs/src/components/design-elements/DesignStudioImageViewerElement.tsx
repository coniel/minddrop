import { useCallback, useState } from 'react';
import { Designs, getPlaceholderMediaDirPath } from '@minddrop/designs';
import { Fs } from '@minddrop/file-system';
import { FilePropertySupportedFileExtensions } from '@minddrop/properties';
import { DesignImageViewerElement } from '../../DesignElements';
import { updateDesignElement } from '../../DesignStudioStore';
import { FlatImageViewerElement } from '../../types';
import { PlaceholderImageDialog } from '../style-editors/PlaceholderImageField/PlaceholderImageDialog';

export interface DesignStudioImageViewerElementProps {
  /**
   * The image viewer element to render in the studio.
   */
  element: FlatImageViewerElement;
}

/**
 * Renders an image viewer element in the design studio.
 * Wraps DesignImageViewerElement with interactive placeholder
 * image selection via double-click.
 */
export const DesignStudioImageViewerElement: React.FC<
  DesignStudioImageViewerElementProps
> = ({ element }) => {
  const [dialogOpen, setDialogOpen] = useState(false);

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
      accept: FilePropertySupportedFileExtensions.image,
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
    <div onDoubleClick={handleDoubleClick} style={{ flex: 1, display: 'flex' }}>
      <DesignImageViewerElement element={element} />
      <PlaceholderImageDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSelect={handleImageSelect}
      />
    </div>
  );
};
