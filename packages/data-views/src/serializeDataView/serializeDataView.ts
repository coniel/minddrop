import { serializeDataViewConfig } from '../serializeDataViewConfig';
import { DataView, StoredDataView } from '../types';

export interface SerializeDataViewOptions {
  /**
   * Whether to include the view's data source. Omitted by
   * owner-persisted views which derive it at load time.
   * @default true
   */
  dataSource?: boolean;

  /**
   * The workspace the view's referenced items belong to. Omit for the
   * active workspace.
   */
  workspaceId?: string;
}

/**
 * Serializes a data view into its stored form: strips the
 * runtime-only fields and converts the config's item references
 * into durable form.
 *
 * @param view - The data view to serialize.
 * @param options - The serialization options.
 * @returns The stored form of the data view.
 */
export function serializeDataView(
  view: DataView,
  options: SerializeDataViewOptions = {},
): StoredDataView {
  // Strip the runtime-only fields
  const {
    virtual: _virtual,
    owner: _owner,
    ownerKey: _ownerKey,
    references: _references,
    dataSource,
    ...rest
  } = view;

  // Convert the config's item references into durable form
  const storedView: StoredDataView = {
    ...rest,
    ...serializeDataViewConfig(
      view.type,
      { options: view.options, data: view.data },
      options.workspaceId,
    ),
  };

  // Include the data source unless dropped
  if (options.dataSource !== false) {
    storedView.dataSource = dataSource;
  }

  return storedView;
}
