import { useMemo } from 'react';
import { Database, Databases, LayoutContext } from '@minddrop/databases';
import { Design, Designs } from '@minddrop/designs-next';
import { createI18nKeyBuilder } from '@minddrop/i18n';
import { UiIconName } from '@minddrop/ui-icons';
import {
  Group,
  Icon,
  IconButton,
  Select,
  SelectOption,
  Spacer,
  Stack,
  Text,
} from '@minddrop/ui-primitives';
import { orderByCreated, reconcileIdOrder } from '@minddrop/utils';
import { useEnterDesignMode } from '../useEnterDesignMode';
import './DatabaseDesignPanel.css';

const layoutContextI18nKey = createI18nKeyBuilder('databases.layoutContexts.');

// Select value representing the meta Color property
const META_COLOR_VALUE = 'meta-color';

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
 * Layout contexts grouped by base design type, preserving order.
 * Each group renders together, separated by a gap.
 */
const LAYOUT_CONTEXT_GROUPS = Databases.constants.LayoutContexts.reduce<
  LayoutContext[][]
>((groups, context) => {
  const currentGroup = groups[groups.length - 1];

  if (
    currentGroup &&
    Databases.constants.LayoutContextBaseType[currentGroup[0]] ===
      Databases.constants.LayoutContextBaseType[context]
  ) {
    currentGroup.push(context);
  } else {
    groups.push([context]);
  }

  return groups;
}, []);

export interface DatabaseDesignPanelProps {
  /**
   * The ID of the database to configure.
   */
  databaseId: string;
}

/**
 * Renders the database's design configuration.
 */
export const DatabaseDesignPanel: React.FC<DatabaseDesignPanelProps> = ({
  databaseId,
}) => {
  const database = Databases.use(databaseId);
  const unsortedDesigns = Designs.useAll(databaseId);
  const enterDesignMode = useEnterDesignMode();

  // Order the designs as the database lists them, designs missing
  // from its list after them by creation date.
  const designs = useMemo(
    () =>
      reconcileIdOrder(
        database?.designs ?? [],
        unsortedDesigns,
        orderByCreated,
      ),
    [unsortedDesigns, database?.designs],
  );

  if (!database) {
    return null;
  }

  return (
    <Stack gap={4} className="database-design-panel">
      {/* Design mode link */}
      <Group gap={1} className="database-design-panel-header">
        <Text size="sm" weight="medium" text="designs.labels.designs" />
        <Spacer />
        <IconButton
          size="sm"
          variant="subtle"
          icon={Designs.constants.Icon}
          label="databases.design.actions.designMode"
          tooltip={{ title: 'databases.design.actions.designMode' }}
          onClick={enterDesignMode}
        />
      </Group>

      <Stack gap={6} className="database-design-panel-section">
        {/* Default design per context, once the database has designs */}
        {designs.length === 0 ? (
          <Text
            block
            size="sm"
            color="muted"
            text="databases.design.noDesigns"
          />
        ) : (
          <DefaultDesignsSection database={database} designs={designs} />
        )}

        {/* Entry colour source */}
        <EntryColorSection database={database} />
      </Stack>
    </Stack>
  );
};

interface DefaultDesignsSectionProps {
  /**
   * The database being configured.
   */
  database: Database;

  /**
   * The database's designs, in its own order.
   */
  designs: Design[];
}

/**
 * Renders a select per layout context for pinning one of the
 * database's designs as the context's default.
 */
const DefaultDesignsSection: React.FC<DefaultDesignsSectionProps> = ({
  database,
  designs,
}) => {
  // Pin the picked design as the context's default
  function handleValueChange(context: LayoutContext, designId: string) {
    Databases.setDefaultDesign(database.id, context, designId);
  }

  return (
    <Stack gap={2}>
      <Stack gap={1}>
        <Text
          size="sm"
          weight="medium"
          text="databases.design.defaultDesigns.title"
        />
        <Text
          block
          size="xs"
          color="muted"
          text="databases.design.defaultDesigns.description"
        />
      </Stack>
      <Stack gap={4}>
        {LAYOUT_CONTEXT_GROUPS.map((group) => (
          <Stack
            key={Databases.constants.LayoutContextBaseType[group[0]]}
            gap={2}
          >
            {group.map((context) => {
              // The designs of the context's base type
              const contextDesigns = designs.filter(
                (design) =>
                  design.type ===
                  Databases.constants.LayoutContextBaseType[context],
              );

              // Resolve the design the context renders with: the
              // pinned one, else the first of the base type.
              const value = Databases.resolveDesign(database.id, context)?.id;

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
                  {contextDesigns.length ? (
                    <Select
                      size="sm"
                      variant="subtle"
                      value={value}
                      onValueChange={(designId) =>
                        handleValueChange(context, designId)
                      }
                      options={contextDesigns.map(
                        (design): SelectOption<string> => ({
                          value: design.id,
                          stringLabel: design.name,
                        }),
                      )}
                    />
                  ) : (
                    <Text
                      size="sm"
                      color="muted"
                      text="databases.design.defaultDesigns.noCompatible"
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

interface EntryColorSectionProps {
  /**
   * The database being configured.
   */
  database: Database;
}

/**
 * Renders the entry color source select: the meta Color property,
 * or one of the database's select properties.
 */
const EntryColorSection: React.FC<EntryColorSectionProps> = ({ database }) => {
  // The database's select properties, offered as color sources
  const selectProperties = database.properties.filter(
    (property) => property.type === 'select',
  );

  // The meta Color property is always offered, even when the
  // database has not added it as an actual property.
  const options: SelectOption<string>[] = [
    { value: META_COLOR_VALUE, label: 'properties.color.name' },
    ...selectProperties.map((property) => ({
      value: property.name,
      stringLabel: property.name,
    })),
  ];

  // Assign the selected color source to the database
  function handleValueChange(value: string) {
    Databases.setColorProperty(
      database.id,
      value === META_COLOR_VALUE ? null : value,
    );
  }

  return (
    <Stack gap={2}>
      <Stack gap={1}>
        <Text
          size="sm"
          weight="medium"
          text="databases.design.entryColor.title"
        />
        <Text
          block
          size="xs"
          color="muted"
          text="databases.design.entryColor.description"
        />
      </Stack>
      <Group gap={2} className="database-design-panel-row">
        <Icon name="palette" color="muted" />
        <Text size="sm" text="databases.design.entryColor.label" />
        <Spacer />
        <Select
          size="sm"
          variant="subtle"
          value={database.colorProperty ?? META_COLOR_VALUE}
          onValueChange={handleValueChange}
          options={options}
        />
      </Group>
    </Stack>
  );
};
