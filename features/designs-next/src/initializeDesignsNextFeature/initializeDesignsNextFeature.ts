import { DesignElementConfigs, Designs } from '@minddrop/designs-next';
import { I18n } from '@minddrop/i18n';
import { ElementsPalette } from '@minddrop/ui-designs-next';
import { Views } from '@minddrop/views';
import {
  BoxElementConfig,
  HeadingElementConfig,
  TextElementConfig,
} from '../elements';
import { locales } from '../locales';

/**
 * Initializes the designs feature: registers the feature's
 * translations, the elements palette sidebar and the built-in design
 * elements.
 */
export function initializeDesignsNextFeature(): void {
  // Register the feature's translations
  I18n.registerTranslations(locales);

  // Register the sidebar fill shown while editing a design
  Views.registerFill('sidebar', {
    id: Designs.constants.ElementsPaletteSidebarId,
    component: ElementsPalette,
  });

  // Register the built-in element configs
  DesignElementConfigs.register(BoxElementConfig);
  DesignElementConfigs.register(HeadingElementConfig);
  DesignElementConfigs.register(TextElementConfig);
}
