import { UiExtension } from './UiExtension.types';

export interface AppStore {
  /**
   * The UI extensions added by extensions.
   */
  uiExtensions: UiExtension[];

  /**
   * Adds a UI extension to the store.
   *
   * @param extension The UI extension to add.
   */
  addUiExtension(extension: UiExtension): void;

  /**
   * Removes a UI extension from the store.
   *
   * @param id The ID of the extension to remove.
   */
  removeUiExtension(id: string): void;

  /**
   * Clears the store state.
   */
  clear(): void;
}
