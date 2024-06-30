import { MindDropApi } from './MindDropApi';
import { MindDropExtension } from './types';

export async function initializeExtensions(
  extensions: MindDropExtension[],
): Promise<void> {
  await Promise.all(
    extensions.map((extension) => extension.initialize(MindDropApi)),
  );
}
