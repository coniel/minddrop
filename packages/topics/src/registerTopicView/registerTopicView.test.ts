import { registerTopicView } from './registerTopicView';
import { cleanup, core, setup, unregisteredTopicView } from '../test-utils';
import { getTopicView } from '../getTopicView';
import { Views } from '@minddrop/views';

describe('registerView', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('registers the view', () => {
    registerTopicView(core, unregisteredTopicView);

    expect(Views.get(unregisteredTopicView.id)).toBeDefined();
  });

  it('registers the topic view', () => {
    registerTopicView(core, unregisteredTopicView);

    expect(getTopicView(unregisteredTopicView.id)).toEqual(
      unregisteredTopicView,
    );
  });

  it('dispatches a `topics:register-view` event', (done) => {
    core.addEventListener('topics:register-view', (payload) => {
      expect(payload.data).toEqual(unregisteredTopicView);
      done();
    });

    registerTopicView(core, unregisteredTopicView);
  });
});
