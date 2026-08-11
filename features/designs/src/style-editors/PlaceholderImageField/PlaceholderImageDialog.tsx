import { useCallback, useEffect, useState } from 'react';
import { Layouts } from '@minddrop/designs';
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
import { useMediaDirPath } from '../../MediaDirContext';
import { listMediaImages } from '../../utils';
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
 * Dialog for selecting a placeholder image from the media files of
 * the entity owning the layout, or uploading a new one.
 */
export const PlaceholderImageDialog: React.FC<PlaceholderImageDialogProps> = ({
  open,
  onOpenChange,
  onSelect,
}) => {
  const { t } = useTranslation();
  const [files, setFiles] = useState<FsEntry[]>([]);
  const mediaDirPath = useMediaDirPath();

  // Load existing media images when the dialog opens
  useEffect(() => {
    if (!open) {
      return;
    }

    listMediaImages(mediaDirPath).then(setFiles);
  }, [open, mediaDirPath]);

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
    if (!mediaDirPath) {
      throw new Error('Cannot add media, no media directory is set.');
    }

    const filePaths = await Fs.openFilePicker({
      accept: IMAGE_EXTENSIONS,
      multiple: true,
    });

    if (!filePaths || filePaths.length === 0) {
      return;
    }

    // Add all selected files to the media directory
    const fileNames = await Promise.all(
      filePaths.map((path) => Layouts.addMediaFile(mediaDirPath, path)),
    );

    if (fileNames.length === 1) {
      // Single file — select it directly and close the dialog
      onSelect(fileNames[0]);
      onOpenChange(false);
    } else {
      // Multiple files — refresh the grid so user can pick one
      const updatedFiles = await listMediaImages(mediaDirPath);
      setFiles(updatedFiles);
    }
  }, [onSelect, onOpenChange, mediaDirPath]);

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
 * A thumbnail component for a single media image file.
 */
const Thumbnail: React.FC<{
  entry: FsEntry;
  onSelect: (name: string) => void;
}> = ({ entry, onSelect }) => {
  // Get the image src URL
  const imageSrc = Fs.useImageSrc(entry.path);

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
