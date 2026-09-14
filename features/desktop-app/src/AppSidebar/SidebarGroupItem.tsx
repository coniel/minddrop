import { Collections } from '@minddrop/collections';
import { DataViews } from '@minddrop/data-views';
import { DatabaseEntries, Databases } from '@minddrop/databases';
import { CollectionMenuItem } from '@minddrop/feature-collections';
import { DataViewMenuItem } from '@minddrop/feature-data-views';
import {
  DatabaseEntryMenuItem,
  DatabaseMenuItem,
} from '@minddrop/feature-databases';
import { QueryMenuItem } from '@minddrop/feature-queries';
import { SpaceMenuItem } from '@minddrop/feature-spaces';
import { TagMenuItem } from '@minddrop/feature-tags';
import { Queries } from '@minddrop/queries';
import { Spaces } from '@minddrop/spaces';
import { Tags } from '@minddrop/tags';
import { useEntityGroupItemMenu } from '@minddrop/ui-entity-groups';
import { entityIdType } from '@minddrop/utils';

export interface SidebarGroupItemProps {
  /**
   * The ID of the entity the item points to.
   */
  itemId: string;
}

/**
 * Renders an item listed in a sidebar group as the menu item its
 * entity type calls for, carrying the group actions in its menu.
 */
export const SidebarGroupItem: React.FC<SidebarGroupItemProps> = ({
  itemId,
}) => {
  const { menu, popovers } = useEntityGroupItemMenu();

  const type = entityIdType(itemId);

  if (type === Databases.constants.EntityType) {
    return (
      <DatabaseMenuItem databaseId={itemId} menu={menu} popovers={popovers} />
    );
  }

  if (type === DatabaseEntries.constants.EntityType) {
    return (
      <DatabaseEntryMenuItem entryId={itemId} menu={menu} popovers={popovers} />
    );
  }

  if (type === DataViews.constants.EntityType) {
    return (
      <DataViewMenuItem dataViewId={itemId} menu={menu} popovers={popovers} />
    );
  }

  if (type === Spaces.constants.EntityType) {
    return <SpaceMenuItem spaceId={itemId} menu={menu} popovers={popovers} />;
  }

  if (type === Collections.constants.EntityType) {
    return (
      <CollectionMenuItem
        collectionId={itemId}
        menu={menu}
        popovers={popovers}
      />
    );
  }

  if (type === Queries.constants.EntityType) {
    return <QueryMenuItem queryId={itemId} menu={menu} popovers={popovers} />;
  }

  if (type === Tags.constants.EntityType) {
    return <TagMenuItem tagId={itemId} menu={menu} popovers={popovers} />;
  }

  return null;
};
