import { afterEach, describe, expect, it, vi } from 'vitest';
import { Events } from '@minddrop/events';
import { createKeyValueStore } from '../createKeyValueStore';
import { StorePersistEvent, StorePersistedEvent } from '../events';

type TestValues = { value: string };

const defaults: TestValues = { value: 'default' };

// Stands in for the platform layer, acknowledging each write it
// receives. Returns the namespaces it was asked to write.
function registerPlatformLayer(): string[] {
  const written: string[] = [];

  Events.addListener(StorePersistEvent, 'test-platform', (data) => {
    written.push(data.namespace);

    Events.dispatch(StorePersistedEvent, { namespace: data.namespace });
  });

  return written;
}

describe('store persistence acknowledgement', () => {
  afterEach(() => {
    Events.removeListener(StorePersistEvent, 'test-platform');
  });

  it('resolves once the write is acknowledged', async () => {
    const store = createKeyValueStore<TestValues>(
      'Test:PersistedAck',
      defaults,
      { persistTo: 'app-config', namespace: 'ack-resolves' },
    );

    const written = registerPlatformLayer();

    store.set('value', 'updated');

    await store.persisted();

    expect(written).toEqual(['ack-resolves']);
  });

  it('waits for every pending write', async () => {
    const store = createKeyValueStore<TestValues>(
      'Test:PersistedAckMultiple',
      defaults,
      { persistTo: 'app-config', namespace: 'ack-multiple' },
    );

    const written = registerPlatformLayer();

    store.set('value', 'one');
    store.set('value', 'two');
    store.set('value', 'three');

    await store.persisted();

    expect(written).toHaveLength(3);
  });

  it('resolves immediately when no platform layer is listening', async () => {
    const store = createKeyValueStore<TestValues>(
      'Test:PersistedNoPlatform',
      defaults,
      { persistTo: 'app-config', namespace: 'ack-no-platform' },
    );

    // No platform layer is registered, so nothing will ever
    // acknowledge the write.
    store.set('value', 'updated');

    // Should not hang
    await expect(store.persisted()).resolves.toBeUndefined();
  });

  it('resolves immediately when nothing has been written', async () => {
    const store = createKeyValueStore<TestValues>(
      'Test:PersistedNoWrites',
      defaults,
      { persistTo: 'app-config', namespace: 'ack-no-writes' },
    );

    registerPlatformLayer();

    await expect(store.persisted()).resolves.toBeUndefined();
  });

  it('ignores acknowledgements for other stores', async () => {
    const store = createKeyValueStore<TestValues>(
      'Test:PersistedOtherNamespace',
      defaults,
      { persistTo: 'app-config', namespace: 'ack-mine' },
    );

    // A platform layer which acknowledges the wrong store
    Events.addListener(StorePersistEvent, 'test-platform', () => {
      Events.dispatch(StorePersistedEvent, { namespace: 'someone-else' });
    });

    store.set('value', 'updated');

    const resolved = vi.fn();
    void store.persisted().then(resolved);

    // Let the mistargeted acknowledgement land
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(resolved).not.toHaveBeenCalled();
  });
});
