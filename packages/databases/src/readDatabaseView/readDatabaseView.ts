import {
  ContentViews,
  StoredContentView,
  VirtualContentViewData,
} from '@minddrop/content-views';
import { Fs } from '@minddrop/file-system';
import { DatabaseFileReadResult, DatabaseId } from '../types';

/**
 * Reads a database-owned view from its file, with the database
 * attached as its data source and owner.
 *
 * @param path - The path to the view file.
 * @param databaseId - The ID of the database owning the view.
 * @param workspaceId - The workspace to resolve the view's references in.
 * @returns The view, or whether its file is missing or cannot be read.
 */
export async function readDatabaseView(
  path: string,
  databaseId: DatabaseId,
  workspaceId: string,
): Promise<DatabaseFileReadResult<StoredContentView & VirtualContentViewData>> {
  // Check the view file exists
  if (!(await Fs.exists(path))) {
    return { status: 'missing' };
  }

  // View as read from the file
  let storedView: StoredContentView;

  try {
    // Read the view file
    const contents = await Fs.readJsonFile(path);

    // Report a file which is not a view as unreadable
    if (!ContentViews.isStored(contents)) {
      return { status: 'unreadable' };
    }

    // Restore the view's dates and resolve its config references
    storedView = ContentViews.deserialize(contents, workspaceId);
  } catch {
    // Report a file which is not valid JSON as unreadable
    return { status: 'unreadable' };
  }

  // Attach the database to the view
  return {
    status: 'read',
    value: {
      // The view as stored
      ...storedView,
      // The database as the view's data source
      dataSource: { type: 'database', id: databaseId },
      // The database as the view's owner
      owner: databaseId,
    },
  };
}
