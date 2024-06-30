import { FileNode, FileNodeClassifierConfig } from '../types';
import { NodeClassifierConfigsStore } from '../NodeClassifierConfigsStore';

/**
 * Adds a display value to a file node based on its file extension by
 * checking against registered file node classifier configs.
 *
 * If no classifier matches the file type, the node's original display
 * value is returned.
 *
 * @param node - The file node to classify.
 * @returns The display value.
 */
export function classifyFileNode(node: FileNode): string | undefined {
  // Get all file node classifier configs
  const classifierConfigs = NodeClassifierConfigsStore.getAll().filter(
    (classifierConfig): classifierConfig is FileNodeClassifierConfig =>
      classifierConfig.nodeType === 'file',
  );

  // Use the node's current display value as the default
  let display = node.display;
  // Get the file extension
  const fileType = node.file?.split('.').pop() || '';

  // Loop through all classifier configs until a match is found
  classifierConfigs.every((config) => {
    if (config.fileTypes.includes(fileType)) {
      display = config.display;

      return false;
    }

    return true;
  });

  return display;
}
