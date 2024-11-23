import { TextNode, TextNodeClassifierConfig } from '../types';
import { NodeClassifierConfigsStore } from '../NodeClassifierConfigsStore';

/**
 * Adds a layout value to a text node based on its content,
 * checking against registered text node classifier configs.
 *
 * If no classifier returns a match, the node's original layout
 * value is returned.
 *
 * @param node - The text node to classify.
 * @returns The layout value.
 */
export function classifyTextNode(node: TextNode): string | undefined {
  // Get all text node classifier configs
  const classifierConfigs = NodeClassifierConfigsStore.getAll().filter(
    (classifierConfig): classifierConfig is TextNodeClassifierConfig =>
      classifierConfig.nodeType === 'text',
  );

  // Use the node's current layout value as the default
  let layout = node.layout;

  // Loop through all classifier configs until a match is found
  classifierConfigs.every((config) => {
    if (config.callback(node)) {
      layout = config.layout;

      return false;
    }

    return true;
  });

  return layout;
}
