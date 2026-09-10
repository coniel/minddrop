import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Events } from '@minddrop/events';
import { NotRegisteredError } from '../errors';
import { createRegistry } from './createRegistry';

// Test events registered in the event data registry below
const TestRegisteredEvent = 'test:registry:registered';
const TestUnregisteredEvent = 'test:registry:unregistered';

declare module '@minddrop/events/EventDataMap' {
  interface EventDataMap {
    'test:registry:registered': TestItem;
    'test:registry:unregistered': TestItem;
  }
}

interface TestItem {
  type: string;
  name: string;
}

const item1: TestItem = { type: 'item-1', name: 'Item 1' };
const item2: TestItem = { type: 'item-2', name: 'Item 2' };

describe('createRegistry', () => {
  describe('without events', () => {
    const registry = createRegistry<TestItem>('Test:Registry', 'type', {
      label: 'test item',
    });

    beforeEach(() => {
      registry.clear();
      Events.tests.cleanup();
    });

    describe('register', () => {
      it('registers the item', () => {
        registry.register(item1);

        expect(registry.get('item-1')).toEqual(item1);
      });

      it('replaces an item registered under the same identifier', () => {
        registry.register(item1);

        const replacement = { ...item1, name: 'Replacement' };
        registry.register(replacement);

        expect(registry.get('item-1')).toEqual(replacement);
      });
    });

    describe('unregister', () => {
      it('unregisters the item', () => {
        registry.register(item1);
        registry.register(item2);

        registry.unregister('item-1');

        expect(registry.getAll()).toEqual([item2]);
      });

      it('does nothing when the item is not registered', () => {
        registry.register(item1);

        registry.unregister('item-2');

        expect(registry.getAll()).toEqual([item1]);
      });
    });

    describe('get', () => {
      it('returns the registered item', () => {
        registry.register(item1);

        expect(registry.get('item-1')).toEqual(item1);
      });

      it('throws when the item is not registered', () => {
        expect(() => registry.get('item-1')).toThrowError(NotRegisteredError);
      });

      it('returns null when the item is not registered and not throwing', () => {
        expect(registry.get('item-1', false)).toBeNull();
      });
    });

    describe('getAll', () => {
      it('returns the registered items', () => {
        registry.register(item1);
        registry.register(item2);

        expect(registry.getAll()).toEqual([item1, item2]);
      });

      it('returns an empty array when nothing is registered', () => {
        expect(registry.getAll()).toEqual([]);
      });
    });

    describe('clear', () => {
      it('unregisters all items', () => {
        registry.register(item1);
        registry.register(item2);

        registry.clear();

        expect(registry.getAll()).toEqual([]);
      });
    });

    it('does not dispatch registration events', async () => {
      const callback = vi.fn();
      Events.addListener('*', 'test', callback);

      registry.register(item1);
      registry.unregister('item-1');

      await Events.tests.awaitAllListeners();

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('with events', () => {
    const registry = createRegistry<TestItem>('Test:RegistryEvents', 'type', {
      label: 'test item',
      events: {
        registered: TestRegisteredEvent,
        unregistered: TestUnregisteredEvent,
      },
    });

    beforeEach(() => {
      registry.clear();
      Events.tests.cleanup();
    });

    it('dispatches the registered event', async () =>
      new Promise<void>((done) => {
        Events.addListener(TestRegisteredEvent, 'test', (payload) => {
          expect(payload).toEqual(item1);
          done();
        });

        registry.register(item1);
      }));

    it('dispatches the unregistered event', async () =>
      new Promise<void>((done) => {
        registry.register(item1);

        Events.addListener(TestUnregisteredEvent, 'test', (payload) => {
          expect(payload).toEqual(item1);
          done();
        });

        registry.unregister('item-1');
      }));

    it('does not dispatch the unregistered event when the item is not registered', async () => {
      const callback = vi.fn();
      Events.addListener(TestUnregisteredEvent, 'test', callback);

      registry.unregister('item-1');

      await Events.tests.awaitAllListeners();

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('store', () => {
    const registry = createRegistry<TestItem>('Test:RegistryStore', 'type', {
      label: 'test item',
    });

    beforeEach(() => {
      registry.clear();
    });

    it('holds the registered items', () => {
      registry.register(item1);

      expect(registry.store.get('item-1')).toEqual(item1);
    });
  });
});
