import { Database } from '../../types';
import { objectDatabase } from './databases.fixtures';

// The object database with an explicit title property. It keeps the
// object database's ID, so it stands in for it with the object
// entries.
export const titledObjectDatabase: Database = {
  ...objectDatabase,
  properties: [{ type: 'title', name: 'Title' }, ...objectDatabase.properties],
};
