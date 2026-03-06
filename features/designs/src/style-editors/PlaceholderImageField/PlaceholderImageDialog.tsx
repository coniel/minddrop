import { useCallback, useEffect, useState } from 'react';
import { Designs, getPlaceholderMediaDirPath } from '@minddrop/designs';
import { Fs, FsEntry } from '@minddrop/file-system';
import { useTranslation } from '@minddrop/i18n';
import { FilePropertySupportedFileExtensions } from '@minddrop/properties';
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
  /**
   * Whether the dialog is open.
   */
  open: boolean;

  /**
   * Called when the dialog open state changes.
   */
  onOpenChange: (open: boolean) => void;

  /**
   * Called when the user selects an image.
   */
  onSelect: (fileName: string) => void;
}

const IMAGE_EXTENSIONS = FilePropertySupportedFileExtensions.image;

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

    loadPlaceholderImages().then(setFiles);
  }, [open]);

  // Handles clicking an image thumbnail — selects it and closes the dialog
  const handleThumbnailSelect = useCallback(
    (name: string) => {
      onSelect(name);
      onOpenChange(false);
    },
    [onSelect, onOpenChange],
  );

  // Handles selecting new images via the OS file picker.
  // Single file: add to media, select it, and close the dialog.
  // Multiple files: add all to media and refresh the grid for
  // the user to pick one.
  const handleSelectNew = useCallback(async () => {
    const filePaths = await Fs.openFilePicker({
      accept: IMAGE_EXTENSIONS,
      multiple: true,
    });

    if (!filePaths || filePaths.length === 0) {
      return;
    }

    // Add all selected files to the placeholder media directory
    const fileNames = await Promise.all(
      filePaths.map((path) => Designs.addPlaceholderMedia(path)),
    );

    if (fileNames.length === 1) {
      // Single file — select it directly and close the dialog
      onSelect(fileNames[0]);
      onOpenChange(false);
    } else {
      // Multiple files — refresh the grid so user can pick one
      const updatedFiles = await loadPlaceholderImages();
      setFiles(updatedFiles);
    }
  }, [onSelect, onOpenChange]);

  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <Dialog width="lg" className="placeholder-image-dialog">
        {/* Header with title, select new button, and close button */}
        <div className="placeholder-image-dialog-header">
          <DialogTitle>
            {t('designs.image.placeholder.dialog.title')}
          </DialogTitle>
          <div className="placeholder-image-dialog-header-actions">
            <Button
              variant="subtle"
              color="primary"
              startIcon="image"
              label="designs.image.placeholder.dialog.selectNew"
              onClick={handleSelectNew}
            />
            <DialogClose
              render={
                <IconButton
                  label="actions.cancel"
                  icon="x"
                  variant="subtle"
                  color="muted"
                />
              }
            />
          </div>
        </div>

        {/* Image grid */}
        <ScrollArea>
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
              <Text
                color="muted"
                text="designs.image.placeholder.dialog.empty"
              />
            </div>
          )}
        </ScrollArea>
      </Dialog>
    </DialogRoot>
  );
};

/**
 * Reads the placeholder media directory and returns only image
 * file entries, sorted newest first.
 */
async function loadPlaceholderImages(): Promise<FsEntry[]> {
  const dirPath = getPlaceholderMediaDirPath();
  const dirExists = await Fs.exists(dirPath);

  if (!dirExists) {
    return [];
  }

  const entries = await Fs.readDir(dirPath);

  // Filter to image files and sort newest first by filename
  // (filenames are timestamp-prefixed, so lexicographic descending
  // gives newest first)
  return entries
    .filter((entry) => {
      if (!entry.name) {
        return false;
      }

      const extension = entry.name.split('.').pop()?.toLowerCase();

      return extension && IMAGE_EXTENSIONS.includes(extension);
    })
    .sort((a, b) => (b.name ?? '').localeCompare(a.name ?? ''));
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
