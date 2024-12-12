import { BlockData } from './Block.types';

export interface BaseBlockClassifier {
  /**
   * A unique identifier for the classifier. Used to unregister the classifier.
   */
  id: string;

  /**
   * The block type this classifier is associated with.
   */
  blockType: string;
}

export interface TextBlockClassifier<TData extends BlockData = BlockData>
  extends BaseBlockClassifier {
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

export interface FileBlockClassifier<TData extends BlockData = BlockData>
  extends BaseBlockClassifier {
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

export interface LinkBlockClassifier<TData extends BlockData = BlockData>
  extends BaseBlockClassifier {
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
