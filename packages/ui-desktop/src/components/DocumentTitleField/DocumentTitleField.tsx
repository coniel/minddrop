import React, { useCallback, useRef, useState } from 'react';
import { isUntitled, useTranslation } from '@minddrop/i18n';
import {
  InvisibleTextField,
  InvisibleTextFieldProps,
  Tooltip,
} from '@minddrop/ui-elements';
import { useDocument, Documents } from '@minddrop/documents';
import './DocumentTitleField.css';

export interface DocumentTitleFieldProps
  extends Partial<InvisibleTextFieldProps> {
  /**
   * The document ID.
   */
  documentId: string;
}

export const DocumentTitleField = React.forwardRef<
  HTMLInputElement,
  DocumentTitleFieldProps
>(({ documentId, ...other }, ref) => {
  const document = useDocument(documentId);
  const inputRef = useRef<HTMLInputElement>(null);
  const input = ref || inputRef;
  const { t } = useTranslation();
  const [originalTitle, setOriginalTitle] = useState(document?.title || '');
  const [title, setTitle] = useState(
    !document?.title || isUntitled(document.title) ? '' : document.title,
  );
  const [error, setError] = useState('');

  const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setTitle(event.target.value);
  }, []);

  const onBlur = useCallback(async () => {
    if (!title || title === originalTitle) {
      setTitle(originalTitle);

      return;
    }

    try {
      await Documents.rename(documentId, title);
      setOriginalTitle(title);
      setError('');
    } catch (error) {
      console.error(error);
      setError('documents.actions.rename.form.name.error.conflict');
      inputRef.current?.focus();
    }
  }, [documentId, title, originalTitle]);

  const onSubmit = useCallback((event: React.FormEvent) => {
    event.preventDefault();
    inputRef.current?.blur();
  }, []);

  return (
    <div className="document-title-field">
      <form onSubmit={onSubmit}>
        <InvisibleTextField
          ref={input}
          color={error ? 'danger' : 'regular'}
          autoFocus={!document?.title || isUntitled(document?.title)}
          label={t('documentTitle')}
          placeholder={
            isUntitled(document?.title) ? document!.title : t('labels.untitled')
          }
          size="title"
          value={title}
          onBlur={onBlur}
          onChange={onChange}
          {...other}
        />
      </form>
      <Tooltip
        className="document-title-field-tooltip"
        side="bottom"
        align="start"
        open={!!error}
        title={<span>{t(error, { name: title })}</span>}
      >
        <div />
      </Tooltip>
    </div>
  );
});

DocumentTitleField.displayName = 'DocumentTitleField';
