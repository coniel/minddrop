import { describe, expect, it } from 'vitest';
import { BuiltInContentIconSetId } from '../constants';
import {
  getRegisteredContentIconSets,
  loadContentIconSet,
} from '../contentIconSetRegistry';
import { initializeIcons } from './initializeIcons';

describe('initializeIcons', () => {
  it('registers the built-in content icon set', () => {
    initializeIcons();

    // The built-in set is listed as registered
    expect(
      getRegisteredContentIconSets().find(
        (definition) => definition.id === BuiltInContentIconSetId,
      ),
    ).toBeDefined();
  });

  // Transforming the icon data module can exceed the default test
  // timeout, so allow extra time
  it('loads icon components and metadata', { timeout: 30000 }, async () => {
    initializeIcons();

    const contents = await loadContentIconSet(BuiltInContentIconSetId);

    // The set resolves with an icon component per icon
    expect(contents?.icons.cat).toBeDefined();

    // The set resolves with the picker metadata
    expect(contents?.metadata.icons.length).toBeGreaterThan(0);
    expect(contents?.metadata.categories.length).toBeGreaterThan(0);
    expect(contents?.metadata.labels.length).toBeGreaterThan(0);
  });
});
