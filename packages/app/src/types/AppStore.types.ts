import { View } from './View.types';
import { UiExtension } from './UiExtension.types';

export interface AppStore {
  /**
   * The currently open view.
   */
  view: View;

  /**
   * The UI extensions added by extensions.
   */
  uiExtensions: UiExtension[];

  /**
   * Sets the currently open view.
   *
   * @param view The view.
   */
  setView(view: View): void;

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
