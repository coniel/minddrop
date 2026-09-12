import { Collections } from '@minddrop/collections';
import { DataViews } from '@minddrop/data-views';
import { Databases } from '@minddrop/databases';
import { Designs } from '@minddrop/designs';
import { Designs as DesignsNext } from '@minddrop/designs-next';
import { EntityGroups } from '@minddrop/entity-groups';
import { Queries } from '@minddrop/queries';
import { Search } from '@minddrop/search';
import { Spaces } from '@minddrop/spaces';
import { Sql } from '@minddrop/sql';
import { Tags } from '@minddrop/tags';
import { Workspace } from '@minddrop/workspaces';

/**
 * Loads a workspace's content into the content packages' store
 * records, connecting to its SQL database and search index.
 *
 * @param workspace - The workspace to load.
 */
export async function loadWorkspace(workspace: Workspace): Promise<void> {
  await Designs.loadWorkspace(workspace);
  await DesignsNext.loadWorkspace(workspace);

  // Connect to the workspace's SQL database, which the databases
  // backend opens.
  Sql.connect(workspace.id);

  // Load tags and tag groups before entries referencing them are
  // loaded.
  await Tags.loadWorkspace(workspace);

  const { schemaChanged } = await Databases.loadWorkspace(workspace);

  // Load persisted data views. Requires entries and the item
  // reference adapters, both loaded by Databases.loadWorkspace.
  await DataViews.loadWorkspace(workspace);

  // Load persisted collections. Requires entries and the item
  // reference adapters, both loaded by Databases.loadWorkspace.
  await Collections.loadWorkspace(workspace);

  // Load persisted queries
  await Queries.loadWorkspace(workspace);

  // Load persisted spaces
  await Spaces.loadWorkspace(workspace);

  // Load the entity groups of every registered type. Requires the
  // item reference adapters to resolve their members.
  await EntityGroups.loadWorkspace(workspace);

  // Load the workspace's search index
  await Search.loadWorkspace(workspace, { schemaChanged });
}
