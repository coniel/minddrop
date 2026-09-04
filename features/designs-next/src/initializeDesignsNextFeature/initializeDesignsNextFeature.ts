import { BoxElementType, registerElementType } from '@minddrop/designs-next';
import { I18n } from '@minddrop/i18n';
import { registerElementRenderer } from '@minddrop/ui-designs-next';
import {
  BoxElementConfig,
  BoxElementRenderer,
  HeadingElementConfig,
  HeadingElementRenderer,
  HeadingElementType,
  TextElementConfig,
  TextElementRenderer,
  TextElementType,
} from '../elements';
import { locales } from '../locales';

/**
 * Initializes the designs feature: registers the feature's
 * translations and the built-in design elements.
 */
export function initializeDesignsNextFeature(): void {
  // Register the feature's translations
  I18n.registerTranslations(locales);

  // Register the built-in element configs and renderers
  registerElementType(BoxElementConfig);
  registerElementRenderer(BoxElementType, BoxElementRenderer);
  registerElementType(HeadingElementConfig);
  registerElementRenderer(HeadingElementType, HeadingElementRenderer);
  registerElementType(TextElementConfig);
  registerElementRenderer(TextElementType, TextElementRenderer);
}
