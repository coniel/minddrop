import { ContentView } from './ContentView.types';
import { ViewDataSource } from './ViewDataSource.types';

/**
 * A content view as stored in a view file: without the runtime-only
 * fields (`virtual`, `owner`, `ownerKey`, `references`), and with
 * its config's item references in durable form.
 */
export type StoredContentView = Omit<
  ContentView,
  'virtual' | 'owner' | 'ownerKey' | 'references' | 'dataSource'
> & {
  /**
   * The data source, omitted from owner-persisted views which
   * derive it at load time.
   */
  dataSource?: ViewDataSource;
};
