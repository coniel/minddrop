import { groupDocsByResourceType } from '../groupDocsByResourceType';
import { GroupedResources, ResourceDB } from '../types';

/**
 * Retrieves all documents from a PouchDB database
 * and returns them deserialized and group by resource type.
 *
 * @param db A PouchDB database cotaining DBResourceDocuemnts.
 * @returns A promise which resolves to deserialized resource documents grouped by resource type.
 */
export async function getAllDocs(db: ResourceDB): Promise<GroupedResources> {
  const allDocs = await db.allDocs({ include_docs: true });

  const docs = allDocs.rows.map((row) => row.doc);

  return groupDocsByResourceType(docs);
}
