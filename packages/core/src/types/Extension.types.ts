import { App } from './App.type';
import { Topic } from './Topic.types';

export interface Extension {
  /**
   * The main extension method, called when the app starts
   * up. Use this method to set up event listeners.
   */
  onRun: (app: App) => void;

  /**
   * Called once when the extension is installed.
   * Directly followed by a call to `onActivate`.
   */
  onInstall: (app: App) => Promise<void>;

  /**
   * Called once when the extension is activated
   * globally. Called directly after `onInstall`, but can
   * also be called independently at a later stage if the
   * extension was temporarily disabled.
   */
  onActivate: (app: App) => Promise<void>;

  /**
   * Called once when the extension has been
   * updated to a new version.
   */
  onUpdate: (app: App) => void;

  /**
   * Called once when the extension is deactivated
   * globally. Called directly before `onUninstall`, but
   * can also be called independently if the user disables
   * the extension without uninstalling it.
   */
  onDeactivate: (app: App) => Promise<void>;

  /**
   * Called once when the extension is uninstalled.
   * Use to clean up any data stored by your extension.
   * Always preceeded by a call to `onDeactivate`.
   */
  onUninstall: (app: App) => Promise<void>;

  /**
   * Called once when the extension is activaed for
   * a given topic.
   */
  onTopicActivate: (app: App, topic: Topic) => Promise<void>;

  /**
   * Called once when the extension is deactivaed for
   * a given topic.
   */
  onTopicDeactivate: (app: App, topic: Topic) => Promise<void>;
}
