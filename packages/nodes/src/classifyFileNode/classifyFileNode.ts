import { FileNode, FileNodeClassifierConfig } from '../types';
import { NodeClassifierConfigsStore } from '../NodeClassifierConfigsStore';

/**
 * Adds a layout value to a file node based on its file extension by
 * checking against registered file node classifier configs.
 *
 * If no classifier matches the file type, the node's original layout
 * value is returned.
 *
 * @param node - The file node to classify.
 * @returns The layout value.
 */
export function classifyFileNode(node: FileNode): string | undefined {
  // Get all file node classifier configs
  const classifierConfigs = NodeClassifierConfigsStore.getAll().filter(
    (classifierConfig): classifierConfig is FileNodeClassifierConfig =>
      classifierConfig.nodeType === 'file',
  );

  // Use the node's current layout value as the default
  let layout = node.layout;
  // Get the file extension
  const fileType = node.file?.split('.').pop() || '';

  // Loop through all classifier configs until a match is found
  classifierConfigs.every((config) => {
    if (config.fileTypes.includes(fileType)) {
      layout = config.layout;

      return false;
    }

    return true;
  });

  return layout;
}
