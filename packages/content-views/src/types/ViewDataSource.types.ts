export interface DatabaseViewDataSource {
  type: 'database';

  /**
   * The ID of the source database.
   */
  id: string;
}

export interface QueryViewDataSource {
  type: 'query';

  /**
   * The ID of the source query.
   */
  id: string;
}

export interface CollectionViewDataSource {
  type: 'collection';

  /**
   * The ID of the source collection.
   */
  id: string;
}

export type ViewDataSource =
  | DatabaseViewDataSource
  | QueryViewDataSource
  | CollectionViewDataSource;

export type ViewDataSourceType = ViewDataSource['type'];
