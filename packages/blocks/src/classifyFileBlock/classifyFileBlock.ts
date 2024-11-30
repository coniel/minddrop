import { BlockClassifiersStore } from '../BlockClassifiersStore';
import { Block, BlockData, RegisteredFileBlockClassifier } from '../types';

/**
 * Classifies a file into a block type using registered file
 * block classifiers.
 *
 * @param block - The file to classify.
 * @returns An object containing the block type and initial properties.
 */
export function classifyFileBlock(
  file: File,
): (Pick<Block, 'type'> & BlockData) | undefined {
  let matchedClassifier: RegisteredFileBlockClassifier | undefined;

  // Get all file block classifiers
  const fileClassifiers = BlockClassifiersStore.getAll().filter(
    (classifier): classifier is RegisteredFileBlockClassifier =>
      classifier.category === 'file',
  );

  // Get the file extension
  const fileType = file.name?.split('.').pop() || '';

  // Run all file classifier match functions until a match is found
  fileClassifiers.every((classifier) => {
    if (classifier.match && classifier.match(file)) {
      matchedClassifier = classifier;

      return false;
    }

    return true;
  });

  if (!matchedClassifier) {
    // Check all file type definitions for a match
    fileClassifiers.every((classifier) => {
      if (classifier.fileTypes && classifier.fileTypes.includes(fileType)) {
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
      type: matchedClassifier.id,
      ...matchedClassifier.initializeData(file),
    };
  }

  return { type: matchedClassifier.blockType };
}
