import { createArrayStore } from '@minddrop/utils';
import {
  FileBlockClassifier,
  LinkBlockClassifier,
  RegisteredBlockClassifier,
  TextBlockClassifier,
} from './types';

export const BlockClassifiersStore =
  createArrayStore<RegisteredBlockClassifier>('id');

/**
 * Unregisters a BlockClassifier by ID.
 *
 * @param id - The ID of the classifier to unregister.
 */
export function unregisterBlockClassifier(id: string): void {
  BlockClassifiersStore.remove(id);
}

/**
 * Registers a text block classifier.
 *
 * @param classifier - The classifier to register.
 */
export function registerTextBlockClassifier(
  classifier: TextBlockClassifier,
): void {
  BlockClassifiersStore.add({ ...classifier, category: 'text' });
}

/**
 * Registers a link block classifier.
 *
 * @param classifier - The classifier to register.
 */
export function registerLinkBlockClassifier(
  classifier: LinkBlockClassifier,
): void {
  BlockClassifiersStore.add({ ...classifier, category: 'link' });
}

/**
 * Registers a file block classifier.
 *
 * @param classifier - The classifier to register.
 */
export function registerFileBlockClassifier(
  classifier: FileBlockClassifier,
): void {
  BlockClassifiersStore.add({ ...classifier, category: 'file' });
}
