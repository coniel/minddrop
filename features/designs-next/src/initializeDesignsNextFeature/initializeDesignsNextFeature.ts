import { DesignElementConfigs } from '@minddrop/designs-next';
import { I18n } from '@minddrop/i18n';
import {
  BoxElementConfig,
  HeadingElementConfig,
  TextElementConfig,
} from '../elements';
import { locales } from '../locales';

/**
 * Initializes the designs feature: registers the feature's
 * translations and the built-in design elements.
 */
export function initializeDesignsNextFeature(): void {
  // Register the feature's translations
  I18n.registerTranslations(locales);

  // Register the built-in element configs
  DesignElementConfigs.register(BoxElementConfig);
  DesignElementConfigs.register(HeadingElementConfig);
  DesignElementConfigs.register(TextElementConfig);
}
