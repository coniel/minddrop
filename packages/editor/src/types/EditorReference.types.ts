import { IconProp } from '@minddrop/ui-primitives';

export interface EditorReference {
  /**
   * What the wikilink points at, as written between its brackets, e.g.
   * `Book` or `Books/Book`.
   */
  reference: string;

  /**
   * The text the link shows.
   */
  label: string;

  /**
   * Supporting text describing what the reference names, shown below the
   * label while choosing one.
   */
  description?: string;

  /**
   * The icon shown alongside the reference.
   */
  icon?: IconProp;
}

/**
 * Supplies the references a wikilink can point at.
 *
 * The editor has no knowledge of what a reference names: it is given them,
 * and writes back whatever it is told to. That is what lets the same editor
 * link to entries today and to anything else later, without either knowing
 * about the other.
 */
export interface ReferenceSource {
  /**
   * Returns the references to offer before anything has been searched for.
   */
  getRecent(): EditorReference[];

  /**
   * Returns the references matching a search query.
   *
   * @param query - The text typed to search by.
   */
  search(query: string): EditorReference[];
}
