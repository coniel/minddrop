import { LinkNode, LinkNodeClassifierConfig } from '../types';
import { NodeClassifierConfigsStore } from '../NodeClassifierConfigsStore';

/**
 * Adds a display value to a link node based on its content,
 * checking against registered link node classifier configs.
 *
 * If no classifier returns a match, the node's original display
 * value is returned.
 *
 * @param node - The link node to classify.
 * @returns The display value.
 */
export function classifyLinkNode(node: LinkNode): string | undefined {
  // Get all link node classifier configs
  const classifierConfigs = NodeClassifierConfigsStore.getAll().filter(
    (classifierConfig): classifierConfig is LinkNodeClassifierConfig =>
      classifierConfig.nodeType === 'link',
  );

  // Use the node's current display value as the default
  let display = node.display;

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
      display = config.display;

      return false;
    }

    // Attempt to match using the config's callback function
    // if provided.
    if (config.callback && config.callback(node)) {
      display = config.display;

      return false;
    }

    return true;
  });

  return display;
}
