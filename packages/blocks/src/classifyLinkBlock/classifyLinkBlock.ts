import { BlockClassifiersStore } from '../BlockClassifiersStore';
import { Block, BlockData, RegisteredLinkBlockClassifier } from '../types';

/**
 * Classifies a URL into a block type based on registered link
 * block classifiers.
 *
 * @param url - The URL to classify.
 * @returns An object containing the block type and initial properties.
 */
export function classifyLinkBlock(
  url: string,
): (Pick<Block, 'type'> & BlockData) | undefined {
  let matchedClassifier: RegisteredLinkBlockClassifier | undefined;

  // Get all link block classifiers
  const linkClassifiers = BlockClassifiersStore.getAll().filter(
    (classifier): classifier is RegisteredLinkBlockClassifier =>
      classifier.category === 'link',
  );

  // Run all link classifier match functions until a match is found
  linkClassifiers.every((classifier) => {
    if (classifier.match && classifier.match(url)) {
      matchedClassifier = classifier;

      return false;
    }

    return true;
  });

  // Check all link pattern definitions for a match
  if (!matchedClassifier) {
    linkClassifiers.every((classifier) => {
      if (
        classifier.patterns &&
        classifier.patterns.some((pattern) =>
          // Replace * instances with regex wildcards
          new RegExp(pattern.replace(/\*/g, '[^ ]*')).test(url),
        )
      ) {
        matchedClassifier = classifier;

        return false;
      }

      return true;
    });
  }

  if (!matchedClassifier) {
    return undefined;
  }

  // Initialize properties if an initializer is provided
  if (matchedClassifier.initializeData) {
    return {
      type: matchedClassifier.blockType,
      ...matchedClassifier.initializeData(url),
    };
  }

  return { type: matchedClassifier.blockType };
}
