import { UiExtension } from './UiExtension.types';

export interface AppStore {
  /**
   * The IDs of the root level topics.
   */
  rootTopics: string[];

  /**
   * The IDs of archived root level topics.
   */
  archivedRootTopics: string[];

  /**
   * The ID of the currently open view.
   */
  view: string;

  /**
   * The ID of the currently open view instance.
   * `null` if a static view is open.
   */
  viewInstance: string | null;

  /**
   * The UI extensions added by extensions.
   */
  uiExtensions: UiExtension[];

  /**
   * Adds topics to the root topics list.
   *
   * @param topicIds The IDs of the root topics to add.
   */
  addRootTopics(topicIds: string[]): void;

  /**
   * Removes topics from the root topics list.
   *
   * @param topicIds The IDs of the topics to remove.
   */
  removeRootTopics(topicIds: string[]): void;

  /**
   * Adds topics to the archived topics list.
   *
   * @param topicIds The IDs of the archived topics to add.
   */
  addArchivedRootTopics(topicIds: string[]): void;

  /**
   * Removes topics from the archived topics list.
   *
   * @param topicIds The IDs of the archived topics to remove.
   */
  removeArchivedRootTopics(topicIds: string[]): void;

  /**
   * Sets the ID of the currently open view.
   *
   * @param viewId The ID of the view.
   */
  setView(viewId: string): void;

  /**
   * Sets the currently open view instance ID. Can be set
   * to `null` if no view instance is open.
   *
   * @param viewInstanceId The ID of the view instance or null to clear.
   */
  setViewInstance(viewInstanceId: string | null): void;

  /**
   * Adds a UI extension to the store.
   *
   * @param extension The UI extension to add.
   */
  addUiExtension(extension: UiExtension): void;

  /**
   * Removes a UI extension from the store.
   *
   * @param location The location of the extension to remove.
   * @param element The element of the extension to remove.
   */
  removeUiExtension(location: string, element: UiExtension['element']): void;

  /**
   * Removes all UI extensions added by a specified source
   * from the store. Optionally, a location can be specified
   * to remove UI extensions only from the specified location.
   *
   * @param core A MindDrop core instance.
   * @param location The location from which to remove the UI extensions.
   */
  removeAllUiExtensions(source: string, location?: string): void;

  /**
   * Clears the store state.
   */
  clear(): void;
}
