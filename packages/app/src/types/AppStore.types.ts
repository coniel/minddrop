import { ViewInstance } from '@minddrop/views';
import { UiExtension } from './UiExtension.types';

export interface AppStore {
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
   * Clears the store state.
   */
  clear(): void;
}
