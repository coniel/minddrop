import React, { useCallback, useRef, useState } from 'react';
import { useTranslation } from '@minddrop/i18n';
import {
  InvisibleTextField,
  PopoverContent,
  Tooltip,
} from '@minddrop/ui-elements';
import { Workspace, Workspaces } from '@minddrop/workspaces';
import { PathConflictError } from '@minddrop/file-system';
import './RenameWorkspacePopover.css';

export interface RenameWorkspacePopoverProps {
  /**
   * The workspace being renamed.
   */
  workspace: Workspace;

  /**
   * Callback fired when the popover closes.
   */
  onClose(): void;
}

export const RenameWorkspacePopover = React.forwardRef<
  HTMLDivElement,
  RenameWorkspacePopoverProps
>(({ workspace, onClose }, ref) => {
  const form = useRef<HTMLFormElement | null>(null);
  const input = useRef<HTMLInputElement | null>(null);
  const { t } = useTranslation('workspaces.actions.rename.form.name');
  const [name, setName] = useState(workspace.name);
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
      if (!name || name === workspace.name || name === errorValue) {
        onClose();

        return;
      }

      try {
        // Rename the workspace
        await Workspaces.rename(workspace.path, name);
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
    [workspace, name, errorValue, onClose],
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
        className="rename-workspace-popover"
        ref={form}
        onSubmit={handleSubmit}
      >
        <InvisibleTextField
          name="name"
          size="large"
          label={t('placeholder')}
          placeholder={t('placeholder')}
          ref={input}
          defaultValue={workspace.name}
          onChange={handleNameChange}
        />
        <Tooltip open={!!error} title={t(error, { name })}>
          <div />
        </Tooltip>
      </form>
    </PopoverContent>
  );
});

RenameWorkspacePopover.displayName = 'RenameWorkspacePopover';
