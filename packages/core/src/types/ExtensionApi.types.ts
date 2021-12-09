import { Core } from './Core.types';

export interface ExtensionApi {
  /**
   * The main extension method, called when the app starts
   * up. Use this method to set up event listeners.
   */
  onRun: (core: Core) => void;

  /**
   * Called once when the extesion is installed.
   * Directly followed by a call to `onActivate`.
   */
  onInstall: (core: Core) => Promise<void>;

  /**
   * Called once when the extension is activated
   * globally. Called directly after `onInstall`, but can
   * also be called independently at a later stage if the
   * extension was temporarily disabled.
   */
  onActivate: (core: Core) => Promise<void>;

  /**
   * Called once when the extension has been
   * updated to a new version.
   */
  onUpdate: (core: Core) => void;

  /**
   * Called once when the extension is deactivated
   * globally. Called directly before `onUninstall`, but
   * can also be called independently if the user disables
   * the extension without uninstalling it.
   */
  onDeactivate: (core: Core) => Promise<void>;

  /**
   * Called once when the extension is uninstalled.
   * Use to clean up any data stored by your extension.
   * Always preceeded by a call to `onDeactivate`.
   */
  onUninstall: (core: Core) => Promise<void>;
}
