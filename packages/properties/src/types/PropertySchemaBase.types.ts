import { PropertyType } from './Properties.types';

export interface PropertySchemaBase {
  /**
   * The property type.
   */
  type: PropertyType;

  /**
   * The property name. Also used as the key in the properties object.
   */
  name: string;

  /**
   * The property icon. Value depends on the icon type:
   * - `content-icon`: '[set-name]:[icon-name]:[color]'
   * - `emoji`: 'emoji:[emoji-character]:[skin-tone]'
   * - `asset`: 'asset:[asset-file-name]'
   */
  icon?: string;

  /**
   * Description of the property.
   */
  description?: string;

  /**
   * Indicates that this property is a meta data property, such as a created
   * or last-modified timestamp.
   *
   * Item types can only contain one property of each meta type. The value is
   * automatically managed by the system and cannot be modified directly.
   *
   * The name and icon of meta properties are not customizable.
   */
  meta?: boolean;

  /**
   * Indicates that this property is protected, i.e., it cannot be deleted
   * or modified by users.
   */
  protected?: boolean;
}
