import { afterEach, describe, expect, it } from 'vitest';
import { Fs } from '../../FileSystem';
import { initializeMockFileSystem } from '../../mock';
import { registerMockAdapterOverrides } from './registerMockAdapterOverrides';

const NotePath = 'workspace/note.md';

const MockFileSystem = initializeMockFileSystem([
  { path: NotePath, textContent: 'Hello' },
]);

// Registers the plain mock adapter again
let restore: VoidFunction = () => undefined;

describe('registerMockAdapterOverrides', () => {
  afterEach(async () => {
    restore();
    await Fs.tests.cleanup();
  });

  it('routes calls to an overridden method through the override', async () => {
    restore = registerMockAdapterOverrides(MockFileSystem, {
      readTextFile: async () => 'Overridden',
    });

    expect(await Fs.readTextFile(NotePath)).toBe('Overridden');
  });

  it('routes calls to other methods to the mock adapter', async () => {
    restore = registerMockAdapterOverrides(MockFileSystem, {
      readTextFile: async () => 'Overridden',
    });

    expect(await Fs.exists(NotePath)).toBe(true);
  });

  it('registers the plain mock adapter again on restore', async () => {
    restore = registerMockAdapterOverrides(MockFileSystem, {
      readTextFile: async () => 'Overridden',
    });

    restore();

    expect(await Fs.readTextFile(NotePath)).toBe('Hello');
  });

  it("keeps the mock's reset for the test cleanup", async () => {
    restore = registerMockAdapterOverrides(MockFileSystem, {});

    await Fs.writeTextFile(NotePath, 'Changed');
    await Fs.tests.cleanup();

    expect(MockFileSystem.readTextFile(NotePath)).toBe('Hello');
  });
});
