import { FC } from 'react';
import { TranslationKey } from '@minddrop/i18n';
import { UiIconName } from '@minddrop/ui-icons';

/**
 * A panel registered into the dev tools shell.
 */
export interface DevToolsPanelConfig {
  /**
   * Unique identifier of the panel.
   */
  id: string;

  /**
   * Translation key of the panel's label, used as the
   * panel tab's tooltip and in the shortcuts help.
   */
  label: TranslationKey;

  /**
   * Icon rendered in the panel's tab.
   */
  icon: UiIconName;

  /**
   * Single character key which opens the panel when pressed
   * without modifiers, and closes the dev tools when the panel
   * is already active.
   *
   * Keys reserved by the shell are ignored.
   */
  shortcut?: string;

  /**
   * The panel's content, rendered in the dev tools body while
   * the panel is active. Wrap the content in DevToolsPanelLayout
   * to render a panel sidebar alongside it.
   */
  component: FC;
}
