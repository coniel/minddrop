import { Databases } from '@minddrop/databases';
import { MenuGroup, MenuLabel } from '@minddrop/ui-primitives';
import { DatabaseDesignTypeSelectionMenu } from '../DatabaseDesignTypeSelectionMenu';

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

  return (
    <MenuGroup marginTop="large">
      <MenuLabel
        actionsAlwaysVisible
        label="labels.designs"
        actions={<DatabaseDesignTypeSelectionMenu databaseId={databaseId} />}
      />
    </MenuGroup>
  );
};
