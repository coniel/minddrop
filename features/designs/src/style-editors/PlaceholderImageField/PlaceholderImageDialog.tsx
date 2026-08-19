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
   * Callback fired when the dialog open state changes.
   */
  onOpenChange: (open: boolean) => void;

  /**
   * Callback fired with the file name of the selected image.
   */
  onSelect: (fileName: string) => void;
}

const ImageExtensions = FilePropertySupportedFileExtensions.image;

/**
 * Renders a dialog for picking an image from the media files of
 * the entity owning the layout, or adding new ones.
 */
export const PlaceholderImageDialog: React.FC<PlaceholderImageDialogProps> = ({
  open,
  onOpenChange,
  onSelect,
}) => {
  const { t } = useTranslation();
  const [files, setFiles] = useState<FsEntry[]>([]);
  const mediaDirPath = useMediaDirPath();

  // Load the existing media images each time the dialog opens
  useEffect(() => {
    if (!open) {
      return;
    }

    listMediaImages(mediaDirPath).then(setFiles);
  }, [open, mediaDirPath]);

  // Selecting a thumbnail picks it and closes the dialog
  const handleThumbnailSelect = useCallback(
    (name: string) => {
      onSelect(name);
      onOpenChange(false);
    },
    [onSelect, onOpenChange],
  );

  // Add images from the file picker: a single file is selected
  // outright, several are added for the user to choose between
  const handleSelectNew = useCallback(async () => {
    if (!mediaDirPath) {
      throw new Error('Cannot add media, no media directory is set.');
    }

    const filePaths = await Fs.openFilePicker({
      accept: ImageExtensions,
      multiple: true,
    });

    if (!filePaths || filePaths.length === 0) {
      return;
    }

    // Copy every picked file into the media directory
    const fileNames = await Promise.all(
      filePaths.map((path) => Layouts.addMediaFile(mediaDirPath, path)),
    );

    if (fileNames.length === 1) {
      onSelect(fileNames[0]);
      onOpenChange(false);

      return;
    }

    // Several files: refresh the grid so one can be picked
    setFiles(await listMediaImages(mediaDirPath));
  }, [onSelect, onOpenChange, mediaDirPath]);

  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <Dialog width="lg" className="designs-placeholder-image-dialog">
        {/** Title, add button and close button **/}
        <div className="designs-placeholder-image-dialog-header">
          <DialogTitle>
            {t('designs.image.placeholder.dialog.title')}
          </DialogTitle>
          <div className="designs-placeholder-image-dialog-header-actions">
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

        {/** The media directory's images **/}
        <ScrollArea>
          {files.length > 0 ? (
            <div className="designs-placeholder-image-dialog-grid">
              {files.map((entry) => (
                <Thumbnail
                  key={entry.name}
                  entry={entry}
                  onSelect={handleThumbnailSelect}
                />
              ))}
            </div>
          ) : (
            <div className="designs-placeholder-image-dialog-empty">
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

interface ThumbnailProps {
  /**
   * The media file entry to render.
   */
  entry: FsEntry;

  /**
   * Callback fired with the file name when the thumbnail is clicked.
   */
  onSelect: (name: string) => void;
}

/**
 * Renders a single media image as a selectable thumbnail.
 */
const Thumbnail: React.FC<ThumbnailProps> = ({ entry, onSelect }) => {
  const imageSrc = Fs.useImageSrc(entry.path);

  function handleClick() {
    if (entry.name) {
      onSelect(entry.name);
    }
  }

  if (!imageSrc || !entry.name) {
    return null;
  }

  return (
    <img
      src={imageSrc}
      alt={entry.name}
      className="designs-placeholder-image-dialog-thumbnail"
      onClick={handleClick}
    />
  );
};
