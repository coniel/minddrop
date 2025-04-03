import React, { useCallback, useRef, useState } from 'react';
import { Collection, Collections } from '@minddrop/collections';
import { PathConflictError } from '@minddrop/file-system';
import { useTranslation } from '@minddrop/i18n';
import {
  InvisibleTextField,
  PopoverContent,
  Tooltip,
} from '@minddrop/ui-elements';
import './RenameCollectionPopover.css';

export interface RenameCollectionPopoverProps {
  /**
   * The collection being renamed.
   */
  collection: Collection;

  /**
   * Callback fired when the popover closes.
   */
  onClose(): void;
}

export const RenameCollectionPopover = React.forwardRef<
  HTMLDivElement,
  RenameCollectionPopoverProps
>(({ collection, onClose }, ref) => {
  const form = useRef<HTMLFormElement | null>(null);
  const input = useRef<HTMLInputElement | null>(null);
  const { t } = useTranslation({
    keyPrefix: 'collections.actions.rename.form.name',
  });
  const [name, setName] = useState(collection.name);
  const [error, setError] = useState('');
  const [errorValue, setErrorValue] = useState('');

  const selectInput = useCallback(() => {
    // Hacky but works and saves from having to
    // mess with fake timers in tests.
    setTimeout(() => {
      setTimeout(() => {
        input.current?.select();
      });
    });
  }, [input]);

  const submitForm = useCallback(() => {
    form.current?.dispatchEvent(
      new Event('submit', { cancelable: true, bubbles: true }),
    );
  }, [form]);

  const handleNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setError('');
      setName(event.currentTarget.value);
    },
    [],
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();

      // Do nothing if the field is empty, unchanged, or
      // the same bad value is submitted twice (to allow
      // close on click away when there is an error).
      if (!name || name === collection.name || name === errorValue) {
        onClose();

        return;
      }

      try {
        // Rename the collection
        await Collections.rename(collection.path, name);
      } catch (error) {
        // New workspce name conflicts with an existing dir
        if (error instanceof PathConflictError) {
          setErrorValue(name);
          setError('error.conflict');
        }

        return;
      }

      // Close the popover
      onClose();
    },
    [collection, name, errorValue, onClose],
  );

  return (
    <PopoverContent
      align="center"
      side="top"
      ref={ref}
      sideOffset={-55}
      onOpenAutoFocus={selectInput}
      onPointerDownOutside={submitForm}
      onEscapeKeyDown={onClose}
    >
      <form
        data-testid="form"
        className="rename-collection-popover"
        ref={form}
        onSubmit={handleSubmit}
      >
        <InvisibleTextField
          name="name"
          size="large"
          label={t('placeholder')}
          placeholder={t('placeholder')}
          ref={input}
          defaultValue={collection.name}
          onChange={handleNameChange}
        />
        <Tooltip open={!!error} title={t(error, { name })}>
          <div />
        </Tooltip>
      </form>
    </PopoverContent>
  );
});

RenameCollectionPopover.displayName = 'RenameCollectionPopover';
