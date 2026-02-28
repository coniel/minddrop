import { Databases } from '@minddrop/databases';
import { Events } from '@minddrop/events';
import { BrowseDesignsEvent } from '@minddrop/feature-design-property-mapping';
import { IconButton, MenuGroup, MenuLabel } from '@minddrop/ui-primitives';

export interface DatabaseDesignsMenuProps
  extends React.HTMLProps<HTMLDivElement> {
  /**
   * The ID of the database to which the designs belong.
   */
  databaseId: string;
}

export const DatabaseDesignsMenu: React.FC<DatabaseDesignsMenuProps> = ({
  databaseId,
}) => {
  const databaseConfig = Databases.use(databaseId);

  if (!databaseConfig) {
    return null;
  }

  // Dispatch the browse designs event to open the design browser overlay
  function handleAddDesign() {
    Events.dispatch(BrowseDesignsEvent, { databaseId });
  }

  return (
    <MenuGroup marginTop="large">
      <MenuLabel
        actionsAlwaysVisible
        label="labels.designs"
        actions={
          <IconButton
            size="sm"
            label="databases.actions.addDesign"
            icon="plus"
            onClick={handleAddDesign}
          />
        }
      />
    </MenuGroup>
  );
};
