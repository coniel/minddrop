import {
  DefaultContentIconSetId,
  loadContentIconSet,
} from '@minddrop/ui-icons';

/**
 * Loads the default content icon set.
 *
 * Call before a test which picks a content icon. The set otherwise
 * loads on first use, and that load counts towards the test's timeout.
 *
 * @throws {Error} If the default content icon set is not registered.
 */
export async function loadDefaultContentIconSet(): Promise<void> {
  // Load the default set
  const contents = await loadContentIconSet(DefaultContentIconSetId);

  // Fail rather than leave the set to load inside the test
  if (!contents) {
    throw new Error('The default content icon set is not registered');
  }
}
