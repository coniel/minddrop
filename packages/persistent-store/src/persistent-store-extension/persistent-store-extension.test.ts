import { onDisable, onRun } from './persistent-store-extension';
import { setup, cleanup, core } from '../test-utils';
import { LocalStoreResource } from '../LocalStoreResource';
import { GlobalStoreResource } from '../GlobalStoreResource';
import { RDDataSchema, Resources } from '@minddrop/resources';
import { LocalPersistentStore } from '../LocalPersistentStore';
import { GlobalPersistentStore } from '../GlobalPersistentStore';

const schema: RDDataSchema<{ foo: string }> = {
  foo: { type: 'string' },
};

describe('rich text extension', () => {
  beforeEach(setup);

  afterEach(cleanup);

  describe('onRun', () => {
    it('registers the `persistent-stores:local` resource', () => {
      // Run the extension
      onRun(core);

      // Should register the 'persistent-store:local' resource
      expect(Resources.get(LocalStoreResource.resource)).toBeDefined();
    });

    it('registers the `persistent-stores:global` resource', () => {
      // Run the extension
      onRun(core);

      // Should register the 'persistent-store:global' resource
      expect(Resources.get(GlobalStoreResource.resource)).toBeDefined();
    });
  });

  describe('onDisable', () => {
    beforeEach(() => onRun(core));

    it('unregisters the `persistent-store:local` resource', () => {
      // Disable the extension
      onDisable(core);

      // Should unregister the 'persistent-store:local' resource
      expect(Resources.get('persistent-store:local')).toBeUndefined();
    });

    it('unregisters the `persistent-store:global` resource', () => {
      // Disable the extension
      onDisable(core);

      // Should unregister the 'persistent-store:global' resource
      expect(Resources.get('persistent-store:global')).toBeUndefined();
    });

    it('clears registered local persistent stores', () => {
      // Initialize a local persistent store
      LocalPersistentStore.initialize(core, schema, {});

      // Disable the exension
      onDisable(core);

      // Store type config should be cleared
      expect(
        LocalStoreResource.typeConfigsStore.get(core.extensionId),
      ).toBeUndefined();
    });

    it('clears the local persistent store documents', () => {
      // Initialize a local persistent store
      LocalPersistentStore.initialize(core, schema, {});

      // Disable the exension
      onDisable(core);

      // Local store documents should be cleared
      expect(LocalStoreResource.getAll()).toEqual({});
    });

    it('clears registered global persistent stores', () => {
      // Initialize a global persistent store
      GlobalPersistentStore.initialize(core, schema, {});

      // Disable the exension
      onDisable(core);

      // Store type config should be cleared
      expect(
        GlobalPersistentStore.typeConfigsStore.get(core.extensionId),
      ).toBeUndefined();
    });

    it('clears the global persistent store documents', () => {
      // Initialize a global persistent store
      GlobalPersistentStore.initialize(core, schema, {});

      // Disable the exension
      onDisable(core);

      // Global store documents should be cleared
      expect(GlobalStoreResource.getAll()).toEqual({});
    });

    it('removes all event listeners', () => {
      // Disable the extension
      onDisable(core);

      // There should no longer be any rich text related event listeners
      expect(core.hasEventListeners()).toBeFalsy();
    });
  });
});
