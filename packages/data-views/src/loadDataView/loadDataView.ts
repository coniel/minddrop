import { extractDataViewReferences } from '../extractDataViewReferences';
import { readDataView } from '../readDataView';
import { resolveDataViewConfig } from '../resolveDataViewConfig';
import { DataView } from '../types';

/**
 * Reads a data view from the file system, resolving its durable
 * references into item IDs and indexing the references.
 *
 * @param path - The path to the data view file.
 * @param workspaceId - The workspace to resolve the references in. Omit for the active workspace.
 * @returns The data view or null if it doesn't exist.
 */
export async function loadDataView(
  path: string,
  workspaceId?: string,
): Promise<DataView | null> {
  const view = await readDataView(path);

  if (!view) {
    return null;
  }

  // Resolve the config's durable references
  const config = resolveDataViewConfig(
    view.type,
    { options: view.options, data: view.data },
    workspaceId,
  );

  return {
    ...view,
    ...config,
    references: extractDataViewReferences(view.type, config),
  };
}
