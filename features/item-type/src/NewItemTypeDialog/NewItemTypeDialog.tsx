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
  AudioItemTypeConfig,
  BaseItemTypeConfig,
  BasicItemTypeConfig,
  FileItemTypeConfig,
  ImageBaseItemTypeConfig,
  PageBaseItemTypeConfig,
  PdfItemTypeConfig,
  SpaceBaseItemTypeConfig,
  UrlBaseItemTypeConfig,
  VideoItemTypeConfig,
} from '@minddrop/base-item-types';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { ItemTypes } from '@minddrop/item-types';
import { Paths, useForm } from '@minddrop/utils';

interface BaseTypeOption {
  name: string;
  type: string;
  icon: string;
}

const baseItemTypes: BaseItemTypeConfig[] = [
  BasicItemTypeConfig,
  UrlBaseItemTypeConfig,
  FileItemTypeConfig,
  PageBaseItemTypeConfig,
  SpaceBaseItemTypeConfig,
];

const fileItemTypes: BaseItemTypeConfig[] = [
  {
    ...FileItemTypeConfig,
    name: 'Any',
    icon: 'content-icon:file',
  },
  PdfItemTypeConfig,
  ImageBaseItemTypeConfig,
  VideoItemTypeConfig,
  AudioItemTypeConfig,
  {
    ...FileItemTypeConfig,
    name: 'Custom',
    icon: 'content-icon:settings-2',
  },
];

const defaultIcon = 'content-icon:box:default';

export const NewItemTypeDialog: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [icon, setIcon] = useState(defaultIcon);
  const [customIcon, setCustomIcon] = useState(false);
  const [selectedType, setSelectedType] = useState<BaseItemTypeConfig>(
    baseItemTypes[0],
  );
  const [selectedFileType, setSelectedFileType] = useState<BaseTypeOption>(
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

  useEffect(() => {
    function openDialog() {
      setDialogOpen(true);
    }

    Events.addListener(
      'item-types:new-item-type-dialog:open',
      'new-item-type-dialog',
      openDialog,
    );

    Events.addListener(
      'item-types:new-item-type-dialog:close',
      'new-item-type-dialog',
      closeDialog,
    );

    return () => {
      Events.removeListener(
        'item-types:new-item-type-dialog:open',
        'new-item-type-dialog',
      );
      Events.removeListener(
        'item-types:new-item-type-dialog:close',
        'new-item-type-dialog',
      );
    };
  }, [closeDialog]);

  async function handleCreate() {
    if (await validateAllAsync()) {
      // Create the new item type
      await ItemTypes.create({
        baseType: selectedType.type,
        dataType: selectedType.dataType,
        nameSingular: values.nameSingular,
        namePlural: values.namePlural,
        icon,
        color: 'gray',
      });

      // Close the dialog
      closeDialog();
      reset();
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
    (type: BaseTypeOption) => {
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
          <Text color="muted">New item type</Text>
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
            placeholder="Type name (e.g. Books)"
            weight="medium"
            {...fieldProps.namePlural}
          />
          <InvisibleTextField
            size="large"
            label="Item name"
            placeholder="Item name (e.g. Book)"
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
          {selectedType.type === FileItemTypeConfig.type && (
            <div>
              <MenuLabel>File type</MenuLabel>
              <div className="base-type-buttons">
                {fileItemTypes.map((config) => (
                  <Button
                    key={config.type}
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
          <Button variant="contained" onClick={closeDialog}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreate}>
            Create item type
          </Button>
        </div>
      </Dialog>
    </DialogRoot>
  );
};

function validateNameSingular(value: string) {
  if (ItemTypes.get(value, false)) {
    return 'An item type with this name already exists.';
  }
}

async function validateNamePlural(value: string) {
  const newDirPath = Fs.concatPath(Paths.workspace, value);

  if (await Fs.exists(newDirPath)) {
    return 'A folder with this name already exists in the workspace.';
  }
}
