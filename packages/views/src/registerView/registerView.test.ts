import { getView } from '../getView';
import { cleanup, core, setup, staticView } from '../tests';
import { registerView } from './registerView';

const view = { ...staticView, id: 'new-view' };

describe('registerView', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('adds the view to the store', () => {
    registerView(core, view);

    expect(getView(view.id)).toEqual(view);
  });

  it("dispatches a 'views:register' event", (done) => {
    const callback = (payload) => {
      expect(payload.data).toEqual(view);
      done();
    };

    core.addEventListener('views:register', callback);

    registerView(core, view);
  });
});
