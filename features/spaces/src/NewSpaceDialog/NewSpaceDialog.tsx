import { useCallback, useEffect, useState } from 'react';
import { Events } from '@minddrop/events';
import { SpaceGroups, Spaces } from '@minddrop/spaces';
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
  ScrollArea,
  Text,
  TextField,
} from '@minddrop/ui-primitives';
import { useForm } from '@minddrop/utils';
import {
  EventListenerId,
  OpenNewSpaceDialogEvent,
  OpenNewSpaceDialogEventData,
  OpenSpaceViewEvent,
} from '../events';
import './NewSpaceDialog.css';

export interface NewSpaceDialogProps {
  /**
   * Whether the dialog is open by default.
   * @default false
   */
  defaultOpen?: boolean;
}

/**
 * Renders the new space creation dialog: a space template picker with
 * name and icon fields. Currently only the blank space template
 * exists.
 */
export const NewSpaceDialog: React.FC<NewSpaceDialogProps> = ({
  defaultOpen = false,
}) => {
  const [dialogOpen, setDialogOpen] = useState(defaultOpen);
  const [icon, setIcon] = useState(Spaces.constants.EntityDefaultIcon);
  // The group the space is filed under, taken from the event which
  // opened the dialog.
  const [groupId, setGroupId] = useState<string | null>(null);
  const {
    fieldProps,
    validateAllAsync,
    values: formValues,
    reset,
  } = useForm([{ name: 'name', required: true }]);

  const closeDialog = useCallback(() => {
    setDialogOpen(false);

    // Reset the dialog state after a short delay to allow the
    // close animation to complete.
    setTimeout(() => {
      setIcon(Spaces.constants.EntityDefaultIcon);
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

  // File the space under the group the dialog was opened from
  const handleOpenEvent = useCallback(
    (data: OpenNewSpaceDialogEventData) => {
      setGroupId(data?.groupId ?? null);
      toggleDialog();
    },
    [toggleDialog],
  );

  // Listen for open dialog events, and open the dialog when one is received
  useEffect(() => {
    Events.addListener(
      OpenNewSpaceDialogEvent,
      EventListenerId,
      handleOpenEvent,
    );

    return () => {
      Events.removeListener(OpenNewSpaceDialogEvent, EventListenerId);
    };
  }, [handleOpenEvent]);

  function handleSelectIcon(selectedIcon: string) {
    setIcon(selectedIcon);
  }

  function handleClearIcon() {
    setIcon(Spaces.constants.EntityDefaultIcon);
  }

  async function handleCreate() {
    // Validate the form fields
    if (!(await validateAllAsync())) {
      return;
    }

    // Create the space
    const space = await Spaces.create({
      name: formValues.name,
      icon,
    });

    // File the space under the group it was created from
    if (groupId) {
      await SpaceGroups.addItem(groupId, space.id);
    }

    // Close the dialog
    closeDialog();

    // Open the new space
    Events.dispatch(OpenSpaceViewEvent, {
      spaceId: space.id,
    });
  }

  return (
    <DialogRoot open={dialogOpen} onOpenChange={toggleDialog}>
      <Dialog className="new-space-dialog">
        <div className="left-column">
          <ScrollArea startPadding={2} sidePadding={2} endPadding={2}>
            <MenuGroup>
              <MenuLabel label="spaces.form.labels.templates" />
              {/* The blank space is the only template for now */}
              <MenuItem
                active
                contentIcon={Spaces.constants.EntityDefaultIcon}
                label="spaces.templates.blank.name"
              />
            </MenuGroup>
          </ScrollArea>
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
              <Heading text="spaces.templates.blank.name" />
              <Text
                paragraph
                color="muted"
                text="spaces.templates.blank.description"
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
                    label="spaces.form.icon.label"
                    size="lg"
                    variant="filled"
                    color="neutral"
                  >
                    <ContentIcon icon={icon} />
                  </IconButton>
                </IconPicker>
                <TextField
                  variant="filled"
                  label="spaces.form.name.label"
                  placeholder="spaces.form.name.placeholder"
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
              label="spaces.form.actions.create"
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
