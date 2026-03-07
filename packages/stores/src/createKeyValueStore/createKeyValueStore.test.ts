import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Events } from '@minddrop/events';
import {
  StoreHydrateEvent,
  StoreHydrateRequestEvent,
  StoreHydratedEvent,
  StorePersistEvent,
} from '../events';
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
      Events._clearAll();
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
      {
        persistTo: 'app-config',
        namespace: 'test-kv',
      },
    );

    beforeEach(() => {
      // Clear events first so old listeners don't receive
      // the persist event dispatched by store.reset()
      Events._clearAll();
      store.reset();
    });

    it('dispatches a persist event on set', async () =>
      new Promise<void>((done) => {
        Events.addListener(StorePersistEvent, 'test', (payload) => {
          expect(payload.data).toEqual({
            persistTo: 'app-config',
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
          expect(payload.data).toEqual({
            persistTo: 'app-config',
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
          expect(payload.data).toEqual({
            persistTo: 'app-config',
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
            expect(payload.data).toEqual({
              persistTo: 'app-config',
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
            persistTo: 'app-config',
            namespace: 'hydrate-resolve-test',
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
            persistTo: 'app-config',
            namespace: 'hydrated-event-test',
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
          expect.objectContaining({
            data: { namespace: 'hydrated-event-test' },
          }),
        );
      });
    });
  });

  describe('hydrate listener', () => {
    it('loads data when a matching load event is dispatched', async () => {
      // Create a fresh store so its listener is active
      const freshStore = createKeyValueStore<TestValues>(
        'Test:KeyValuePersist',
        defaults,
        {
          persistTo: 'app-config',
          namespace: 'kv-load-test',
        },
      );

      // Dispatch a load event with data for this store
      await Events.dispatch(StoreHydrateEvent, {
        namespace: 'kv-load-test',
        data: { theme: 'dark', fontSize: 20 },
      });

      expect(freshStore.get('theme')).toBe('dark');
      expect(freshStore.get('fontSize')).toBe(20);
      // Unset values keep their defaults
      expect(freshStore.get('sidebarOpen')).toBe(true);
    });

    it('ignores load events for other namespaces', async () => {
      // Create a fresh store so its listener is active
      const freshStore = createKeyValueStore<TestValues>(
        'Test:KeyValuePersist',
        defaults,
        {
          persistTo: 'app-config',
          namespace: 'kv-load-test-2',
        },
      );

      // Dispatch a load event for a different namespace
      await Events.dispatch(StoreHydrateEvent, {
        namespace: 'other-package',
        data: { theme: 'dark' },
      });

      expect(freshStore.get('theme')).toBe('light');
    });
  });
});
