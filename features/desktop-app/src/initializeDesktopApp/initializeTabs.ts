import { I18n } from '@minddrop/i18n';
import { Tabs } from '../Tabs';
import { locales } from '../locales';

/**
 * Initializes tab support: registers translations and global
 * keyboard shortcuts.
 */
export function initializeTabs(): void {
  I18n.registerTranslations(locales);

  window.addEventListener('keydown', handleKeyDown);
}

/**
 * Handles tab keyboard shortcuts: new tab (mod+t), close tab (mod+w)
 * and activate the Nth tab (mod+1-9).
 */
function handleKeyDown(event: KeyboardEvent): void {
  if (!event.metaKey && !event.ctrlKey) {
    return;
  }

  if (event.key === 't') {
    event.preventDefault();
    Tabs.newTab();

    return;
  }

  if (event.key === 'w') {
    event.preventDefault();
    Tabs.closeActiveTab();

    return;
  }

  const digit = Number(event.key);

  if (Number.isInteger(digit) && digit >= 1 && digit <= 9) {
    event.preventDefault();
    Tabs.activateTabByIndex(digit - 1);
  }
}
