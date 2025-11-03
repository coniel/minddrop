import { UiIconName } from '@minddrop/icons';
import { PropertyType } from './Properties.types';

export interface PropertyTypeConfig {
  /**
   * The property type.
   */
  type: PropertyType;

  /**
   * The property type display name, also used as the default name when
   * creating new properties of this type.
   */
  name: string;

  /**
   * The property type icon, also used as the default icon when creating new
   * properties of this type.
   */
  icon: UiIconName;

  /**
   * The property type description.
   */
  description: string;

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
}
