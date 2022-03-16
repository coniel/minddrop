import { Core } from '@minddrop/core';
import { TopicMap } from '@minddrop/topics';

export interface ExtensionConfig {
  /**
   * The extension ID.
   */
  id: string;

  /**
   * The extension's name as displayed to users.
   */
  name: string;

  /**
   * A short description of the extension which will be displayed
   * to users.
   */
  description: string;

  /**
   * The scopes of the extension:
   * - `app`: the extension provides app wide functionality
   * - `topic`: the extension provides topic specific functionality
   */
  scopes: ('app' | 'topic')[];

  /**
   * The main extension method, called when the app starts
   * up. Use this method to set up event listeners.
   */
  onRun(core: Core): void;

  /**
   * Called once when the extesion is installed.
   * Directly followed by a call to `onEnable`.
   */
  onInstall?(core: Core): void | Promise<void>;

  /**
   * Called once when the extension is enabled
   * globally. Called directly after `onInstall`, but can
   * also be called independently at a later stage if the
   * extension was temporarily disabled.
   */
  onEnable?(core: Core): void | Promise<void>;

  /**
   * Called when the extension is enabled on given topics.
   *
   * @param core A MindDrop core instance.
   * @param topics The topics for which the extension was enabled.
   */
  onEnableTopics?(core: Core, topics: TopicMap): void | Promise<void>;

  /**
   * Called once when the extension has been
   * updated to a new version.
   */
  onUpdate?(core: Core): void | void;

  /**
   * Called once when the extension is disabled
   * globally. Called directly before `onUninstall`, but
   * can also be called independently if the user disables
   * the extension without uninstalling it.
   */
  onDisable?(core: Core): void | Promise<void>;

  /**
   * Called when the extension is disabled on given topics.
   *
   * @param core A MindDrop core instance.
   * @param topics The topics for which the extension was disabled.
   */
  onDisableTopics?(core: Core, topics: TopicMap): void | Promise<void>;

  /**
   * Called once when the extension is uninstalled.
   * Use to clean up any data stored by your extension.
   * Always preceeded by a call to `onDisable`.
   */
  onUninstall?(core: Core): void | Promise<void>;
}
