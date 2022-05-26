import { getView } from '../getView';
import {
  cleanup,
  core,
  setup,
  unregisteredView,
  unregisteredViewConfig,
} from '../test-utils';
import { registerView } from './registerView';

describe('registerView', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('adds the view to the store', () => {
    // Register a view
    registerView(core, unregisteredViewConfig);

    // View should be registered
    expect(getView(unregisteredViewConfig.id)).toEqual(unregisteredView);
  });

  it("dispatches a 'views:view:register' event", (done) => {
    // Listen to 'views:view:register' events
    core.addEventListener('views:view:register', (payload) => {
      // Payload data should be the registered view
      expect(payload.data).toEqual(unregisteredView);
      done();
    });

    // Register a view
    registerView(core, unregisteredViewConfig);
  });
});
