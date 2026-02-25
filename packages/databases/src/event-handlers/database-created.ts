import { Views } from '@minddrop/views';
import { DatabaseCreatedEventData } from '../events';

export function onCreateDatabase(data: DatabaseCreatedEventData) {
  // Create a new view for the database
  Views.create('table', {
    type: 'database',
    id: data.id,
  });
}
