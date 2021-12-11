import { serializeResouceDocument } from '../serializeResouceDocument';
import { getAllDocs } from '../getAllDocs';
import { ResourceDB } from '../types';
import { DBApi } from '../types';

export function initializePouchDB(db: ResourceDB): DBApi {
  return {
    getAllDocs: () => getAllDocs(db),
    add: async (type, doc) => {
      await db.put(serializeResouceDocument(doc, type));
    },
    update: async (id, changes) => {
      const item = await db.get(id);
      await db.put({
        ...item,
        ...changes,
      });
    },
    delete: async (id) => {
      const item = await db.get(id);
      await db.put({
        ...item,
        _deleted: true,
      });
    },
  };
}
