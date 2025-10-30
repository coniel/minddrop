import {
  Button,
  ContentIcon,
  Dialog,
  DialogClose,
  DialogRoot,
  Icon,
  IconButton,
  IconPicker,
  InvisibleTextField,
  MenuLabel,
  Text,
} from '@minddrop/ui-primitives';
import './NewItemTypeDialog.css';
import { useCallback, useEffect, useState } from 'react';
import {
  AudioBaseItemTypeConfig,
  BaseItemTypeConfig,
  BasicBaseItemTypeConfig,
  FileBaseItemTypeConfig,
  ImageBaseItemTypeConfig,
  PageBaseItemTypeConfig,
  PdfBaseItemTypeConfig,
  SpaceBaseItemTypeConfig,
  UrlBaseItemTypeConfig,
  VideoBaseItemTypeConfig,
} from '@minddrop/base-item-types';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { i18n } from '@minddrop/i18n';
import { ItemTypes } from '@minddrop/item-types';
import { Paths, useForm } from '@minddrop/utils';
import { EventListenerId, OpenNewItemTypeDialogEvent } from '../events';

const baseItemTypes: BaseItemTypeConfig[] = [
  BasicBaseItemTypeConfig,
  UrlBaseItemTypeConfig,
  FileBaseItemTypeConfig,
  PageBaseItemTypeConfig,
  SpaceBaseItemTypeConfig,
];

const fileItemTypes: BaseItemTypeConfig[] = [
  {
    ...FileBaseItemTypeConfig,
    name: i18n.t('itemTypes.baseTypes.file.generic.name'),
    icon: 'content-icon:file',
  },
  PdfBaseItemTypeConfig,
  ImageBaseItemTypeConfig,
  VideoBaseItemTypeConfig,
  AudioBaseItemTypeConfig,
  {
    ...FileBaseItemTypeConfig,
    name: i18n.t('itemTypes.baseTypes.file.custom.name'),
    icon: 'content-icon:settings-2',
  },
];

const defaultIcon = 'content-icon:box:default';

export interface NewItemTypeDialogProps {
  /**
   * Whether the dialog is open by default.
   * @default false
   */
  defaultOpen?: boolean;
}

export const NewItemTypeDialog: React.FC<NewItemTypeDialogProps> = ({
  defaultOpen = false,
}) => {
  const [dialogOpen, setDialogOpen] = useState(defaultOpen);
  const [icon, setIcon] = useState(defaultIcon);
  const [customIcon, setCustomIcon] = useState(false);
  const [selectedType, setSelectedType] = useState<BaseItemTypeConfig>(
    baseItemTypes[0],
  );
  const [selectedFileType, setSelectedFileType] = useState<BaseItemTypeConfig>(
    fileItemTypes[0],
  );
  const { fieldProps, validateAllAsync, values, reset } = useForm([
    {
      name: 'nameSingular',
      required: true,
      validate: validateNameSingular,
    },
    {
      name: 'namePlural',
      required: true,
      validateAsync: validateNamePlural,
    },
  ]);

  const closeDialog = useCallback(() => {
    setDialogOpen(false);

    // Reset form and selected types after a short delay to allow
    // the dialog close animation to complete.
    setTimeout(() => {
      reset();
      setSelectedType(baseItemTypes[0]);
      setSelectedFileType(fileItemTypes[0]);
      setIcon(defaultIcon);
      setCustomIcon(false);
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
    Events.addListener(
      OpenNewItemTypeDialogEvent,
      EventListenerId,
      toggleDialog,
    );

    return () => {
      Events.removeListener(OpenNewItemTypeDialogEvent, EventListenerId);
    };
  }, [toggleDialog]);

  async function handleCreate() {
    if (await validateAllAsync()) {
      let baseType = selectedType.type;
      let dataType = selectedType.dataType;

      // If the selected base type is File, use the selected file type
      if (selectedType.type === FileBaseItemTypeConfig.type) {
        baseType = selectedFileType.type;
        dataType = selectedFileType.dataType;
      }

      // Create the new item type
      await ItemTypes.create({
        baseType,
        dataType,
        nameSingular: values.nameSingular,
        namePlural: values.namePlural,
        icon,
        color: 'gray',
      });

      // Close the dialog
      closeDialog();
      reset();

      // Go to the new item type view
      Events.dispatch('item-type:view:open', {
        type: values.nameSingular,
        tab: 'properties',
      });
    }
  }

  function handleClearIcon() {
    setIcon(defaultIcon);
    setCustomIcon(false);
  }

  function hndleSelectIcon(selectedIcon: string) {
    setCustomIcon(true);
    setIcon(selectedIcon);
  }

  const handleSelectType = useCallback(
    (type: BaseItemTypeConfig) => {
      setSelectedType(type);

      if (!customIcon) {
        setIcon(type.icon);
      }
    },
    [customIcon],
  );

  const handleSelectFileType = useCallback(
    (type: BaseItemTypeConfig) => {
      setSelectedFileType(type);

      if (!customIcon) {
        setIcon(type.icon);
      }
    },
    [customIcon],
  );

  return (
    <DialogRoot open={dialogOpen} onOpenChange={toggleDialog}>
      <Dialog className="new-item-type-dialog">
        <div className="header">
          <Text color="muted" text="itemTypes.form.labels.new" />
          <DialogClose
            render={
              <IconButton label="actions.cancel" icon="x" color="light" />
            }
          />
        </div>
        <div className="content">
          <IconPicker
            closeOnSelect
            onSelect={hndleSelectIcon}
            onClear={handleClearIcon}
            currentIcon={icon}
          >
            <IconButton label="Select icon" size="medium">
              <ContentIcon icon={icon} />
            </IconButton>
          </IconPicker>
          <InvisibleTextField
            size="title"
            label="Type name"
            placeholder="itemTypes.form.labels.namePlural"
            weight="medium"
            {...fieldProps.namePlural}
          />
          <InvisibleTextField
            size="large"
            label="Item name"
            placeholder="itemTypes.form.labels.nameSingular"
            {...fieldProps.nameSingular}
          />
          <div className="base-type-buttons">
            {baseItemTypes.map((config) => (
              <Button
                key={config.type}
                variant="contained"
                size="small"
                active={selectedType.type === config.type}
                startIcon={
                  selectedType.type === config.type ? (
                    <Icon name="check" />
                  ) : (
                    <ContentIcon icon={config.icon} />
                  )
                }
                onClick={() => handleSelectType(config)}
              >
                {config.name}
              </Button>
            ))}
          </div>
          {selectedType.type === FileBaseItemTypeConfig.type && (
            <div>
              <MenuLabel label="itemTypes.form.labels.fileType" />
              <div className="base-type-buttons">
                {fileItemTypes.map((config) => (
                  <Button
                    key={config.name}
                    active={selectedFileType.name === config.name}
                    variant="contained"
                    size="small"
                    startIcon={
                      selectedFileType.name === config.name ? (
                        <Icon name="check" />
                      ) : (
                        <ContentIcon icon={config.icon} />
                      )
                    }
                    onClick={() => handleSelectFileType(config)}
                  >
                    {config.name}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="footer">
          <Button
            label="actions.cancel"
            variant="contained"
            onClick={closeDialog}
          />
          <Button
            label="itemTypes.form.actions.create"
            variant="primary"
            onClick={handleCreate}
          />
        </div>
      </Dialog>
    </DialogRoot>
  );
};

function validateNameSingular(value: string) {
  // Ensure no item type with the same name exists
  if (ItemTypes.get(value, false)) {
    return i18n.t('itemTypes.form.errors.itemNameConflict');
  }
}

async function validateNamePlural(value: string) {
  const itemTypes = ItemTypes.getAll();
  const nameConfict = itemTypes.find((type) => type.namePlural === value);

  // Ensure no item type with the same plural name exists
  if (nameConfict) {
    return i18n.t('itemTypes.form.errors.typeNameConflict');
  }

  const newDirPath = Fs.concatPath(Paths.workspace, value);

  // Ensure no directory with the same name exists in the workspace
  if (await Fs.exists(newDirPath)) {
    return i18n.t('itemTypes.form.errors.pathConflict');
  }
}
