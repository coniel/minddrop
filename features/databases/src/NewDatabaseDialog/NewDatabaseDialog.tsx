import { useCallback, useEffect, useState } from 'react';
import {
  DataType,
  DataTypes,
  DatabaseTemplate,
  Databases,
  databaseTemplates,
} from '@minddrop/databases';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { i18n } from '@minddrop/i18n';
import { PropertiesSchema } from '@minddrop/properties';
import {
  Button,
  ContentIcon,
  Dialog,
  DialogClose,
  DialogRoot,
  Heading,
  IconButton,
  IconPicker,
  MenuGroup,
  MenuItem,
  MenuLabel,
  Subheading,
  Text,
  TextField,
} from '@minddrop/ui-primitives';
import { Paths, useForm } from '@minddrop/utils';
import { EventListenerId, OpenNewDatabaseDialogEvent } from '../events';
import './NewDatabaseDialog.css';

const defaultIcon = 'content-icon:box:default';

export interface NewDatabaseDialogProps {
  /**
   * Whether the dialog is open by default.
   * @default false
   */
  defaultOpen?: boolean;
}

export const NewDatabaseDialog: React.FC<NewDatabaseDialogProps> = ({
  defaultOpen = false,
}) => {
  const dataTypes = DataTypes.useAll();
  const [dialogOpen, setDialogOpen] = useState(defaultOpen);
  const [icon, setIcon] = useState(defaultIcon);
  const [customIcon, setCustomIcon] = useState(false);
  const [selectedDataType, setSelectedDataType] = useState<DataType | null>(
    null,
  );
  const [selectedTemplate, setSelectedTemplate] =
    useState<DatabaseTemplate | null>(null);
  const { fieldProps, validateAllAsync, values, reset, setFieldValue } =
    useForm([
      {
        name: 'name',
        required: true,
        validateAsync: validateDatabaseName,
      },
      {
        name: 'entryName',
        required: true,
      },
    ]);

  const closeDialog = useCallback(() => {
    setDialogOpen(false);

    // Reset form and selected types after a short delay to allow
    // the dialog close animation to complete.
    setTimeout(() => {
      reset();
      setSelectedDataType(null);
      setSelectedTemplate(null);
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
      OpenNewDatabaseDialogEvent,
      EventListenerId,
      toggleDialog,
    );

    return () => {
      Events.removeListener(OpenNewDatabaseDialogEvent, EventListenerId);
    };
  }, [toggleDialog]);

  async function handleCreate() {
    if (!selectedDataType && !setSelectedTemplate) return;

    if (await validateAllAsync()) {
      // Create the new item type
      await Databases.create(Paths.workspace, {
        dataType: selectedDataType
          ? selectedDataType.type
          : selectedTemplate!.dataType,
        name: values.name,
        entryName: values.entryName,
        properties: selectedTemplate ? selectedTemplate.properties : undefined,
        icon,
      });

      // Close the dialog
      closeDialog();
      reset();

      // Go to the new item type view
      Events.dispatch('database:view:open', {
        type: values.name,
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
    (type: DataType) => {
      if (selectedTemplate) {
        reset();
      }

      setSelectedDataType(type);
      setSelectedTemplate(null);

      if (!customIcon) {
        setIcon(type.icon);
      }
    },
    [customIcon, selectedTemplate, reset],
  );

  const handleSelectTemplate = useCallback(
    (template: DatabaseTemplate) => {
      setSelectedTemplate(template);
      setIcon(template.icon);
      setFieldValue('name', i18n.t(template.name));
      setFieldValue('entryName', i18n.t(template.entryName));
      setSelectedDataType(null);
    },
    [setFieldValue],
  );

  let databaseTypeName = '';
  let databaseDescription = '';
  let databasenamePlaceholder = '';
  let entryNamePlaceholder = '';
  let properties: PropertiesSchema = [];

  if (selectedDataType) {
    databaseTypeName = `dataTypes.${selectedDataType.type}.database`;
    databaseDescription = selectedDataType.description;
    databasenamePlaceholder = `dataTypes.${selectedDataType.type}.dbNamePlaceholder`;
    entryNamePlaceholder = `dataTypes.${selectedDataType.type}.entryNamePlaceholder`;
    properties = selectedDataType.properties;
  }

  if (selectedTemplate) {
    databaseTypeName = selectedTemplate.name;
    databaseDescription = selectedTemplate.description || '';
    databasenamePlaceholder = selectedTemplate.name;
    entryNamePlaceholder = selectedTemplate.entryName;
    properties = selectedTemplate.properties;
  }

  return (
    <DialogRoot open={dialogOpen} onOpenChange={toggleDialog}>
      <Dialog className="new-database-dialog">
        <div className="left-column">
          <MenuGroup>
            <MenuLabel label="databases.form.labels.dataTypes" />
            {dataTypes.map((type) => (
              <MenuItem
                key={type.type}
                onClick={() => handleSelectType(type)}
                active={
                  !!selectedDataType && selectedDataType.type === type.type
                }
                contentIcon={type.icon}
                label={type.name}
              />
            ))}
          </MenuGroup>
          <MenuGroup>
            <MenuLabel label="databases.form.labels.templates" />
            {databaseTemplates.map((template) => (
              <MenuItem
                key={template.name}
                onClick={() => handleSelectTemplate(template)}
                active={
                  !!selectedTemplate && selectedTemplate.name === template.name
                }
                contentIcon={template.icon}
                label={template.name}
              />
            ))}
          </MenuGroup>
        </div>
        <div className="right-column">
          <div className="header">
            <DialogClose
              render={
                <IconButton label="actions.cancel" icon="x" color="light" />
              }
            />
          </div>
          {!selectedDataType && !selectedTemplate && (
            <div className="get-started">
              <Heading text="databases.form.getStarted.title" />
              <Text
                paragraph
                color="muted"
                text="databases.form.getStarted.dataType"
              />
              <Text
                paragraph
                color="muted"
                text="databases.form.getStarted.template"
              />
            </div>
          )}
          {(selectedDataType || selectedTemplate) && (
            <div className="content">
              <div className="description">
                <Heading text={databaseTypeName} />
                <Text paragraph color="muted" text={databaseDescription} />
              </div>
              <div className="fields">
                <TextField
                  variant="filled"
                  label="databases.form.name.label"
                  placeholder={databasenamePlaceholder}
                  iconPicker={
                    <IconPicker
                      closeOnSelect
                      onSelect={hndleSelectIcon}
                      onClear={handleClearIcon}
                      currentIcon={icon}
                    >
                      <IconButton
                        label="databases.form.icon.label"
                        size="large"
                        variant="filled"
                      >
                        <ContentIcon icon={icon} />
                      </IconButton>
                    </IconPicker>
                  }
                  {...fieldProps.name}
                />
                <TextField
                  variant="filled"
                  label="databases.form.entryName.label"
                  placeholder={entryNamePlaceholder}
                  {...fieldProps.entryName}
                />
              </div>
              {properties.length > 0 && (
                <MenuGroup className="properties">
                  <Subheading text="databases.form.properties.title" />
                  <Text
                    paragraph
                    size="small"
                    color="muted"
                    text="databases.form.properties.description"
                  />
                  {properties.map((property) => (
                    <MenuItem
                      key={property.name}
                      contentIcon={property.icon}
                      label={property.name}
                    />
                  ))}
                </MenuGroup>
              )}
            </div>
          )}
          <div className="footer">
            <Button
              label="actions.cancel"
              variant="contained"
              onClick={closeDialog}
            />
            <Button
              label="databases.form.actions.create"
              variant="primary"
              onClick={handleCreate}
            />
          </div>
        </div>
      </Dialog>
    </DialogRoot>
  );
};

async function validateDatabaseName(value: string) {
  const databases = Databases.Store.getAll();
  const nameConfict = databases.find((db) => db.name === value);

  // Ensure no database with the same name exists
  if (nameConfict) {
    return i18n.t('databases.form.errors.nameConflict');
  }

  const newDirPath = Fs.concatPath(Paths.workspace, value);

  // Ensure no directory with the same name exists in the workspace
  if (await Fs.exists(newDirPath)) {
    return i18n.t('databases.form.errors.pathConflict');
  }
}
