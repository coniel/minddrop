import { unregisterView } from './unregisterView';
import {
  core,
  cleanup,
  staticViewConfig,
  instanceViewConfig,
} from '../test-utils';
import { registerView } from '../registerView';
import { ViewNotRegisteredError } from '../errors';
import { ViewConfigsStore } from '../ViewConfigsStore';
import { ViewInstancesResource } from '../ViewInstancesResource';

describe('unregisterView', () => {
  beforeEach(() => {
    // Register a static view
    registerView(core, staticViewConfig);
    // Register an instance view
    registerView(core, instanceViewConfig);
  });

  afterEach(cleanup);

  describe('static view', () => {
    it('unregisters the view from the ViewConfigsStore', () => {
      // Unregister a static view
      unregisterView(core, staticViewConfig.id);

      // View config should no longer be in the ViewConfigsStore
      expect(ViewConfigsStore.get(staticViewConfig.id)).toBeUndefined();
    });
  });

  describe('instance view', () => {
    it('unregisters the view from the ViewConfigsStore', () => {
      // Unregister an instance view
      unregisterView(core, instanceViewConfig.id);

      // View config should no longer be in the ViewConfigsStore
      expect(ViewConfigsStore.get(instanceViewConfig.id)).toBeUndefined();
    });

    it('unregisters the view from the ViewInstancesResource', () => {
      // Unregister an instance view
      unregisterView(core, instanceViewConfig.id);

      // View config should no longer be in the ViewInstancesResource
      expect(
        ViewInstancesResource.typeConfigsStore.get(instanceViewConfig.id),
      ).toBeUndefined();
    });
  });

  it('dipatches a `views:view:unregister` event', (done) => {
    // Listen to 'view:view:unregister' events
    core.addEventListener('views:view:unregister', (payload) => {
      // Payload data should be the unregistered view
      expect(payload.data).toEqual({
        ...staticViewConfig,
        extension: core.extensionId,
      });
      done();
    });

    // Unregister a static view
    unregisterView(core, staticViewConfig.id);
  });

  it('throws a ViewNotRegisteredError if the view is not registered', () => {
    // Attempt to unregister a view which is not registered.
    // Should throw a `ViewNotRegisteredError`.
    expect(() => unregisterView(core, 'not-registered')).toThrowError(
      ViewNotRegisteredError,
    );
  });
});
