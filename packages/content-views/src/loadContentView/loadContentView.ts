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
 * @returns The content view, or null if the file is missing or is not a valid content view.
 */
export async function loadContentView(
  path: string,
  workspaceId?: string,
): Promise<ContentView | null> {
  // Read the content view file
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

  // Combine the view with its resolved config and references
  return {
    // The view as stored
    ...view,
    // The resolved config
    ...config,
    // The resolved config's references
    references: extractContentViewReferences(view.type, config),
  };
}
