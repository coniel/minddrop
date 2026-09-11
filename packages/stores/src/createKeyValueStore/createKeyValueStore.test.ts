import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Events } from '@minddrop/events';
import {
  StoreHydrateEvent,
  StoreHydrateRequestEvent,
  StoreHydratedEvent,
  StorePersistEvent,
} from '../events';
import { dropWorkspaceRecords } from '../storeRegistry';
import { setActiveWorkspaceScope } from '../workspaceScope';
import { createKeyValueStore } from './createKeyValueStore';

type TestValues = {
  theme: string;
  fontSize: number;
  sidebarOpen: boolean;
};

const defaults: TestValues = {
  theme: 'light',
  fontSize: 14,
  sidebarOpen: true,
};

describe('createKeyValueStore', () => {
  describe('without persistence', () => {
    const store = createKeyValueStore<TestValues>('Test:KeyValue', defaults);

    beforeEach(() => {
      store.reset();
      Events.tests.cleanup();
    });

    describe('get', () => {
      it('returns the default value for a key', () => {
        expect(store.get('theme')).toBe('light');
      });

      it('returns the current value after set', () => {
        store.set('theme', 'dark');

        expect(store.get('theme')).toBe('dark');
      });
    });

    describe('getAll', () => {
      it('returns all values', () => {
        expect(store.getAll()).toEqual(defaults);
      });

      it('returns updated values after set', () => {
        store.set('theme', 'dark');

        expect(store.getAll()).toEqual({
          ...defaults,
          theme: 'dark',
        });
      });
    });

    describe('set', () => {
      it('sets a value for a key', () => {
        store.set('fontSize', 16);

        expect(store.get('fontSize')).toBe(16);
      });

      it('overwrites an existing value', () => {
        store.set('fontSize', 16);
        store.set('fontSize', 18);

        expect(store.get('fontSize')).toBe(18);
      });
    });

    describe('load', () => {
      it('merges values into the store', () => {
        store.load({ theme: 'dark', fontSize: 16 });

        expect(store.getAll()).toEqual({
          theme: 'dark',
          fontSize: 16,
          sidebarOpen: true,
        });
      });

      it('overwrites existing values', () => {
        store.set('theme', 'dark');
        store.load({ theme: 'auto' });

        expect(store.get('theme')).toBe('auto');
      });
    });

    describe('reset', () => {
      it('resets a single key to its default value', () => {
        store.set('theme', 'dark');
        store.reset('theme');

        expect(store.get('theme')).toBe('light');
      });

      it('resets all values to defaults when no key is provided', () => {
        store.set('theme', 'dark');
        store.set('fontSize', 20);
        store.set('sidebarOpen', false);

        store.reset();

        expect(store.getAll()).toEqual(defaults);
      });
    });

    it('throws when calling hydrate', () => {
      expect(() => store.hydrate()).toThrow();
    });

    it('does not dispatch persist events', () => {
      const callback = vi.fn();
      Events.addListener(StorePersistEvent, 'test', callback);

      store.set('theme', 'dark');
      store.reset('theme');
      store.reset();

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('with persistence', () => {
    const store = createKeyValueStore<TestValues>(
      'Test:KeyValuePersist',
      defaults,
      { persist: { target: 'app-config', namespace: 'test-kv' } },
    );

    beforeEach(() => {
      // Clear events first so old listeners don't receive
      // the persist event dispatched by store.reset()
      Events.tests.cleanup();
      store.reset();
    });

    it('dispatches a persist event on set', async () =>
      new Promise<void>((done) => {
        Events.addListener(StorePersistEvent, 'test', (payload) => {
          expect(payload).toEqual({
            target: 'app-config',
            namespace: 'test-kv',
            data: { ...defaults, theme: 'dark' },
          });
          done();
        });

        store.set('theme', 'dark');
      }));

    it('dispatches a persist event on reset with key', async () =>
      new Promise<void>((done) => {
        store.set('theme', 'dark');

        Events.addListener(StorePersistEvent, 'test', (payload) => {
          expect(payload).toEqual({
            target: 'app-config',
            namespace: 'test-kv',
            data: defaults,
          });
          done();
        });

        store.reset('theme');
      }));

    it('dispatches a persist event on reset without key', async () =>
      new Promise<void>((done) => {
        store.set('theme', 'dark');

        Events.addListener(StorePersistEvent, 'test', (payload) => {
          expect(payload).toEqual({
            target: 'app-config',
            namespace: 'test-kv',
            data: defaults,
          });
          done();
        });

        store.reset();
      }));

    it('does not dispatch a persist event on load', async () => {
      const callback = vi.fn();
      Events.addListener(StorePersistEvent, 'test', callback);

      store.load({ theme: 'dark' });

      // Wait for async event dispatch
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(callback).not.toHaveBeenCalled();
    });

    describe('hydrate', () => {
      it('dispatches a load request event', async () =>
        new Promise<void>((done) => {
          Events.addListener(StoreHydrateRequestEvent, 'test', (payload) => {
            expect(payload).toEqual({
              target: 'app-config',
              namespace: 'test-kv',
            });
            done();
          });

          store.hydrate();
        }));

      it('resolves after the load event is dispatched', async () => {
        // Create a fresh store so its load listener is active
        const freshStore = createKeyValueStore<TestValues>(
          'Test:KeyValuePersist',
          defaults,
          {
            persist: {
              target: 'app-config',
              namespace: 'hydrate-resolve-test',
            },
          },
        );

        // Simulate the platform layer responding to the load request
        Events.addListener(StoreHydrateRequestEvent, 'test', () => {
          Events.dispatch(StoreHydrateEvent, {
            namespace: 'hydrate-resolve-test',
            data: { theme: 'dark', fontSize: 20 },
          });
        });

        await freshStore.hydrate();

        expect(freshStore.get('theme')).toBe('dark');
        expect(freshStore.get('fontSize')).toBe(20);
        // Unset values keep their defaults
        expect(freshStore.get('sidebarOpen')).toBe(true);
      });

      it('dispatches a hydrated event', async () => {
        // Create a fresh store so its listener is active
        const freshStore = createKeyValueStore<TestValues>(
          'Test:KeyValuePersist',
          defaults,
          {
            persist: {
              target: 'app-config',
              namespace: 'hydrated-event-test',
            },
          },
        );

        const callback = vi.fn();
        Events.addListener(StoreHydratedEvent, 'test', callback);

        // Simulate the platform layer responding to the load request
        Events.addListener(StoreHydrateRequestEvent, 'test', () => {
          Events.dispatch(StoreHydrateEvent, {
            namespace: 'hydrated-event-test',
            data: { theme: 'dark' },
          });
        });

        await freshStore.hydrate();

        expect(callback).toHaveBeenCalledWith(
          { namespace: 'hydrated-event-test' },
          StoreHydratedEvent,
        );
      });
    });
  });

  describe('with app-workspace persistence', () => {
    const store = createKeyValueStore<TestValues>(
      'Test:KeyValueAppWorkspacePersist',
      defaults,
      {
        persist: {
          target: 'app-workspace-config',
          namespace: 'test-kv-app-workspace',
        },
      },
    );

    beforeEach(() => {
      // Clear events first so old listeners don't receive
      // the persist event dispatched by store.reset()
      Events.tests.cleanup();
      store.reset();
    });

    it('dispatches a persist event carrying the target', async () =>
      new Promise<void>((done) => {
        Events.addListener(StorePersistEvent, 'test', (payload) => {
          expect(payload).toEqual({
            target: 'app-workspace-config',
            namespace: 'test-kv-app-workspace',
            data: { ...defaults, theme: 'dark' },
          });
          done();
        });

        store.set('theme', 'dark');
      }));

    it('dispatches a hydrate request event carrying the target', async () =>
      new Promise<void>((done) => {
        Events.addListener(StoreHydrateRequestEvent, 'test', (payload) => {
          expect(payload).toEqual({
            target: 'app-workspace-config',
            namespace: 'test-kv-app-workspace',
          });
          done();
        });

        store.hydrate();
      }));
  });

  describe('hydrate listener', () => {
    it('loads data when a matching load event is dispatched', async () => {
      // Create a fresh store so its listener is active
      const freshStore = createKeyValueStore<TestValues>(
        'Test:KeyValuePersist',
        defaults,
        { persist: { target: 'app-config', namespace: 'kv-load-test' } },
      );

      // Dispatch a load event with data for this store
      Events.dispatch(StoreHydrateEvent, {
        namespace: 'kv-load-test',
        data: { theme: 'dark', fontSize: 20 },
      });

      // The hydrate listener runs queued rather than during the
      // dispatch.
      await vi.waitFor(() => {
        expect(freshStore.get('theme')).toBe('dark');
        expect(freshStore.get('fontSize')).toBe(20);
      });

      // Unset values keep their defaults
      expect(freshStore.get('sidebarOpen')).toBe(true);
    });

    it('ignores load events for other namespaces', async () => {
      // Create a fresh store so its listener is active
      const freshStore = createKeyValueStore<TestValues>(
        'Test:KeyValuePersist',
        defaults,
        { persist: { target: 'app-config', namespace: 'kv-load-test-2' } },
      );

      // Dispatch a load event for a different namespace
      Events.dispatch(StoreHydrateEvent, {
        namespace: 'other-package',
        data: { theme: 'dark' },
      });

      expect(freshStore.get('theme')).toBe('light');
    });
  });
});

describe('createKeyValueStore scoped by workspace', () => {
  const store = createKeyValueStore<TestValues>(
    'Test:KeyValueScoped',
    defaults,
    {
      scope: 'workspace',
    },
  );

  beforeEach(() => {
    setActiveWorkspaceScope('workspace-1');
    store.reset();
    store.in('workspace-2').reset();
  });

  afterEach(() => {
    setActiveWorkspaceScope(null);
    Events.removeListener(StorePersistEvent, 'test');
    Events.removeListener(StoreHydrateRequestEvent, 'test');
  });

  it('reads and writes the active workspace', () => {
    store.set('theme', 'dark');
    setActiveWorkspaceScope('workspace-2');
    store.set('theme', 'blue');

    expect(store.get('theme')).toBe('blue');
    expect(store.in('workspace-1').get('theme')).toBe('dark');
  });

  it('starts every workspace from the defaults', () => {
    store.set('theme', 'dark');

    expect(store.in('workspace-2').getAll()).toEqual(defaults);
  });

  it('reads and writes the addressed workspace', () => {
    store.in('workspace-2').set('theme', 'dark');

    expect(store.get('theme')).toBe('light');
    expect(store.in('workspace-2').get('theme')).toBe('dark');
  });

  it('loads into the addressed workspace', () => {
    store.in('workspace-2').load({ theme: 'dark', fontSize: 16 });

    expect(store.getAll()).toEqual(defaults);
    expect(store.in('workspace-2').getAll()).toEqual({
      ...defaults,
      theme: 'dark',
      fontSize: 16,
    });
  });

  it('resets the addressed workspace only', () => {
    store.set('theme', 'dark');
    store.in('workspace-2').set('theme', 'dark');
    store.in('workspace-2').reset();

    expect(store.get('theme')).toBe('dark');
    expect(store.in('workspace-2').get('theme')).toBe('light');
  });

  it('keeps a default record while no workspace is active', () => {
    setActiveWorkspaceScope(null);
    store.set('theme', 'dark');
    setActiveWorkspaceScope('workspace-1');

    expect(store.get('theme')).toBe('light');

    setActiveWorkspaceScope(null);

    expect(store.get('theme')).toBe('dark');

    store.reset();
  });

  it('re-selects the hooks when the active workspace changes', () => {
    store.set('theme', 'dark');
    store.in('workspace-2').set('theme', 'blue');

    const { result } = renderHook(() => store.useValue('theme'));

    expect(result.current).toBe('dark');

    act(() => setActiveWorkspaceScope('workspace-2'));

    expect(result.current).toBe('blue');
  });

  it('re-renders the hooks on writes to the active workspace only', () => {
    const { result } = renderHook(() => store.useAllValues());

    act(() => store.in('workspace-2').set('theme', 'dark'));

    expect(result.current.theme).toBe('light');

    act(() => store.set('theme', 'dark'));

    expect(result.current.theme).toBe('dark');
  });

  it('drops a workspace record through the registry', () => {
    store.in('workspace-2').set('theme', 'dark');

    dropWorkspaceRecords('workspace-2');

    expect(store.in('workspace-2').getAll()).toEqual(defaults);
  });

  describe('with persistence', () => {
    const persist = {
      target: 'app-workspace-config' as const,
      namespace: 'scoped-kv',
    };

    it('persists with the workspace the write was made to', async () =>
      new Promise<void>((done) => {
        const persisted = createKeyValueStore<TestValues>(
          'Test:KeyValueScopedPersist',
          defaults,
          { scope: 'workspace', persist },
        );

        Events.addListener(StorePersistEvent, 'test', (payload) => {
          expect(payload).toEqual({
            ...persist,
            workspaceId: 'workspace-2',
            data: { ...defaults, theme: 'dark' },
          });
          done();
        });

        persisted.in('workspace-2').set('theme', 'dark');
      }));

    it('hydrates the addressed workspace', async () => {
      // A namespace of its own, so that the store's hydrate listener
      // is not shadowed by the store created above.
      const namespace = 'scoped-kv-hydrate';
      const persisted = createKeyValueStore<TestValues>(
        'Test:KeyValueScopedPersist',
        defaults,
        { scope: 'workspace', persist: { ...persist, namespace } },
      );

      // Stand in for the platform layer holding data for
      // workspace-2 only.
      Events.addListener(StoreHydrateRequestEvent, 'test', (request) => {
        Events.dispatch(StoreHydrateEvent, {
          namespace,
          workspaceId: request.workspaceId,
          data: request.workspaceId === 'workspace-2' ? { theme: 'dark' } : {},
        });
      });

      await persisted.in('workspace-2').hydrate();

      expect(persisted.get('theme')).toBe('light');
      expect(persisted.in('workspace-2').get('theme')).toBe('dark');
    });
  });
});
