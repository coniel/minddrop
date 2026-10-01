import { DesignElementConfigs } from '@minddrop/designs-next';
import { I18n } from '@minddrop/i18n';
import { PdfElementConfig } from '../elements';
import { locales } from '../locales';

/**
 * Initializes the PDF feature.
 */
export function initializePdfFeature(): void {
  // Register the feature's translations
  I18n.registerTranslations(locales);

  // Register the PDF design element
  DesignElementConfigs.register(PdfElementConfig);
}
