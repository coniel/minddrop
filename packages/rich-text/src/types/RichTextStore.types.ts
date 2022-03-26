import { RichTextDocument } from './RichTextDocument.types';
import { RichTextElement } from './RichTextBlockElement.types';
import { RichTextElementConfig } from './RichTextInlineElementConfig.types';

export interface RichTextStore {
  /**
   * A `{ [id]: RichTextDocument }` map of rich text documents.
   */
  documents: Record<string, RichTextDocument>;

  /**
   * A `{ [id]: RichTextElement }` map of rich text elements.
   */
  elements: Record<string, RichTextElement>;

  /**
   * A { [type]: RichTextElementConfig } map of registered rich text elements.
   */
  elementConfigs: Record<string, RichTextElementConfig>;

  /**
   * Loads rich text documents into the store.
   *
   * @param documents The rich text documents to load.
   */
  loadDocuments(documents: RichTextDocument[]): void;

  /**
   * Sets a rich text document in the store.
   *
   * @param document The rich text document to set.
   */
  setDocument(document: RichTextDocument): void;

  /**
   * Removes a rich text document from the store.
   *
   * @param id The ID of the rich text document to remove.
   */
  removeDocument(id: string): void;

  /**
   * Loads rich text elements into the store.
   *
   * @param elements The rich text elements to load.
   */
  loadElements(elements: RichTextElement[]): void;

  /**
   * Sets a rich text element in the store.
   *
   * @param element The element to set.
   */
  setElement(element: RichTextElement): void;

  /**
   * Removes a rich text element from the store.
   *
   * @param id The ID of the rich text element to remove.
   */
  removeElement(id: string): void;

  /**
   * Adds a new element config to the store.
   *
   * @param config The config to add.
   */
  setElementConfig(config: RichTextElementConfig): void;

  /**
   * Removes an element config from the store.
   *
   * @param type The type of the config to remove.
   */
  removeElementConfig(type: string): void;

  /**
   * Clears all data from the store.
   */
  clear(): void;
}
