import { useCallback } from 'react';
import { Databases } from '@minddrop/databases';
import { Design, DesignType, Designs } from '@minddrop/designs';
import { Events } from '@minddrop/events';
import {
  OpenPropertyMapperEvent,
  OpenPropertyMapperEventData,
} from '@minddrop/feature-designs';
import { createI18nKeyBuilder } from '@minddrop/i18n';
import { UiIconName } from '@minddrop/ui-icons';
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownMenuTrigger,
  IconButton,
  MenuGroup,
  MenuItem,
  MenuItemDropdownMenu,
  MenuLabel,
} from '@minddrop/ui-primitives';

const designTypeI18nKey = createI18nKeyBuilder('designs.');

export interface DatabaseDesignsMenuProps
  extends React.HTMLProps<HTMLDivElement> {
  /**
   * The ID of the database to which the designs belong.
   */
  databaseId: string;
}

const DESIGN_TYPES: DesignType[] = ['page', 'card', 'list'];

const designTypeIconMap: Record<string, UiIconName> = {
  page: 'layout',
  card: 'layout-grid',
  list: 'layout-list',
};

/**
 * Renders a grouped list of designs that the database has
 * property mappings for, with per-item options to set as
 * default or remove.
 */
export const DatabaseDesignsMenu: React.FC<DatabaseDesignsMenuProps> = ({
  databaseId,
}) => {
  const databaseConfig = Databases.use(databaseId);
  const allDesigns = Designs.useAll();

  // Sets the design as the default for its type on this database
  const handleSetAsDefault = useCallback(
    (design: Design) => {
      if (!databaseConfig) {
        return;
      }

      Databases.update(databaseId, {
        defaultDesigns: {
          ...databaseConfig.defaultDesigns,
          [design.type]: design.id,
        },
      });
    },
    [databaseId, databaseConfig],
  );

  // Removes the design's property map from this database
  const handleRemove = useCallback(
    (designId: string) => {
      Databases.removeDesignPropertyMap(databaseId, designId);
    },
    [databaseId],
  );

  // Opens the property mapping tool for the given design
  const handleOpenMapper = useCallback(
    (designId: string) => {
      Events.dispatch<OpenPropertyMapperEventData>(OpenPropertyMapperEvent, {
        databaseId,
        designId,
      });
    },
    [databaseId],
  );

  if (!databaseConfig) {
    return null;
  }

  // Get the design IDs that the database has property mappings for
  const mappedDesignIds = Object.keys(databaseConfig.designPropertyMaps);

  // Filter designs to only those with mappings in this database
  const mappedDesigns = allDesigns.filter((design) =>
    mappedDesignIds.includes(design.id),
  );

  return (
    <div>
      {DESIGN_TYPES.map((type) => {
        // Filter mapped designs by type
        const typeDesigns = mappedDesigns.filter(
          (design) => design.type === type,
        );

        if (!typeDesigns.length) {
          return null;
        }

        return (
          <MenuGroup key={type}>
            <MenuLabel label={designTypeI18nKey(type, 'name')} />
            {typeDesigns.map((design) => {
              // Check if this design is the current default for its type
              const isDefault =
                databaseConfig.defaultDesigns[design.type] === design.id;

              return (
                <MenuItem
                  key={design.id}
                  icon={isDefault ? 'star' : designTypeIconMap[design.type]}
                  muted
                  onClick={() => handleOpenMapper(design.id)}
                  actions={
                    <DesignItemActions
                      design={design}
                      isDefault={isDefault}
                      onSetAsDefault={handleSetAsDefault}
                      onRemove={handleRemove}
                    />
                  }
                >
                  {design.name}
                </MenuItem>
              );
            })}
          </MenuGroup>
        );
      })}
    </div>
  );
};

interface DesignItemActionsProps {
  /**
   * The design this actions menu belongs to.
   */
  design: Design;

  /**
   * Whether this design is the current default for its type.
   */
  isDefault: boolean;

  /**
   * Callback to set this design as the default.
   */
  onSetAsDefault: (design: Design) => void;

  /**
   * Callback to remove this design from the database.
   */
  onRemove: (designId: string) => void;
}

/**
 * Renders the dropdown options menu for a design menu item.
 */
function DesignItemActions({
  design,
  isDefault,
  onSetAsDefault,
  onRemove,
}: DesignItemActionsProps) {
  return (
    <MenuItemDropdownMenu>
      <DropdownMenuTrigger>
        <IconButton
          size="sm"
          icon="more-horizontal"
          label="databases.designs.actions.manage"
        />
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuPositioner side="bottom" align="start">
          <DropdownMenuContent>
            <MenuGroup>
              <DropdownMenuItem
                icon="star"
                label="databases.designs.actions.setAsDefault"
                disabled={isDefault}
                onClick={() => onSetAsDefault(design)}
              />
              <DropdownMenuItem
                icon="x"
                label="databases.designs.actions.remove"
                danger
                onClick={() => onRemove(design.id)}
              />
            </MenuGroup>
          </DropdownMenuContent>
        </DropdownMenuPositioner>
      </DropdownMenuPortal>
    </MenuItemDropdownMenu>
  );
}
