import { vi } from 'vitest';
import { DesignElementConfigs } from '@minddrop/designs-next';
import {
  MockFs,
  locales,
  testElementConfig,
} from '@minddrop/designs-next/test-utils';
import { I18n } from '@minddrop/i18n';
import { cleanup as cleanupRender } from '@minddrop/test-utils';
import { setupWorkspaceFixtures } from '@minddrop/workspaces/test-utils';

// Register the design translations. Runs after the imports above, so
// it lands after the i18n initialization in @minddrop/test-utils
// which resets the resource bundles.
I18n.registerTranslations(locales);

// Register the box config so fixture elements resolve a renderer
DesignElementConfigs.register(testElementConfig);

// Load the workspace the design files are written into
setupWorkspaceFixtures(MockFs);

export function cleanup() {
  cleanupRender();
  vi.clearAllMocks();
}
