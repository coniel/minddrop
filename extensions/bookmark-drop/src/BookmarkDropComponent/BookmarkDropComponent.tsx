import React, { FC, useCallback, useEffect, useState } from 'react';
import { useCore } from '@minddrop/core';
import {
  Drop,
  Icon,
  PopoverTrigger,
  Popover,
  PopoverContent,
  InvisibleTextField,
  Button,
} from '@minddrop/ui';
import {
  useSelectable,
  useDraggable,
  SelectionItem,
} from '@minddrop/selection';
import { DropActions } from '@minddrop/app-ui';
import { Files } from '@minddrop/files';
import { DropComponentProps, Drops } from '@minddrop/drops';
import { mapPropsToClasses } from '@minddrop/utils';
import { useTranslation } from '@minddrop/i18n';
import { Extension } from '../bookmark-drop-extension';
import { BookmarkDrop, UpdateBookmarkDropData } from '../types';
import { getBookmarkPreview } from '../getBookmarkPreview';
import './BookmarkDropComponent.css';

export interface BookmarkDropComponentProps
  extends DropComponentProps,
    BookmarkDrop {}

interface UrlFormElements extends HTMLFormControlsCollection {
  url: HTMLInputElement;
}

interface UrlForm extends HTMLFormElement {
  readonly elements: UrlFormElements;
}

export const BookmarkDropComponent: FC<BookmarkDropComponentProps> = ({
  resource,
  url,
  hasPreview,
  title,
  description,
  image,
  id,
  color,
  currentParent,
}) => {
  const selectionItem: SelectionItem = { id, resource, parent: currentParent };
  const core = useCore(Extension.id);
  const { t } = useTranslation();
  // State of the bookmark preview
  const [previewStatus, setPreviewStatus] = useState<
    'missing' | 'present' | 'fetching'
  >(hasPreview ? 'present' : 'missing');
  // Drag and drop handling
  const { onDragStart, onDragEnd } = useDraggable(selectionItem);
  // Selection handling
  const { onClick, selected } = useSelectable(selectionItem);
  const domain = url ? new URL(url).hostname : '';

  useEffect(() => {
    // If the drop has a URL but no preview,
    // fetch the preview data.
    if (url && previewStatus === 'missing') {
      setPreviewStatus('fetching');
      getBookmarkPreview(core, id, url, () => setPreviewStatus('present'));
    }
  }, [previewStatus, url, core, id]);

  const handleSubmitUrl = useCallback(
    (event: React.FormEvent<UrlForm>) => {
      event.preventDefault();

      // Get the URL value
      const { url: urlField } = event.currentTarget.elements;

      // Don't upate the drop if the value is empty
      if (!urlField.value) {
        return;
      }

      // Update the drop
      Drops.update<UpdateBookmarkDropData>(core, id, {
        url: urlField.value,
        hasPreview: false,
      });
    },
    [id, core],
  );

  return (
    <Drop
      draggable
      color={color}
      selected={selected}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={mapPropsToClasses({ placeholder: !url }, 'bookmark-drop')}
    >
      <div className="content">
        {hasPreview && image && (
          <img className="image" src={Files.getUrl(image)} alt="" />
        )}
        {url && (
          <div className="text-content">
            {previewStatus === 'fetching' && (
              <div className="fetching-preview">Fetching preview...</div>
            )}
            {hasPreview && (
              <>
                {title && <div className="title">{title}</div>}
                {description && (
                  <div className="description">{description}</div>
                )}
              </>
            )}
            <div className="url">{domain}</div>
          </div>
        )}
        {!url && (
          <Popover>
            <PopoverTrigger>
              <div role="button" className="placeholder-content">
                <Icon name="bookmark" className="placeholder-icon" />
                <span>{t('bookmarkPlaceholder')}</span>
              </div>
            </PopoverTrigger>
            <PopoverContent>
              <form
                className="bookmark-drop-url-form"
                onSubmit={handleSubmitUrl}
              >
                <InvisibleTextField
                  name="url"
                  placeholder="https://..."
                  label={t('bookmarkLink')}
                />
                <Button
                  type="submit"
                  label="save"
                  size="medium"
                  variant="primary"
                />
              </form>
            </PopoverContent>
          </Popover>
        )}
      </div>
      {url && (
        <a
          rel="noopener noreferrer"
          target="_blank"
          className="link"
          href={url}
        />
      )}
      <div className="drag-handle" onClick={onClick} />
      <DropActions dropId={id} currentParent={currentParent} />
    </Drop>
  );
};
