import { useCallback, useState } from 'react';
import { Layouts } from '@minddrop/designs';
import { Fs } from '@minddrop/file-system';
import { FilePropertySupportedFileExtensions } from '@minddrop/properties';
import { Button, Group, Stack } from '@minddrop/ui-primitives';
import { useMediaDirPath } from '../../MediaDirContext';
import { useMediaFilePath } from '../../useMediaFilePath';
import { PlaceholderImageDialog } from './PlaceholderImageDialog';
import './PlaceholderImageField.css';

export interface PlaceholderImageFieldProps {
  /**
   * The current image file name, or an empty string when no image
   * is set.
   */
  image: string;

  /**
   * Callback fired with the file name of the selected image.
   */
  onSelect: (fileName: string) => void;

  /**
   * Callback fired when the current image is removed.
   */
  onRemove: () => void;

  /**
   * Whether the buttons use the primary colour.
   */
  primary?: boolean;
}

const ImageExtensions = FilePropertySupportedFileExtensions.image;

/**
 * Renders an image picker with a preview, buttons for browsing
 * the media directory or adding a new file, and the media
 * browsing dialog.
 */
export const PlaceholderImageField: React.FC<PlaceholderImageFieldProps> = ({
  image,
  onSelect,
  onRemove,
  primary = false,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const mediaDirPath = useMediaDirPath();

  // Resolve the current image against the owner's media directory
  const imagePath = useMediaFilePath(image);
  const imageSrc = Fs.useImageSrc(imagePath);

  const buttonColor = primary ? 'primary' : undefined;

  function handleOpenDialog() {
    setDialogOpen(true);
  }

  // Copy a file picked from the file system into the media
  // directory and select it
  const handleSelectNewImage = useCallback(async () => {
    if (!mediaDirPath) {
      throw new Error('Cannot add media, no media directory is set.');
    }

    const filePath = await Fs.openFilePicker({ accept: ImageExtensions });

    if (!filePath) {
      return;
    }

    onSelect(await Layouts.addMediaFile(mediaDirPath, filePath));
  }, [onSelect, mediaDirPath]);

  return (
    <>
      {imageSrc ? (
        <Stack gap={2}>
          <img
            src={imageSrc}
            alt=""
            className="designs-placeholder-image-preview"
            onDoubleClick={handleOpenDialog}
          />
          <Group gap={2}>
            <Button
              variant="subtle"
              color={buttonColor}
              size="md"
              label="designs.image.placeholder.change"
              onClick={handleOpenDialog}
            />
            <Button
              variant="subtle"
              color={buttonColor}
              size="md"
              label="designs.image.placeholder.remove"
              onClick={onRemove}
            />
          </Group>
        </Stack>
      ) : (
        <Group gap={2}>
          <Button
            variant="subtle"
            color={buttonColor}
            size="md"
            startIcon="folder-open"
            label="designs.image.placeholder.browse"
            onClick={handleOpenDialog}
          />
          <Button
            variant="subtle"
            color={buttonColor}
            size="md"
            startIcon="image"
            label="designs.image.placeholder.select"
            onClick={handleSelectNewImage}
          />
        </Group>
      )}
      <PlaceholderImageDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSelect={onSelect}
      />
    </>
  );
};
