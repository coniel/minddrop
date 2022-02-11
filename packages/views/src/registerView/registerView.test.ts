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
    registerView(core, unregisteredViewConfig);

    expect(getView(unregisteredViewConfig.id)).toEqual(unregisteredView);
  });

  it("dispatches a 'views:register' event", (done) => {
    const callback = (payload) => {
      expect(payload.data).toEqual(unregisteredView);
      done();
    };

    core.addEventListener('views:register', callback);

    registerView(core, unregisteredViewConfig);
  });
});
