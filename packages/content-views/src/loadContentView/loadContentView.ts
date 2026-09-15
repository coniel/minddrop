import { extractContentViewReferences } from '../extractContentViewReferences';
import { readContentView } from '../readContentView';
import { resolveContentViewConfig } from '../resolveContentViewConfig';
import { ContentView } from '../types';

/**
 * Reads a content view from the file system, resolving its durable
 * references into item IDs and indexing the references.
 *
 * @param path - The path to the content view file.
 * @param workspaceId - The workspace to resolve the references in. Omit for the active workspace.
 * @returns The content view or null if it doesn't exist.
 */
export async function loadContentView(
  path: string,
  workspaceId?: string,
): Promise<ContentView | null> {
  const view = await readContentView(path);

  if (!view) {
    return null;
  }

  // Resolve the config's durable references
  const config = resolveContentViewConfig(
    view.type,
    { options: view.options, data: view.data },
    workspaceId,
  );

  return {
    ...view,
    ...config,
    references: extractContentViewReferences(view.type, config),
  };
}
