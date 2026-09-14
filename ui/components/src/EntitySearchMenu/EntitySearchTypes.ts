import { Collection, Collections } from '@minddrop/collections';
import { DataView, DataViews } from '@minddrop/data-views';
import {
  Database,
  DatabaseEntries,
  DatabaseEntry,
  Databases,
} from '@minddrop/databases';
import { Queries, Query } from '@minddrop/queries';
import { Space, Spaces } from '@minddrop/spaces';
import { Tag, Tags } from '@minddrop/tags';

export interface EntitySearchOption {
  /**
   * The entity's ID.
   */
  id: string;

  /**
   * The name the entity is listed under.
   */
  label: string;

  /**
   * The stringified content icon shown beside the name.
   */
  icon?: string;

  /**
   * The date the entity is ranked by when nothing has been
   * searched for, which is when it was created for everything but
   * an entry, whose file is what changes.
   */
  recency: Date;
}

export interface EntitySearchTypeConfig {
  /**
   * The entity type the config lists, matching the type prefix of
   * its entities' IDs.
   */
  type: string;

  /**
   * Returns the type's most recent entities, newest first.
   */
  getRecent: (limit: number) => EntitySearchOption[];

  /**
   * Returns the type's entities matching the query.
   */
  search: (query: string) => EntitySearchOption[];
}

/**
 * The entity types the search menu can list, each saying how its
 * entities are found and how they read as an option.
 */
export const EntitySearchTypes: EntitySearchTypeConfig[] = [
  {
    type: Databases.constants.EntityType,
    getRecent: (limit) => Databases.getRecent(limit).map(toDatabaseOption),
    search: (query) => Databases.search(query).map(toDatabaseOption),
  },
  {
    type: DatabaseEntries.constants.EntityType,
    getRecent: (limit) => DatabaseEntries.getRecent(limit).map(toEntryOption),
    search: (query) => DatabaseEntries.searchByTitle(query).map(toEntryOption),
  },
  {
    type: DataViews.constants.EntityType,
    getRecent: (limit) => DataViews.getRecent(limit).map(toDataViewOption),
    search: (query) =>
      DataViews.search(query).filter(isPersisted).map(toDataViewOption),
  },
  {
    type: Spaces.constants.EntityType,
    getRecent: (limit) => Spaces.getRecent(limit).map(toSpaceOption),
    search: (query) => Spaces.search(query).map(toSpaceOption),
  },
  {
    type: Collections.constants.EntityType,
    getRecent: (limit) =>
      Collections.getRecent(limit).filter(isPersisted).map(toCollectionOption),
    search: (query) =>
      Collections.search(query).filter(isPersisted).map(toCollectionOption),
  },
  {
    type: Queries.constants.EntityType,
    getRecent: (limit) => Queries.getRecent(limit).map(toQueryOption),
    search: (query) => Queries.search(query).map(toQueryOption),
  },
  {
    type: Tags.constants.EntityType,
    getRecent: (limit) => Tags.getRecent(limit).map(toTagOption),
    search: (query) => Tags.search(query).map(toTagOption),
  },
];

/**
 * Whether the entity is one the workspace holds. A virtual one
 * belongs to whatever made it, so it is not offered.
 */
function isPersisted(entity: DataView | Collection): boolean {
  return !entity.virtual;
}

function toDatabaseOption(database: Database): EntitySearchOption {
  return {
    id: database.id,
    label: database.name,
    icon: database.icon,
    recency: database.created,
  };
}

/**
 * Entries take their database's icon, as they do wherever they are
 * listed, and rank by when they were last changed.
 */
function toEntryOption(entry: DatabaseEntry): EntitySearchOption {
  return {
    id: entry.id,
    label: entry.title,
    icon: Databases.get(entry.database, false)?.icon,
    recency: entry.lastModified,
  };
}

function toDataViewOption(dataView: DataView): EntitySearchOption {
  return {
    id: dataView.id,
    label: dataView.name,
    icon: dataView.icon,
    recency: dataView.created,
  };
}

function toSpaceOption(space: Space): EntitySearchOption {
  return {
    id: space.id,
    label: space.name,
    icon: space.icon,
    recency: space.created,
  };
}

/**
 * Collections and queries have no icon of their own, so they take
 * their type's default.
 */
function toCollectionOption(collection: Collection): EntitySearchOption {
  return {
    id: collection.id,
    label: collection.name,
    icon: Collections.constants.EntityDefaultIcon,
    recency: collection.created,
  };
}

function toQueryOption(query: Query): EntitySearchOption {
  return {
    id: query.id,
    label: query.name,
    icon: Queries.constants.EntityDefaultIcon,
    recency: query.created,
  };
}

function toTagOption(tag: Tag): EntitySearchOption {
  return {
    id: tag.id,
    label: tag.name,
    icon: tag.icon,
    recency: tag.created,
  };
}
