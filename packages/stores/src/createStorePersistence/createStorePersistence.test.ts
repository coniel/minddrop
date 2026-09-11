import { afterEach, describe, expect, it, vi } from 'vitest';
import { Events } from '@minddrop/events';
import { createKeyValueStore } from '../createKeyValueStore';
import {
  StoreHydrateEvent,
  StoreHydrateRequestEvent,
  StorePersistEvent,
  StorePersistedEvent,
} from '../events';

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
      { persist: { target: 'app-config', namespace: 'ack-resolves' } },
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
      { persist: { target: 'app-config', namespace: 'ack-multiple' } },
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
      { persist: { target: 'app-config', namespace: 'ack-no-platform' } },
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
      { persist: { target: 'app-config', namespace: 'ack-no-writes' } },
    );

    registerPlatformLayer();

    await expect(store.persisted()).resolves.toBeUndefined();
  });

  it('ignores acknowledgements for other stores', async () => {
    const store = createKeyValueStore<TestValues>(
      'Test:PersistedOtherNamespace',
      defaults,
      { persist: { target: 'app-config', namespace: 'ack-mine' } },
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

describe('store hydration per workspace', () => {
  afterEach(() => {
    Events.removeListener(StoreHydrateRequestEvent, 'test-platform');
  });

  it('resolves each pending hydration with its own workspace', async () => {
    const store = createKeyValueStore<TestValues>(
      'Test:HydratePerWorkspace',
      defaults,
      {
        scope: 'workspace',
        persist: {
          target: 'app-workspace-config',
          namespace: 'hydrate-per-workspace',
        },
      },
    );

    // Stand in for a platform layer answering requests out of order,
    // collecting the answers to send afterwards
    const answers: (() => void)[] = [];

    Events.addListener(StoreHydrateRequestEvent, 'test-platform', (request) => {
      answers.push(() =>
        Events.dispatch(StoreHydrateEvent, {
          namespace: request.namespace,
          workspaceId: request.workspaceId,
          data: { value: request.workspaceId },
        }),
      );
    });

    const resolved: string[] = [];
    const first = store
      .in('workspace-1')
      .hydrate()
      .then(() => resolved.push('workspace-1'));
    const second = store
      .in('workspace-2')
      .hydrate()
      .then(() => resolved.push('workspace-2'));

    await vi.waitFor(() => expect(answers).toHaveLength(2));

    // Answer the second request first
    answers[1]();
    await second;

    expect(resolved).toEqual(['workspace-2']);

    answers[0]();
    await first;

    expect(resolved).toEqual(['workspace-2', 'workspace-1']);
    expect(store.in('workspace-1').get('value')).toBe('workspace-1');
    expect(store.in('workspace-2').get('value')).toBe('workspace-2');
  });
});
