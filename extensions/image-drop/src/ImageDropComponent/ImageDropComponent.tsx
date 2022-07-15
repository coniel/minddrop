import React, { FC, useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useSafeState } from 'ahooks';
import { useCore } from '@minddrop/core';
import { Drop, Icon } from '@minddrop/ui';
import { useDraggableDrop, useSelectableDrop } from '@minddrop/app';
import { DropActions } from '@minddrop/app-ui';
import { Files } from '@minddrop/files';
import { DropComponentProps, Drops, useDataInsert } from '@minddrop/drops';
import { mapPropsToClasses } from '@minddrop/utils';
import { useTranslation } from '@minddrop/i18n';
import { ImageDropData, UpdateImageDropData } from '../types';
import './ImageDropComponent.css';

export type ImageDropComponentProps = DropComponentProps<ImageDropData>;

export const ImageDropComponent: FC<ImageDropComponentProps> = ({
  file,
  id,
  color,
  currentParent,
}) => {
  const core = useCore('minddrop:drop:image');
  const { t } = useTranslation();
  // Tracks whether the image file has been saved
  // to avoid saving it multiple times.
  const saved = useRef(!!file);
  // The data insert used to create the drop
  const dataInsert = useDataInsert(id);
  // The file input use to set/change the image
  const fileInput = useRef<HTMLInputElement | null>(null);
  // Drag and drop handling
  const { onDragStart } = useDraggableDrop(id);
  // Selection handling
  const { selectedClass, select, isSelected } = useSelectableDrop(id);
  // The image src value
  const [imageUrl, setImageUrl] = useSafeState(file ? Files.getUrl(file) : '');

  // Saves an image file and sets it as the drop's file
  const saveImage = useCallback(
    async (image: File) => {
      // Only save if the file has not already been saved
      if (saved.current === false) {
        // Mark the file as saved
        saved.current = true;

        // Save the file
        const reference = await Files.save(core, image);

        // Add the file to the drop
        Drops.update<UpdateImageDropData>(core, id, { file: reference.id });

        // Return the file reference ID
        return reference.id;
      }

      return null;
    },
    [id, core],
  );

  // Reads the provided file as a data URL and sets
  // that URL as the image URL.
  const setDataUrl = useCallback(
    (image: File) => {
      // Create a file reader to get the file as a
      // base64 data URL.
      const reader = new FileReader();

      reader.onload = (event) => {
        // Set the data URL as the image URL
        setImageUrl(event.target.result as string);
      };

      reader.readAsDataURL(image);
    },
    [setImageUrl],
  );

  // Fired when the file input value changes.
  // Saves the file and set the file's data URL
  // as the image URL.
  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      // Get the file
      const image = event.target.files[0];

      if (image) {
        // Mark the file as unsaved
        saved.current = false;

        // Set the file base64 data URL as the image URL
        setDataUrl(image);

        // Save the file and add it to the drop
        saveImage(image);
      }
    },
    [saveImage, setDataUrl],
  );

  // Saves the data insert's file if the drop was
  // created from a data insert.
  useEffect(() => {
    if (dataInsert) {
      // Get the file from the data insert
      const insertFile = dataInsert.files[0];

      if (!insertFile) {
        // Do nothing if the data insert does not
        // contain a file.
        return;
      }

      // Set the file base64 data URL as the image URL
      setDataUrl(insertFile);

      // Save the file and add it to the drop
      saveImage(insertFile);
    }
  }, [saveImage, dataInsert, core, setDataUrl]);

  // Opens the file picker by clicking on the
  // file input element.
  const openFilePicker = useCallback(() => {
    if (fileInput.current) {
      // Click on the file input element
      fileInput.current.click();
    }
  }, [fileInput]);

  return (
    <Drop
      draggable
      color={color}
      onDragStart={onDragStart}
      className={mapPropsToClasses(
        { [selectedClass]: isSelected, placeholder: !file },
        'image-drop',
      )}
    >
      {imageUrl && <img className="image" alt="" src={imageUrl} />}
      {!imageUrl && !dataInsert && (
        <div
          role="button"
          className="placeholder-content"
          onClick={openFilePicker}
        >
          <Icon name="image" className="placeholder-icon" />
          <span>{t('imagePlaceholder')}</span>
        </div>
      )}
      <div
        className="drag-handle"
        onClick={() => (!isSelected ? select() : undefined)}
      />
      <DropActions dropId={id} currentParent={currentParent} />
      {createPortal(
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="image-drop-hidden-file-input"
          data-testid="file-input"
        />,
        document.body,
      )}
    </Drop>
  );
};
