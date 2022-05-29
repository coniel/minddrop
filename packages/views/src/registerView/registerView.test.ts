import { core, staticViewConfig, instanceViewConfig } from '../test-utils';
import { ViewConfigsStore } from '../ViewConfigsStore';
import { ViewInstancesResource } from '../ViewInstancesResource';
import { registerView } from './registerView';

describe('registerView', () => {
  afterEach(() => {
    // Clear registered view configs
    ViewConfigsStore.clear();

    // Clear registered view instance types
    ViewInstancesResource.typeConfigsStore.clear();
  });

  describe('static view', () => {
    it('registers the view config in the ViewConfigsStore', () => {
      // Register a static view
      registerView(core, staticViewConfig);

      // View config should be registered
      expect(ViewConfigsStore.get(staticViewConfig.id)).toBeDefined();
    });
  });

  describe('instance view', () => {
    it('registers the view config in the ViewConfigsStore', () => {
      // Register a static view
      registerView(core, instanceViewConfig);

      // View config should be registered
      expect(ViewConfigsStore.get(instanceViewConfig.id)).toBeDefined();
    });

    it('registers the view instance type in the ViewInstancesResource', () => {
      // Register a static view
      registerView(core, instanceViewConfig);

      // View intance type should be registered
      expect(
        ViewInstancesResource.typeConfigsStore.get(instanceViewConfig.id),
      ).toBeDefined();
    });
  });

  it("dispatches a 'views:view:register' event", (done) => {
    // Listen to 'views:view:register' events
    core.addEventListener('views:view:register', (payload) => {
      // Payload data should be the registered view
      expect(payload.data).toEqual({
        ...staticViewConfig,
        extension: core.extensionId,
      });
      done();
    });

    // Register a view
    registerView(core, staticViewConfig);
  });
});
