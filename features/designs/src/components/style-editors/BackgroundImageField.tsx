import { useCallback, useMemo, useState } from 'react';
import { Designs, getPlaceholderMediaDirPath } from '@minddrop/designs';
import { Fs } from '@minddrop/file-system';
import { Button, Group, Stack } from '@minddrop/ui-primitives';
import { updateElementStyle, useElementStyle } from '../../DesignStudioStore';
import { PlaceholderImageDialog } from './ImageElementStyleEditor/PlaceholderImageDialog';

export interface BackgroundImageFieldProps {
  elementId: string;
}

export const BackgroundImageField = ({
  elementId,
}: BackgroundImageFieldProps) => {
  const backgroundImage = useElementStyle(elementId, 'backgroundImage');
  const [dialogOpen, setDialogOpen] = useState(false);

  // Resolve the current background image path for preview
  const imagePath = useMemo(
    () =>
      backgroundImage
        ? Fs.concatPath(getPlaceholderMediaDirPath(), backgroundImage)
        : null,
    [backgroundImage],
  );

  const imageSrc = Fs.useImageSrc(imagePath);

  // Handles selecting an image from the placeholder image dialog
  const handleImageSelect = useCallback(
    (fileName: string) => {
      updateElementStyle(elementId, 'backgroundImage', fileName);
    },
    [elementId],
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

    updateElementStyle(elementId, 'backgroundImage', fileName);
  }, [elementId]);

  // Handles clearing the current background image
  const handleRemoveImage = useCallback(() => {
    updateElementStyle(elementId, 'backgroundImage', '');
  }, [elementId]);

  if (imageSrc) {
    return (
      <Stack gap={2}>
        <img
          src={imageSrc}
          alt=""
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
            size="md"
            label="designs.image.placeholder.change"
            onClick={() => setDialogOpen(true)}
          />
          <Button
            variant="subtle"
            size="md"
            label="designs.image.placeholder.remove"
            onClick={handleRemoveImage}
          />
        </Group>
        <PlaceholderImageDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSelect={handleImageSelect}
        />
      </Stack>
    );
  }

  return (
    <>
      <Group gap={2}>
        <Button
          variant="subtle"
          size="md"
          startIcon="image"
          label="designs.image.placeholder.select"
          onClick={handleSelectNewImage}
        />
        <Button
          variant="subtle"
          size="md"
          startIcon="folder-open"
          label="designs.image.placeholder.browse"
          onClick={() => setDialogOpen(true)}
        />
      </Group>
      <PlaceholderImageDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSelect={handleImageSelect}
      />
    </>
  );
};
