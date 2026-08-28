import { TranslationKey } from '@minddrop/i18n';
import { UiIconName } from '@minddrop/ui-icons';

export interface SettingsView {
  /**
   * Unique identifier of the settings view.
   */
  id: string;

  /**
   * The i18n key of the view's settings sidebar menu item label,
   * also used as its page title.
   */
  label: TranslationKey;

  /**
   * The i18n key of the view's description, shown below its
   * page title.
   */
  description: TranslationKey;

  /**
   * Icon of the view's settings sidebar menu item.
   */
  icon: UiIconName;

  /**
   * The component rendering the view's settings content.
   */
  component: React.ComponentType;
}
