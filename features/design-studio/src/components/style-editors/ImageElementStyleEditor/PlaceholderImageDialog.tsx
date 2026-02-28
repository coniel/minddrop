import { useCallback, useEffect, useState } from 'react';
import { Designs, getPlaceholderMediaDirPath } from '@minddrop/designs';
import { Fs, FsEntry } from '@minddrop/file-system';
import { useTranslation } from '@minddrop/i18n';
import {
  Button,
  Dialog,
  DialogClose,
  DialogRoot,
  DialogTitle,
  IconButton,
  ScrollArea,
  Text,
} from '@minddrop/ui-primitives';
import './PlaceholderImageDialog.css';

export interface PlaceholderImageDialogProps {
  /** Whether the dialog is open. */
  open: boolean;

  /** Called when the dialog open state changes. */
  onOpenChange: (open: boolean) => void;

  /** Called when the user selects an image. */
  onSelect: (fileName: string) => void;
}

/**
 * A thumbnail component for a single placeholder image file.
 */
const Thumbnail: React.FC<{
  entry: FsEntry;
  onSelect: (name: string) => void;
}> = ({ entry, onSelect }) => {
  // Build the full path to the image file
  const imagePath = Fs.concatPath(getPlaceholderMediaDirPath(), entry.name!);

  // Get the image src URL
  const imageSrc = Fs.useImageSrc(imagePath);

  if (!imageSrc || !entry.name) {
    return null;
  }

  return (
    <img
      src={imageSrc}
      alt={entry.name}
      className="placeholder-image-dialog-thumbnail"
      onClick={() => onSelect(entry.name!)}
    />
  );
};

/**
 * Dialog for selecting a placeholder image from existing placeholder
 * media files, or uploading a new one.
 */
export const PlaceholderImageDialog: React.FC<PlaceholderImageDialogProps> = ({
  open,
  onOpenChange,
  onSelect,
}) => {
  const { t } = useTranslation();
  const [files, setFiles] = useState<FsEntry[]>([]);

  // Load existing placeholder media files when the dialog opens
  useEffect(() => {
    if (!open) {
      return;
    }

    // Read the placeholder media directory
    const dirPath = getPlaceholderMediaDirPath();

    Fs.exists(dirPath).then((dirExists) => {
      if (!dirExists) {
        setFiles([]);

        return;
      }

      Fs.readDir(dirPath).then((entries) => {
        // Filter to only image files
        const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'];
        const imageFiles = entries.filter((entry) => {
          if (!entry.name) {
            return false;
          }

          const extension = entry.name.split('.').pop()?.toLowerCase();

          return extension && imageExtensions.includes(extension);
        });

        setFiles(imageFiles);
      });
    });
  }, [open]);

  // Handles clicking an image thumbnail — selects it and closes the dialog
  const handleThumbnailSelect = useCallback(
    (name: string) => {
      onSelect(name);
      onOpenChange(false);
    },
    [onSelect, onOpenChange],
  );

  // Handles selecting a new image via the OS file picker
  const handleSelectNew = useCallback(async () => {
    const filePath = await Fs.openFilePicker({
      accept: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'],
    });

    if (!filePath) {
      return;
    }

    // Add the file to the placeholder media directory
    const fileName = await Designs.addPlaceholderMedia(filePath as string);

    // Select the newly uploaded file
    onSelect(fileName);
    onOpenChange(false);
  }, [onSelect, onOpenChange]);

  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <Dialog width="md" className="placeholder-image-dialog">
        {/* Header with title and close button */}
        <div className="placeholder-image-dialog-header">
          <DialogTitle>
            {t('designs.image.placeholder.dialog.title')}
          </DialogTitle>
          <DialogClose
            render={
              <IconButton label="actions.cancel" icon="x" color="muted" />
            }
          />
        </div>

        {/* Image grid */}
        <ScrollArea style={{ maxHeight: 400 }}>
          {files.length > 0 ? (
            <div className="placeholder-image-dialog-grid">
              {files.map((entry) => (
                <Thumbnail
                  key={entry.name}
                  entry={entry}
                  onSelect={handleThumbnailSelect}
                />
              ))}
            </div>
          ) : (
            <div className="placeholder-image-dialog-empty">
              <Text color="muted" text="designs.image.placeholder.dialog.empty" />
            </div>
          )}
        </ScrollArea>

        {/* Footer with select new button */}
        <div className="placeholder-image-dialog-footer">
          <Button
            variant="subtle"
            startIcon="image"
            label="designs.image.placeholder.dialog.selectNew"
            onClick={handleSelectNew}
          />
        </div>
      </Dialog>
    </DialogRoot>
  );
};
