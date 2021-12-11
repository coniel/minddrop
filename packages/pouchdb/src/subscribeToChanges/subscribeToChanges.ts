import { deserializeResourceDocument } from '../deserializeResourceDocument';
import {
  DBResourceDocument,
  ResourceChangeHandler,
  ResourceDB,
} from '../types';

export async function subscribeToChanges(
  db: ResourceDB,
  onChange: ResourceChangeHandler,
) {
  db.changes<DBResourceDocument>({
    since: 'now',
    live: true,
    include_docs: true,
  }).on('change', (change) => {
    const { doc } = change;
    const cleanedDoc = deserializeResourceDocument(doc);

    onChange(doc.resourceType, cleanedDoc, !!change.deleted);
  });
}
