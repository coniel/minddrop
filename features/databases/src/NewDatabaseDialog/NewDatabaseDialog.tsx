import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BlankDatabaseTemplate,
  DatabaseTemplate,
  DatabaseTemplates,
  Databases,
  DefaultDatabaseIcon,
} from '@minddrop/databases';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { TranslationKey, i18n } from '@minddrop/i18n';
import { PropertiesSchema } from '@minddrop/properties';
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
  Subheading,
  Text,
  TextField,
} from '@minddrop/ui-primitives';
import { Paths, useForm } from '@minddrop/utils';
import {
  EventListenerId,
  OpenDatabaseViewEvent,
  OpenNewDatabaseDialogEvent,
} from '../events';
import './NewDatabaseDialog.css';

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
  const databaseTemplates = DatabaseTemplates.useAll();
  const [dialogOpen, setDialogOpen] = useState(defaultOpen);
  const [icon, setIcon] = useState(DefaultDatabaseIcon);
  // The blank template, used to create a database from scratch with only the
  // title, created, and last modified date properties.
  const blankTemplate = useMemo(
    () => BlankDatabaseTemplate((key) => i18n.t(key, { defaultValue: key })),
    [],
  );
  // The blank template is selected by default so the dialog opens ready to
  // create a database from scratch.
  const [selectedTemplate, setSelectedTemplate] =
    useState<DatabaseTemplate>(blankTemplate);
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
      setSelectedTemplate(blankTemplate);
      setIcon(DefaultDatabaseIcon);
    }, 300);
  }, [reset, blankTemplate]);

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
    if (!setSelectedTemplate) return;

    if (await validateAllAsync()) {
      // Create the new database
      const database = await Databases.create({
        ...selectedTemplate,
        name: values.name,
        entryName: values.entryName,
        icon,
      });

      // Close the dialog
      closeDialog();
      reset();

      // Go to the new database's view with the properties panel open
      Events.dispatch(OpenDatabaseViewEvent, {
        databaseId: database.id,
        configurationPanelOpen: true,
      });
    }
  }

  function handleClearIcon() {
    setIcon(DefaultDatabaseIcon);
  }

  function handleSelectIcon(selectedIcon: string) {
    setIcon(selectedIcon);
  }

  const handleSelectTemplate = useCallback(
    (template: DatabaseTemplate) => {
      setSelectedTemplate(template);
      setIcon(template.icon);
      setFieldValue('name', template.name);
      setFieldValue('entryName', template.entryName);
    },
    [setFieldValue],
  );

  const handleSelectBlank = useCallback(() => {
    setSelectedTemplate(blankTemplate);
    setIcon(blankTemplate.icon);

    // Clear the fields so the user names their database from scratch
    setFieldValue('name', '');
    setFieldValue('entryName', '');
  }, [blankTemplate, setFieldValue]);

  const isBlankTemplate = selectedTemplate === blankTemplate;
  const databaseTypeName = selectedTemplate.name;
  const databaseDescription = selectedTemplate.description || null;
  const properties: PropertiesSchema = selectedTemplate.properties || [];

  return (
    <DialogRoot open={dialogOpen} onOpenChange={toggleDialog}>
      <Dialog className="new-database-dialog">
        <div className="left-column">
          <MenuGroup>
            <MenuLabel label="databases.form.labels.templates" />
            <MenuItem
              onClick={handleSelectBlank}
              active={isBlankTemplate}
              contentIcon={blankTemplate.icon}
              stringLabel={blankTemplate.name}
            />
            {databaseTemplates.map((template) => (
              <MenuItem
                key={template.name}
                onClick={() => handleSelectTemplate(template)}
                active={selectedTemplate.name === template.name}
                contentIcon={template.icon}
                stringLabel={template.name}
              />
            ))}
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
              <Heading stringText={databaseTypeName} />
              {databaseDescription && (
                <Text
                  paragraph
                  color="muted"
                  stringText={databaseDescription}
                />
              )}
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
                    label="databases.form.icon.label"
                    size="lg"
                    variant="filled"
                    color="neutral"
                  >
                    <ContentIcon icon={icon} />
                  </IconButton>
                </IconPicker>
                <TextField
                  variant="filled"
                  label="databases.form.name.label"
                  placeholder="databases.form.name.placeholder"
                  {...fieldProps.name}
                />
              </Group>
              <TextField
                variant="filled"
                label="databases.form.entryName.label"
                placeholder="databases.form.entryName.placeholder"
                {...fieldProps.entryName}
              />
            </div>
            {properties.length > 0 && (
              <MenuGroup className="properties">
                <Subheading text="databases.form.properties.title" />
                <Text
                  paragraph
                  size="sm"
                  color="muted"
                  text="databases.form.properties.description"
                />
                {properties.map((property) => (
                  <MenuItem
                    key={property.name}
                    contentIcon={property.icon}
                    stringLabel={property.name}
                  />
                ))}
              </MenuGroup>
            )}
          </div>
          <div className="footer">
            <Button
              label="actions.cancel"
              variant="ghost"
              onClick={closeDialog}
            />
            <Button
              label="databases.form.actions.create"
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

async function validateDatabaseName(
  value: string,
): Promise<TranslationKey | undefined> {
  const databases = Databases.getAll();
  const nameConfict = databases.find((db) => db.name === value);

  // Ensure no database with the same name exists
  if (nameConfict) {
    return 'databases.form.errors.nameConflict';
  }

  const newDirPath = Fs.concatPath(Paths.workspace, value);

  // Ensure no directory with the same name exists in the workspace
  if (await Fs.exists(newDirPath)) {
    return 'databases.form.errors.pathConflict';
  }
}
