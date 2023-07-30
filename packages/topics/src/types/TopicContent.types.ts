import { Drop } from '@minddrop/drops';

export interface TopicColumn {
  /**
   * A unique ID generated at parse time.
   */
  id: string;

  /**
   * The markdown used to split this column from the
   * previous one. Used to re-write the markdown in
   * its original form when saving changes.
   */
  seperator?: string;

  /**
   * The drops contained within the column.
   */
  drops: Drop[];
}

export interface TopicContent {
  /**
   * The topic title.
   */
  title: string;

  /**
   * The topic's raw markdown content.
   */
  markdown: string;

  /**
   * The topic's drops grouped by column.
   */
  columns: TopicColumn[];
}
