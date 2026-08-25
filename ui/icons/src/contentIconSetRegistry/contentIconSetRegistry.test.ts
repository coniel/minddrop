import { describe, expect, it } from 'vitest';
import { ContentIconSetContents } from '../types';
import {
  getLoadedContentIconSet,
  getRegisteredContentIconSets,
  loadContentIconSet,
  registerContentIconSet,
  subscribeToContentIconSets,
} from './contentIconSetRegistry';

// Generates set contents for tests, which use uniquely named sets
// so they do not interfere with each other via the shared registry
function generateSet(): ContentIconSetContents {
  return {
    icons: {
      cat: () => null,
    },
    metadata: {
      id: 'test-set',
      name: 'Test set',
      icons: [['cat', [0], [0]]],
      categories: ['Animals'],
      labels: ['kitten'],
    },
  };
}

describe('contentIconSetRegistry', () => {
  it('registers sets without loading them', () => {
    let loadCount = 0;

    // Register a set with a counting loader
    registerContentIconSet({
      id: 'register-test',
      name: 'Register test',
      load: async () => {
        loadCount += 1;

        return generateSet();
      },
    });

    // The set is listed as registered
    expect(
      getRegisteredContentIconSets().find(
        (definition) => definition.id === 'register-test',
      ),
    ).toBeDefined();

    // Registering does not run the loader
    expect(loadCount).toBe(0);

    // The set is not available synchronously before loading
    expect(getLoadedContentIconSet('register-test')).toBeNull();
  });

  it('loads a set and caches the contents', async () => {
    let loadCount = 0;
    const contents = generateSet();

    // Register a set with a counting loader
    registerContentIconSet({
      id: 'load-test',
      name: 'Load test',
      load: async () => {
        loadCount += 1;

        return contents;
      },
    });

    // Loading resolves with the loader's contents
    expect(await loadContentIconSet('load-test')).toBe(contents);

    // Loading again reuses the cached result
    expect(await loadContentIconSet('load-test')).toBe(contents);
    expect(loadCount).toBe(1);

    // The contents are available synchronously once loaded
    expect(getLoadedContentIconSet('load-test')).toBe(contents);
  });

  it('resolves to null for unregistered sets', async () => {
    expect(await loadContentIconSet('missing-set')).toBeNull();
  });

  it('notifies subscribers when a set loads', async () => {
    let notified = false;

    // Register a set to load
    registerContentIconSet({
      id: 'subscribe-test',
      name: 'Subscribe test',
      load: async () => generateSet(),
    });

    // Subscribe to set loads
    const unsubscribe = subscribeToContentIconSets(() => {
      notified = true;
    });

    await loadContentIconSet('subscribe-test');

    // The subscriber was called when the set loaded
    expect(notified).toBe(true);

    unsubscribe();
  });
});
