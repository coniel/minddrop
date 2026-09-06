import { describe, expect, it } from 'vitest';
import {
  awaitPendingOperations,
  hasPendingOperations,
} from '../PendingOperationsStore';
import { initializeMockFileSystem } from '../mock';
import { FileSystemAdapter } from '../types';
import { trackAdapterOperations } from './trackAdapterOperations';

describe('trackAdapterOperations', () => {
  it('tracks an operation until it settles', async () => {
    const { MockFs } = initializeMockFileSystem();
    const adapter = trackAdapterOperations(MockFs);

    const operation = adapter.exists('missing');

    expect(hasPendingOperations()).toBe(true);

    await operation;
    await awaitPendingOperations();

    expect(hasPendingOperations()).toBe(false);
  });

  it('returns the operation result unchanged', async () => {
    const { MockFs } = initializeMockFileSystem([
      { path: 'file.txt', textContent: 'contents' },
    ]);
    const adapter = trackAdapterOperations(MockFs);

    await expect(adapter.readTextFile('file.txt')).resolves.toBe('contents');
  });

  it('passes non-function properties through', () => {
    const { MockFs } = initializeMockFileSystem();
    const labelled: FileSystemAdapter & { label: string } = {
      ...MockFs,
      label: 'mock',
    };
    const adapter = trackAdapterOperations(labelled);

    expect(Reflect.get(adapter, 'label')).toBe('mock');
  });
});
