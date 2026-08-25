import { I18n, initializeI18n } from '@minddrop/i18n';
import { Icons } from '@minddrop/ui-icons';
import { initializeInputModalityTracking } from '@minddrop/ui-primitives';
import { Workspaces } from '@minddrop/workspaces';
import { locales } from '../locales';

// The onboarding app runs in its own window, rendered before any
// workspace exists. It initializes only what the workspace setup
// screens need, leaving the rest to the main app window.

// In development mode, React runs effects twice on first load, so
// initializeOnboardingApp may be called more than once. Memoizing
// the in-flight promise ensures initialization runs once and every
// caller awaits the same completion.
let initPromise: Promise<void> | null = null;

// Initialize internationalization
initializeI18n();

/**
 * Initializes the onboarding app.
 */
export function initializeOnboardingApp(): Promise<void> {
  if (!initPromise) {
    initPromise = runInitialization();
  }

  return initPromise;
}

/**
 * Runs the one-time onboarding app initialization.
 */
async function runInitialization(): Promise<void> {
  // Register onboarding translations
  I18n.registerTranslations(locales);

  // Track whether the user is navigating by keyboard or pointer
  initializeInputModalityTracking();

  // Register the content icon sets, which load on first use
  Icons.initialize();

  // Load any workspaces still listed in the workspaces config, so that
  // adding a workspace does not drop them from the config file
  await Workspaces.initialize();
}
