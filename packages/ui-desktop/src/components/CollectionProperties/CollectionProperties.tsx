import { useState } from 'react';
import { Collection, Collections } from '@minddrop/collections';
import {
  CollectionPropertySchema,
  CollectionPropertyType,
} from '@minddrop/collections/src/types/CollectionPropertiesSchema.types';
import {
  Box,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  Group,
  Icon,
  SecondaryNavItem,
  Stack,
  Text,
  UserIcon,
} from '@minddrop/ui-elements';
import './CollectionProperties.css';
import { useTranslation } from '@minddrop/i18n';
import { UiIconName } from '@minddrop/icons';
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
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null);

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
    setSelectedProperty(null);
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
            {collection.properties.map((schema, index) => (
              <SecondaryNavItem
                key={schema.name}
                label={schema.name}
                icon={
                  schema.icon ? (
                    <UserIcon icon={schema.icon} />
                  ) : (
                    <Icon name={IconMap[schema.type]} />
                  )
                }
                onClick={() => setSelectedProperty(index)}
              />
            ))}
          </Stack>
          <Group>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button
                  size="small"
                  label="properties.actions.add"
                  variant="text"
                  startIcon="plus"
                />
              </DropdownMenuTrigger>
              <DropdownMenuPortal>
                <DropdownMenuContent align="start" minWidth={300}>
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
                </DropdownMenuContent>
              </DropdownMenuPortal>
            </DropdownMenu>
          </Group>
        </Stack>
      </Stack>
      {selectedProperty !== null && (
        <Box pr="md" flex={1} className="property-details">
          <CollectionPropertyEditor
            collectionPath={collection.path}
            schema={collection.properties[selectedProperty]}
            onDelete={onDeleteProperty}
          />
        </Box>
      )}
    </Group>
  );
};
