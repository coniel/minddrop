import { LinkNode, LinkNodeClassifierConfig } from '../types';
import { NodeClassifierConfigsStore } from '../NodeClassifierConfigsStore';

/**
 * Adds a layout value to a link node based on its content,
 * checking against registered link node classifier configs.
 *
 * If no classifier returns a match, the node's original layout
 * value is returned.
 *
 * @param node - The link node to classify.
 * @returns The layout value.
 */
export function classifyLinkNode(node: LinkNode): string | undefined {
  // Get all link node classifier configs
  const classifierConfigs = NodeClassifierConfigsStore.getAll().filter(
    (classifierConfig): classifierConfig is LinkNodeClassifierConfig =>
      classifierConfig.nodeType === 'link',
  );

  // Use the node's current layout value as the default
  let layout = node.layout;

  // Loop through all classifier configs until a match is found
  classifierConfigs.every((config) => {
    // Attempt to match using the config's patterns if provided
    if (
      node.url &&
      config.patterns &&
      config.patterns.some((pattern) =>
        // Replace * instances with regex wildcards
        new RegExp(pattern.replace(/\*/g, '[^ ]*')).test(node.url as string),
      )
    ) {
      layout = config.layout;

      return false;
    }

    // Attempt to match using the config's callback function
    // if provided.
    if (config.callback && config.callback(node)) {
      layout = config.layout;

      return false;
    }

    return true;
  });

  return layout;
}
