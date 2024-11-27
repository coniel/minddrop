import { Block, BlockData } from './Block.types';

export interface BaseBlockClassifier<TData extends BlockData = {}> {
  /**
   * A unique identifier for the classifier. Used to unregister the classifier.
   */
  id: string;

  /**
   * The block type this classifier is associated with.
   */
  blockType: string;

  /**
   * Callback used to asynchronously update a new block's parameters after creation.
   * This can be useful for fetching parameters from the web or other async operations that
   * need to be performed when a new block of this type is created.
   *
   * Receives the new block, including the initial parameters set by the `initializeData`
   * function if provided. Overwrites the block's current properties with the returned value,
   * removing any properties not included in the returned object.
   *
   * Note: when creating a new block based on a match, the block is inserted into the document
   * synchronously. The block will be updated with the parameters returned by this function
   * after it has been inserted.
   *
   * @param block - The block in its initial state.
   * @returns The updated block parameters.
   */
  updateDataAsync?: (block: Block<TData>) => Promise<TData>;
}

export interface TextBlockClassifier<TData extends BlockData = {}>
  extends BaseBlockClassifier<TData> {
  /**
   * The classifier function. Receives the text to be classified and returns
   * true if the text matches the classifier.
   *
   * @param text - The text content to classify.
   * @returns true if the text matches the classifier, false otherwise.
   */
  match: (text: string) => boolean;

  /**
   * A function that can be used to initialize the block's properties and
   * text value.
   *
   * @param text - The text content which matched the classifier.
   * @returns The block's initial properties.
   */
  initializeData?: (text: string) => TData;
}

export interface FileBlockClassifier<TData extends BlockData = {}>
  extends BaseBlockClassifier<TData> {
  /**
   * The file extensions that the classifier will match.
   */
  fileTypes?: string[];

  /**
   * The classifier function. Receives the file name to be classified and returns
   * true if the file name matches the classifier. Usefull for more advanced matching.
   *
   * @param file - The file to classify.
   * @returns true if the file matches the classifier, false otherwise.
   */
  match?: (file: File) => boolean;

  /**
   * A function that can be used to initialize the block's properties.
   *
   * @param file - The file which matched the classifier.
   * @returns The block's initial properties.
   */
  initializeData?: (file: File) => TData;
}

export interface LinkBlockClassifier<TData extends BlockData = {}>
  extends BaseBlockClassifier<TData> {
  /**
   * A URL containing one of these patterns will return a match.
   *
   * Patterns can make use of wildcards to match non-specific parts of the URL.
   * E.g. `*.google.com/maps/*` will match any URL containing `google.com/maps/`.
   */
  patterns?: string[];

  /**
   * A function that can be used for more advanced matching.
   *
   * @param url - The url to classify.
   * @returns true if the url matches the classifier, false otherwise.
   */
  match?: (url: string) => boolean;

  /**
   * A function that can be used to initialize the block's properties.
   *
   * @param url - The URL which matched the classifier.
   * @returns The block's initial properties.
   */
  initializeData?: (url: string) => TData;
}

export type BlockClassifier =
  | FileBlockClassifier
  | LinkBlockClassifier
  | TextBlockClassifier;

export type RegisteredTextBlockClassifier = TextBlockClassifier & {
  category: 'text';
};

export type RegisteredFileBlockClassifier = FileBlockClassifier & {
  category: 'file';
};

export type RegisteredLinkBlockClassifier = LinkBlockClassifier & {
  category: 'link';
};

export type RegisteredBlockClassifier =
  | RegisteredTextBlockClassifier
  | RegisteredFileBlockClassifier
  | RegisteredLinkBlockClassifier;
