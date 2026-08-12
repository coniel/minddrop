import {
  Database,
  Databases,
  LAYOUT_CONTEXTS,
  LayoutContext,
  layoutContextBaseType,
  resolveDesignPropertyMap,
} from '@minddrop/databases';
import { Design, Designs } from '@minddrop/designs';
import { createI18nKeyBuilder } from '@minddrop/i18n';
import { METADATA_PROPERTY_TYPES } from '@minddrop/properties';
import { UiIconName } from '@minddrop/ui-icons';
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

const layoutContextI18nKey = createI18nKeyBuilder('databases.layoutContexts.');

// Select value representing no mapping
const NONE_VALUE = 'none';

/**
 * Maps layout contexts to their icons.
 */
const layoutContextIconMap: Record<LayoutContext, UiIconName> = {
  card: 'layout-grid',
  'preview-card': 'square-mouse-pointer',
  list: 'layout-list',
  'navigation-list': 'panel-left',
  page: 'layout',
  dialog: 'app-window',
  panel: 'panel-right',
  'new-entry': 'file-plus',
};

/**
 * Layout contexts grouped by base layout type, preserving order.
 * Each group renders together, separated by a gap.
 */
const LAYOUT_CONTEXT_GROUPS = LAYOUT_CONTEXTS.reduce<LayoutContext[][]>(
  (groups, context) => {
    const currentGroup = groups[groups.length - 1];

    if (
      currentGroup &&
      layoutContextBaseType[currentGroup[0]] === layoutContextBaseType[context]
    ) {
      currentGroup.push(context);
    } else {
      groups.push([context]);
    }

    return groups;
  },
  [],
);

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
 * the database's compatible properties. Metadata properties are
 * auto-mapped unless overridden.
 */
const PropertyMappingSection: React.FC<DesignSectionProps> = ({
  database,
  design,
}) => {
  // The stored mappings, filled in with the auto-mapped metadata
  // properties
  const propertyMap = resolveDesignPropertyMap(design.properties, database);

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

        const options: SelectOption<string>[] = compatibleProperties.map(
          (property) => ({
            value: property.name,
            stringLabel: property.name,
          }),
        );

        // Metadata properties are always auto-mapped, so they are
        // not offered the "none" option
        if (!METADATA_PROPERTY_TYPES.has(designProperty.type)) {
          options.unshift({
            value: NONE_VALUE,
            label: 'databases.design.mapping.none',
          });
        }

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
                value={propertyMap[designProperty.name] || NONE_VALUE}
                onValueChange={(value) =>
                  handleValueChange(designProperty.name, value)
                }
                options={options}
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
 * Renders a select per layout context for pinning one of the
 * design's layouts as the database default. Contexts whose base
 * type has no layouts show a "no compatible layouts" message.
 */
const DefaultLayoutsSection: React.FC<DesignSectionProps> = ({
  database,
  design,
}) => {
  // Pin the selected layout as the context's default
  function handleValueChange(context: LayoutContext, value: string) {
    Databases.setDefaultLayout(database.id, context, value);
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
      <Stack gap={4}>
        {LAYOUT_CONTEXT_GROUPS.map((group) => (
          <Stack key={layoutContextBaseType[group[0]]} gap={2}>
            {group.map((context) => {
              // Layouts of the context's base type
              const layouts = design.layouts.filter(
                (layout) => layout.type === layoutContextBaseType[context],
              );
              const pinnedId = database.defaultLayouts[context];

              // Fall back to the first layout of the base type when
              // there is no valid pin
              const value =
                layouts.find((layout) => layout.id === pinnedId)?.id ??
                layouts[0]?.id;

              return (
                <Group
                  key={context}
                  gap={2}
                  className="database-design-panel-row"
                >
                  <Icon name={layoutContextIconMap[context]} color="muted" />
                  <Text
                    size="sm"
                    text={layoutContextI18nKey(context, 'name')}
                  />
                  <Spacer />
                  {layouts.length ? (
                    <Select
                      size="sm"
                      variant="subtle"
                      value={value}
                      onValueChange={(layoutId) =>
                        handleValueChange(context, layoutId)
                      }
                      options={layouts.map(
                        (layout): SelectOption<string> => ({
                          value: layout.id,
                          stringLabel: layout.name,
                        }),
                      )}
                    />
                  ) : (
                    <Text
                      size="sm"
                      color="muted"
                      text="databases.design.defaultLayouts.noCompatible"
                    />
                  )}
                </Group>
              );
            })}
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};
