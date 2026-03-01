import { Databases } from '@minddrop/databases';
import { DesignType, Designs } from '@minddrop/designs';
import { MenuGroup, MenuItem, MenuLabel } from '@minddrop/ui-primitives';

export interface DatabaseDesignsMenuProps
  extends React.HTMLProps<HTMLDivElement> {
  /**
   * The ID of the database to which the designs belong.
   */
  databaseId: string;
}

const DESIGN_TYPES: DesignType[] = ['page', 'card', 'list'];

const designTypeIconMap: Record<string, string> = {
  page: 'layout',
  card: 'layout-grid',
  list: 'layout-list',
};

/**
 * Renders a grouped list of designs that the database has
 * property mappings for.
 */
export const DatabaseDesignsMenu: React.FC<DatabaseDesignsMenuProps> = ({
  databaseId,
}) => {
  const databaseConfig = Databases.use(databaseId);
  const allDesigns = Designs.useAll();

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
            <MenuLabel label={`designs.${type}.name`} />
            {typeDesigns.map((design) => (
              <MenuItem
                key={design.id}
                icon={designTypeIconMap[design.type]}
                muted
              >
                {design.name}
              </MenuItem>
            ))}
          </MenuGroup>
        );
      })}
    </div>
  );
};
