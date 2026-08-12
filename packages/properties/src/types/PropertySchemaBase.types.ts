import { TranslationKey } from '@minddrop/i18n';
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
   */
  icon?: string;

  /**
   * Description of the property.
   */
  description?: string;

  /**
   * Placeholder text displayed in place of a missing value.
   */
  placeholder?: string;

  /**
   * Indicates that this property is a meta data property, such as a title,
   * created or last-modified timestamp.
   *
   * Item types can only contain one property of each meta type.
   */
  meta?: boolean;
}

/**
 * A property schema template with i18n translation keys as its name and
 * description. Used for the built-in property schema definitions.
 */
export type PropertySchemaTemplate<
  T extends PropertySchemaBase = PropertySchemaBase,
> = Omit<T, 'name' | 'description'> & {
  name: TranslationKey;
  description?: TranslationKey;
};
