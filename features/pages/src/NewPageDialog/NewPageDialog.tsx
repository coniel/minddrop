import { useCallback, useEffect, useState } from 'react';
import { Events } from '@minddrop/events';
import { DefaultPageIcon, Pages } from '@minddrop/pages';
import {
  Button,
  ContentIcon,
  Dialog,
  DialogClose,
  DialogRoot,
  Group,
  Heading,
  IconButton,
  IconPicker,
  MenuGroup,
  MenuItem,
  MenuLabel,
  Text,
  TextField,
} from '@minddrop/ui-primitives';
import { useForm } from '@minddrop/utils';
import {
  EventListenerId,
  OpenNewPageDialogEvent,
  OpenPageViewEvent,
  OpenPageViewEventData,
} from '../events';
import './NewPageDialog.css';

export interface NewPageDialogProps {
  /**
   * Whether the dialog is open by default.
   * @default false
   */
  defaultOpen?: boolean;
}

/**
 * Renders the new page creation dialog: a page template picker with
 * name and icon fields. Currently only the blank page template
 * exists.
 */
export const NewPageDialog: React.FC<NewPageDialogProps> = ({
  defaultOpen = false,
}) => {
  const [dialogOpen, setDialogOpen] = useState(defaultOpen);
  const [icon, setIcon] = useState(DefaultPageIcon);
  const {
    fieldProps,
    validateAllAsync,
    values: formValues,
    reset,
  } = useForm([{ name: 'name', required: true }]);

  const closeDialog = useCallback(() => {
    setDialogOpen(false);

    // Reset the dialog state after a short delay to allow the
    // close animation to complete
    setTimeout(() => {
      setIcon(DefaultPageIcon);
      reset();
    }, 300);
  }, [reset]);

  const toggleDialog = useCallback(() => {
    if (dialogOpen) {
      closeDialog();
    } else {
      setDialogOpen(true);
    }
  }, [dialogOpen, closeDialog]);

  // Listen for open dialog events, and open the dialog when one is received
  useEffect(() => {
    Events.addListener(OpenNewPageDialogEvent, EventListenerId, toggleDialog);

    return () => {
      Events.removeListener(OpenNewPageDialogEvent, EventListenerId);
    };
  }, [toggleDialog]);

  function handleSelectIcon(selectedIcon: string) {
    setIcon(selectedIcon);
  }

  function handleClearIcon() {
    setIcon(DefaultPageIcon);
  }

  async function handleCreate() {
    // Validate the form fields
    if (!(await validateAllAsync())) {
      return;
    }

    // Create the page
    const page = await Pages.create({
      name: formValues.name,
      icon,
    });

    // Close the dialog
    closeDialog();

    // Open the new page
    Events.dispatch<OpenPageViewEventData>(OpenPageViewEvent, {
      pageId: page.id,
    });
  }

  return (
    <DialogRoot open={dialogOpen} onOpenChange={toggleDialog}>
      <Dialog className="new-page-dialog">
        <div className="left-column">
          <MenuGroup>
            <MenuLabel label="pages.form.labels.templates" />
            {/* The blank page is the only template for now */}
            <MenuItem
              active
              contentIcon={DefaultPageIcon}
              label="pages.templates.blank.name"
            />
          </MenuGroup>
        </div>
        <div className="right-column">
          <div className="header">
            <DialogClose
              render={
                <IconButton label="actions.cancel" icon="x" color="muted" />
              }
            />
          </div>
          <div className="content">
            <div className="description">
              <Heading text="pages.templates.blank.name" />
              <Text
                paragraph
                color="muted"
                text="pages.templates.blank.description"
              />
            </div>
            <div className="fields">
              <Group gap={2} align="end">
                <IconPicker
                  closeOnSelect
                  onSelect={handleSelectIcon}
                  onClear={handleClearIcon}
                  currentIcon={icon}
                >
                  <IconButton
                    label="pages.form.icon.label"
                    size="lg"
                    variant="filled"
                    color="neutral"
                  >
                    <ContentIcon icon={icon} />
                  </IconButton>
                </IconPicker>
                <TextField
                  variant="filled"
                  label="pages.form.name.label"
                  placeholder="pages.form.name.placeholder"
                  {...fieldProps.name}
                />
              </Group>
            </div>
          </div>
          <div className="footer">
            <Button
              label="actions.cancel"
              variant="ghost"
              onClick={closeDialog}
            />
            <Button
              label="pages.form.actions.create"
              variant="solid"
              color="primary"
              onClick={handleCreate}
            />
          </div>
        </div>
      </Dialog>
    </DialogRoot>
  );
};
