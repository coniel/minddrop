import { useCallback, useMemo, useState } from 'react';
import { Designs, getPlaceholderMediaDirPath } from '@minddrop/designs';
import { Fs } from '@minddrop/file-system';
import {
  Button,
  Group,
  InputLabel,
  Stack,
  SwitchField,
} from '@minddrop/ui-primitives';
import {
  updateDesignElement,
  updateElementStyle,
  useDesignStudioStore,
  useElementStyle,
} from '../../../DesignStudioStore';
import { FlatImageElement } from '../../../types';
import { Border } from '../Border';
import { MarginFields } from '../MarginFields';
import { ObjectFitSelect } from '../ObjectFitSelect';
import { OpacityField } from '../OpacityField';
import { SectionLabel } from '../SectionLabel';
import { SizingFields } from '../SizingFields/SizingFields';
import { PlaceholderImageDialog } from './PlaceholderImageDialog';

export interface ImageElementStyleEditorProps {
  elementId: string;
}

export const ImageElementStyleEditor: React.FC<
  ImageElementStyleEditorProps
> = ({ elementId }) => {
  const width = useElementStyle(elementId, 'width');
  const height = useElementStyle(elementId, 'height');
  const round = useElementStyle(elementId, 'round');

  const placeholderImage = useDesignStudioStore(
    (state) =>
      (state.elements[elementId] as FlatImageElement)?.placeholderImage,
  );

  const imagePath = useMemo(
    () =>
      placeholderImage
        ? Fs.concatPath(getPlaceholderMediaDirPath(), placeholderImage)
        : null,
    [placeholderImage],
  );

  const imageSrc = Fs.useImageSrc(imagePath);

  const handleRoundChange = useCallback(
    (checked: boolean) => {
      updateElementStyle(elementId, 'round', checked);

      if (checked) {
        // Switch width to px since round requires equal px dimensions
        updateElementStyle(elementId, 'widthUnit', 'px');

        // Use style values if set, otherwise fall back to rendered dimensions
        let effectiveWidth = width || 0;
        let effectiveHeight = height || 0;

        if (!effectiveWidth || !effectiveHeight) {
          const imageElement = document.querySelector(
            `[data-element-id="${elementId}"] img, [data-element-id="${elementId}"]`,
          ) as HTMLElement | null;

          if (imageElement) {
            if (!effectiveWidth) {
              effectiveWidth = imageElement.clientWidth;
            }

            if (!effectiveHeight) {
              effectiveHeight = imageElement.clientHeight;
            }
          }
        }

        // Set both dimensions to the smallest value
        const smallest =
          Math.min(effectiveWidth, effectiveHeight) ||
          effectiveWidth ||
          effectiveHeight;

        if (smallest) {
          updateElementStyle(elementId, 'width', smallest);
          updateElementStyle(elementId, 'height', smallest);
        }
      }
    },
    [elementId, width, height],
  );

  const [dialogOpen, setDialogOpen] = useState(false);

  // Handles selecting an image from the placeholder image dialog
  const handleImageSelect = useCallback(
    (fileName: string) => {
      updateDesignElement(elementId, { placeholderImage: fileName });
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
    updateDesignElement(elementId, { placeholderImage: fileName });
  }, [elementId]);

  const handleRemoveImage = useCallback(() => {
    updateDesignElement(elementId, { placeholderImage: '' });
  }, [elementId]);

  // Opens the dialog if existing images exist, otherwise opens the file picker
  const handleImageDoubleClick = useCallback(async () => {
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

  return (
    <>
      <Stack gap={3}>
        <SectionLabel label="designs.image.placeholder.label" />
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
                cursor: 'pointer',
              }}
            />
            <Group gap={2}>
              <Button
                variant="subtle"
                size="sm"
                label="designs.image.placeholder.change"
                onClick={() => setDialogOpen(true)}
              />
              <Button
                variant="subtle"
                size="sm"
                label="designs.image.placeholder.remove"
                onClick={handleRemoveImage}
              />
            </Group>
          </Stack>
        ) : (
          <Group gap={2}>
            <Button
              variant="subtle"
              color="primary"
              size="sm"
              startIcon="image"
              label="designs.image.placeholder.select"
              onClick={handleSelectNewImage}
            />
            <Button
              variant="subtle"
              color="primary"
              size="sm"
              startIcon="folder-open"
              label="designs.image.placeholder.browse"
              onClick={() => setDialogOpen(true)}
            />
          </Group>
        )}
        <PlaceholderImageDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSelect={handleImageSelect}
        />
      </Stack>

      <Stack gap={3}>
        <SectionLabel label="designs.image.sizing.label" />
        <SizingFields elementId={elementId} />
        <Stack gap={1}>
          <InputLabel size="xs" label="designs.image.sizing.object-fit.label" />
          <ObjectFitSelect elementId={elementId} />
        </Stack>
        <SwitchField
          size="md"
          label="designs.image.round.label"
          checked={round}
          onCheckedChange={handleRoundChange}
        />
      </Stack>

      <Stack gap={3}>
        <SectionLabel label="designs.border.label" />
        <Border elementId={elementId} disableRadius={round} />
      </Stack>

      <Stack gap={3}>
        <SectionLabel label="designs.opacity.label" />
        <OpacityField elementId={elementId} />
      </Stack>

      <Stack gap={3}>
        <SectionLabel label="designs.typography.margin.label" />
        <MarginFields elementId={elementId} />
      </Stack>
    </>
  );
};
