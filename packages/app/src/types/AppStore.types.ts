import { ViewInstance } from '@minddrop/views';
import { UiExtension } from './UiExtension.types';

export interface DraggedData {
  /**
   * The IDs of drops currently being dragged.
   */
  drops: string[];

  /**
   * The IDs of topics currently being dragged.
   */
  topics: string[];
}

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
   * The currently open view instance.
   * `null` if a static view is open.
   */
  viewInstance: ViewInstance | null;

  /**
   * The UI extensions added by extensions.
   */
  uiExtensions: UiExtension[];

  /**
   * An array of drop IDs containing the currently
   * selected drops in the app UI.
   */
  selectedDrops: string[];

  /**
   * An array of drop IDs containing the currently
   * selected topics in the app UI.
   */
  selectedTopics: string[];

  /**
   * Data which is currently being dragged.
   */
  draggedData: DraggedData;

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
   * Sets the currently open view instance. Can be set
   * to `null` if no view instance is open.
   *
   * @param viewInstance The view instance or null to clear.
   */
  setViewInstance(viewInstance: ViewInstance | null): void;

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
   * Adds drops to the selected drops.
   *
   * @param drops The IDs of the drops to add.
   */
  addSelectedDrops(dropIds: string[]): void;

  /**
   * Removes drops from the selected drops.
   *
   * @param dropIds The IDs of the drops to remove.
   */
  removeSelectedDrops(dropIds: string[]): void;

  /**
   * Clears the selected drops.
   */
  clearSelectedDrops(): void;

  /**
   * Adds topics to the selected topics.
   *
   * @param topics The IDs of the topics to add.
   */
  addSelectedTopics(topicIds: string[]): void;

  /**
   * Removes topics from the selected topics.
   *
   * @param topicIds The IDs of the topics to remove.
   */
  removeSelectedTopics(topicIds: string[]): void;

  /**
   * Clears the selected topics.
   */
  clearSelectedTopics(): void;

  /**
   * Clears both selected drops and selected topics.
   */
  clearSelection(): void;

  /**
   * Sets dragged data.
   *
   * @param data The dragged data.
   */
  setDraggedData(data: Partial<DraggedData>): void;

  /**
   * Clears the dragged data.
   */
  clearDraggedData(): void;

  /**
   * Clears the store state.
   */
  clear(): void;
}
