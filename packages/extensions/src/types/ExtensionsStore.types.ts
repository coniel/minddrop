import { ExtensionConfig } from './ExtensionConfig.types';
import { ExtensionDocument } from './ExtensionDocument.types';

export interface ExtensionsStore {
  /**
   * An {extensionId]: ExtensionConfig } map of extension configs.
   */
  extensionConfigs: Record<string, ExtensionConfig>;

  /**
   * An { [extensionId]: ExtensionDocument } map of extension documents.
   */
  extensionDocuments: Record<string, ExtensionDocument>;

  /**
   * Sets and extension config in the store.
   *
   * @param config The extension config.
   */
  setExtensionConfig(config: ExtensionConfig): void;

  /**
   * Removes an extension config from the store.
   *
   * @param id The ID of the extension for which to remove the config.
   */
  removeExtensionConfig(id: string): void;

  /**
   * Loads extension documents into the store.
   *
   * @param docs The extension documents to load.
   */
  loadExtensionDocuments(docs: ExtensionDocument[]): void;

  /**
   * Sets and extension document in the store.
   *
   * @param doc The extension document.
   */
  setExtensionDocument(document: ExtensionDocument): void;

  /**
   * Removes an extension document from the store.
   *
   * @param id The ID of the extension for which to remove the document.
   */
  removeExtensionDocument(id: string): void;

  /**
   * Clears all data from the store.
   */
  clear(): void;
}
