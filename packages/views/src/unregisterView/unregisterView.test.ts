import { unregisterView } from './unregisterView';
import { cleanup, core, setup, staticView, unregisteredView } from '../tests';
import { getView } from '../getView';
import { ViewNotRegisteredError } from '../errors';

describe('unregisterView', () => {
  beforeEach(() => {
    setup();
  });

  afterEach(() => {
    cleanup();
  });

  it('removes the view from the store', () => {
    unregisterView(core, staticView.id);

    expect(() => getView(staticView.id)).toThrowError(ViewNotRegisteredError);
  });

  it('dipatches a `views:unregister` event', (done) => {
    const callback = (payload) => {
      expect(payload.data).toEqual(staticView);
      done();
    };

    core.addEventListener('views:unregister', callback);

    unregisterView(core, staticView.id);
  });

  it('throws a ViewNotRegisteredError if the view is not registered', () => {
    expect(() => unregisterView(core, unregisteredView.id)).toThrowError(
      ViewNotRegisteredError,
    );
  });
});
