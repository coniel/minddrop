import { Extension } from './Extension.types';

export interface ExtensionsStore {
  /**
   * An { [id]: Extension } map of extensions.
   */
  extensions: Record<string, Extension>;

  /**
   * Adds a new extension to the store.
   *
   * @param config The extension.
   */
  setExtension(config: Extension): void;

  /**
   * Removes a extension from the store.
   *
   * @param id The ID of the extension to remove.
   */
  removeExtension(id: string): void;

  /**
   * Clears all data from the store.
   */
  clear(): void;
}
