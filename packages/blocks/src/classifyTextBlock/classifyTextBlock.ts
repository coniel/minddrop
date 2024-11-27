import { BlockClassifiersStore } from '../BlockClassifiersStore';
import { Block, BlockData, RegisteredTextBlockClassifier } from '../types';

/**
 * Classifies text into a block type based on registered text
 * block classifiers.
 *
 * @param text - The text to classify.
 * @returns An object containing the block type and initial properties.
 */
export function classifyTextBlock(
  text: string,
): (Pick<Block, 'type'> & BlockData) | undefined {
  let matchedClassifier: RegisteredTextBlockClassifier | undefined;

  // Get all link block classifiers
  const linkClassifiers = BlockClassifiersStore.getAll().filter(
    (classifier): classifier is RegisteredTextBlockClassifier =>
      classifier.category === 'text',
  );

  // Run all text classifier match functions until a match is found
  linkClassifiers.every((classifier) => {
    if (classifier.match && classifier.match(text)) {
      matchedClassifier = classifier;

      return false;
    }

    return true;
  });

  if (!matchedClassifier) {
    return;
  }

  // Initialize properties if an initializer is provided
  if (matchedClassifier.initializeData) {
    return {
      type: matchedClassifier.blockType,
      ...matchedClassifier.initializeData(text),
    };
  }

  return { type: matchedClassifier.blockType };
}
