import { vi } from 'vitest';
import { BoxElementType } from '@minddrop/designs-next';
import { locales } from '@minddrop/designs-next/test-utils';
import { I18n } from '@minddrop/i18n';
import { cleanup as cleanupRender } from '@minddrop/test-utils';
import { registerElementRenderer } from './registerElementRenderer';
import { DesignElementComponent } from './types';

// Register the design translations. Runs after the imports above, so
// it lands after the i18n initialization in @minddrop/test-utils
// which resets the resource bundles.
I18n.registerTranslations(locales);

// Stand-in renderer for the box elements used in fixtures
const TestBoxElement: DesignElementComponent = () => null;

registerElementRenderer(BoxElementType, TestBoxElement);

export function cleanup() {
  cleanupRender();
  vi.clearAllMocks();
}
