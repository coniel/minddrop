import { ViewOpenMode } from '@minddrop/views';
import { PropertyFileStorage } from './Database.types';

export interface DatabaseDefaults {
  /**
   * The serializer used for entry files in new databases.
   */
  entrySerializer: string;

  /**
   * How new databases store property files on disk.
   */
  propertyFileStorage: PropertyFileStorage;

  /**
   * How entries of new databases open when clicked.
   */
  entryOpenMode: ViewOpenMode;
}
