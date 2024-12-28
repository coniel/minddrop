import { Locales } from '../../../i18n/src';
import { MindDropApi } from './MindDropApi.types';

export interface MindDropExtension {
  /**
   * A unique identifier for the extension.
   */
  id: string;

  /**
   * Initializes the extension. Called on application startup.
   */
  initialize: (api: MindDropApi) => Promise<void>;

  /**
   * Optional cleanup method called when the extension is diasabled
   * but not removed from the application.
   */
  onDisable?: (api: MindDropApi) => Promise<void>;

  /**
   * Optional cleanup method called when the extension is removed
   * from the application.
   *
   * The `onDisable` callback will be called before this one, so this
   * callback only needs to handle cleanup that is specific to the
   * extension being removed.
   */
  onRemove?: (api: MindDropApi) => Promise<void>;

  /**
   * Optional translations for text appearing in the extension's UI.
   *
   * Translations will be namespaced under the extension's ID when
   * loaded into the application. When using translations, add the
   * extension's ID as a prefix to the translation key:
   *
   * `t('extensionId.key')`
   *
   * The translation object should be in the format:
   *
   * {
   *   "en-GB": {
   *     "key": "Translation",
   *     "nested": {
   *       "key": "Nested translation"
   *     }
   *   },
   *   "en-US": ...
   *   "fr-FR": ...
   * }
   */
  locales?: Locales;
}
