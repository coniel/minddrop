import { useCallback, useState } from 'react';
import { Layouts } from '@minddrop/designs-legacy';
import { Fs } from '@minddrop/file-system';
import { FilePropertySupportedFileExtensions } from '@minddrop/properties';
import { Button, Group, Stack } from '@minddrop/ui-primitives';
import { useMediaDirPath } from '../../MediaDirContext';
import { useMediaFilePath } from '../../useMediaFilePath';
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
  const mediaDirPath = useMediaDirPath();

  // Resolve the full path to the current placeholder image
  const imagePath = useMediaFilePath(image);

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
    if (!mediaDirPath) {
      throw new Error('Cannot add media, no media directory is set.');
    }

    const filePath = await Fs.openFilePicker({
      accept: IMAGE_EXTENSIONS,
    });

    if (!filePath) {
      return;
    }

    const fileName = await Layouts.addMediaFile(mediaDirPath, filePath);
    onSelect(fileName);
  }, [onSelect, mediaDirPath]);

  return (
    <>
      {imageSrc ? (
        <Stack gap={2}>
          <img
            src={imageSrc}
            alt=""
            onDoubleClick={() => setDialogOpen(true)}
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
              size="md"
              label="designs.image.placeholder.change"
              onClick={() => setDialogOpen(true)}
            />
            <Button
              variant="subtle"
              color={primary ? 'primary' : undefined}
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
            color={primary ? 'primary' : undefined}
            size="md"
            startIcon="folder-open"
            label="designs.image.placeholder.browse"
            onClick={() => setDialogOpen(true)}
          />
          <Button
            variant="subtle"
            color={primary ? 'primary' : undefined}
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
        onSelect={handleImageSelect}
      />
    </>
  );
};
