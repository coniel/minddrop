import { Databases } from '@minddrop/databases';
import { DatabaseMenuItem } from '@minddrop/feature-databases';
import {
  EntityGroupItem,
  ProtectedEntityGroupProps,
} from '@minddrop/ui-entity-groups';

/**
 * Renders the databases group's contents: every database in the
 * workspace. Each one can be dragged into a user's group, which
 * copies it there rather than taking it out of here.
 */
export const DatabasesGroup: React.FC<ProtectedEntityGroupProps> = ({
  group,
}) => {
  const databases = Databases.useAll();

  return (
    <>
      {databases.map((database, index) => (
        <EntityGroupItem
          key={database.id}
          itemId={database.id}
          groupId={group.id}
          index={index}
        >
          <DatabaseMenuItem databaseId={database.id} />
        </EntityGroupItem>
      ))}
    </>
  );
};
