import { useState } from 'react';
import {
  Collection,
  CollectionPropertySchemas,
  Collections,
} from '@minddrop/collections';
import { CollectionPropertyType } from '@minddrop/collections/src/types/CollectionPropertiesSchema.types';
import {
  Box,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Group,
  Icon,
  IconButton,
  MenuLabel,
  SecondaryNavItem,
  Stack,
  Text,
  TextInput,
  UserIcon,
} from '@minddrop/ui-elements';
import './CollectionProperties.css';
import { useTranslation } from '@minddrop/i18n';
import { Icons, UiIconName } from '@minddrop/icons';
import { CollectionPropertyEditor } from '../CollectionPropertyEditor';

export interface CollectionPropertiesProps {
  /**
   * The collection to display properties for.
   */
  collection: Collection;
}

const IconMap: Record<CollectionPropertyType, UiIconName> = {
  [CollectionPropertyType.Text]: 'text',
  [CollectionPropertyType.Number]: 'hash',
  [CollectionPropertyType.Date]: 'calendar',
  [CollectionPropertyType.Checkbox]: 'checkmark-square',
  [CollectionPropertyType.Select]: 'checkmark',
  [CollectionPropertyType.MultiSelect]: 'list',
  [CollectionPropertyType.Created]: 'calendar',
  [CollectionPropertyType.Modified]: 'calendar',
  [CollectionPropertyType.Markdown]: 'text',
};

export const CollectionProperties: React.FC<CollectionPropertiesProps> = ({
  collection,
}) => {
  const { t } = useTranslation();
  const [selectedProperty, setSelectedProperty] = useState('');

  function addProperty(type: CollectionPropertyType) {
    return () => {
      Collections.addProperty(
        collection.path,
        t(`properties.${type}.label`),
        type,
      );
    };
  }

  function onDeleteProperty() {
    setSelectedProperty('');
  }

  return (
    <Group align="flex-start" gap="xl" className="collection-properties">
      <Stack>
        <Stack gap="xs">
          <Text as="div" color="light" weight="semibold" size="tiny">
            Basic properties
          </Text>
          <SecondaryNavItem label="Title" icon="text" />
          <SecondaryNavItem label="Icon" icon="color-palette" />
          <SecondaryNavItem label="Created date" icon="calendar" />
          <SecondaryNavItem label="Last modified date" icon="calendar" />
          <SecondaryNavItem label="Markdown content" icon="menu" />
        </Stack>
        <Stack gap="xs">
          <Text as="div" color="light" weight="semibold" size="tiny">
            Custom properties
          </Text>
          <Stack className="properties-list" gap="xs" justify="stretch">
            {Object.entries(collection.properties || {}).map(
              ([name, schema]) => (
                <SecondaryNavItem
                  key={name}
                  label={name}
                  icon={
                    schema.icon ? (
                      <UserIcon icon={schema.icon} />
                    ) : (
                      <Icon name={IconMap[schema.type]} />
                    )
                  }
                  onClick={() => setSelectedProperty(name)}
                />
              ),
            )}
          </Stack>
          <Group>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <IconButton label="properties.actions.add" icon="plus" />
              </DropdownMenuTrigger>
              <DropdownMenuPortal>
                <DropdownMenuContent align="end" minWidth={300}>
                  <DropdownMenuItem
                    icon={IconMap[CollectionPropertyType.Text]}
                    label="properties.text.label"
                    tooltipDescription="properties.text.description"
                    onSelect={addProperty(CollectionPropertyType.Text)}
                  />
                  <DropdownMenuItem
                    icon={IconMap[CollectionPropertyType.Number]}
                    label="properties.number.label"
                    tooltipDescription="properties.number.description"
                    onSelect={addProperty(CollectionPropertyType.Number)}
                  />
                  <DropdownMenuItem
                    icon={IconMap[CollectionPropertyType.Date]}
                    label="properties.date.label"
                    tooltipDescription="properties.date.description"
                    onSelect={addProperty(CollectionPropertyType.Date)}
                  />
                  <DropdownMenuItem
                    icon={IconMap[CollectionPropertyType.Checkbox]}
                    label="properties.checkbox.label"
                    tooltipDescription="properties.checkbox.description"
                    onSelect={addProperty(CollectionPropertyType.Checkbox)}
                  />
                  <DropdownMenuItem
                    icon={IconMap[CollectionPropertyType.Select]}
                    label="properties.select.label"
                    tooltipDescription="properties.select.description"
                    onSelect={addProperty(CollectionPropertyType.Select)}
                  />
                  <DropdownMenuItem
                    icon={IconMap[CollectionPropertyType.MultiSelect]}
                    label="properties.multiselect.label"
                    tooltipDescription="properties.multiselect.description"
                    onSelect={addProperty(CollectionPropertyType.MultiSelect)}
                  />
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    icon={IconMap[CollectionPropertyType.Created]}
                    label="properties.created.label"
                    tooltipDescription="properties.created.description"
                    onSelect={addProperty(CollectionPropertyType.Created)}
                  />
                  <DropdownMenuItem
                    icon={IconMap[CollectionPropertyType.Modified]}
                    label="properties.modified.label"
                    tooltipDescription="properties.modified.description"
                    onSelect={addProperty(CollectionPropertyType.Modified)}
                  />
                  <DropdownMenuItem
                    icon={IconMap[CollectionPropertyType.Markdown]}
                    label="properties.markdown.label"
                    tooltipDescription="properties.markdown.description"
                    onSelect={addProperty(CollectionPropertyType.Markdown)}
                  />
                </DropdownMenuContent>
              </DropdownMenuPortal>
            </DropdownMenu>
          </Group>
        </Stack>
      </Stack>
      <Box key={selectedProperty} flex={1} mt="xl" className="property-details">
        {selectedProperty && (
          <CollectionPropertyEditor
            collectionPath={collection.path}
            schema={collection.properties[selectedProperty]}
            onDelete={onDeleteProperty}
          />
        )}
      </Box>
    </Group>
  );
};
