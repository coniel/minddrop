import { FileBasedPropertyType } from '@minddrop/properties';
import { CustomContentType } from './CustomContentType.types';

/**
 * The types of content added to databases from outside the app.
 */
export type ContentType = 'text' | 'url' | FileBasedPropertyType;

/**
 * The ID of the database that content of each type is added to. Null
 * when no database is set for the type.
 */
export type ContentTypeDatabaseIds = Record<ContentType, string | null>;

export interface DatabaseContentDefaults extends ContentTypeDatabaseIds {
  /**
   * The user-defined content types, in creation order. They take
   * priority over the built-in content types.
   */
  customTypes: CustomContentType[];
}
