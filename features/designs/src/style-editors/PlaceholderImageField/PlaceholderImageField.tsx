import { useCallback, useMemo, useState } from 'react';
import { Designs, getPlaceholderMediaDirPath } from '@minddrop/designs';
import { Fs } from '@minddrop/file-system';
import { FilePropertySupportedFileExtensions } from '@minddrop/properties';
import { Button, Group, Stack } from '@minddrop/ui-primitives';
import { PlaceholderImageDialog } from './PlaceholderImageDialog';

export interface PlaceholderImageFieldProps {
  /**
   * Current placeholder image filename, or empty string
   * if no image is set.
   */
  image: string;

  /**
   * Called with the selected filename when the user picks
   * an image.
   */
  onSelect: (fileName: string) => void;

  /**
   * Called when the user removes the current image.
   */
  onRemove: () => void;

  /**
   * Whether to use the primary color for the buttons.
   * @default false
   */
  primary?: boolean;
}

const IMAGE_EXTENSIONS = FilePropertySupportedFileExtensions.image;

/**
 * Renders a placeholder image picker with preview thumbnail,
 * select/browse/change/remove buttons, and a dialog for
 * browsing existing placeholder media.
 */
export const PlaceholderImageField: React.FC<PlaceholderImageFieldProps> = ({
  image,
  onSelect,
  onRemove,
  primary = false,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  // Resolve the full path to the current placeholder image
  const imagePath = useMemo(
    () => (image ? Fs.concatPath(getPlaceholderMediaDirPath(), image) : null),
    [image],
  );

  const imageSrc = Fs.useImageSrc(imagePath);

  // Handles selecting an image from the placeholder image dialog
  const handleImageSelect = useCallback(
    (fileName: string) => {
      onSelect(fileName);
    },
    [onSelect],
  );

  // Handles selecting a new image via the OS file picker
  const handleSelectNewImage = useCallback(async () => {
    const filePath = await Fs.openFilePicker({
      accept: IMAGE_EXTENSIONS,
    });

    if (!filePath) {
      return;
    }

    const fileName = await Designs.addPlaceholderMedia(filePath as string);
    onSelect(fileName);
  }, [onSelect]);

  // Opens the dialog if existing images exist, otherwise opens the file picker
  const handleImageDoubleClick = useCallback(async () => {
    const dirPath = getPlaceholderMediaDirPath();
    const dirExists = await Fs.exists(dirPath);

    if (!dirExists) {
      handleSelectNewImage();

      return;
    }

    const entries = await Fs.readDir(dirPath);
    const hasImages = entries.some((entry) => {
      if (!entry.name) {
        return false;
      }

      const extension = entry.name.split('.').pop()?.toLowerCase();

      return extension && IMAGE_EXTENSIONS.includes(extension);
    });

    if (hasImages) {
      setDialogOpen(true);
    } else {
      handleSelectNewImage();
    }
  }, [handleSelectNewImage]);

  return (
    <>
      {imageSrc ? (
        <Stack gap={2}>
          <img
            src={imageSrc}
            alt=""
            onDoubleClick={handleImageDoubleClick}
            style={{
              width: '100%',
              borderRadius: 'var(--space-1)',
              objectFit: 'cover',
              maxHeight: 120,
            }}
          />
          <Group gap={2}>
            <Button
              variant="subtle"
              color={primary ? 'primary' : undefined}
              size="sm"
              label="designs.image.placeholder.change"
              onClick={() => setDialogOpen(true)}
            />
            <Button
              variant="subtle"
              color={primary ? 'primary' : undefined}
              size="sm"
              label="designs.image.placeholder.remove"
              onClick={onRemove}
            />
          </Group>
        </Stack>
      ) : (
        <Group gap={2}>
          <Button
            variant="subtle"
            color={primary ? 'primary' : undefined}
            size="sm"
            startIcon="folder-open"
            label="designs.image.placeholder.browse"
            onClick={() => setDialogOpen(true)}
          />
          <Button
            variant="subtle"
            color={primary ? 'primary' : undefined}
            size="sm"
            startIcon="image"
            label="designs.image.placeholder.select"
            onClick={handleSelectNewImage}
          />
        </Group>
      )}
      <PlaceholderImageDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSelect={handleImageSelect}
      />
    </>
  );
};
