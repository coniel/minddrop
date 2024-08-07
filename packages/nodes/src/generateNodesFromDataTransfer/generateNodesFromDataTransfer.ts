import { toMindDropDataTransfer } from '@minddrop/utils';
import { Fs } from '@minddrop/file-system';
import { FileNode, Node } from '../types';
import * as Nodes from '../Nodes';

/**
 * Generates nodes from a data transfer object.
 * Files are written to the file system in the provided parent path.
 *
 * @param dataTransfer - The data transfer object to generate nodes from.
 * @param parentPath - The path to the parent directory in which to write files.
 * @returns The generated nodes.
 */
export async function generateNodesFromDataTransfer(
  dataTransfer: DataTransfer,
  parentPath: string,
): Promise<Node[]> {
  const transfer = toMindDropDataTransfer(dataTransfer);

  // Generate file nodes if files are present
  if ('files' in transfer) {
    return await Promise.all(
      transfer.files?.map(async (file) =>
        createNodeFromFile(file, parentPath),
      ) || [],
    );
  }

  // Generate a link node if a URL is present
  if (transfer.types.includes('text/url')) {
    const url = transfer.data['text/url'];

    return [Nodes.generateLinkNode(url)];
  }

  // Generate a text node if plain text is present
  if (transfer.types.includes('text/plain')) {
    const text = transfer.data['text/plain'];

    return [Nodes.generateTextNode(text)];
  }

  return [];
}

async function createNodeFromFile(
  file: File,
  parentPath: string,
): Promise<FileNode> {
  const filePath = await Fs.incrementalPath(
    Fs.concatPath(parentPath, file.name),
  );
  await Fs.writeBinaryFile(filePath.path, file);

  return Nodes.generateFileNode(filePath.path);
}
