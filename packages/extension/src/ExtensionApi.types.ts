import { ExtensionAppApi } from './ExtensionAppApi.types';
import { Topic } from '@minddrop/topic';

export interface ExtensionApi {
  /**
   * The main extension method, called when the app starts
   * up. Use this method to set up event listeners.
   */
  onRun: (app: ExtensionAppApi) => void;

  /**
   * Called once when the extension is installed.
   * Directly followed by a call to `onActivate`.
   */
  onInstall: (app: ExtensionAppApi) => Promise<void>;

  /**
   * Called once when the extension is activated
   * globally. Called directly after `onInstall`, but can
   * also be called independently at a later stage if the
   * extension was temporarily disabled.
   */
  onActivate: (app: ExtensionAppApi) => Promise<void>;

  /**
   * Called once when the extension has been
   * updated to a new version.
   */
  onUpdate: (app: ExtensionAppApi) => void;

  /**
   * Called once when the extension is deactivated
   * globally. Called directly before `onUninstall`, but
   * can also be called independently if the user disables
   * the extension without uninstalling it.
   */
  onDeactivate: (app: ExtensionAppApi) => Promise<void>;

  /**
   * Called once when the extension is uninstalled.
   * Use to clean up any data stored by your extension.
   * Always preceeded by a call to `onDeactivate`.
   */
  onUninstall: (app: ExtensionAppApi) => Promise<void>;

  /**
   * Called once when the extension is activaed for
   * a given topic.
   */
  onTopicActivate: (app: ExtensionAppApi, topic: Topic) => Promise<void>;

  /**
   * Called once when the extension is deactivaed for
   * a given topic.
   */
  onTopicDeactivate: (app: ExtensionAppApi, topic: Topic) => Promise<void>;
}
