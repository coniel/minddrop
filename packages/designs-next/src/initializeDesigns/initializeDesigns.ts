import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { I18n } from '@minddrop/i18n';
import { onFileSystemChanged } from '../event-handlers';
import { locales } from '../locales';

/**
 * Initializes the designs package.
 */
export function initializeDesigns(): void {
  // Register the translations
  I18n.registerTranslations(locales);

  // Apply changes made to design files outside of the app
  Events.on(Fs.events.Changed, 'designs-next', (data) =>
    onFileSystemChanged(data),
  );
}
