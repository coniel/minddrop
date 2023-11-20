import { PathConflictError } from '@minddrop/file-system';
import { useTranslation } from '@minddrop/i18n';
import { Page, Pages } from '@minddrop/pages';
import { InvisibleTextField, PopoverContent, Tooltip } from '@minddrop/ui';
import React, { useCallback, useRef, useState } from 'react';
import './RenamePagePopover.css';

export interface RetitlePagePopoverProps {
  /**
   * The page being renamed.
   */
  page: Page;

  /**
   * Callback fired when the popover closes.
   */
  onClose(): void;
}

export const RenamePagePopover = React.forwardRef<
  HTMLDivElement,
  RetitlePagePopoverProps
>(({ page, onClose }, ref) => {
  const form = useRef<HTMLFormElement | null>(null);
  const input = useRef<HTMLInputElement | null>(null);
  const { t } = useTranslation('pages.actions.rename.form.name');
  const [title, setTitle] = useState(page.title);
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

  const handletitleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setError('');
      setTitle(event.currentTarget.value);
    },
    [],
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();

      // Do nothing if the field is empty, unchanged, or
      // the same bad value is submitted twice (to allow
      // close on click away when there is an error).
      if (!title || title === page.title || title === errorValue) {
        onClose();

        return;
      }

      try {
        // Rename the page
        await Pages.rename(page.path, title);
      } catch (error) {
        console.log(error);

        // New workspce title conflicts with an existing dir
        if (error instanceof PathConflictError) {
          setErrorValue(title);
          setError('error.conflict');
        }

        return;
      }

      // Close the popover
      onClose();
    },
    [page, title, errorValue, onClose],
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
        className="rename-page-popover"
        ref={form}
        onSubmit={handleSubmit}
      >
        <InvisibleTextField
          title="name"
          size="large"
          label={t('placeholder')}
          placeholder={t('placeholder')}
          ref={input}
          defaultValue={page.title}
          onChange={handletitleChange}
        />
        <Tooltip
          open={!!error}
          title={<span>{t(error, { name: title })}</span>}
        >
          <div />
        </Tooltip>
      </form>
    </PopoverContent>
  );
});

RenamePagePopover.displayName = 'RenamePagePopover';
