import { vi } from 'vitest';
import { locales } from '@minddrop/designs-next/test-utils';
import { I18n } from '@minddrop/i18n';
import { cleanup as cleanupRender } from '@minddrop/test-utils';
import { locales as featureLocales } from './locales';

// Register the design translations
I18n.registerTranslations(locales);
I18n.registerTranslations(featureLocales);

export function cleanup() {
  cleanupRender();
  vi.clearAllMocks();
}
