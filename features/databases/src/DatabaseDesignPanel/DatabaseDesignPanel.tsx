import { Database, Databases } from '@minddrop/databases';
import { Design, Designs, LayoutType } from '@minddrop/designs';
import { layoutTypeIconMap } from '@minddrop/feature-designs';
import { createI18nKeyBuilder } from '@minddrop/i18n';
import {
  ContentIcon,
  Group,
  Icon,
  IconButton,
  Select,
  SelectOption,
  Spacer,
  Stack,
  Text,
} from '@minddrop/ui-primitives';
import { openDesignStudio } from '../navigation';
import { getCompatibleDatabaseProperties } from '../utils';
import './DatabaseDesignPanel.css';

const layoutTypeI18nKey = createI18nKeyBuilder('designs.layouts.');

// Select value representing no mapping
const NONE_VALUE = 'none';

const LAYOUT_TYPES: LayoutType[] = ['card', 'list', 'page'];

export interface DatabaseDesignPanelProps {
  /**
   * The ID of the database to configure.
   */
  databaseId: string;
}

/**
 * Renders the database's design configuration: a design select,
 * and the selected design's property mapping and default layout
 * pinning.
 */
export const DatabaseDesignPanel: React.FC<DatabaseDesignPanelProps> = ({
  databaseId,
}) => {
  const database = Databases.use(databaseId);
  const designs = Designs.useAll();

  // Assign the selected design to the database
  function handleSelectDesign(designId: string) {
    Databases.setDesign(databaseId, designId);
  }

  if (!database) {
    return null;
  }

  const design = designs.find(
    (candidate) => candidate.id === database.designId,
  );

  // No designs to pick from: prompt to create one
  if (designs.length === 0) {
    return (
      <Stack className="database-design-panel database-design-panel-section">
        <Text block size="sm" color="muted" text="databases.design.noDesigns" />
      </Stack>
    );
  }

  return (
    <Stack gap={4} className="database-design-panel">
      {/* Design selection header */}
      <Group gap={2} className="database-design-panel-header">
        <Select
          size="lg"
          variant="subtle"
          placeholder="databases.design.selectDesign"
          value={database.designId || undefined}
          onValueChange={handleSelectDesign}
          options={designs.map(
            (option): SelectOption<string> => ({
              value: option.id,
              stringLabel: option.name,
            }),
          )}
        />
        <Spacer />
        {design && (
          <IconButton
            size="lg"
            icon="palette"
            label="databases.design.actions.edit"
            tooltip={{ title: 'databases.design.actions.edit' }}
            onClick={() => openDesignStudio(databaseId, design.id)}
          />
        )}
      </Group>

      {design && (
        <Stack gap={6} className="database-design-panel-section">
          <PropertyMappingSection database={database} design={design} />
          <DefaultLayoutsSection database={database} design={design} />
        </Stack>
      )}
    </Stack>
  );
};

interface DesignSectionProps {
  /**
   * The database being configured.
   */
  database: Database;

  /**
   * The database's design.
   */
  design: Design;
}

/**
 * Renders a select per design property for mapping it to one of
 * the database's compatible properties.
 */
const PropertyMappingSection: React.FC<DesignSectionProps> = ({
  database,
  design,
}) => {
  // Map the design property to the selected database property,
  // or unmap it when the "none" option is selected
  function handleValueChange(designPropertyName: string, value: string) {
    const { [designPropertyName]: removed, ...map } =
      database.designPropertyMap;

    if (value !== NONE_VALUE) {
      map[designPropertyName] = value;
    }

    Databases.setDesignPropertyMap(database.id, map);
  }

  return (
    <Stack gap={2}>
      <Stack gap={1}>
        <Text size="sm" weight="medium" text="databases.design.mapping.title" />
        <Text
          block
          size="xs"
          color="muted"
          text="databases.design.mapping.description"
        />
      </Stack>
      {design.properties.length === 0 && (
        <Text
          block
          size="sm"
          color="muted"
          text="databases.design.mapping.noProperties"
        />
      )}
      {design.properties.map((designProperty) => {
        const compatibleProperties = getCompatibleDatabaseProperties(
          designProperty,
          database.properties,
        );

        return (
          <Group
            key={designProperty.name}
            gap={2}
            className="database-design-panel-row"
          >
            <ContentIcon icon={designProperty.icon} />
            <Text size="sm" truncate>
              {designProperty.name}
            </Text>
            <Spacer />
            {compatibleProperties.length ? (
              <Select
                size="sm"
                variant="subtle"
                value={
                  database.designPropertyMap[designProperty.name] || NONE_VALUE
                }
                onValueChange={(value) =>
                  handleValueChange(designProperty.name, value)
                }
                options={[
                  { value: NONE_VALUE, label: 'databases.design.mapping.none' },
                  ...compatibleProperties.map(
                    (property): SelectOption<string> => ({
                      value: property.name,
                      stringLabel: property.name,
                    }),
                  ),
                ]}
              />
            ) : (
              <Text
                size="sm"
                color="muted"
                text="databases.design.mapping.noCompatible"
              />
            )}
          </Group>
        );
      })}
    </Stack>
  );
};

/**
 * Renders a select per layout type for pinning one of the
 * design's layouts as the database default.
 */
const DefaultLayoutsSection: React.FC<DesignSectionProps> = ({
  database,
  design,
}) => {
  // Layout types the design has at least one layout of
  const typesWithLayouts = LAYOUT_TYPES.filter((type) =>
    design.layouts.some((layout) => layout.type === type),
  );

  // Pin the selected layout as the type's default
  function handleValueChange(type: LayoutType, value: string) {
    Databases.setDefaultLayout(database.id, type, value);
  }

  if (!typesWithLayouts.length) {
    return null;
  }

  return (
    <Stack gap={2}>
      <Stack gap={1}>
        <Text
          size="sm"
          weight="medium"
          text="databases.design.defaultLayouts.title"
        />
        <Text
          block
          size="xs"
          color="muted"
          text="databases.design.defaultLayouts.description"
        />
      </Stack>
      {typesWithLayouts.map((type) => {
        const layouts = design.layouts.filter((layout) => layout.type === type);
        const pinnedId = database.defaultLayouts[type];

        // Fall back to the first layout of the type when there is
        // no valid pin
        const value = layouts.some((layout) => layout.id === pinnedId)
          ? pinnedId
          : layouts[0].id;

        return (
          <Group key={type} gap={2} className="database-design-panel-row">
            <Icon name={layoutTypeIconMap[type]} color="muted" />
            <Text size="sm" text={layoutTypeI18nKey(type, 'name')} />
            <Spacer />
            <Select
              size="sm"
              variant="subtle"
              value={value}
              onValueChange={(layoutId) => handleValueChange(type, layoutId)}
              options={layouts.map(
                (layout): SelectOption<string> => ({
                  value: layout.id,
                  stringLabel: layout.name,
                }),
              )}
            />
          </Group>
        );
      })}
    </Stack>
  );
};
