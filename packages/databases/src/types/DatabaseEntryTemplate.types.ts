import { PropertyMap } from '@minddrop/properties';
import { EntityId } from '@minddrop/utils';

export type DatabaseEntryTemplateId = EntityId<'database-entry-template'>;

export interface DatabaseEntryTemplate {
  /**
   * A unique identifier for the template.
   */
  id: DatabaseEntryTemplateId;

  /**
   * Display name shown in the configuration panel and entry
   * creation menus.
   */
  name: string;

  /**
   * Optional default title applied to entries created from the
   * template. Falls back to the localised untitled title.
   */
  defaultTitle?: string;

  /**
   * The pre-filled property values. Only properties with a value are
   * stored. File based property values are the names of files stored
   * in the template's directory inside the database's hidden dir.
   */
  properties: PropertyMap;
}

export type DatabaseEntryTemplateData = Omit<DatabaseEntryTemplate, 'id'>;

export type UpdateDatabaseEntryTemplateData =
  Partial<DatabaseEntryTemplateData>;
