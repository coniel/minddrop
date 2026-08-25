import { ContentIconName, ContentIconSet } from './ContentIcon.types';

// [name, category indexes, label indexes]
export type MinifiedContentIcon = [ContentIconName, number[], number[]];

export interface UnminifiedContentIcon {
  name: ContentIconName;
  set: string;
  categories: string[];
  labels: string[];
}

export interface ContentIconSetMetadata {
  /**
   * ID the set is referenced by in icon strings.
   */
  id: string;

  /**
   * Display name of the set.
   */
  name: string;

  /**
   * Minified icon entries as [name, category indexes, label indexes]
   * tuples.
   */
  icons: [string, number[], number[]][];

  /**
   * Category names referenced by the icon entries.
   */
  categories: string[];

  /**
   * Search labels referenced by the icon entries.
   */
  labels: string[];
}

export interface ContentIconSetContents {
  /**
   * The set's icon components keyed by icon name.
   */
  icons: ContentIconSet;

  /**
   * The set's icon metadata, used by the icon picker.
   */
  metadata: ContentIconSetMetadata;
}

export interface ContentIconSetDefinition {
  /**
   * ID the set is referenced by in icon strings.
   */
  id: string;

  /**
   * Display name of the set.
   */
  name: string;

  /**
   * Loads the set's icon components and metadata.
   */
  load: () => Promise<ContentIconSetContents>;
}

export interface LoadedContentIconSet {
  /**
   * ID the set is referenced by in icon strings.
   */
  id: string;

  /**
   * Display name of the set.
   */
  name: string;

  /**
   * The set's unminified icons.
   */
  icons: UnminifiedContentIcon[];

  /**
   * The set's icons grouped by category.
   */
  iconsByCategory: [string, UnminifiedContentIcon[]][];

  /**
   * Fuzzy searches the set's icons by name and label.
   */
  search: (query: string) => UnminifiedContentIcon[];
}
