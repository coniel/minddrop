import { vi } from 'vitest';
import { locales } from '@minddrop/designs-next/test-utils';
import { I18n } from '@minddrop/i18n';
import { cleanup as cleanupRender } from '@minddrop/test-utils';

// Register the design translations. Runs after the imports above, so
// it lands after the i18n initialization in @minddrop/test-utils
// which resets the resource bundles.
I18n.registerTranslations(locales);

export function cleanup() {
  cleanupRender();
  vi.clearAllMocks();
}
